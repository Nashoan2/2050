import React, { useRef, useState } from 'react';
import { useInvoice } from '../context/InvoiceContext';
import { AlmamlakaLogoBadge } from './LogoBadge';
import { ArabicNumberHelper } from '../utils/arabic';
import { Printer, Share2, Camera, X, Calendar, Filter } from 'lucide-react';
import html2canvas from 'html2canvas';

export const CustomerStatementModal: React.FC = () => {
  const {
    statementCustomer,
    statementStartDate,
    statementEndDate,
    storeConfig,
    reportConfig,
    navigateTo,
    showToast,
    updateStatementStartDate,
    updateStatementEndDate,
    setStatementQuickPeriod,
  } = useInvoice();

  const [showPeriodFilter, setShowPeriodFilter] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!statementCustomer) return null;

  // Filter transactions by dates if set
  const sDate = statementStartDate ? ArabicNumberHelper.parseDate(statementStartDate) : null;
  const eDate = statementEndDate ? ArabicNumberHelper.parseDate(statementEndDate) : null;

  const filteredTransactions = statementCustomer.transactions.filter(t => {
    if (!sDate && !eDate) return true;
    const tDate = ArabicNumberHelper.parseDate(t.date);
    if (!tDate) return true;
    if (sDate) {
      sDate.setHours(0, 0, 0, 0);
      if (tDate < sDate) return false;
    }
    if (eDate) {
      eDate.setHours(23, 59, 59, 999);
      if (tDate > eDate) return false;
    }
    return true;
  });

  const finalBalance = filteredTransactions.length > 0
    ? filteredTransactions[filteredTransactions.length - 1].balanceAfter
    : statementCustomer.balance;

  const totalDebit = filteredTransactions
    .filter(t => t.type === 'صرف' || t.type === 'فاتورة' || (t.type === 'افتتاح' && t.amount > 0))
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCredit = filteredTransactions
    .filter(t => t.type === 'قبض' || (t.type === 'افتتاح' && t.amount < 0))
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const tableBorderColor = reportConfig.tableBorderColorHex || '#0070BA';
  const headerColor = reportConfig.headerColorHex || '#1A237E';
  const fontScale = (reportConfig.fontScalePercent || 100) / 100;
  const tableHeaderBg = reportConfig.tableHeaderBgHex || '#EBF5FB';
  const tableHeaderTextColor = reportConfig.tableHeaderTextColorHex || reportConfig.primaryTextColorHex || '#111827';

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = () => {
    window.print();
    showToast('💡 اختر "حفظ بتنسيق PDF" من نافذة الطباعة.');
  };

  const handleCaptureScreenshot = async () => {
    if (!cardRef.current) return;
    setIsCapturing(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFFFF',
        logging: false,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `كشف_حساب_${statementCustomer.name}.png`;
      link.href = dataUrl;
      link.click();
      showToast('✅ تم حفظ صورة كشف الحساب بنجاح!');
    } catch (err: any) {
      showToast(`❌ تعذر التقاط كشف الحساب: ${err?.message || err}`);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F3F6] text-slate-900 p-2 sm:p-4 flex flex-col items-center">
      {/* Top Action Bar (hidden when printing) */}
      <div className="w-full max-w-4xl no-print mb-4 space-y-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={handlePrint}
            className="h-10 px-3 bg-[#1A237E] hover:bg-[#121858] text-white font-extrabold rounded-lg shadow text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة</span>
          </button>

          <button
            onClick={handleExportPdf}
            className="h-10 px-3 bg-[#C62828] hover:bg-[#a61f1f] text-white font-extrabold rounded-lg shadow text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>تصدير PDF</span>
          </button>

          <button
            disabled={isCapturing}
            onClick={handleCaptureScreenshot}
            className="h-10 px-3 bg-[#00796B] hover:bg-[#005f54] text-white font-extrabold rounded-lg shadow text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
          >
            <Camera className="w-4 h-4" />
            <span>{isCapturing ? 'جاري...' : '📸 لقطة شاشة'}</span>
          </button>

          <button
            onClick={() => setShowPeriodFilter(!showPeriodFilter)}
            className="h-10 px-3 bg-[#17A2B8] hover:bg-[#138496] text-white font-extrabold rounded-lg shadow text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>تغيير الفترة</span>
          </button>
        </div>

        <button
          onClick={() => navigateTo('MAIN')}
          className="w-full h-9 bg-slate-500 hover:bg-slate-600 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
          <span>إغلاق والرجوع للرئيسية</span>
        </button>

        {/* Quick Period Filter Dropdown / Card */}
        {showPeriodFilter && (
          <div className="p-3 bg-white rounded-xl shadow-lg border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-cyan-600" />
                تحديد فترة كشف الحساب:
              </span>
              <button
                onClick={() => setShowPeriodFilter(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                إغلاق
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 text-xs">
              <button
                onClick={() => setStatementQuickPeriod('today')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-cyan-100 rounded font-bold cursor-pointer"
              >
                اليوم
              </button>
              <button
                onClick={() => setStatementQuickPeriod('this_month')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-cyan-100 rounded font-bold cursor-pointer"
              >
                هذا الشهر
              </button>
              <button
                onClick={() => setStatementQuickPeriod('last_month')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-cyan-100 rounded font-bold cursor-pointer"
              >
                الشهر الماضي
              </button>
              <button
                onClick={() => setStatementQuickPeriod('3_months')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-cyan-100 rounded font-bold cursor-pointer"
              >
                آخر 3 أشهر
              </button>
              <button
                onClick={() => setStatementQuickPeriod('6_months')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-cyan-100 rounded font-bold cursor-pointer"
              >
                آخر 6 أشهر
              </button>
              <button
                onClick={() => setStatementQuickPeriod('all')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-cyan-100 rounded font-bold cursor-pointer"
              >
                جميع العمليات
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">من تاريخ (dd/MM/yyyy)</label>
                <input
                  type="text"
                  value={statementStartDate}
                  onChange={(e) => updateStatementStartDate(e.target.value)}
                  className="w-full h-8 px-2 text-xs border rounded bg-slate-50 font-bold"
                  placeholder="01/01/2026"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">إلى تاريخ (dd/MM/yyyy)</label>
                <input
                  type="text"
                  value={statementEndDate}
                  onChange={(e) => updateStatementEndDate(e.target.value)}
                  className="w-full h-8 px-2 text-xs border rounded bg-slate-50 font-bold"
                  placeholder="31/12/2026"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Printable Statement Document Card */}
      <div
        ref={cardRef}
        style={{ borderColor: tableBorderColor, transform: `scale(${fontScale})`, transformOrigin: 'top center' }}
        className="w-full max-w-4xl bg-white text-slate-900 rounded-xl border-4 p-4 sm:p-6 shadow-xl relative overflow-hidden print-card"
      >
        {/* Watermark in background */}
        {reportConfig.showWatermark && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-[0.05] select-none z-0">
            {reportConfig.showLogo && (
              <img
                src={storeConfig.logoBase64 ? (storeConfig.logoBase64.startsWith('data:') ? storeConfig.logoBase64 : `data:image/png;base64,${storeConfig.logoBase64}`) : '/app_logo.jpg'}
                alt="watermark"
                className="w-64 h-64 object-contain rounded-full mb-3"
              />
            )}
            <h1 className="text-4xl font-black text-indigo-900">{storeConfig.wmAr || storeConfig.storeNameAr || 'المملكة للإلكترونيات'}</h1>
            <p className="text-2xl font-black tracking-widest text-indigo-900 uppercase">
              {storeConfig.storeNameEn || 'ALMAMLAKA ELECTRONICS'}
            </p>
          </div>
        )}

        <div className="relative z-10 space-y-4">
          {/* 1. Header (Store Info - Logo) */}
          {(reportConfig.showStoreInfo || reportConfig.showLogo) && (
            <div className="flex items-center justify-between gap-4 pb-3 border-b-2" style={{ borderColor: tableBorderColor }}>
              {/* Arabic Info */}
              <div className="flex-1 text-right space-y-0.5">
                <h2 className="text-lg sm:text-xl font-black" style={{ color: headerColor }}>
                  {storeConfig.storeNameAr || 'المملكة للإلكترونيات'}
                </h2>
                <p className="text-xs font-bold text-slate-700">{storeConfig.addressAr || 'إب شارع تعز'}</p>
                <p className="text-xs font-extrabold" style={{ color: headerColor }}>
                  تلفون: {storeConfig.phone || '772707736'}
                </p>
                {reportConfig.showBranch && storeConfig.branch && (
                  <p className="text-xs font-semibold text-slate-600">الفرع: {storeConfig.branch}</p>
                )}
              </div>

              {/* Logo */}
              {reportConfig.showLogo && (
                <div className="shrink-0">
                  <AlmamlakaLogoBadge size={74} logoBase64={storeConfig.logoBase64} />
                </div>
              )}

              {/* English Info */}
              <div className="flex-1 text-left space-y-0.5" dir="ltr">
                <h2 className="text-sm sm:text-base font-black tracking-wide" style={{ color: headerColor }}>
                  {storeConfig.storeNameEn || 'ALMAMLAKA ELECTRONICS'}
                </h2>
                <p className="text-xs font-bold text-slate-700">{storeConfig.addressEn || 'YEMEN Ibb'}</p>
                <p className="text-xs font-extrabold" style={{ color: headerColor }}>
                  Tel: {storeConfig.phone || '772707736'}
                </p>
                <p className="text-[11px] font-semibold text-slate-500">
                  {ArabicNumberHelper.formatDateTime()}
                </p>
              </div>
            </div>
          )}

          {/* 2. Statement Title & Period */}
          <div className="text-center py-2 border-2 rounded-lg" style={{ backgroundColor: tableHeaderBg, color: tableHeaderTextColor, borderColor: tableBorderColor }}>
            <h1 className="text-lg sm:text-xl font-black">
              كشف حساب عميل: {statementCustomer.name}
            </h1>
            <p className="text-xs font-bold mt-0.5 opacity-90">
              رقم الحساب: <span className="font-black">{statementCustomer.accountNumber}</span>
              {statementCustomer.phone ? ` | الهاتف: ${statementCustomer.phone}` : ''}
              {statementStartDate && statementEndDate ? ` (الفترة: من ${statementStartDate} إلى ${statementEndDate})` : ' (جميع العمليات)'}
            </p>
          </div>

          {/* 3. Account Summary Badges */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200">
              <span className="text-xs text-red-700 font-bold block">إجمالي المدين (عليه):</span>
              <span className="text-base sm:text-lg font-black text-red-800">
                {ArabicNumberHelper.formatAmount(totalDebit)} YER
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
              <span className="text-xs text-emerald-700 font-bold block">إجمالي الدائن (له):</span>
              <span className="text-base sm:text-lg font-black text-emerald-800">
                {ArabicNumberHelper.formatAmount(totalCredit)} YER
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200">
              <span className="text-xs text-indigo-700 font-bold block">الرصيد النهائي:</span>
              <span className={`text-base sm:text-lg font-black ${finalBalance > 0 ? 'text-red-700' : finalBalance < 0 ? 'text-emerald-700' : 'text-slate-700'}`}>
                {ArabicNumberHelper.formatAmount(Math.abs(finalBalance))} YER
                <span className="text-xs block font-bold">
                  {finalBalance > 0 ? '(مدين / عليه)' : finalBalance < 0 ? '(دائن / له)' : '(خالص)'}
                </span>
              </span>
            </div>
          </div>

          {/* 4. Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="font-black border-2" style={{ backgroundColor: tableHeaderBg, color: tableHeaderTextColor, borderColor: tableBorderColor }}>
                  <th className="p-2 border text-center w-12" style={{ borderColor: tableBorderColor }}>م</th>
                  <th className="p-2 border" style={{ borderColor: tableBorderColor }}>التاريخ والوقت</th>
                  <th className="p-2 border text-center" style={{ borderColor: tableBorderColor }}>نوع الحركة</th>
                  <th className="p-2 border" style={{ borderColor: tableBorderColor }}>البيان والتفاصيل</th>
                  <th className="p-2 border text-left text-red-700" style={{ borderColor: tableBorderColor }}>مدين (عليه)</th>
                  <th className="p-2 border text-left text-emerald-700" style={{ borderColor: tableBorderColor }}>دائن (له)</th>
                  <th className="p-2 border text-left" style={{ borderColor: tableBorderColor }}>الرصيد</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-500 font-bold">
                      لا توجد حركات أو فواتير مسجلة لهذا الحساب في هذه الفترة.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx, idx) => {
                    const isDebit = tx.type === 'صرف' || tx.type === 'فاتورة' || (tx.type === 'افتتاح' && tx.amount > 0);
                    const isCredit = tx.type === 'قبض' || (tx.type === 'افتتاح' && tx.amount < 0);
                    const formattedType = ArabicNumberHelper.formatTransactionType(tx);
                    const cleanNote = ArabicNumberHelper.cleanStatementNote(tx.note);

                    return (
                      <tr key={idx} className={`border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`} style={{ borderColor: tableBorderColor }}>
                        <td className="p-2 text-center text-slate-500 font-bold border" style={{ borderColor: tableBorderColor }}>
                          {idx + 1}
                        </td>
                        <td className="p-2 text-slate-800 font-semibold border" style={{ borderColor: tableBorderColor }}>
                          {tx.date}
                        </td>
                        <td className="p-2 text-center font-bold border" style={{ borderColor: tableBorderColor }}>
                          <span className={`px-2 py-0.5 rounded text-xs ${tx.type === 'قبض' ? 'bg-emerald-100 text-emerald-800' : tx.type === 'صرف' ? 'bg-rose-100 text-rose-800' : tx.type === 'فاتورة' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'}`}>
                            {formattedType}
                          </span>
                        </td>
                        <td className="p-2 text-slate-800 font-semibold border" style={{ borderColor: tableBorderColor }}>
                          {cleanNote || tx.note || '---'}
                          {tx.voucherNum && !cleanNote.includes(tx.voucherNum) && (
                            <span className="text-slate-500 text-[11px] block">سند/فاتورة #{tx.voucherNum}</span>
                          )}
                        </td>
                        <td className="p-2 text-left font-black text-red-700 border" style={{ borderColor: tableBorderColor }}>
                          {isDebit ? ArabicNumberHelper.formatAmount(tx.amount) : '---'}
                        </td>
                        <td className="p-2 text-left font-black text-emerald-700 border" style={{ borderColor: tableBorderColor }}>
                          {isCredit ? ArabicNumberHelper.formatAmount(Math.abs(tx.amount)) : '---'}
                        </td>
                        <td className="p-2 text-left font-black text-slate-900 border" style={{ borderColor: tableBorderColor }}>
                          {ArabicNumberHelper.formatAmount(tx.balanceAfter)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* 5. Amount in Words Banner */}
          <div className="p-3 bg-[#EBF5FB] rounded-lg border-2 text-xs font-bold text-slate-800" style={{ borderColor: tableBorderColor }}>
            <span className="text-indigo-900 font-extrabold">الرصيد كتابة:</span>{' '}
            فقط {ArabicNumberHelper.numberToArabicWords(finalBalance)} ريال يمني{' '}
            {finalBalance > 0 ? '(مدين / مستحق للدفع)' : finalBalance < 0 ? '(دائن / للمشترك)' : '(خالص ومطابق)'}
          </div>

          {/* 6. Signatures */}
          <div className="pt-6 flex items-end justify-between text-xs font-bold text-slate-700">
            <div className="text-center space-y-8">
              <span>توقيع العميل للمطابقة:</span>
              <div className="w-36 border-b border-dashed border-slate-400" />
            </div>

            <div className="text-center space-y-8">
              <span>توقيع المحاسب / الإدارة:</span>
              <div className="w-36 border-b border-dashed border-slate-400">
                {reportConfig.accountantSignatureName && (
                  <span className="text-xs text-indigo-900 font-black">{reportConfig.accountantSignatureName}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
