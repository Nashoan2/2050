import React, { useState, useEffect } from 'react';
import { useInvoice } from '../context/InvoiceContext';
import { ArabicNumberHelper } from '../utils/arabic';
import { AlmamlakaLogoBadge } from './LogoBadge';
import {
  X,
  ArrowRight,
  Plus,
  Users,
  DollarSign,
  Receipt,
  ClipboardList,
  Search,
  Printer,
  Share2,
  Trash2,
  Edit,
  FileText,
  Calendar,
  Phone,
  MapPin,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Customer } from '../types';

export const CustomersModal: React.FC = () => {
  const {
    showCustomersModal,
    setCustomersModalVisible,
    customersModalInitialTab,
    customers,
    addCustomer,
    editCustomer,
    deleteCustomer,
    addReceiptVoucher,
    addPaymentVoucher,
    deleteVoucher,
    getAllVouchers,
    openCustomerStatement,
    requestStatementDateRange,
    showToast,
    reportConfig,
    storeConfig,
  } = useInvoice();

  const [activeTab, setActiveTab] = useState<number>(customersModalInitialTab);

  // Sync activeTab when modal opens or initialTab changes
  useEffect(() => {
    if (customersModalInitialTab !== undefined) {
      setActiveTab(customersModalInitialTab);
    }
  }, [customersModalInitialTab, showCustomersModal]);

  // Dynamic Shaded Field Colors from Report Customizer
  const shadedBg = reportConfig.tableHeaderBgHex || '#EBF5FB';
  const shadedText = reportConfig.tableHeaderTextColorHex || reportConfig.primaryTextColorHex || '#111827';
  const tableBorderColor = reportConfig.tableBorderColorHex || '#0070BA';
  const headerColor = reportConfig.headerColorHex || '#5E258D';

  // State for viewing/printing a formal voucher slip
  const [printingVoucher, setPrintingVoucher] = useState<{
    voucherNum: string;
    type: string;
    account: string;
    customerName: string;
    date: string;
    amount: number;
    currency: string;
    note: string;
  } | null>(null);

  // New Customer Form State
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustBalance, setNewCustBalance] = useState('');
  const [newCustAccount, setNewCustAccount] = useState('');

  // Voucher Form State
  const [vAccount, setVAccount] = useState('');
  const [vAmount, setVAmount] = useState('');
  const [vCurrency, setVCurrency] = useState('YER');
  const [vNote, setVNote] = useState('');
  const [vDate, setVDate] = useState(ArabicNumberHelper.formatDateTime());
  const [vNumber, setVNumber] = useState('');

  // Search & Filter
  const [customerSearch, setCustomerSearch] = useState('');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  if (!showCustomersModal) return null;

  const handleClose = () => {
    setCustomersModalVisible(false);
  };

  const handleAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const balanceNum = parseFloat(ArabicNumberHelper.toEngDigits(newCustBalance)) || 0;
    const ok = addCustomer(newCustName, newCustPhone, newCustAddress, balanceNum, newCustAccount);
    if (ok) {
      setNewCustName('');
      setNewCustPhone('');
      setNewCustAddress('');
      setNewCustBalance('');
      setNewCustAccount('');
      setActiveTab(2); // Jump to All Customers list
    }
  };

  const handleAddReceiptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(ArabicNumberHelper.toEngDigits(vAmount)) || 0;
    const ok = addReceiptVoucher(vAccount, amt, vCurrency, vNote, vDate, vNumber);
    if (ok) {
      setVAmount('');
      setVNote('');
      setVNumber('');
    }
  };

  const handleAddPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(ArabicNumberHelper.toEngDigits(vAmount)) || 0;
    const ok = addPaymentVoucher(vAccount, amt, vCurrency, vNote, vDate, vNumber);
    if (ok) {
      setVAmount('');
      setVNote('');
      setVNumber('');
    }
  };

  const matchedCustomerForVoucher = customers.find(
    c => ArabicNumberHelper.toEngDigits(c.accountNumber).trim() === ArabicNumberHelper.toEngDigits(vAccount).trim()
  );

  const receiptVouchers = getAllVouchers('قبض');
  const paymentVouchers = getAllVouchers('صرف');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-[#F1F3FA] text-slate-900 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-300">
        {/* Top Header */}
        <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {activeTab >= 0 ? (
              <button
                onClick={() => setActiveTab(-1)}
                className="px-3 py-1.5 rounded-lg border border-slate-800 text-slate-800 hover:bg-slate-100 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                <span>القائمة الرئيسية للعملاء</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-[#1A237E] flex items-center justify-center text-white">
                  <Users className="w-5 h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-black text-[#1A237E]">إدارة العملاء والحسابات</h2>
              </div>
            )}
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab < 0 ? (
            /* Main Customers Hub Menu */
            <div className="space-y-3 max-w-xl mx-auto py-2">
              <button
                onClick={() => setActiveTab(3)}
                className="w-full h-14 bg-[#28A745] hover:bg-[#218838] text-white font-extrabold text-base sm:text-lg rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
              >
                <span>إضافة عميل جديد 👥</span>
              </button>

              <button
                onClick={() => setActiveTab(0)}
                className="w-full h-14 bg-[#D49B00] hover:bg-[#b88600] text-white font-extrabold text-base sm:text-lg rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
              >
                <span>سند قبض 💰</span>
              </button>

              <button
                onClick={() => setActiveTab(1)}
                className="w-full h-14 bg-[#4A86BA] hover:bg-[#3d6f9a] text-white font-extrabold text-base sm:text-lg rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
              >
                <span>سند صرف 💸</span>
              </button>

              <button
                onClick={() => setActiveTab(2)}
                className="w-full h-14 bg-[#007BFF] hover:bg-[#0069d9] text-white font-extrabold text-base sm:text-lg rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
              >
                <span>جميع العملاء 📋</span>
              </button>

              <button
                onClick={() => setActiveTab(4)}
                className="w-full h-14 bg-[#4A86BA] hover:bg-[#3d6f9a] text-white font-extrabold text-base sm:text-lg rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
              >
                <span>كشف حساب عميل 📊</span>
              </button>

              <button
                onClick={() => setActiveTab(5)}
                className="w-full h-14 bg-[#495057] hover:bg-[#343a40] text-white font-extrabold text-base sm:text-lg rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
              >
                <span>كشف حساب عميل من فترة إلى فترة 📊</span>
              </button>
            </div>
          ) : (
            /* Sub Tabs View */
            <div className="space-y-4">
              {/* Tab Navigation Pill Bar */}
              <div className="flex gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
                {[
                  { id: 0, label: '💸 سند قبض' },
                  { id: 1, label: '💰 سند صرف' },
                  { id: 2, label: '📋 جميع العملاء' },
                  { id: 3, label: '➕ عميل جديد' },
                  { id: 4, label: '📊 كشف حساب عميل' },
                  { id: 5, label: '📅 فترة إلى فترة' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-black whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-[#1A237E] text-white shadow'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab 0: Receipt Voucher (سند قبض) */}
              {activeTab === 0 && (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl border-2 shadow-sm overflow-hidden" style={{ borderColor: tableBorderColor }}>
                    <div className="p-3.5 border-b-2 flex items-center justify-between" style={{ backgroundColor: shadedBg, borderColor: tableBorderColor, color: shadedText }}>
                      <h3 className="text-base font-black flex items-center gap-1.5" style={{ color: shadedText }}>
                        <span>💰</span> تسجيل سند قبض جديد
                      </h3>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/70 border" style={{ borderColor: tableBorderColor }}>
                        سند قبض معتمد
                      </span>
                    </div>

                    <form onSubmit={handleAddReceiptSubmit} className="p-4 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">رقم حساب العميل</label>
                          <input
                            type="text"
                            required
                            value={vAccount}
                            onChange={(e) => setVAccount(e.target.value)}
                            placeholder="أدخل رقم الحساب (مثال 1001)"
                            className="w-full h-10 px-3 rounded-lg border text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-600"
                            style={{ borderColor: tableBorderColor }}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">اسم العميل المسجل</label>
                          <input
                            type="text"
                            readOnly
                            value={matchedCustomerForVoucher?.name || '--- غير محدد ---'}
                            className="w-full h-10 px-3 bg-slate-100 rounded-lg border border-slate-200 text-sm font-bold text-slate-700"
                          />
                        </div>
                      </div>

                      {matchedCustomerForVoucher && (
                        <div
                          className="p-3 rounded-lg border-2 text-xs flex justify-between items-center font-bold"
                          style={{ backgroundColor: shadedBg, borderColor: tableBorderColor, color: shadedText }}
                        >
                          <span className="font-extrabold">الرصيد الحالي للعميل:</span>
                          <span className={`text-base font-black ${matchedCustomerForVoucher.balance > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                            {ArabicNumberHelper.formatAmount(matchedCustomerForVoucher.balance)} YER
                          </span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">المبلغ المقبوض</label>
                          <input
                            type="number"
                            required
                            step="any"
                            value={vAmount}
                            onChange={(e) => setVAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full h-10 px-3 rounded-lg border text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-600"
                            style={{ borderColor: tableBorderColor }}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">العملة</label>
                          <select
                            value={vCurrency}
                            onChange={(e) => setVCurrency(e.target.value)}
                            className="w-full h-10 px-2 bg-white rounded-lg border text-sm font-bold"
                            style={{ borderColor: tableBorderColor }}
                          >
                            <option value="YER">YER (ريال يمني)</option>
                            <option value="$">($) USD (دولار)</option>
                            <option value="SAR">SAR (ريال سعودي)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">رقم السند (تلقائي أو مخصص)</label>
                          <input
                            type="text"
                            value={vNumber}
                            onChange={(e) => setVNumber(e.target.value)}
                            placeholder="تلقائي"
                            className="w-full h-10 px-3 bg-slate-50 rounded-lg border border-slate-300 text-sm font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات / البيان</label>
                        <input
                          type="text"
                          value={vNote}
                          onChange={(e) => setVNote(e.target.value)}
                          placeholder="دفعة من الحساب / تسديد اشتراك..."
                          className="w-full h-10 px-3 bg-white rounded-lg border border-slate-300 text-sm font-bold"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-[#059640] hover:bg-[#047833] text-white font-extrabold rounded-xl shadow transition-transform duration-75 active:scale-[0.99] cursor-pointer"
                      >
                        حفظ سند القبض 💰
                      </button>
                    </form>
                  </div>

                  {/* Past Receipt Vouchers Table */}
                  <div className="bg-white rounded-xl border-2 shadow-sm overflow-hidden" style={{ borderColor: tableBorderColor }}>
                    <div className="p-3 border-b-2" style={{ backgroundColor: shadedBg, borderColor: tableBorderColor }}>
                      <h4 className="text-sm font-black" style={{ color: shadedText }}>سندات القبض المسجلة ({receiptVouchers.length})</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-right text-xs">
                        <thead>
                          <tr className="border-b-2 font-black" style={{ backgroundColor: shadedBg, color: shadedText, borderColor: tableBorderColor }}>
                            <th className="p-2 border" style={{ borderColor: tableBorderColor }}>رقم السند</th>
                            <th className="p-2 border" style={{ borderColor: tableBorderColor }}>العميل</th>
                            <th className="p-2 border" style={{ borderColor: tableBorderColor }}>التاريخ</th>
                            <th className="p-2 border" style={{ borderColor: tableBorderColor }}>المبلغ</th>
                            <th className="p-2 border" style={{ borderColor: tableBorderColor }}>البيان</th>
                            <th className="p-2 border text-center" style={{ borderColor: tableBorderColor }}>إجراءات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {receiptVouchers.map((v, i) => (
                            <tr key={i} className="border-b hover:bg-slate-50 transition-colors" style={{ borderColor: tableBorderColor }}>
                              <td className="p-2 font-black text-amber-900 border" style={{ borderColor: tableBorderColor }}>#{v.voucherNum}</td>
                              <td className="p-2 font-bold text-slate-900 border" style={{ borderColor: tableBorderColor }}>{v.customerName} ({v.account})</td>
                              <td className="p-2 text-slate-600 border" style={{ borderColor: tableBorderColor }}>{v.date}</td>
                              <td className="p-2 font-black text-emerald-700 border" style={{ borderColor: tableBorderColor }}>{ArabicNumberHelper.formatAmount(v.amount)} {v.currency}</td>
                              <td className="p-2 text-slate-600 border" style={{ borderColor: tableBorderColor }}>{v.note || '---'}</td>
                              <td className="p-2 text-center border" style={{ borderColor: tableBorderColor }}>
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setPrintingVoucher(v)}
                                    className="p-1.5 text-purple-700 hover:bg-purple-100 rounded cursor-pointer transition-colors"
                                    title="معاينة وطباعة السند"
                                  >
                                    <Printer className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => deleteVoucher(v.voucherNum, 'قبض', v.account)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer transition-colors"
                                    title="حذف السند"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 1: Payment Voucher (سند صرف) */}
              {activeTab === 1 && (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl border-2 shadow-sm overflow-hidden" style={{ borderColor: tableBorderColor }}>
                    <div className="p-3.5 border-b-2 flex items-center justify-between" style={{ backgroundColor: shadedBg, borderColor: tableBorderColor, color: shadedText }}>
                      <h3 className="text-base font-black flex items-center gap-1.5" style={{ color: shadedText }}>
                        <span>💸</span> تسجيل سند صرف جديد
                      </h3>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/70 border" style={{ borderColor: tableBorderColor }}>
                        سند صرف معتمد
                      </span>
                    </div>

                    <form onSubmit={handleAddPaymentSubmit} className="p-4 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">رقم حساب العميل</label>
                          <input
                            type="text"
                            required
                            value={vAccount}
                            onChange={(e) => setVAccount(e.target.value)}
                            placeholder="أدخل رقم الحساب (مثال 1001)"
                            className="w-full h-10 px-3 rounded-lg border text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ borderColor: tableBorderColor }}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">اسم العميل المسجل</label>
                          <input
                            type="text"
                            readOnly
                            value={matchedCustomerForVoucher?.name || '--- غير محدد ---'}
                            className="w-full h-10 px-3 bg-slate-100 rounded-lg border border-slate-200 text-sm font-bold text-slate-700"
                          />
                        </div>
                      </div>

                      {matchedCustomerForVoucher && (
                        <div
                          className="p-3 rounded-lg border-2 text-xs flex justify-between items-center font-bold"
                          style={{ backgroundColor: shadedBg, borderColor: tableBorderColor, color: shadedText }}
                        >
                          <span className="font-extrabold">الرصيد الحالي للعميل:</span>
                          <span className={`text-base font-black ${matchedCustomerForVoucher.balance > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                            {ArabicNumberHelper.formatAmount(matchedCustomerForVoucher.balance)} YER
                          </span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">المبلغ المصروف</label>
                          <input
                            type="number"
                            required
                            step="any"
                            value={vAmount}
                            onChange={(e) => setVAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full h-10 px-3 rounded-lg border text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ borderColor: tableBorderColor }}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">العملة</label>
                          <select
                            value={vCurrency}
                            onChange={(e) => setVCurrency(e.target.value)}
                            className="w-full h-10 px-2 bg-white rounded-lg border text-sm font-bold"
                            style={{ borderColor: tableBorderColor }}
                          >
                            <option value="YER">YER (ريال يمني)</option>
                            <option value="$">($) USD (دولار)</option>
                            <option value="SAR">SAR (ريال سعودي)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">رقم السند</label>
                          <input
                            type="text"
                            value={vNumber}
                            onChange={(e) => setVNumber(e.target.value)}
                            placeholder="تلقائي"
                            className="w-full h-10 px-3 bg-slate-50 rounded-lg border border-slate-300 text-sm font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات / البيان</label>
                        <input
                          type="text"
                          value={vNote}
                          onChange={(e) => setVNote(e.target.value)}
                          placeholder="صرف مستحقات / مرتجع..."
                          className="w-full h-10 px-3 bg-white rounded-lg border border-slate-300 text-sm font-bold"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-[#DC2626] hover:bg-[#b91c1c] text-white font-extrabold rounded-xl shadow transition-transform duration-75 active:scale-[0.99] cursor-pointer"
                      >
                        حفظ سند الصرف 💸
                      </button>
                    </form>
                  </div>

                  {/* Past Payment Vouchers Table */}
                  <div className="bg-white rounded-xl border-2 shadow-sm overflow-hidden" style={{ borderColor: tableBorderColor }}>
                    <div className="p-3 border-b-2" style={{ backgroundColor: shadedBg, borderColor: tableBorderColor }}>
                      <h4 className="text-sm font-black" style={{ color: shadedText }}>سندات الصرف المسجلة ({paymentVouchers.length})</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-right text-xs">
                        <thead>
                          <tr className="border-b-2 font-black" style={{ backgroundColor: shadedBg, color: shadedText, borderColor: tableBorderColor }}>
                            <th className="p-2 border" style={{ borderColor: tableBorderColor }}>رقم السند</th>
                            <th className="p-2 border" style={{ borderColor: tableBorderColor }}>العميل</th>
                            <th className="p-2 border" style={{ borderColor: tableBorderColor }}>التاريخ</th>
                            <th className="p-2 border" style={{ borderColor: tableBorderColor }}>المبلغ</th>
                            <th className="p-2 border" style={{ borderColor: tableBorderColor }}>البيان</th>
                            <th className="p-2 border text-center" style={{ borderColor: tableBorderColor }}>إجراءات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentVouchers.map((v, i) => (
                            <tr key={i} className="border-b hover:bg-slate-50 transition-colors" style={{ borderColor: tableBorderColor }}>
                              <td className="p-2 font-black text-blue-900 border" style={{ borderColor: tableBorderColor }}>#{v.voucherNum}</td>
                              <td className="p-2 font-bold text-slate-900 border" style={{ borderColor: tableBorderColor }}>{v.customerName} ({v.account})</td>
                              <td className="p-2 text-slate-600 border" style={{ borderColor: tableBorderColor }}>{v.date}</td>
                              <td className="p-2 font-black text-rose-700 border" style={{ borderColor: tableBorderColor }}>{ArabicNumberHelper.formatAmount(v.amount)} {v.currency}</td>
                              <td className="p-2 text-slate-600 border" style={{ borderColor: tableBorderColor }}>{v.note || '---'}</td>
                              <td className="p-2 text-center border" style={{ borderColor: tableBorderColor }}>
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setPrintingVoucher(v)}
                                    className="p-1.5 text-purple-700 hover:bg-purple-100 rounded cursor-pointer transition-colors"
                                    title="معاينة وطباعة السند"
                                  >
                                    <Printer className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => deleteVoucher(v.voucherNum, 'صرف', v.account)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer transition-colors"
                                    title="حذف السند"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: All Customers (جميع العملاء) */}
              {activeTab === 2 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        placeholder="بحث بالاسم أو رقم الحساب أو الهاتف..."
                        className="w-full h-10 pr-9 pl-3 bg-white rounded-lg text-sm text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                    </div>

                    <button
                      onClick={() => setActiveTab(3)}
                      className="h-10 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      عميل جديد
                    </button>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-right text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-slate-100 text-slate-800 border-b border-slate-200 font-black">
                            <th className="p-3">رقم الحساب</th>
                            <th className="p-3">اسم العميل</th>
                            <th className="p-3">الهاتف</th>
                            <th className="p-3">العنوان</th>
                            <th className="p-3 text-left">الرصيد الحالي</th>
                            <th className="p-3 text-center">إجراءات سريعة</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customers
                            .filter(c =>
                              c.name.includes(customerSearch) ||
                              c.accountNumber.includes(customerSearch) ||
                              c.phone.includes(customerSearch)
                            )
                            .map((c) => (
                              <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="p-3 font-black text-blue-900">#{c.accountNumber}</td>
                                <td className="p-3 font-bold text-slate-900">{c.name}</td>
                                <td className="p-3 text-slate-600">{c.phone || '---'}</td>
                                <td className="p-3 text-slate-600">{c.address || '---'}</td>
                                <td className="p-3 text-left">
                                  <span className={`font-black ${c.balance > 0 ? 'text-red-700' : c.balance < 0 ? 'text-emerald-700' : 'text-slate-700'}`}>
                                    {ArabicNumberHelper.formatAmount(c.balance)} YER
                                  </span>
                                </td>
                                <td className="p-3 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      onClick={() => {
                                        openCustomerStatement(c);
                                        handleClose();
                                      }}
                                      className="px-2 py-1 bg-purple-100 text-purple-800 hover:bg-purple-200 rounded font-bold text-xs cursor-pointer flex items-center gap-1"
                                      title="عرض كشف الحساب"
                                    >
                                      <FileText className="w-3.5 h-3.5" />
                                      كشف
                                    </button>

                                    <button
                                      onClick={() => {
                                        setVAccount(c.accountNumber);
                                        setActiveTab(0); // Go to receipt voucher
                                      }}
                                      className="px-2 py-1 bg-amber-100 text-amber-800 hover:bg-amber-200 rounded font-bold text-xs cursor-pointer"
                                      title="سند قبض"
                                    >
                                      قبض
                                    </button>

                                    <button
                                      onClick={() => {
                                        setEditingCustomer(c);
                                      }}
                                      className="p-1 text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                                      title="تعديل العميل"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>

                                    <button
                                      onClick={() => {
                                        if (confirm(`هل أنت متأكد من حذف العميل ${c.name}؟`)) {
                                          deleteCustomer(c.accountNumber);
                                        }
                                      }}
                                      className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                                      title="حذف العميل"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: New Customer (عميل جديد) */}
              {activeTab === 3 && (
                <div className="bg-white rounded-xl p-5 border border-emerald-200 shadow-sm max-w-xl mx-auto">
                  <h3 className="text-base font-black text-emerald-900 mb-3 flex items-center gap-1.5">
                    <span>👥</span> إضافة عميل / مشترك جديد
                  </h3>

                  <form onSubmit={handleAddCustomerSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">اسم العميل بالكامل *</label>
                      <input
                        type="text"
                        required
                        value={newCustName}
                        onChange={(e) => setNewCustName(e.target.value)}
                        placeholder="مثال: أحمد محمد علي"
                        className="w-full h-11 px-3 bg-slate-50 rounded-lg border border-slate-300 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">رقم الحساب (اختياري)</label>
                        <input
                          type="text"
                          value={newCustAccount}
                          onChange={(e) => setNewCustAccount(e.target.value)}
                          placeholder="تلقائي إن تُرِك فارغاً"
                          className="w-full h-10 px-3 bg-slate-50 rounded-lg border border-slate-300 font-bold text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف</label>
                        <input
                          type="text"
                          value={newCustPhone}
                          onChange={(e) => setNewCustPhone(e.target.value)}
                          placeholder="77..."
                          className="w-full h-10 px-3 bg-slate-50 rounded-lg border border-slate-300 font-bold text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">العنوان</label>
                      <input
                        type="text"
                        value={newCustAddress}
                        onChange={(e) => setNewCustAddress(e.target.value)}
                        placeholder="المدينة / الشارع..."
                        className="w-full h-10 px-3 bg-slate-50 rounded-lg border border-slate-300 font-bold text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">الرصيد الافتتاحي (مدين + / دائن -)</label>
                      <input
                        type="number"
                        step="any"
                        value={newCustBalance}
                        onChange={(e) => setNewCustBalance(e.target.value)}
                        placeholder="0.00"
                        className="w-full h-10 px-3 bg-slate-50 rounded-lg border border-slate-300 font-bold text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#28A745] hover:bg-[#218838] text-white font-extrabold rounded-xl shadow transition-colors cursor-pointer"
                    >
                      حفظ العميل الجديد 💾
                    </button>
                  </form>
                </div>
              )}

              {/* Tab 4: Customer Statement Lookup (كشف حساب عميل) */}
              {activeTab === 4 && (
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm max-w-xl mx-auto space-y-3">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                    <span>📊</span> اختر عميل لفتح كشف حسابه مباشرة:
                  </h3>

                  <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                    {customers.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          openCustomerStatement(c);
                          handleClose();
                        }}
                        className="p-3 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <span className="font-black text-slate-900 text-sm block">{c.name}</span>
                          <span className="text-xs text-slate-500">حساب #{c.accountNumber}</span>
                        </div>
                        <span className={`font-black text-sm ${c.balance > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                          {ArabicNumberHelper.formatAmount(c.balance)} YER
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 5: Statement by Date Range (كشف حساب لعميل من فترة إلى فترة) */}
              {activeTab === 5 && (
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm max-w-xl mx-auto space-y-3">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                    <span>📅</span> اختر عميل لتحديد الفترة الزمنية لكشف الحساب:
                  </h3>

                  <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                    {customers.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          requestStatementDateRange(c);
                          handleClose();
                        }}
                        className="p-3 hover:bg-cyan-50 rounded-lg transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <span className="font-black text-slate-900 text-sm block">{c.name}</span>
                          <span className="text-xs text-slate-500">حساب #{c.accountNumber}</span>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-cyan-100 text-cyan-800 rounded">
                          تحديد الفترة 📅
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Edit Customer Inline Dialog */}
        {editingCustomer && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-5 w-full max-w-md shadow-2xl space-y-3">
              <h3 className="font-black text-slate-900 text-base">تعديل بيانات العميل #{editingCustomer.accountNumber}</h3>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">اسم العميل</label>
                <input
                  type="text"
                  value={editingCustomer.name}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                  className="w-full h-10 px-3 border rounded font-bold text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">الهاتف</label>
                <input
                  type="text"
                  value={editingCustomer.phone}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                  className="w-full h-10 px-3 border rounded font-bold text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">العنوان</label>
                <input
                  type="text"
                  value={editingCustomer.address}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                  className="w-full h-10 px-3 border rounded font-bold text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    editCustomer(
                      editingCustomer.accountNumber,
                      editingCustomer.name,
                      editingCustomer.phone,
                      editingCustomer.address
                    );
                    setEditingCustomer(null);
                  }}
                  className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm"
                >
                  حفظ التعديل
                </button>
                <button
                  onClick={() => setEditingCustomer(null)}
                  className="py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg text-sm"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Printable Voucher Slip Modal (معاينة وطباعة سند القبض / سند الصرف) */}
        {printingVoucher && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            <div className="bg-white text-slate-900 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden border-2 flex flex-col" style={{ borderColor: tableBorderColor }}>
              {/* Slip Toolbar */}
              <div className="p-3 bg-slate-900 text-white flex items-center justify-between no-print">
                <span className="font-black text-sm flex items-center gap-1.5">
                  <Printer className="w-4 h-4 text-purple-400" />
                  طباعة سند {printingVoucher.type} رسمي (#{printingVoucher.voucherNum})
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    طباعة السند
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrintingVoucher(null)}
                    className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Printable Document Slip */}
              <div className="p-6 space-y-4 print-card bg-white" style={{ borderColor: tableBorderColor }}>
                {/* Header */}
                <div className="flex items-center justify-between border-b-2 pb-3" style={{ borderColor: tableBorderColor }}>
                  <div className="space-y-0.5">
                    <h2 className="text-xl font-black" style={{ color: headerColor }}>
                      {storeConfig.storeNameAr || 'المملكة للإلكترونيات'}
                    </h2>
                    <p className="text-xs font-bold text-slate-600">{storeConfig.branch || 'فرع شارع تعز'}</p>
                    <p className="text-xs font-extrabold text-slate-700">هاتف: {storeConfig.phone || '772707736'}</p>
                  </div>
                  <AlmamlakaLogoBadge size={65} logoBase64={storeConfig.logoBase64} />
                </div>

                {/* Voucher Title Banner */}
                <div
                  className="text-center py-2 px-4 rounded-lg border-2"
                  style={{ backgroundColor: shadedBg, borderColor: tableBorderColor, color: shadedText }}
                >
                  <h1 className="text-lg font-black tracking-wide">
                    سند {printingVoucher.type === 'قبض' ? 'قبض نقدي 💰' : 'صرف نقدي 💸'}
                  </h1>
                  <div className="flex justify-between items-center text-xs font-bold mt-1 opacity-90">
                    <span>رقم السند: #{printingVoucher.voucherNum}</span>
                    <span>التاريخ: {printingVoucher.date}</span>
                  </div>
                </div>

                {/* Shaded Content Box */}
                <div
                  className="p-4 rounded-xl border-2 space-y-2.5 text-sm"
                  style={{ backgroundColor: shadedBg, borderColor: tableBorderColor, color: shadedText }}
                >
                  <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: tableBorderColor }}>
                    <span className="font-bold opacity-80">{printingVoucher.type === 'قبض' ? 'استلمنا من الأخ:' : 'صُرف للأخ:'}</span>
                    <span className="font-black text-base">{printingVoucher.customerName} (حساب: #{printingVoucher.account})</span>
                  </div>

                  <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: tableBorderColor }}>
                    <span className="font-bold opacity-80">المبلغ رقماً:</span>
                    <span className="font-black text-lg text-emerald-800">
                      {ArabicNumberHelper.formatAmount(printingVoucher.amount)} {printingVoucher.currency}
                    </span>
                  </div>

                  <div className="border-b pb-2" style={{ borderColor: tableBorderColor }}>
                    <span className="font-bold opacity-80 block text-xs mb-0.5">المبلغ كتابة (تفقيط):</span>
                    <span className="font-black text-sm">
                      {ArabicNumberHelper.numberToArabicWords(printingVoucher.amount)} {ArabicNumberHelper.getCurrencyName(printingVoucher.currency)} فقط لا غير.
                    </span>
                  </div>

                  <div>
                    <span className="font-bold opacity-80 block text-xs mb-0.5">وذلك مقابل / البيان:</span>
                    <span className="font-bold">{printingVoucher.note || 'دفعة من الحساب'}</span>
                  </div>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-3 gap-2 pt-4 text-center text-xs font-bold text-slate-700">
                  <div className="space-y-6">
                    <span>توقيع المستلم:</span>
                    <div className="h-0.5 border-b border-dashed border-slate-400 w-3/4 mx-auto" />
                  </div>
                  <div className="space-y-6">
                    <span>المحاسب:</span>
                    <span className="block font-black text-purple-900">{reportConfig.accountantSignatureName || 'المحاسب'}</span>
                  </div>
                  <div className="space-y-6">
                    <span>توقيع وختم الإدارة:</span>
                    <div className="h-0.5 border-b border-dashed border-slate-400 w-3/4 mx-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
