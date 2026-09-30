import React, { useState, useMemo } from 'react';
import { useInvoice } from '../context/InvoiceContext';
import { AlmamlakaLogoBadge } from './LogoBadge';
import { ArabicNumberHelper } from '../utils/arabic';
import {
  Plus,
  Folder,
  FileText,
  Users,
  DollarSign,
  Receipt,
  ClipboardList,
  Settings,
  LogOut,
  ChevronLeft,
  X,
  Trash2,
  Phone,
  Monitor,
  Printer,
  Share2,
  HardDrive,
  BarChart3,
  Percent,
  Calculator,
  RefreshCw,
  Search,
  Zap
} from 'lucide-react';
import { AppActionButton } from '../types';

export const MainScreen: React.FC = () => {
  const {
    storeConfig,
    uiConfig,
    isFormVisible,
    editingInvoiceId,
    invNum,
    invType,
    customerAccount,
    customerName,
    cardId,
    price,
    subscriptionType,
    qty,
    desc,
    endDate,
    invoiceDate,
    currency,
    extraItems,
    customers,
    closeInvoiceForm,
    updateInvNum,
    updateInvType,
    updateCustomerAccount,
    updateCustomerName,
    updateCardId,
    updatePrice,
    updateSubscriptionType,
    updateQty,
    updateDesc,
    updateInvoiceDate,
    updateEndDate,
    updateCurrency,
    addExtraItem,
    removeExtraItem,
    updateExtraItem,
    saveCurrentInvoice,
    getMainTotal,
    getExtraItemsTotal,
    getGrandTotal,
    selectCustomerForInvoice,
    generateNewCustomerAccount,
    executeActionButton,
    setSettingsModalVisible,
    showToast,
  } = useInvoice();

  const [showCustomerPicker, setShowCustomerPicker] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');

  // Matched customer for balance display
  const matchedCustomer = customerAccount
    ? customers.find(c => ArabicNumberHelper.toEngDigits(c.accountNumber).trim() === ArabicNumberHelper.toEngDigits(customerAccount).trim())
    : customerName
    ? customers.find(c => c.name.trim().toLowerCase() === customerName.trim().toLowerCase())
    : undefined;

  // Shortcuts
  const activeShortcuts = uiConfig.buttons.filter(b => b.isQuickShortcut);
  const visibleButtons = uiConfig.buttons.filter(b => b.isVisible);

  // Instant click handler: bypasses confirmation modal only for main screen exit button
  const handleActionClick = (btn: AppActionButton) => {
    if (btn.id === 'EXIT_APP') {
      showToast('شكراً لاستخدامكم نظام المملكة للإلكترونيات.');
      try {
        window.close();
      } catch {
        // ignored
      }
      return;
    }
    executeActionButton(btn);
  };

  // Render Action Icon
  const renderActionIcon = (id: string, emoji: string) => {
    switch (id) {
      case 'NEW_INVOICE': return <Plus className="w-5 h-5 text-white" />;
      case 'SAVED_INVOICES': return <Folder className="w-5 h-5 text-white" />;
      case 'OPEN_REPORT': return <FileText className="w-5 h-5 text-white" />;
      case 'CUSTOMERS': return <Users className="w-5 h-5 text-white" />;
      case 'RECEIPT_VOUCHER': return <DollarSign className="w-5 h-5 text-white" />;
      case 'PAYMENT_VOUCHER': return <Receipt className="w-5 h-5 text-white" />;
      case 'ALL_CUSTOMERS': return <ClipboardList className="w-5 h-5 text-white" />;
      case 'SETTINGS': return <Settings className="w-5 h-5 text-white" />;
      case 'EXIT_APP': return <LogOut className="w-5 h-5 text-white" />;
      case 'CUSTOMER_DISPLAY': return <Monitor className="w-5 h-5 text-white" />;
      case 'PRINT_INVOICE': return <Printer className="w-5 h-5 text-white" />;
      case 'EXPORT_PDF': return <Share2 className="w-5 h-5 text-white" />;
      case 'ROOM_BACKUP': return <HardDrive className="w-5 h-5 text-white" />;
      case 'REPORT_CONTROL': return <BarChart3 className="w-5 h-5 text-white" />;
      case 'CURRENCY_CONVERTER': return <RefreshCw className="w-5 h-5 text-white" />;
      case 'PERCENTAGE_CALCULATOR': return <Percent className="w-5 h-5 text-white" />;
      case 'FULL_CALCULATOR': return <Calculator className="w-5 h-5 text-white" />;
      default:
        return emoji ? <span className="text-base">{emoji}</span> : <ChevronLeft className="w-5 h-5 text-white" />;
    }
  };

  const getButtonGradient = (btn: AppActionButton) => {
    switch (btn.id) {
      case 'NEW_INVOICE': return 'from-[#65330D] via-[#472106] to-[#2B1202] border-[#8B4513]';
      case 'SAVED_INVOICES': return 'from-[#734019] via-[#532B0E] to-[#351A05] border-[#9E5B28]';
      case 'OPEN_REPORT': return 'from-[#0B5D9E] via-[#063F6E] to-[#032542] border-[#1A82D2]';
      case 'CUSTOMERS': return 'from-[#581C87] via-[#3B0F5D] to-[#24063C] border-[#8427D6]';
      case 'RECEIPT_VOUCHER': return 'from-[#059640] via-[#03702E] to-[#01461B] border-[#10B981]';
      case 'PAYMENT_VOUCHER': return 'from-[#DC2626] via-[#A51717] to-[#6B0B0B] border-[#EF4444]';
      case 'ALL_CUSTOMERS': return 'from-[#1D4ED8] via-[#163CA8] to-[#0E256C] border-[#3B82F6]';
      case 'SETTINGS': return 'from-[#233348] via-[#172332] to-[#0B131C] border-[#3D5470]';
      case 'EXIT_APP': return 'from-[#B91C1C] via-[#8A1111] to-[#550808] border-[#EF4444]';
      default: return 'from-[#1E293B] via-[#0F172A] to-[#020617] border-[#334155]';
    }
  };

  const grandTotal = useMemo(() => getGrandTotal(), [price, extraItems, currency]);
  const grandTotalWords = useMemo(() => ArabicNumberHelper.numberToArabicWords(grandTotal), [grandTotal]);
  const currName = ArabicNumberHelper.getCurrencyName(currency);

  return (
    <div className="w-full max-w-xl mx-auto px-3 sm:px-4 py-4 min-h-screen flex flex-col justify-start">
      {/* 1. Header (Almamlaka Logo on Left in LTR / Right in RTL, Store Title with glowing line) */}
      <div className="flex items-center justify-between gap-4 mb-4 pb-2 border-b border-slate-700/60">
        {/* Logo Badge (Clickable to open settings) */}
        <div onClick={() => setSettingsModalVisible(true)} title="فتح إعدادات المتجر">
          <AlmamlakaLogoBadge size={80} logoBase64={storeConfig.logoBase64} />
        </div>

        {/* Store Title with neon line */}
        <div
          onClick={() => setSettingsModalVisible(true)}
          className="flex flex-col items-start cursor-pointer select-none group"
          title="فتح إعدادات المتجر"
        >
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide group-hover:text-purple-300 transition-colors">
            {storeConfig.storeNameAr || 'المملكة للإلكترونيات'}
          </h1>
          <div className="h-[3.5px] w-48 sm:w-56 mt-1.5 rounded-full bg-gradient-to-r from-[#00F2FE] via-[#818CF8] to-[#E879F9] shadow-[0_0_12px_rgba(0,242,254,0.6)]" />
          <span className="text-xs text-slate-400 mt-1 font-semibold">{storeConfig.branch || 'فرع شارع تعز'}</span>
        </div>
      </div>

      {!isFormVisible ? (
        <>
          {/* 2. Quick Shortcuts (2x2 Grid) */}
          {uiConfig.showQuickShortcutsBar && activeShortcuts.length > 0 && (
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              {activeShortcuts.map((shortcut) => {
                let badgeBg = 'bg-gradient-to-br from-blue-500 to-indigo-700';
                let borderColor = 'border-blue-500';
                let IconComponent = Users;
                let label = shortcut.label;

                if (shortcut.id === 'CURRENCY_CONVERTER') {
                  badgeBg = 'bg-gradient-to-br from-emerald-500 to-teal-700';
                  borderColor = 'border-emerald-500';
                  IconComponent = RefreshCw;
                  label = 'محول العملات';
                } else if (shortcut.id === 'ALL_CUSTOMERS') {
                  badgeBg = 'bg-gradient-to-br from-blue-500 to-indigo-700';
                  borderColor = 'border-blue-500';
                  IconComponent = Users;
                  label = 'جميع العملاء';
                } else if (shortcut.id === 'PERCENTAGE_CALCULATOR') {
                  badgeBg = 'bg-gradient-to-br from-indigo-500 to-purple-700';
                  borderColor = 'border-indigo-500';
                  IconComponent = Percent;
                  label = 'حاسبة النسبة المئوية';
                } else if (shortcut.id === 'FULL_CALCULATOR') {
                  badgeBg = 'bg-gradient-to-br from-rose-500 to-red-700';
                  borderColor = 'border-rose-500';
                  IconComponent = Calculator;
                  label = 'آلة حاسبة النسبة';
                }

                return (
                  <button
                    key={shortcut.id}
                    type="button"
                    onClick={() => handleActionClick(shortcut)}
                    className={`flex items-center justify-between px-3 py-2 bg-[#F7F2E7] hover:bg-white text-slate-900 rounded-xl border-2 ${borderColor} shadow-md transition-transform duration-75 active:scale-[0.98] cursor-pointer select-none`}
                  >
                    <span className="font-extrabold text-sm truncate">{label}</span>
                    <div className={`w-9 h-9 rounded-lg ${badgeBg} flex items-center justify-center text-white shadow-sm shrink-0 border border-white/30`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* 3. Main Action Buttons (3D Capsules) */}
          <div className="flex flex-col gap-2.5">
            {visibleButtons.map((btn) => {
              const gradient = getButtonGradient(btn);
              return (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => handleActionClick(btn)}
                  className={`relative flex items-center justify-between px-4 py-3 bg-gradient-to-b ${gradient} rounded-full border shadow-lg text-white hover:brightness-110 active:scale-[0.98] transition-transform duration-75 cursor-pointer overflow-hidden glass-shine select-none`}
                >
                  <div className="flex items-center gap-2">
                    <ChevronLeft className="w-5 h-5 text-white/80" />
                    <span className="font-bold text-base tracking-wide">{btn.label}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full button-orb flex items-center justify-center shrink-0 border border-white/30">
                    {renderActionIcon(btn.id, btn.iconEmoji)}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        /* Invoice Entry / Edit Form Section */
        <div className="bg-[#ECEFF1] text-slate-900 rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-300">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-300">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              {editingInvoiceId ? (
                <>
                  <span>✏️</span> تعديل الفاتورة ({invNum})
                </>
              ) : (
                <>
                  <span>📋</span> إدخال بيانات الفاتورة
                </>
              )}
            </h2>
            <button
              onClick={closeInvoiceForm}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title="إغلاق والرجوع للرئيسية"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {/* Row 1: Invoice Type | Invoice Number | Currency */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">نوع الفاتورة</label>
                <select
                  value={invType}
                  onChange={(e) => updateInvType(e.target.value)}
                  className="w-full h-11 px-2.5 rounded-lg bg-white border border-slate-300 font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="نقداً">نقداً</option>
                  <option value="أجل">أجل</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">رقم الفاتورة</label>
                <input
                  type="text"
                  value={invNum}
                  onChange={(e) => updateInvNum(e.target.value)}
                  className="w-full h-11 px-2.5 text-center rounded-lg bg-white border border-slate-300 font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">العملة</label>
                <select
                  value={currency}
                  onChange={(e) => updateCurrency(e.target.value)}
                  className="w-full h-11 px-2.5 rounded-lg bg-white border border-slate-300 font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="YER">YER (ريال يمني)</option>
                  <option value="$">($) USD (دولار)</option>
                  <option value="SAR">(SR) SAR (ريال سعودي)</option>
                </select>
              </div>
            </div>

            {/* Editable date if modifying existing invoice */}
            {editingInvoiceId !== null && (
              <div>
                <label className="block text-xs font-bold text-purple-900 mb-1">📅 تاريخ الفاتورة (قابل للتعديل)</label>
                <input
                  type="text"
                  value={invoiceDate}
                  onChange={(e) => updateInvoiceDate(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg bg-[#FFF0F3] border border-purple-300 font-bold text-sm text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            )}

            {/* Row 2: Customer Account Number and Customer Name */}
            {invType === 'أجل' ? (
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">رقم حساب العميل</label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setCustomerSearch('');
                          setShowCustomerPicker(true);
                        }}
                        className="px-2 py-0.5 rounded bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-bold border border-blue-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Users className="w-3 h-3" />
                        دليل العملاء
                      </button>
                      <button
                        type="button"
                        onClick={generateNewCustomerAccount}
                        className="px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold border border-amber-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Zap className="w-3 h-3" />
                        رقم جديد
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={customerAccount}
                    onChange={(e) => updateCustomerAccount(e.target.value)}
                    placeholder="رقم الحساب"
                    className="w-full h-11 px-3 rounded-lg bg-[#FFF0F3] border border-rose-200 font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">اسم المشترك / العميل</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => updateCustomerName(e.target.value)}
                    placeholder="اسم المشترك / العميل"
                    className="w-full h-11 px-3 rounded-lg bg-[#FFF0F3] border border-rose-200 font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                {matchedCustomer && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-700">👤 صاحب الحساب:</span>
                      <span className="font-black text-emerald-900 text-sm">{matchedCustomer.name}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-emerald-200 pt-1">
                      <span className="font-bold text-slate-700">💰 الرصيد الحالي للعميل:</span>
                      <span className={`font-black text-sm ${matchedCustomer.balance > 0 ? 'text-red-700' : matchedCustomer.balance < 0 ? 'text-emerald-700' : 'text-slate-600'}`}>
                        {ArabicNumberHelper.formatAmount(matchedCustomer.balance)} {currency}
                        {matchedCustomer.balance > 0 ? ' (عليه دين سابق)' : matchedCustomer.balance < 0 ? ' (له رصيد دائن)' : ' (متزن / 0)'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم العميل / المشترك</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => updateCustomerName(e.target.value)}
                  placeholder="اسم العميل (اختياري للفاتورة النقدية)"
                  className="w-full h-11 px-3 rounded-lg bg-[#FFF0F3] border border-rose-200 font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            )}

            {/* Row 3: Card / Subscription ID | Price */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">رقم الاشتراك / الكارت</label>
                <input
                  type="text"
                  value={cardId}
                  onChange={(e) => updateCardId(e.target.value)}
                  placeholder="رقم الكارت"
                  className="w-full h-11 px-3 rounded-lg bg-[#FFF0F3] border border-rose-200 font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">سعر الاشتراك</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => updatePrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-11 px-3 rounded-lg bg-[#FFF0F3] border border-rose-200 font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>

            {/* Row 4: Qty | Subscription Type */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">العدد (الكمية)</label>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => updateQty(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg bg-[#FFF0F3] border border-rose-200 font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">نوع التجديد / المدة</label>
                <select
                  value={subscriptionType}
                  onChange={(e) => updateSubscriptionType(e.target.value)}
                  className="w-full h-11 px-2.5 rounded-lg bg-white border border-slate-300 font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="months">أشهر (تجديد شهري)</option>
                  <option value="tournament">بطولة (تجديد بطولة)</option>
                </select>
              </div>
            </div>

            {/* Row 5: Main Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الوصف الرئيسي</label>
              <input
                type="text"
                value={desc}
                onChange={(e) => updateDesc(e.target.value)}
                className="w-full h-11 px-3 rounded-lg bg-[#FFF0F3] border border-rose-200 font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            {/* Row 6: End Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">تاريخ الانتهاء</label>
              <input
                type="text"
                value={endDate}
                onChange={(e) => updateEndDate(e.target.value)}
                placeholder="dd/MM/yyyy"
                className="w-full h-11 px-3 rounded-lg bg-[#FFF0F3] border border-rose-200 font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            {/* Extra Items Section */}
            <div className="pt-2 border-t border-slate-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-slate-800">الأصناف الإضافية ({extraItems.length})</span>
                <button
                  type="button"
                  onClick={() => addExtraItem('', 0, 1, currency)}
                  className="px-2.5 py-1 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  إضافة صنف إضافي
                </button>
              </div>

              {extraItems.map((item) => (
                <div key={item.id} className="p-2.5 mb-2 bg-white rounded-lg border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateExtraItem(item.id, e.target.value, item.price, item.qty, item.currency)}
                      placeholder="اسم الصنف الإضافي"
                      className="flex-1 h-9 px-2 text-xs rounded bg-slate-50 border border-slate-300 font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => removeExtraItem(item.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                      title="حذف الصنف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold">السعر</span>
                      <input
                        type="number"
                        value={item.price || ''}
                        onChange={(e) => updateExtraItem(item.id, item.description, parseFloat(e.target.value) || 0, item.qty, item.currency)}
                        className="w-full h-8 px-2 text-xs rounded bg-slate-50 border border-slate-300 font-bold text-center"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold">الكمية</span>
                      <input
                        type="number"
                        value={item.qty || ''}
                        onChange={(e) => updateExtraItem(item.id, item.description, item.price, parseFloat(e.target.value) || 1, item.currency)}
                        className="w-full h-8 px-2 text-xs rounded bg-slate-50 border border-slate-300 font-bold text-center"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold">العملة</span>
                      <select
                        value={item.currency}
                        onChange={(e) => updateExtraItem(item.id, item.description, item.price, item.qty, e.target.value)}
                        className="w-full h-8 px-1 text-xs rounded bg-slate-50 border border-slate-300 font-bold"
                      >
                        <option value="YER">YER</option>
                        <option value="$">USD</option>
                        <option value="SAR">SAR</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Grand Total Summary Card */}
            <div className="p-3 bg-white rounded-xl border border-purple-200 shadow-sm space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
                <span>سعر الاشتراك:</span>
                <span>{ArabicNumberHelper.formatAmount(getMainTotal())} {currency}</span>
              </div>
              {extraItems.length > 0 && (
                <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
                  <span>إجمالي الأصناف الإضافية:</span>
                  <span>{ArabicNumberHelper.formatAmount(getExtraItemsTotal())} {currency}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-base font-black text-purple-900 border-t border-slate-200 pt-1.5">
                <span>المبلغ الإجمالي الكلي:</span>
                <span className="text-xl text-rose-600">
                  {ArabicNumberHelper.formatAmount(grandTotal)} {currency}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-700 bg-purple-50 p-2 rounded border border-purple-100 mt-1">
                <span className="text-purple-900">المبلغ كتابة:</span> فقط {grandTotalWords} {currName} لا غير
              </div>
            </div>

            {/* Action Buttons: Save & Close */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={saveCurrentInvoice}
                className="w-full py-3 bg-[#5E258D] hover:bg-[#4d1e75] active:scale-[0.98] text-white font-extrabold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>💾</span>
                {editingInvoiceId ? 'حفظ التعديلات' : 'حفظ الفاتورة'}
              </button>
              <button
                type="button"
                onClick={closeInvoiceForm}
                className="w-full py-3 bg-slate-500 hover:bg-slate-600 active:scale-[0.98] text-white font-extrabold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>✖</span>
                إغلاق وإلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Picker Dialog */}
      {showCustomerPicker && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                دليل العملاء والحسابات
              </h3>
              <button
                onClick={() => setShowCustomerPicker(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-2">
              <div className="relative">
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="ابحث بالاسم أو رقم الحساب أو الهاتف..."
                  className="w-full h-10 pr-9 pl-3 bg-slate-100 rounded-lg text-sm text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 my-2">
              {customers
                .filter(c =>
                  c.name.includes(customerSearch) ||
                  c.accountNumber.includes(customerSearch) ||
                  c.phone.includes(customerSearch)
                )
                .map(c => (
                  <div
                    key={c.id}
                    onClick={() => {
                      selectCustomerForInvoice(c);
                      setShowCustomerPicker(false);
                    }}
                    className="p-3 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{c.name}</div>
                      <div className="text-xs text-slate-500">حساب: {c.accountNumber} {c.phone ? `| هاتف: ${c.phone}` : ''}</div>
                    </div>
                    <div className="text-left font-black text-xs text-purple-700">
                      {ArabicNumberHelper.formatAmount(c.balance)} YER
                    </div>
                  </div>
                ))}
            </div>

            <button
              onClick={() => setShowCustomerPicker(false)}
              className="w-full py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-sm transition-colors cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
