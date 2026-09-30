import React, { useState } from 'react';
import { useInvoice } from '../context/InvoiceContext';
import { ArabicNumberHelper } from '../utils/arabic';
import {
  X,
  Search,
  Trash2,
  Edit,
  Eye,
  Calendar,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';
import { InvoiceData } from '../types';

export const SavedInvoicesModal: React.FC = () => {
  const {
    showSavedInvoicesModal,
    setSavedInvoicesModalVisible,
    savedInvoices,
    deleteSavedInvoice,
    clearAllInvoices,
    editSavedInvoice,
    openInvoiceReport,
    updateInvoiceDateOnly,
  } = useInvoice();

  const [search, setSearch] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const [dateEditingInv, setDateEditingInv] = useState<InvoiceData | null>(null);
  const [newDateStr, setNewDateStr] = useState('');

  if (!showSavedInvoicesModal) return null;

  const filteredInvoices = savedInvoices.filter(inv =>
    inv.invNum.includes(search) ||
    inv.customerName.includes(search) ||
    inv.cardId.includes(search) ||
    inv.desc.includes(search)
  ).slice().reverse(); // Show latest first

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-300">
        {/* Header */}
        <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-purple-700" />
            <h2 className="text-lg sm:text-xl font-black text-purple-900">📂 إدارة الفواتير المحفوظة ({savedInvoices.length})</h2>
          </div>
          <button
            onClick={() => setSavedInvoicesModalVisible(false)}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Search */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث برقم الفاتورة، اسم العميل، رقم الكارت..."
              className="w-full h-10 pr-9 pl-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          </div>

          {savedInvoices.length > 0 && (
            <button
              onClick={() => setConfirmClear(true)}
              className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Trash2 className="w-4 h-4" />
              حذف جميع الفواتير
            </button>
          )}
        </div>

        {/* Invoices List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-bold text-sm">
              لا توجد فواتير محفوظة متطابقة مع البحث.
            </div>
          ) : (
            filteredInvoices.map((inv) => (
              <div
                key={inv.id}
                className="p-3.5 bg-slate-50 hover:bg-purple-50/40 rounded-xl border border-slate-200 shadow-sm transition-colors space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-purple-900">فاتورة #{inv.invNum}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-extrabold ${inv.invType === 'أجل' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                      {inv.invType}
                    </span>
                  </div>

                  <span className="text-xs text-slate-500 font-semibold">{inv.createdAt}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 font-semibold block">العميل:</span>
                    <span className="font-bold text-slate-900">{inv.customerName || 'عميل نقدي'}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-semibold block">الكارت / الاشتراك:</span>
                    <span className="font-bold text-slate-900">{inv.cardId || '---'} ({inv.desc})</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-semibold block">المبلغ الإجمالي:</span>
                    <span className="font-black text-rose-600 text-sm">
                      {ArabicNumberHelper.formatAmount(inv.grandTotal)} {inv.currency}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => {
                      openInvoiceReport(inv);
                      setSavedInvoicesModalVisible(false);
                    }}
                    className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    عرض الفاتورة
                  </button>

                  <button
                    onClick={() => {
                      editSavedInvoice(inv);
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    تعديل البيانات
                  </button>

                  <button
                    onClick={() => {
                      setDateEditingInv(inv);
                      setNewDateStr(inv.createdAt);
                    }}
                    className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                    title="تعديل تاريخ الفاتورة فقط"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    تعديل التاريخ
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`هل أنت متأكد من حذف الفاتورة رقم ${inv.invNum}؟`)) {
                        deleteSavedInvoice(inv.id);
                      }
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                    title="حذف الفاتورة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Clear All Confirmation Modal */}
        {confirmClear && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-3 shadow-2xl text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-900 text-base">تأكيد حذف جميع الفواتير</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                هل أنت متأكد من رغبتك في حذف جميع الفواتير المحفوظة نهائياً؟ لن يمكن التراجع عن هذه الخطوة إلا إذا كانت لديك نسخة احتياطية.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    clearAllInvoices();
                    setConfirmClear(false);
                  }}
                  className="py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs"
                >
                  نعم، احذف الكل
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg text-xs"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Date Modal */}
        {dateEditingInv && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-3 shadow-2xl">
              <h3 className="font-black text-slate-900 text-base">تعديل تاريخ الفاتورة #{dateEditingInv.invNum}</h3>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">التاريخ الجديد (dd/MM/yyyy HH:mm)</label>
                <input
                  type="text"
                  value={newDateStr}
                  onChange={(e) => setNewDateStr(e.target.value)}
                  className="w-full h-10 px-3 border rounded font-bold text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    if (newDateStr.trim()) {
                      updateInvoiceDateOnly(dateEditingInv.id, newDateStr.trim());
                    }
                    setDateEditingInv(null);
                  }}
                  className="py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-lg text-xs"
                >
                  حفظ التاريخ
                </button>
                <button
                  onClick={() => setDateEditingInv(null)}
                  className="py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg text-xs"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
