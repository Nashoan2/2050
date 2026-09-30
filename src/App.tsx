import React, { useEffect } from 'react';
import { useInvoice } from './context/InvoiceContext';
import { MainScreen } from './components/MainScreen';
import { InvoiceReportModal } from './components/InvoiceReportModal';
import { CustomerStatementModal } from './components/CustomerStatementModal';
import { CustomerDisplayView } from './components/CustomerDisplayView';
import { CurrencyConverterModal } from './components/CurrencyConverterModal';
import { PercentageCalculatorModal } from './components/PercentageCalculatorModal';
import { FullCalculatorModal } from './components/FullCalculatorModal';
import { CustomersModal } from './components/CustomersModal';
import { SavedInvoicesModal } from './components/SavedInvoicesModal';
import { SettingsModal } from './components/SettingsModal';
import { CustomerStatementDateRangeDialog } from './components/CustomerStatementDateRangeDialog';
import { ExitConfirmModal } from './components/ExitConfirmModal';
import { ExportedPdfDialog } from './components/ExportedPdfDialog';

export const AppContent: React.FC = () => {
  const {
    currentScreen,
    toastMessage,
    clearToast,
    reportConfig,
    showCustomersModal,
    showSavedInvoicesModal,
    showSettingsModal,
    showDateRangeDialog,
    showExitConfirmDialog,
    exportedPdf
  } = useInvoice();

  // Clear toast after 3 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        clearToast();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const fontClass = reportConfig.fontFamily === 'Tajawal'
    ? 'font-tajawal'
    : reportConfig.fontFamily === 'Almarai'
    ? 'font-almarai'
    : reportConfig.fontFamily === 'Amiri'
    ? 'font-amiri'
    : 'font-cairo';

  return (
    <div className={`min-h-screen bg-[#1E232B] text-slate-100 ${fontClass} relative antialiased`}>
      {/* Screen Router */}
      {currentScreen === 'MAIN' && <MainScreen />}
      {currentScreen === 'INVOICE_REPORT' && <InvoiceReportModal />}
      {currentScreen === 'CUSTOMER_STATEMENT' && <CustomerStatementModal />}
      {currentScreen === 'CUSTOMER_INVOICE_DISPLAY' && <CustomerDisplayView />}
      {currentScreen === 'CURRENCY_CONVERTER' && <CurrencyConverterModal />}
      {currentScreen === 'PERCENTAGE_CALCULATOR' && <PercentageCalculatorModal />}
      {currentScreen === 'FULL_CALCULATOR' && <FullCalculatorModal />}

      {/* Global Modals & Dialogs - mounted only when opened for fast, lag-free UI */}
      {showCustomersModal && <CustomersModal />}
      {showSavedInvoicesModal && <SavedInvoicesModal />}
      {showSettingsModal && <SettingsModal />}
      {showDateRangeDialog && <CustomerStatementDateRangeDialog />}
      {showExitConfirmDialog && <ExitConfirmModal />}
      {exportedPdf && <ExportedPdfDialog />}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-slate-900/95 text-white border border-slate-700/80 rounded-full shadow-2xl backdrop-blur-md text-xs sm:text-sm font-bold flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
