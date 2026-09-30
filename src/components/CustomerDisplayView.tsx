import React from 'react';
import { useInvoice } from '../context/InvoiceContext';
import { AlmamlakaLogoBadge } from './LogoBadge';
import { ArabicNumberHelper } from '../utils/arabic';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export const CustomerDisplayView: React.FC = () => {
  const {
    previewInvoice,
    storeConfig,
    navigateTo,
  } = useInvoice();

  if (!previewInvoice) return null;

  const grandTotal = previewInvoice.grandTotal;
  const currName = ArabicNumberHelper.getCurrencyName(previewInvoice.currency);
  const amountInWords = ArabicNumberHelper.numberToArabicWords(grandTotal);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0E1A] via-[#111827] to-[#0A0E1A] text-white p-4 sm:p-6 flex flex-col justify-between">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={() => navigateTo('INVOICE_REPORT')}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-bold text-slate-300 transition-colors cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>الرجوع للفاتورة</span>
        </button>

        <div className="flex items-center gap-3">
          <AlmamlakaLogoBadge size={54} logoBase64={storeConfig.logoBase64} />
          <div>
            <h1 className="text-lg font-black text-white">{storeConfig.storeNameAr || 'المملكة للإلكترونيات'}</h1>
            <p className="text-xs text-slate-400 font-semibold">{storeConfig.branch || 'فرع شارع تعز'}</p>
          </div>
        </div>

        <div className="text-xs font-bold text-emerald-400 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" />
          <span>فاتورة معتمدة</span>
        </div>
      </div>

      {/* Main Display Body */}
      <div className="max-w-xl w-full mx-auto my-auto space-y-5 text-center">
        {/* Invoice Number & Type Banner */}
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-slate-800/80 border border-slate-700 shadow-lg">
          <span className="text-sm font-black text-purple-400">فاتورة رقم #{previewInvoice.invNum || '1'}</span>
          <span className="text-slate-600">|</span>
          <span className="text-sm font-extrabold text-amber-400">{previewInvoice.invType || 'نقداً'}</span>
        </div>

        {/* Customer Details */}
        <div className="space-y-1">
          <span className="text-xs text-slate-400 font-bold block">المشترك / العميل</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {previewInvoice.customerName || 'عميل نقدي محترم'}
          </h2>
          {previewInvoice.customerAccount && (
            <p className="text-xs text-purple-300 font-mono">حساب رقم: #{previewInvoice.customerAccount}</p>
          )}
        </div>

        {/* Subscription Info Card */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-3">
          <div className="grid grid-cols-2 gap-3 text-right">
            <div>
              <span className="text-xs text-slate-400 block font-semibold">باقة الاشتراك:</span>
              <span className="font-extrabold text-base text-white">{previewInvoice.desc || 'تجديد باقة تميز'}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-semibold">رقم الكارت:</span>
              <span className="font-extrabold text-base text-purple-300">{previewInvoice.cardId || '---'}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-semibold">المدة / الكمية:</span>
              <span className="font-extrabold text-base text-white">{previewInvoice.qty} {previewInvoice.type === 'tournament' ? 'بطولة' : 'شهر'}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-semibold">تاريخ الانتهاء:</span>
              <span className="font-extrabold text-base text-amber-400">{previewInvoice.endDate || '---'}</span>
            </div>
          </div>
        </div>

        {/* Grand Total Hero Box */}
        <div className="bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-purple-900/60 border-2 border-purple-500/60 rounded-3xl p-6 shadow-[0_0_30px_rgba(139,92,246,0.3)] space-y-2">
          <span className="text-xs sm:text-sm font-bold text-purple-200 block uppercase tracking-wider">
            المبلغ الإجمالي المطلوب
          </span>
          <div className="text-4xl sm:text-5xl font-black text-white tracking-wider font-mono">
            {ArabicNumberHelper.formatAmount(grandTotal)}{' '}
            <span className="text-xl sm:text-2xl text-purple-300">{previewInvoice.currency}</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-purple-200/90 pt-1">
            فقط {amountInWords} {currName} لا غير
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center border-t border-slate-800 pt-4 text-xs text-slate-400 space-y-1">
        <p className="font-extrabold text-slate-300">شكراً لتعاملكم مع {storeConfig.storeNameAr || 'المملكة للإلكترونيات'}</p>
        <p>خدمة العملاء: {storeConfig.phone || '772707736'}</p>
      </div>
    </div>
  );
};
