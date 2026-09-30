import React from 'react';
import { useInvoice } from '../context/InvoiceContext';
import { Calendar, X, ArrowLeft } from 'lucide-react';

export const CustomerStatementDateRangeDialog: React.FC = () => {
  const {
    showDateRangeDialog,
    pendingStatementCustomer,
    statementStartDate,
    statementEndDate,
    dismissDateRangeDialog,
    updateStatementStartDate,
    updateStatementEndDate,
    setStatementQuickPeriod,
    applyDateRangeAndOpenStatement,
  } = useInvoice();

  if (!showDateRangeDialog || !pendingStatementCustomer) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white text-slate-900 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">فترة كشف الحساب</h3>
              <p className="text-xs text-slate-500">العميل: {pendingStatementCustomer.name}</p>
            </div>
          </div>
          <button
            onClick={dismissDateRangeDialog}
            className="p-1 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Period Buttons */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-600 block">فترات سريعة جاهزة:</span>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              onClick={() => setStatementQuickPeriod('today')}
              className="py-2 px-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg font-bold transition-colors cursor-pointer text-center"
            >
              اليوم
            </button>
            <button
              onClick={() => setStatementQuickPeriod('this_month')}
              className="py-2 px-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg font-bold transition-colors cursor-pointer text-center"
            >
              هذا الشهر
            </button>
            <button
              onClick={() => setStatementQuickPeriod('last_month')}
              className="py-2 px-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg font-bold transition-colors cursor-pointer text-center"
            >
              الشهر الماضي
            </button>
            <button
              onClick={() => setStatementQuickPeriod('3_months')}
              className="py-2 px-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg font-bold transition-colors cursor-pointer text-center"
            >
              3 أشهر
            </button>
            <button
              onClick={() => setStatementQuickPeriod('6_months')}
              className="py-2 px-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg font-bold transition-colors cursor-pointer text-center"
            >
              6 أشهر
            </button>
            <button
              onClick={() => setStatementQuickPeriod('all')}
              className="py-2 px-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-bold transition-colors cursor-pointer text-center"
            >
              جميع العمليات
            </button>
          </div>
        </div>

        {/* Manual Date Inputs */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">من تاريخ (dd/MM/yyyy)</label>
            <input
              type="text"
              value={statementStartDate}
              onChange={(e) => updateStatementStartDate(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
              placeholder="01/01/2026"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">إلى تاريخ (dd/MM/yyyy)</label>
            <input
              type="text"
              value={statementEndDate}
              onChange={(e) => updateStatementEndDate(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
              placeholder="31/12/2026"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={() => applyDateRangeAndOpenStatement()}
            className="py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-extrabold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer shadow transition-colors"
          >
            <span>عرض كشف الحساب</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={dismissDateRangeDialog}
            className="py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs cursor-pointer transition-colors"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};
