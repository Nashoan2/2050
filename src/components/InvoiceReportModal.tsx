import React, { useRef, useState } from 'react';
import { useInvoice } from '../context/InvoiceContext';
import { AlmamlakaLogoBadge } from './LogoBadge';
import { ArabicNumberHelper } from '../utils/arabic';
import { Printer, Share2, Camera, X, Monitor, CheckCircle, ShieldCheck } from 'lucide-react';
import html2canvas from 'html2canvas';

export const InvoiceReportModal: React.FC = () => {
  const {
    previewInvoice,
    storeConfig,
    reportConfig,
    navigateTo,
    showToast,
  } = useInvoice();

  const [isCapturing, setIsCapturing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!previewInvoice) return null;

  const fontScale = (reportConfig.fontScalePercent || 100) / 100;
  const tableBorderColor = reportConfig.tableBorderColorHex || '#0070BA';
  const headerColor = reportConfig.headerColorHex || '#5E258D';
  const textColor = reportConfig.primaryTextColorHex || '#111111';
  const tableHeaderBg = reportConfig.tableHeaderBgHex || '#EBF5FB';
  const tableHeaderTextColor = reportConfig.tableHeaderTextColorHex || reportConfig.primaryTextColorHex || '#111827';

  const grandTotal = previewInvoice.grandTotal;
  const currName = ArabicNumberHelper.getCurrencyName(previewInvoice.currency);
  const amountInWords = `فقط ${ArabicNumberHelper.numberToArabicWords(grandTotal)} ${currName} لا غير`;
  const invDate = previewInvoice.createdAt
    ? ArabicNumberHelper.formatTo24HourDateTime(previewInvoice.createdAt)
    : ArabicNumberHelper.formatDateTime();

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = () => {
    window.print();
    showToast('💡 يمكنك اختيار "حفظ بتنسيق PDF" (Save as PDF) من نافذة الطباعة.');
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
      link.download = `فاتورة_${previewInvoice.invNum || '1'}.png`;
      link.href = dataUrl;
      link.click();
      showToast('✅ تم حفظ صورة الفاتورة بنجاح!');
    } catch (err: any) {
      showToast(`❌ تعذر التقاط الفاتورة: ${err?.message || err}`);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF1F5] text-slate-900 p-2 sm:p-4 flex flex-col items-center">
      {/* Top Action Bar (hidden when printing) */}
      <div className="w-full max-w-3xl no-print mb-4 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handlePrint}
            className="h-11 px-4 bg-[#5E258D] hover:bg-[#4b1d70] text-white font-extrabold rounded-lg shadow flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الفاتورة</span>
          </button>
          <button
            onClick={handleExportPdf}
            className="h-11 px-4 bg-[#C62828] hover:bg-[#a61f1f] text-white font-extrabold rounded-lg shadow flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>تصدير PDF</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => navigateTo('CUSTOMER_INVOICE_DISPLAY')}
            className="h-10 px-2 bg-[#2E7D32] hover:bg-[#236327] text-white font-bold rounded-lg text-xs sm:text-sm flex items-center justify-center gap-1 cursor-pointer transition-colors"
          >
            <Monitor className="w-4 h-4" />
            <span>وضع العرض 📱</span>
          </button>

          <button
            disabled={isCapturing}
            onClick={handleCaptureScreenshot}
            className="h-10 px-2 bg-[#00796B] hover:bg-[#005f54] text-white font-bold rounded-lg text-xs sm:text-sm flex items-center justify-center gap-1 cursor-pointer transition-colors disabled:opacity-50"
          >
            <Camera className="w-4 h-4" />
            <span>{isCapturing ? 'جاري...' : '📸 لقطة الشاشة'}</span>
          </button>

          <button
            onClick={() => navigateTo('MAIN')}
            className="h-10 px-2 bg-[#557A8B] hover:bg-[#436270] text-white font-bold rounded-lg text-xs sm:text-sm flex items-center justify-center gap-1 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
            <span>✖ إغلاق</span>
          </button>
        </div>
      </div>

      {/* Printable Invoice Document Card */}
      <div
        ref={cardRef}
        style={{ borderColor: tableBorderColor, transform: `scale(${fontScale})`, transformOrigin: 'top center' }}
        className="w-full max-w-3xl bg-white text-slate-900 rounded-xl border-4 p-4 sm:p-6 shadow-xl relative overflow-hidden print-card"
      >
        {/* Watermark in background */}
        {reportConfig.showWatermark && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-[0.06] select-none z-0">
            {reportConfig.showLogo && (
              <img
                src={storeConfig.logoBase64 ? (storeConfig.logoBase64.startsWith('data:') ? storeConfig.logoBase64 : `data:image/png;base64,${storeConfig.logoBase64}`) : '/app_logo.jpg'}
                alt="watermark"
                className="w-64 h-64 object-contain rounded-full mb-3"
              />
            )}
            <h1 className="text-4xl font-black text-purple-900">{storeConfig.wmAr || storeConfig.storeNameAr || 'المملكة للإلكترونيات'}</h1>
            <p className="text-2xl font-black tracking-widest text-purple-900 uppercase">
              {storeConfig.storeNameEn || 'ALMAMLAKA ELECTRONICS'}
            </p>
          </div>
        )}

        <div className="relative z-10 space-y-4">
          {/* Custom Header Title (if any) */}
          {reportConfig.customHeaderTitle && (
            <div className="text-center font-black text-base text-purple-900 pb-1">
              {reportConfig.customHeaderTitle}
            </div>
          )}

          {/* Custom Notice Badge (if any) */}
          {reportConfig.customNoticeBadge && (
            <div className="p-2 bg-amber-50 border border-amber-300 rounded text-center text-xs font-bold text-amber-900">
              {reportConfig.customNoticeBadge}
            </div>
          )}

          {/* 1. Header (Arabic Store Info - Logo - English Store Info) */}
          {(reportConfig.showStoreInfo || reportConfig.showLogo) && (
            <div className="flex items-center justify-between gap-4 pb-3 border-b-2" style={{ borderColor: tableBorderColor }}>
              {/* Arabic Info */}
              {reportConfig.showStoreInfo ? (
                <div className="flex-1 text-right space-y-0.5">
                  <h2 className="text-lg sm:text-xl font-black" style={{ color: headerColor }}>
                    {storeConfig.storeNameAr || 'المملكة للإلكترونيات'}
                  </h2>
                  <p className="text-xs font-bold text-slate-700">{storeConfig.addressAr || 'إب الشارع العام'}</p>
                  <p className="text-xs font-extrabold" style={{ color: headerColor }}>
                    تلفون: {storeConfig.phone || '772707736'}
                  </p>
                  {reportConfig.showBranch && storeConfig.branch && (
                    <p className="text-xs font-semibold text-slate-600">الفرع: {storeConfig.branch}</p>
                  )}
                  {reportConfig.taxOrCrNumber && (
                    <p className="text-[11px] font-bold text-slate-500">الرقم الضريبي/السجل: {reportConfig.taxOrCrNumber}</p>
                  )}
                </div>
              ) : (
                <div className="flex-1" />
              )}

              {/* Logo in Center */}
              {reportConfig.showLogo && (
                <div className="shrink-0">
                  <AlmamlakaLogoBadge size={74} logoBase64={storeConfig.logoBase64} />
                </div>
              )}

              {/* English Info */}
              {reportConfig.showStoreInfo ? (
                <div className="flex-1 text-left space-y-0.5" dir="ltr">
                  <h2 className="text-sm sm:text-base font-black tracking-wide" style={{ color: headerColor }}>
                    {storeConfig.storeNameEn || 'almamlak Electronics'}
                  </h2>
                  <p className="text-xs font-bold text-slate-700">{storeConfig.addressEn || 'YEMEN Ibb'}</p>
                  <p className="text-xs font-extrabold" style={{ color: headerColor }}>
                    Tel: {storeConfig.phone || '772707736'}
                  </p>
                  {reportConfig.showDateTime && (
                    <p className="text-[11px] font-semibold text-slate-500">{invDate}</p>
                  )}
                </div>
              ) : (
                <div className="flex-1" />
              )}
            </div>
          )}

          {/* 2. Invoice Meta Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded-lg bg-slate-50 border" style={{ borderColor: tableBorderColor }}>
            <div>
              <span className="text-[11px] text-slate-500 block font-semibold">رقم الفاتورة:</span>
              <span className="text-base font-black text-rose-700">{previewInvoice.invNum || '1'}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block font-semibold">نوع الفاتورة:</span>
              <span className="text-sm font-black text-slate-900">{previewInvoice.invType || 'نقداً'}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block font-semibold">اسم العميل:</span>
              <span className="text-sm font-black text-purple-900 truncate block">
                {previewInvoice.customerName || 'عميل نقدي'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block font-semibold">رقم الحساب:</span>
              <span className="text-sm font-black text-slate-800">
                {previewInvoice.customerAccount || '---'}
              </span>
            </div>
          </div>

          {/* 3. Main Item Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="font-black border-2" style={{ backgroundColor: tableHeaderBg, color: tableHeaderTextColor, borderColor: tableBorderColor }}>
                  <th className="p-2 border" style={{ borderColor: tableBorderColor }}>اسم الصنف / البيان</th>
                  <th className="p-2 border text-center" style={{ borderColor: tableBorderColor }}>رقم الاشتراك / الكارت</th>
                  <th className="p-2 border text-center" style={{ borderColor: tableBorderColor }}>المدة / الكمية</th>
                  <th className="p-2 border text-center" style={{ borderColor: tableBorderColor }}>تاريخ الانتهاء</th>
                  <th className="p-2 border text-left" style={{ borderColor: tableBorderColor }}>المبلغ</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b" style={{ borderColor: tableBorderColor }}>
                  <td className="p-2.5 font-bold text-slate-900 border" style={{ borderColor: tableBorderColor }}>
                    {previewInvoice.desc || 'تجديد باقة تميز'}
                  </td>
                  <td className="p-2.5 text-center font-bold text-slate-700 border" style={{ borderColor: tableBorderColor }}>
                    {previewInvoice.cardId || '---'}
                  </td>
                  <td className="p-2.5 text-center font-bold text-slate-700 border" style={{ borderColor: tableBorderColor }}>
                    {previewInvoice.qty} {previewInvoice.type === 'tournament' ? 'بطولة' : 'شهر'}
                  </td>
                  <td className="p-2.5 text-center font-bold text-slate-700 border" style={{ borderColor: tableBorderColor }}>
                    {previewInvoice.endDate || '---'}
                  </td>
                  <td className="p-2.5 text-left font-black text-slate-900 border" style={{ borderColor: tableBorderColor }}>
                    {ArabicNumberHelper.formatAmount(previewInvoice.price)} {previewInvoice.currency}
                  </td>
                </tr>

                {/* Extra Items Rows */}
                {previewInvoice.extraItems && previewInvoice.extraItems.map((item, idx) => (
                  <tr key={idx} className="border-b bg-slate-50/50" style={{ borderColor: tableBorderColor }}>
                    <td className="p-2 font-semibold text-slate-800 border" style={{ borderColor: tableBorderColor }}>
                      {item.description || 'صنف إضافي'}
                    </td>
                    <td className="p-2 text-center text-slate-500 border" style={{ borderColor: tableBorderColor }}>
                      ---
                    </td>
                    <td className="p-2 text-center font-semibold text-slate-700 border" style={{ borderColor: tableBorderColor }}>
                      {item.qty}
                    </td>
                    <td className="p-2 text-center text-slate-500 border" style={{ borderColor: tableBorderColor }}>
                      ---
                    </td>
                    <td className="p-2 text-left font-black text-slate-900 border" style={{ borderColor: tableBorderColor }}>
                      {ArabicNumberHelper.formatAmount(item.price * item.qty)} {item.currency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 4. Grand Total & Tafqeet Bar */}
          <div className="p-3 rounded-lg border-2 space-y-1.5" style={{ backgroundColor: tableHeaderBg, color: tableHeaderTextColor, borderColor: tableBorderColor }}>
            <div className="flex items-center justify-between text-base sm:text-lg font-black">
              <span>المبلغ الإجمالي الكلي:</span>
              <span className="text-xl sm:text-2xl text-rose-700">
                {ArabicNumberHelper.formatAmount(grandTotal)} {previewInvoice.currency}
              </span>
            </div>
            {reportConfig.showAmountInWords && (
              <div className="text-xs sm:text-sm font-bold pt-1 border-t" style={{ borderColor: tableBorderColor }}>
                <span className="font-extrabold" style={{ color: headerColor }}>المبلغ كتابة:</span> {amountInWords}
              </div>
            )}
          </div>

          {/* 5. Terms & Notes */}
          {reportConfig.showTermsAndNotes && storeConfig.terms && (
            <div className="p-2.5 bg-slate-50 rounded-lg border text-xs text-slate-700 whitespace-pre-line leading-relaxed">
              <span className="font-extrabold text-slate-900 block mb-1">شروط وملاحظات:</span>
              {storeConfig.terms}
            </div>
          )}

          {/* 6. Signatures and Stamp */}
          {reportConfig.showSignatures && (
            <div className="pt-4 flex items-end justify-between text-xs font-bold text-slate-700">
              <div className="text-center space-y-8">
                <span>توقيع العميل المستلم:</span>
                <div className="w-32 border-b border-dashed border-slate-400" />
              </div>

              {reportConfig.showStampSeal && (
                <div className="text-center p-2 rounded-full border-2 border-dashed border-red-600 text-red-600 font-black text-xs rotate-[-6deg] select-none">
                  <ShieldCheck className="w-6 h-6 mx-auto mb-0.5" />
                  <span>ختم معتمد إلكترونياً</span>
                </div>
              )}

              <div className="text-center space-y-8">
                <span>توقيع المحاسب / الإدارة:</span>
                <div className="w-32 border-b border-dashed border-slate-400">
                  {reportConfig.accountantSignatureName && (
                    <span className="text-[11px] text-purple-900 font-black">{reportConfig.accountantSignatureName}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Custom Footer Text (if any) */}
          {reportConfig.customFooterText && (
            <div className="text-center text-xs font-bold text-slate-500 pt-2 border-t border-slate-200">
              {reportConfig.customFooterText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
