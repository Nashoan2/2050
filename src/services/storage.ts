import {
  Customer,
  ExchangeRates,
  InvoiceData,
  ReportCustomizationConfig,
  RoomBackupSnapshot,
  StoreConfig,
  UiCustomizationConfig,
  AppActionButton,
  FormCustomField
} from '../types';
import { ArabicNumberHelper } from '../utils/arabic';

export const defaultStoreConfig: StoreConfig = {
  storeNameAr: 'المملكة للإلكترونيات',
  storeNameEn: 'almamlak Electronics',
  branch: 'فرع شارع تعز',
  phone: '772707736',
  addressAr: 'إب الشارع العام تحت فندق معين',
  addressEn: 'YEMEN Ibb',
  wmAr: 'المملكة للإلكترونيات',
  terms: '• البضاعة المباعة لا ترد ولا تستبدل بعد خروجها من المحل.\n• استلمت البضاعة الموضحة أعلاه كاملة ، سليمة ، ولعدد ذلك.',
  logoBase64: '',
};

export const defaultExchangeRates: ExchangeRates = {
  yerToUsd: 0.001876,
  usdToYer: 533.0,
  yerToSar: 0.007035,
  sarToYer: 142.1333,
  usdToSar: 3.75,
  sarToUsd: 0.2667,
};

export const defaultFormFields: FormCustomField[] = [
  { id: 'INV_HEADER', title: 'نوع الفاتورة ورقم الفاتورة والعملة', iconEmoji: '🔢', isVisible: true, isRequired: true },
  { id: 'CUSTOMER_NAME', title: 'اسم العميل / الحساب', iconEmoji: '👤', isVisible: true, isRequired: false },
  { id: 'CARD_AND_PRICE', title: 'رقم الاشتراك / الكارت وسعر الاشتراك', iconEmoji: '💳', isVisible: true, isRequired: false },
  { id: 'QTY_AND_TYPE', title: 'العدد (الكمية) ونوع التجديد / المدة', iconEmoji: '📦', isVisible: true, isRequired: false },
  { id: 'DESCRIPTION', title: 'الوصف الرئيسي', iconEmoji: '📝', isVisible: true, isRequired: false },
  { id: 'END_DATE', title: 'تاريخ الانتهاء', iconEmoji: '📅', isVisible: true, isRequired: false },
  { id: 'EXTRA_ITEMS', title: 'الأصناف الإضافية وأزرار الحفظ والإغلاق', iconEmoji: '🧾', isVisible: true, isRequired: true }
];

export const defaultActionButtons: AppActionButton[] = [
  { id: 'NEW_INVOICE', label: 'إضافة فاتورة جديدة', iconEmoji: '➕', colorHex: '#3B1E08', actionType: 'NEW_INVOICE', isVisible: true, isQuickShortcut: false },
  { id: 'SAVED_INVOICES', label: 'إدارة الفاتير المحفوظة', iconEmoji: '📁', colorHex: '#361A07', actionType: 'SAVED_INVOICES', isVisible: true, isQuickShortcut: false },
  { id: 'OPEN_REPORT', label: 'فتح التقرير', iconEmoji: '📄', colorHex: '#283B4F', actionType: 'OPEN_REPORT', isVisible: true, isQuickShortcut: false },
  { id: 'CUSTOMERS', label: 'إدارة العملاء', iconEmoji: '👥', colorHex: '#4F3BE0', actionType: 'CUSTOMERS', isVisible: true, isQuickShortcut: false },
  { id: 'RECEIPT_VOUCHER', label: 'سند قبض', iconEmoji: '💰', colorHex: '#02592F', actionType: 'RECEIPT_VOUCHER', isVisible: true, isQuickShortcut: false },
  { id: 'PAYMENT_VOUCHER', label: 'سند صرف', iconEmoji: '💸', colorHex: '#DC2626', actionType: 'PAYMENT_VOUCHER', isVisible: true, isQuickShortcut: false },
  { id: 'ALL_CUSTOMERS', label: 'جميع العملاء', iconEmoji: '📋', colorHex: '#1D4ED8', actionType: 'ALL_CUSTOMERS', isVisible: false, isQuickShortcut: true },
  { id: 'CURRENCY_CONVERTER', label: 'محول العملات', iconEmoji: '💱', colorHex: '#0D7A56', actionType: 'CURRENCY_CONVERTER', isVisible: false, isQuickShortcut: true },
  { id: 'FULL_CALCULATOR', label: 'الآلة الحاسبة', iconEmoji: '🧮', colorHex: '#DC2626', actionType: 'FULL_CALCULATOR', isVisible: false, isQuickShortcut: true },
  { id: 'PERCENTAGE_CALCULATOR', label: 'النسبة المئوية', iconEmoji: '٪', colorHex: '#4F46E5', actionType: 'PERCENTAGE_CALCULATOR', isVisible: false, isQuickShortcut: true },
  { id: 'SETTINGS', label: 'إعدادات المتجر', iconEmoji: '⚙️', colorHex: '#182230', actionType: 'SETTINGS', isVisible: true, isQuickShortcut: false },
  { id: 'EXIT_APP', label: 'خروج من التطبيق', iconEmoji: '🚪', colorHex: '#9E1212', actionType: 'EXIT_APP', isVisible: true, isQuickShortcut: false },
  { id: 'CUSTOMER_DISPLAY', label: 'وضع العرض للعميل', iconEmoji: '📱', colorHex: '#2E7D32', actionType: 'CUSTOMER_DISPLAY', isVisible: false, isQuickShortcut: false },
  { id: 'PRINT_INVOICE', label: 'طباعة الفاتورة', iconEmoji: '🖨️', colorHex: '#17A2B8', actionType: 'PRINT_INVOICE', isVisible: false, isQuickShortcut: false },
  { id: 'EXPORT_PDF', label: 'تصدير الفاتورة PDF', iconEmoji: '📄', colorHex: '#C62828', actionType: 'EXPORT_PDF', isVisible: false, isQuickShortcut: false },
  { id: 'ROOM_BACKUP', label: 'النسخ الاحتياطي المحلي', iconEmoji: '💾', colorHex: '#4682B4', actionType: 'ROOM_BACKUP', isVisible: false, isQuickShortcut: false },
  { id: 'REPORT_CONTROL', label: 'التحكم في التقارير', iconEmoji: '📊', colorHex: '#8E44AD', actionType: 'REPORT_CONTROL', isVisible: false, isQuickShortcut: false },
];

