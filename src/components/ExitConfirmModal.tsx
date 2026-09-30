import React from 'react';
import { useInvoice } from '../context/InvoiceContext';
import { LogOut, X } from 'lucide-react';

export const ExitConfirmModal: React.FC = () => {
  const {
    showExitConfirmDialog,
    setExitConfirmDialogVisible,
    showToast
  } = useInvoice();

  if (!showExitConfirmDialog) return null;

  const handleConfirmExit = () => {
    setExitConfirmDialogVisible(false);
    showToast('شكراً لاستخدامكم نظام المملكة للإلكترونيات.');
    // In web app, we can attempt window.close() or reload
    try {
      window.close();
    } catch {
      // ignored
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 text-white rounded-2xl p-5 max-w-sm w-full border border-slate-700 shadow-2xl space-y-4 text-center">
        <div className="w-14 h-14 rounded-full bg-red-950/60 border border-red-800 text-red-500 flex items-center justify-center mx-auto">
          <LogOut className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-black text-white">تأكيد الخروج من التطبيق</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            هل أنت متأكد من رغبتك في إغلاق التطبيق؟ تم حفظ جميع بياناتك وفواتيرك تلقائياً.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <button
            onClick={handleConfirmExit}
            className="py-2.5 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-xs cursor-pointer transition-colors"
          >
            نعم، خروج
          </button>
          <button
            onClick={() => setExitConfirmDialogVisible(false)}
            className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs cursor-pointer transition-colors"
          >
            البقاء في التطبيق
          </button>
        </div>
      </div>
    </div>
  );
};
