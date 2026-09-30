import React from 'react';
import { useInvoice } from '../context/InvoiceContext';
import { FileText, Printer, Download, X } from 'lucide-react';

export const ExportedPdfDialog: React.FC = () => {
  const { exportedPdf, dismissExportedPdfDialog, showToast } = useInvoice();

  if (!exportedPdf) return null;

  const handlePrint = () => {
    window.print();
    dismissExportedPdfDialog();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white text-slate-900 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4 border border-slate-200 text-center">
        <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <FileText className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-black text-slate-900">{exportedPdf.title}</h3>
          <p className="text-xs text-slate-500 font-semibold">
            جاهز للطباعة أو التنزيل بصيغة PDF {exportedPdf.sizeFormatted ? `(${exportedPdf.sizeFormatted})` : ''}
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={handlePrint}
            className="w-full py-2.5 bg-[#5E258D] hover:bg-[#4b1d70] text-white font-extrabold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة / حفظ PDF الآن</span>
          </button>

          <button
            onClick={dismissExportedPdfDialog}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