export const defaultUiCustomizationConfig: UiCustomizationConfig = {
  buttonSize: 'MEDIUM',
  buttonLayout: 'SINGLE',
  showQuickShortcutsBar: true,
  buttons: defaultActionButtons,
  formFields: defaultFormFields,
  shadedFieldColorHex: '#FFF0F3',
  shadedFieldAlpha: 1.0,
  themePresetId: 'ROYAL_PURPLE',
  homeScreenStyleId: 'MODERN_CARDS',
  customPrimaryColorHex: '#5E258D',
  customSecondaryColorHex: '#8B5CF6',
  customBgColorHex: '#ECEFF1',
  customCardColorHex: '#FFFFFF',
  bgImageAlpha: 0.85,
};

export const defaultReportCustomizationConfig: ReportCustomizationConfig = {
  fontScalePercent: 100,
  fontFamily: 'Cairo',
  primaryTextColorHex: '#000000',
  headerColorHex: '#5E258D',
  tableBorderColorHex: '#0070BA',
  tableHeaderBgHex: '#EBF5FB',
  tableHeaderTextColorHex: '#111827',
  watermarkColorHex: '#5E258D',
  showLogo: true,
  showStoreInfo: true,
  showDateTime: true,
  showCustomerAccountNumber: true,
  showBranch: true,
  showAmountInWords: true,
  showTermsAndNotes: true,
  showSignatures: true,
  showWatermark: true,
  showCardSubscriptionBox: true,
  customHeaderTitle: '',
  customFooterText: '',
  taxOrCrNumber: '',
  showStampSeal: false,
  customNoticeBadge: '',
  accountantSignatureName: '',
  managerSignatureName: '',
};

export const defaultCustomers: Customer[] = [
  {
    id: 1,
    accountNumber: '1001',
    name: 'أحمد علي',
    phone: '777111222',
    address: 'صنعاء',
    balance: 0,
    transactions: [],
  },
  {
    id: 2,
    accountNumber: '1002',
    name: 'محمد حسن',
    phone: '777333444',
    address: 'عدن',
    balance: 0,
    transactions: [],
  },
];

const STORAGE_KEYS = {
  STORE_CONFIG: 'mamlaka_store_config',
  CUSTOMERS: 'mamlaka_customers',
  SAVED_INVOICES: 'mamlaka_saved_invoices',
  EXCHANGE_RATES: 'mamlaka_exchange_rates',
  UI_CONFIG: 'mamlaka_ui_config',
  REPORT_CONFIG: 'mamlaka_report_config',
  NEXT_RECEIPT_VOUCHER: 'mamlaka_next_receipt_voucher',
  NEXT_PAYMENT_VOUCHER: 'mamlaka_next_payment_voucher',
  ROOM_SNAPSHOTS: 'mamlaka_room_snapshots',
};

