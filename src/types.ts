export interface StoreConfig {
  storeNameAr: string;
  storeNameEn: string;
  branch: string;
  phone: string;
  addressAr: string;
  addressEn: string;
  wmAr: string;
  terms: string;
  logoBase64: string;
}

export interface TransactionRecord {
  date: string;
  type: string; // "فاتورة", "قبض", "صرف", "افتتاح"
  amount: number;
  currency: string;
  note: string;
  voucherNum?: string | null;
  balanceAfter: number;
}

export interface Customer {
  id: number;
  accountNumber: string;
  name: string;
  phone: string;
  address: string;
  balance: number;
  transactions: TransactionRecord[];
}

export interface ExchangeRates {
  yerToUsd: number;
  usdToYer: number;
  yerToSar: number;
  sarToYer: number;
  usdToSar: number;
  sarToUsd: number;
}

export interface ExtraItem {
  id: number;
  description: string;
  type: string;
  price: number;
  qty: number;
  currency: string;
}

export interface InvoiceData {
  id: number;
  invNum: string;
  invType: string; // "نقداً" or "أجل"
  customerAccount: string;
  customerName: string;
  cardId: string;
  price: number;
  type: string; // "months" or "tournament"
  qty: number;
  desc: string;
  endDate: string;
  currency: string;
  extraItems: ExtraItem[];
  grandTotal: number;
  createdAt: string;
}

export interface VoucherItem {
  voucherNum: string;
  type: string; // "قبض" or "صرف"
  account: string;
  customerName: string;
  date: string;
  amount: number;
  currency: string;
  note: string;
}

export type ButtonSize = 'COMPACT' | 'MEDIUM' | 'LARGE';
export type ButtonLayout = 'SINGLE' | 'DOUBLE';

export interface AppActionButton {
  id: string;
  label: string;
  iconEmoji: string;
  colorHex: string;
  actionType: string;
  isVisible: boolean;
  isQuickShortcut: boolean;
  customParam?: string;
  customDesc?: string;
}

export interface FormCustomField {
  id: string;
  title: string;
  iconEmoji: string;
  isVisible: boolean;
  isRequired: boolean;
}

export interface AppThemePreset {
  id: string;
  titleAr: string;
  descAr: string;
  primaryHex: string;
  secondaryHex: string;
  bgHex: string;
  cardHex: string;
  textDarkHex: string;
  accentHex: string;
  emoji: string;
}

export interface HomeScreenStyle {
  id: string;
  titleAr: string;
  descAr: string;
  emoji: string;
}

export interface UiCustomizationConfig {
  buttonSize: ButtonSize;
  buttonLayout: ButtonLayout;
  showQuickShortcutsBar: boolean;
  buttons: AppActionButton[];
  formFields: FormCustomField[];
  shadedFieldColorHex: string;
  shadedFieldAlpha: number;
  themePresetId: string;
  homeScreenStyleId: string;
  customPrimaryColorHex: string;
  customSecondaryColorHex: string;
  customBgColorHex: string;
  customCardColorHex: string;
  customThemeJson?: string;
  customBackgroundImageBase64?: string;
  bgImageAlpha?: number;
}

export interface ReportCustomizationConfig {
  fontScalePercent: number; // 70 to 180
  fontFamily: string; // "Cairo" | "Tajawal" | "Almarai" | "Amiri"
  primaryTextColorHex: string;
  headerColorHex: string;
  tableBorderColorHex: string;
  tableHeaderBgHex: string;
  tableHeaderTextColorHex?: string;
  watermarkColorHex: string;
  showLogo: boolean;
  showStoreInfo: boolean;
  showDateTime: boolean;
  showCustomerAccountNumber: boolean;
  showBranch: boolean;
  showAmountInWords: boolean;
  showTermsAndNotes: boolean;
  showSignatures: boolean;
  showWatermark: boolean;
  showCardSubscriptionBox: boolean;
  customHeaderTitle: string;
  customFooterText: string;
  taxOrCrNumber: string;
  showStampSeal: boolean;
  customNoticeBadge: string;
  accountantSignatureName: string;
  managerSignatureName: string;
}

export interface RoomBackupSnapshot {
  id: number;
  title: string;
  timestamp: string;
  invoiceCount: number;
  customerCount: number;
  backupDataJson: string;
  note?: string;
}

export interface ExportedPdfInfo {
  dataUrl?: string;
  title: string;
  sizeFormatted: string;
  source: 'invoice' | 'statement' | 'all_customers' | 'voucher';
  htmlContent?: string;
}

export type AppScreen =
  | 'MAIN'
  | 'INVOICE_REPORT'
  | 'CUSTOMER_STATEMENT'
  | 'CUSTOMER_INVOICE_DISPLAY'
  | 'CURRENCY_CONVERTER'
  | 'PERCENTAGE_CALCULATOR'
  | 'FULL_CALCULATOR';
