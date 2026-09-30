import React, { useState } from 'react';
import { useInvoice } from '../context/InvoiceContext';
import { ArrowRight, Calculator, Delete, Copy, Check } from 'lucide-react';

export const FullCalculatorModal: React.FC = () => {
  const { navigateTo, showToast } = useInvoice();

  const [displayValue, setDisplayValue] = useState<string>('0');
  const [expression, setExpression] = useState<string>('');
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [pendingOperator, setPendingOperator] = useState<string | null>(null);
  const [isNewInput, setIsNewInput] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const evaluate = (a: number, op: string, b: number): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleDigit = (digit: string) => {
    if (isNewInput || displayValue === '0' || displayValue === 'خطأ') {
      setDisplayValue(digit);
      setIsNewInput(false);
    } else {
      if (displayValue.replace('.', '').length < 12) {
        setDisplayValue(prev => prev + digit);
      }
    }
  };

  const handleDot = () => {
    if (isNewInput || displayValue === 'خطأ') {
      setDisplayValue('0.');
      setIsNewInput(false);
    } else if (!displayValue.includes('.')) {
      setDisplayValue(prev => prev + '.');
    }
  };

  const handleOperator = (op: string) => {
    const current = parseFloat(displayValue) || 0;
    if (storedValue !== null && pendingOperator !== null && !isNewInput) {
      const res = evaluate(storedValue, pendingOperator, current);
      setStoredValue(res);
      setDisplayValue(res.toString());
      setExpression(`${res} ${op}`);
    } else {
      setStoredValue(current);
      setExpression(`${current} ${op}`);
    }
    setPendingOperator(op);
    setIsNewInput(true);
  };

  const handleEquals = () => {
    if (storedValue !== null && pendingOperator !== null) {
      const current = parseFloat(displayValue) || 0;
      const res = evaluate(storedValue, pendingOperator, current);
      setExpression(`${storedValue} ${pendingOperator} ${current} =`);
      setDisplayValue(res.toString());
      setStoredValue(null);
      setPendingOperator(null);
      setIsNewInput(true);
    }
  };

  const handlePercent = () => {
    const current = parseFloat(displayValue) || 0;
    const res = current / 100;
    setDisplayValue(res.toString());
    setIsNewInput(true);
  };

  const handleClear = () => {
    setDisplayValue('0');
    setExpression('');
    setStoredValue(null);
    setPendingOperator(null);
    setIsNewInput(true);
  };

  const handleBackspace = () => {
    if (displayValue.length > 1 && !isNewInput) {
      setDisplayValue(prev => prev.slice(0, -1));
    } else {
      setDisplayValue('0');
      setIsNewInput(true);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(displayValue);
    setCopied(true);
    showToast(`تم نسخ الناتج: ${displayValue}`);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[#1E232B] text-slate-100 p-3 sm:p-4 flex flex-col items-center">
      <div className="w-full max-w-sm flex flex-col space-y-4">
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
            <Calculator className="w-5 h-5 text-rose-400" />
            الآلة الحاسبة
          </h2>
          <div className="w-16" />
        </div>

        {/* Display Screen */}
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-700 shadow-xl space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-500 font-bold min-h-5">
            <span>{expression}</span>
            <button
              onClick={handleCopy}
              className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white text-right tracking-wider overflow-x-auto py-1 font-mono">
            {displayValue}
          </div>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-4 gap-2">
          {/* Row 1 */}
          <button
            onClick={handleClear}
            className="h-14 rounded-2xl font-black text-base bg-rose-900/60 hover:bg-rose-900 text-rose-200 border border-rose-700 shadow cursor-pointer transition-all active:scale-95"
          >
            AC
          </button>
          <button
            onClick={handleBackspace}
            className="h-14 rounded-2xl font-black text-base bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 shadow cursor-pointer flex items-center justify-center transition-all active:scale-95"
          >
            <Delete className="w-5 h-5" />
          </button>
          <button
            onClick={handlePercent}
            className="h-14 rounded-2xl font-black text-base bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 shadow cursor-pointer transition-all active:scale-95"
          >
            %
          </button>
          <button
            onClick={() => handleOperator('÷')}
            className={`h-14 rounded-2xl font-black text-xl shadow cursor-pointer transition-all active:scale-95 ${
              pendingOperator === '÷'
                ? 'bg-amber-500 text-slate-900 font-black'
                : 'bg-amber-600 hover:bg-amber-500 text-white'
            }`}
          >
            ÷
          </button>

          {/* Row 2 */}
          <button
            onClick={() => handleDigit('7')}
            className="h-14 rounded-2xl font-black text-xl bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700 shadow cursor-pointer transition-all active:scale-95"
          >
            7
          </button>
          <button
            onClick={() => handleDigit('8')}
            className="h-14 rounded-2xl font-black text-xl bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700 shadow cursor-pointer transition-all active:scale-95"
          >
            8
          </button>
          <button
            onClick={() => handleDigit('9')}
            className="h-14 rounded-2xl font-black text-xl bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700 shadow cursor-pointer transition-all active:scale-95"
          >
            9
          </button>
          <button
            onClick={() => handleOperator('×')}
            className={`h-14 rounded-2xl font-black text-xl shadow cursor-pointer transition-all active:scale-95 ${
              pendingOperator === '×'
                ? 'bg-amber-500 text-slate-900 font-black'
                : 'bg-amber-600 hover:bg-amber-500 text-white'
            }`}
          >
            ×
          </button>

          {/* Row 3 */}
          <button
            onClick={() => handleDigit('4')}
            className="h-14 rounded-2xl font-black text-xl bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700 shadow cursor-pointer transition-all active:scale-95"
          >
            4
          </button>
          <button
            onClick={() => handleDigit('5')}
            className="h-14 rounded-2xl font-black text-xl bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700 shadow cursor-pointer transition-all active:scale-95"
          >
            5
          </button>
          <button
            onClick={() => handleDigit('6')}
            className="h-14 rounded-2xl font-black text-xl bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700 shadow cursor-pointer transition-all active:scale-95"
          >
            6
          </button>
          <button
            onClick={() => handleOperator('-')}
            className={`h-14 rounded-2xl font-black text-xl shadow cursor-pointer transition-all active:scale-95 ${
              pendingOperator === '-'
                ? 'bg-amber-500 text-slate-900 font-black'
                : 'bg-amber-600 hover:bg-amber-500 text-white'
            }`}
          >
            -
          </button>

          {/* Row 4 */}
          <button
            onClick={() => handleDigit('1')}
            className="h-14 rounded-2xl font-black text-xl bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700 shadow cursor-pointer transition-all active:scale-95"
          >
            1
          </button>
          <button
            onClick={() => handleDigit('2')}
            className="h-14 rounded-2xl font-black text-xl bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700 shadow cursor-pointer transition-all active:scale-95"
          >
            2
          </button>
          <button
            onClick={() => handleDigit('3')}
            className="h-14 rounded-2xl font-black text-xl bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700 shadow cursor-pointer transition-all active:scale-95"
          >
            3
          </button>
          <button
            onClick={() => handleOperator('+')}
            className={`h-14 rounded-2xl font-black text-xl shadow cursor-pointer transition-all active:scale-95 ${
              pendingOperator === '+'
                ? 'bg-amber-500 text-slate-900 font-black'
                : 'bg-amber-600 hover:bg-amber-500 text-white'
            }`}
          >
            +
          </button>

          {/* Row 5 */}
          <button
            onClick={() => handleDigit('0')}
            className="col-span-2 h-14 rounded-2xl font-black text-xl bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700 shadow cursor-pointer transition-all active:scale-95"
          >
            0
          </button>
          <button
            onClick={handleDot}
            className="h-14 rounded-2xl font-black text-xl bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700 shadow cursor-pointer transition-all active:scale-95"
          >
            .
          </button>
          <button
            onClick={handleEquals}
            className="h-14 rounded-2xl font-black text-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950 cursor-pointer transition-all active:scale-95"
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
};