export const StorageService = {
  getStoreConfig(): StoreConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STORE_CONFIG);
      return data ? { ...defaultStoreConfig, ...JSON.parse(data) } : defaultStoreConfig;
    } catch {
      return defaultStoreConfig;
    }
  },

  saveStoreConfig(config: StoreConfig): void {
    localStorage.setItem(STORAGE_KEYS.STORE_CONFIG, JSON.stringify(config));
  },

  getCustomers(): Customer[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      return data ? JSON.parse(data) : defaultCustomers;
    } catch {
      return defaultCustomers;
    }
  },

  saveCustomers(customers: Customer[]): void {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  },

  getSavedInvoices(): InvoiceData[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_INVOICES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveInvoices(invoices: InvoiceData[]): void {
    localStorage.setItem(STORAGE_KEYS.SAVED_INVOICES, JSON.stringify(invoices));
  },

  getExchangeRates(): ExchangeRates {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXCHANGE_RATES);
      return data ? { ...defaultExchangeRates, ...JSON.parse(data) } : defaultExchangeRates;
    } catch {
      return defaultExchangeRates;
    }
  },

  saveExchangeRates(rates: ExchangeRates): void {
    localStorage.setItem(STORAGE_KEYS.EXCHANGE_RATES, JSON.stringify(rates));
  },

  getUiConfig(): UiCustomizationConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.UI_CONFIG);
      if (!data) return defaultUiCustomizationConfig;
      const parsed = JSON.parse(data);
      // Auto-hide ALL_CUSTOMERS by default on first update so user's request takes effect immediately
      if (!localStorage.getItem('mamlaka_all_customers_hidden_by_default_v2')) {
        localStorage.setItem('mamlaka_all_customers_hidden_by_default_v2', 'true');
        if (Array.isArray(parsed.buttons)) {
          parsed.buttons = parsed.buttons.map((b: AppActionButton) =>
            b.id === 'ALL_CUSTOMERS' ? { ...b, isVisible: false } : b
          );
          localStorage.setItem(STORAGE_KEYS.UI_CONFIG, JSON.stringify(parsed));
        }
      }
      // Ensure all buttons exist
      const existingIds = new Set(parsed.buttons?.map((b: AppActionButton) => b.id) || []);
      const missing = defaultActionButtons.filter(b => !existingIds.has(b.id));
      const buttons = [...(parsed.buttons || defaultActionButtons), ...missing];
      return { ...defaultUiCustomizationConfig, ...parsed, buttons };
    } catch {
      return defaultUiCustomizationConfig;
    }
  },

  saveUiConfig(config: UiCustomizationConfig): void {
    localStorage.setItem(STORAGE_KEYS.UI_CONFIG, JSON.stringify(config));
  },

  getReportConfig(): ReportCustomizationConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REPORT_CONFIG);
      return data ? { ...defaultReportCustomizationConfig, ...JSON.parse(data) } : defaultReportCustomizationConfig;
    } catch {
      return defaultReportCustomizationConfig;
    }
  },

  saveReportConfig(config: ReportCustomizationConfig): void {
    localStorage.setItem(STORAGE_KEYS.REPORT_CONFIG, JSON.stringify(config));
  },

  getNextReceiptVoucherNum(): number {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.NEXT_RECEIPT_VOUCHER);
      return val ? parseInt(val, 10) : 1;
    } catch {
      return 1;
    }
  },

  saveNextReceiptVoucherNum(num: number): void {
    localStorage.setItem(STORAGE_KEYS.NEXT_RECEIPT_VOUCHER, num.toString());
  },

  getNextPaymentVoucherNum(): number {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.NEXT_PAYMENT_VOUCHER);
      return val ? parseInt(val, 10) : 1;
    } catch {
      return 1;
    }
  },

  saveNextPaymentVoucherNum(num: number): void {
    localStorage.setItem(STORAGE_KEYS.NEXT_PAYMENT_VOUCHER, num.toString());
  },

  getRoomSnapshots(): RoomBackupSnapshot[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ROOM_SNAPSHOTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveRoomSnapshots(snapshots: RoomBackupSnapshot[]): void {
    localStorage.setItem(STORAGE_KEYS.ROOM_SNAPSHOTS, JSON.stringify(snapshots));
  },

  buildFullBackupJson(): string {
    const backupObj = {
      version: '1.0',
      exportedAt: ArabicNumberHelper.formatDateTime(),
      timestamp: Date.now(),
      storeConfig: this.getStoreConfig(),
      exchangeRates: this.getExchangeRates(),
      customers: this.getCustomers(),
      savedInvoices: this.getSavedInvoices(),
      uiConfig: this.getUiConfig(),
      reportConfig: this.getReportConfig(),
      nextReceiptVoucherNum: this.getNextReceiptVoucherNum(),
      nextPaymentVoucherNum: this.getNextPaymentVoucherNum()
    };
    return JSON.stringify(backupObj, null, 2);
  }
};
