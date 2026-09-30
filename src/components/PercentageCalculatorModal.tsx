import React, { useState } from 'react';
import { useInvoice } from '../context/InvoiceContext';
import { ArabicNumberHelper } from '../utils/arabic';
import { ArrowRight, Percent, Copy, Check, ArrowUpRight, ArrowDownRight } from 'lucide-react';

type Mode = 'SIMPLE' | 'INCREASE' | 'DECREASE' | 'COMPLETION';

export const PercentageCalculatorModal: React.FC = () => {
  const { navigateTo, showToast } = useInvoice();

  const [mode, setMode] = useState<Mode>('SIMPLE');
  const [startValue, setStartValue] = useState<string>('250');
  const [percentage, setPercentage] = useState<string>('10');
  const [activeInput, setActiveInput] = useState<'val' | 'pct'>('val');
  const [copied, setCopied] = useState<boolean>(false);

  const valNum = parseFloat(ArabicNumberHelper.toEngDigits(startValue)) || 0;
  const pctNum = parseFloat(ArabicNumberHelper.toEngDigits(percentage)) || 0;

  const percentAmount = valNum * (pctNum / 100);

  let resultValue = 0;
  let detailLabel = '';
  let isUp = true;

  switch (mode) {
    case 'SIMPLE':
      resultValue = valNum + percentAmount;
      detailLabel = `مبلغ النسبة : ${ArabicNumberHelper.formatAmount(percentAmount)}`;
      isUp = true;
      break;
    case 'INCREASE':
      resultValue = valNum + percentAmount;
      detailLabel = `مقدار الزيادة : +${ArabicNumberHelper.formatAmount(percentAmount)}`;
      isUp = true;
      break;
    case 'DECREASE':
      resultValue = Math.max(0, valNum - percentAmount);
      detailLabel = `مقدار الخصم : -${ArabicNumberHelper.formatAmount(percentAmount)}`;
      isUp = false;
      break;
    case 'COMPLETION':
      resultValue = pctNum !== 0 ? (valNum / pctNum) * 100 : 0;
      detailLabel = `العدد الأصلي من النسبة`;
      isUp = true;
      break;
  }

  const handleKeyClick = (key: string) => {
    const target = activeInput === 'val' ? startValue : percentage;
    const setter = activeInput === 'val' ? setStartValue : setPercentage;

    if (key === 'C') {
      setter('0');
    } else if (key === 'DEL') {
      setter(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else if (key === '.') {
      if (!target.includes('.')) setter(prev => prev + '.');
    } else {
      setter(prev => prev === '0' ? key : prev + key);
    }
  };

  const handleCopy = () => {
    const text = ArabicNumberHelper.formatAmount(resultValue);
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast(`تم نسخ النتيجة: ${text}`);
    setTimeout(() => setCopied(false), 1500);
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
            <Percent className="w-5 h-5 text-indigo-400" />
            حاسبة النسبة المئوية
          </h2>
          <div className="w-16" />
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { id: 'SIMPLE', label: 'بسيطة' },
            { id: 'INCREASE', label: 'زيادة' },
            { id: 'DECREASE', label: 'خصم' },
            { id: 'COMPLETION', label: 'إكمال' },
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id as Mode)}
              className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                mode === m.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => setActiveInput('val')}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              activeInput === 'val'
                ? 'bg-slate-800 border-indigo-500 shadow-md ring-2 ring-indigo-500/30'
                : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <span className="text-[11px] text-slate-400 font-bold block mb-1">المبلغ / القيمة</span>
            <span className="text-xl font-black text-white block truncate">{startValue || '0'}</span>
          </div>

          <div
            onClick={() => setActiveInput('pct')}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              activeInput === 'pct'
                ? 'bg-slate-800 border-indigo-500 shadow-md ring-2 ring-indigo-500/30'
                : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <span className="text-[11px] text-slate-400 font-bold block mb-1">النسبة المئوية (%)</span>
            <span className="text-xl font-black text-indigo-400 block truncate">{percentage || '0'}%</span>
          </div>
        </div>

        {/* Result Card */}
        <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900 rounded-2xl p-5 border border-indigo-500/40 shadow-xl space-y-2 text-center relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-indigo-300 font-bold">
            <span>النتيجة النهائية:</span>
            <button
              onClick={handleCopy}
              className="hover:text-white flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              نسخ النتيجة
            </button>
          </div>

          <div className="text-3xl sm:text-4xl font-black text-white tracking-wider py-1">
            {ArabicNumberHelper.formatAmount(resultValue)}
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-300 pt-1 border-t border-indigo-800/50">
            {isUp ? (
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-rose-400" />
            )}
            <span>{detailLabel}</span>
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'DEL'].map((btn) => (
            <button
              key={btn}
              onClick={() => handleKeyClick(btn)}
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
    </div>
  );
};
