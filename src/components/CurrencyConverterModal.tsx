import React, { useState } from 'react';
import { useInvoice } from '../context/InvoiceContext';
import { ArabicNumberHelper } from '../utils/arabic';
import {
  ArrowRight,
  Copy,
  Edit2,
  RefreshCw,
  Check,
  X,
  Settings
} from 'lucide-react';
import { ExchangeRates } from '../types';

export const CurrencyConverterModal: React.FC = () => {
  const {
    exchangeRates,
    updateExchangeRates,
    navigateTo,
    showToast
  } = useInvoice();

  const [activeCurrency, setActiveCurrency] = useState<'USD' | 'SAR' | 'YER'>('USD');
  const [amountInput, setAmountInput] = useState<string>('100');
  const [showRatesModal, setShowRatesModal] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Temporary rates for editing
  const [tempRates, setTempRates] = useState<ExchangeRates>(exchangeRates);

  const rawAmount = parseFloat(ArabicNumberHelper.toEngDigits(amountInput)) || 0;

  // Real calculations based on active currency
  let usdVal = 0;
  let sarVal = 0;
  let yerVal = 0;

  if (activeCurrency === 'USD') {
    usdVal = rawAmount;
    sarVal = rawAmount * exchangeRates.usdToSar;
    yerVal = rawAmount * exchangeRates.usdToYer;
  } else if (activeCurrency === 'SAR') {
    sarVal = rawAmount;
    usdVal = exchangeRates.usdToSar > 0 ? rawAmount / exchangeRates.usdToSar : 0;
    yerVal = exchangeRates.sarToYer > 0 ? rawAmount * exchangeRates.sarToYer : usdVal * exchangeRates.usdToYer;
  } else {
    yerVal = rawAmount;
    usdVal = exchangeRates.usdToYer > 0 ? rawAmount / exchangeRates.usdToYer : rawAmount * exchangeRates.yerToUsd;
    sarVal = exchangeRates.sarToYer > 0 ? rawAmount / exchangeRates.sarToYer : usdVal * exchangeRates.usdToSar;
  }

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`تم نسخ المبلغ: ${text}`);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleNumClick = (digit: string) => {
    if (digit === 'C') {
      setAmountInput('0');
    } else if (digit === 'DEL') {
      setAmountInput(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else if (digit === '.') {
      if (!amountInput.includes('.')) setAmountInput(prev => prev + '.');
    } else {
      setAmountInput(prev => prev === '0' ? digit : prev + digit);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E232B] text-slate-100 p-3 sm:p-4 flex flex-col items-center">
      <div className="w-full max-w-md flex flex-col space-y-4">
        {/* Top bar */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-700">
          <button
            onClick={() => navigateTo('MAIN')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-300 transition-colors cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>الرئيسية</span>
          </button>

          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-emerald-400" />
            محول العملات المباشر
          </h2>

          <button
            onClick={() => {
              setTempRates(exchangeRates);
              setShowRatesModal(true);
            }}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-emerald-400 cursor-pointer"
            title="تعديل أسعار الصرف"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Currency Switcher Tabs */}
        <div className="grid grid-cols-3 gap-2">
          {(['USD', 'SAR', 'YER'] as const).map(curr => {
            const label = curr === 'USD' ? 'دولار ($)' : curr === 'SAR' ? 'سعودي (SR)' : 'يمني (YR)';
            const active = activeCurrency === curr;
            return (
              <button
                key={curr}
                onClick={() => setActiveCurrency(curr)}
                className={`py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
                  active
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50 scale-[1.02]'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Input Card */}
        <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>المبلغ المدخل ({activeCurrency}):</span>
            <button
              onClick={() => handleCopy(amountInput, 'input')}
              className="hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
            >
              {copiedKey === 'input' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              نسخ
            </button>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-wider text-center py-2 bg-slate-900/60 rounded-xl border border-slate-700/60 overflow-x-auto">
            {amountInput || '0'}
          </div>
        </div>

        {/* Live Converted Cards */}
        <div className="space-y-2.5">
          {/* USD Card */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${activeCurrency === 'USD' ? 'bg-emerald-950/40 border-emerald-500/60' : 'bg-slate-800/70 border-slate-700'}`}>
            <div>
              <span className="text-xs text-slate-400 font-bold block">الدولار الأمريكي ($):</span>
              <span className="text-xl font-black text-white">{ArabicNumberHelper.formatAmount(usdVal)}</span>
            </div>
            <button
              onClick={() => handleCopy(ArabicNumberHelper.formatAmount(usdVal), 'usd')}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 cursor-pointer"
              title="نسخ المبلغ"
            >
              {copiedKey === 'usd' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* SAR Card */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${activeCurrency === 'SAR' ? 'bg-emerald-950/40 border-emerald-500/60' : 'bg-slate-800/70 border-slate-700'}`}>
            <div>
              <span className="text-xs text-slate-400 font-bold block">الريال السعودي (SAR):</span>
              <span className="text-xl font-black text-white">{ArabicNumberHelper.formatAmount(sarVal)}</span>
            </div>
            <button
              onClick={() => handleCopy(ArabicNumberHelper.formatAmount(sarVal), 'sar')}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 cursor-pointer"
              title="نسخ المبلغ"
            >
              {copiedKey === 'sar' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* YER Card */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${activeCurrency === 'YER' ? 'bg-emerald-950/40 border-emerald-500/60' : 'bg-slate-800/70 border-slate-700'}`}>
            <div>
              <span className="text-xs text-slate-400 font-bold block">الريال اليمني (YER):</span>
              <span className="text-xl font-black text-white">{ArabicNumberHelper.formatAmount(yerVal)}</span>
            </div>
            <button
              onClick={() => handleCopy(ArabicNumberHelper.formatAmount(yerVal), 'yer')}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 cursor-pointer"
              title="نسخ المبلغ"
            >
              {copiedKey === 'yer' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'DEL'].map((btn) => (
            <button
              key={btn}
              onClick={() => handleNumClick(btn)}
              className={`h-12 rounded-xl font-black text-lg transition-all active:scale-95 cursor-pointer shadow-sm ${
                btn === 'C'
                  ? 'bg-rose-900/60 hover:bg-rose-900 text-rose-300 border border-rose-700'
                  : btn === 'DEL'
                  ? 'bg-amber-900/60 hover:bg-amber-900 text-amber-300 border border-amber-700'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>

      {/* Exchange Rates Editor Modal */}
      {showRatesModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700">
              <h3 className="font-black text-base text-emerald-400 flex items-center gap-1.5">
                <Settings className="w-4 h-4" />
                تعديل أسعار الصرف
              </h3>
              <button
                onClick={() => setShowRatesModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">سعر الدولار مقابل الريال اليمني ($ &rarr; YER)</label>
                <input
                  type="number"
                  step="any"
                  value={tempRates.usdToYer}
                  onChange={(e) => setTempRates({ ...tempRates, usdToYer: parseFloat(e.target.value) || 0 })}
                  className="w-full h-9 px-3 bg-slate-900 rounded-lg border border-slate-700 font-black text-emerald-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">سعر الدولار مقابل السعودي ($ &rarr; SAR)</label>
                <input
                  type="number"
                  step="any"
                  value={tempRates.usdToSar}
                  onChange={(e) => setTempRates({ ...tempRates, usdToSar: parseFloat(e.target.value) || 0 })}
                  className="w-full h-9 px-3 bg-slate-900 rounded-lg border border-slate-700 font-black text-emerald-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">سعر السعودي مقابل اليمني (SAR &rarr; YER)</label>
                <input
                  type="number"
                  step="any"
                  value={tempRates.sarToYer}
                  onChange={(e) => setTempRates({ ...tempRates, sarToYer: parseFloat(e.target.value) || 0 })}
                  className="w-full h-9 px-3 bg-slate-900 rounded-lg border border-slate-700 font-black text-emerald-400 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  updateExchangeRates(tempRates);
                  setShowRatesModal(false);
                }}
                className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
              >
                حفظ الأسعار
              </button>
              <button
                onClick={() => setShowRatesModal(false)}
                className="py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold rounded-xl text-xs"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
