import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  AppActionButton,
  AppScreen,
  AppThemePreset,
  ButtonLayout,
  ButtonSize,
  Customer,
  ExchangeRates,
  ExportedPdfInfo,
  ExtraItem,
  HomeScreenStyle,
  InvoiceData,
  ReportCustomizationConfig,
  RoomBackupSnapshot,
  StoreConfig,
  TransactionRecord,
  UiCustomizationConfig,
  VoucherItem
} from '../types';
import {
  StorageService,
  defaultStoreConfig,
  defaultCustomers,
  defaultExchangeRates,
  defaultUiCustomizationConfig,
  defaultReportCustomizationConfig
} from '../services/storage';
import { ArabicNumberHelper } from '../utils/arabic';

export interface InvoiceContextType {
  // Screens & Navigation
  currentScreen: AppScreen;
  navigateTo: (screen: AppScreen) => void;

  // Store & Settings
  storeConfig: StoreConfig;
  updateStoreConfig: (config: StoreConfig) => void;
  updateStoreLogo: (base64: string) => void;
  resetStoreLogo: () => void;

  // Customers
  customers: Customer[];
  addCustomer: (name: string, phone: string, address: string, initialBalance: number, customAccount?: string) => boolean;
  editCustomer: (account: string, newName: string, newPhone: string, newAddress: string, newInitialBalance?: number) => void;
  deleteCustomer: (account: string) => boolean;
  findCustomerByAccount: (account: string) => Customer | undefined;
  getNextCustomerAccount: () => string;
  selectCustomerForInvoice: (customer: Customer) => void;
  generateNewCustomerAccount: () => void;

  // Vouchers
  nextReceiptVoucherNum: number;
  nextPaymentVoucherNum: number;
  addReceiptVoucher: (account: string, amount: number, currency: string, note: string, date?: string, voucherNum?: string) => boolean;
  addPaymentVoucher: (account: string, amount: number, currency: string, note: string, date?: string, voucherNum?: string) => boolean;
  editVoucher: (oldVoucherNum: string, type: string, targetAccount: string, newAmount: number, newCurrency: string, newNote: string, newDate: string, newVoucherNum?: string, origAccount?: string) => boolean;
  deleteVoucher: (voucherNum: string, type: string, account?: string) => boolean;
  getAllVouchers: (type: string) => VoucherItem[];

  // Invoices & Form State
  savedInvoices: InvoiceData[];
  isFormVisible: boolean;
  editingInvoiceId: number | null;
  invoiceDate: string;
  invNum: string;
  invType: string;
  customerAccount: string;
  customerName: string;
  cardId: string;
  price: string;
  subscriptionType: string;
  qty: string;
  desc: string;
  endDate: string;
  currency: string;
  extraItems: ExtraItem[];
  previewInvoice: InvoiceData | null;

  // Invoice Form Actions
  setFormVisible: (visible: boolean) => void;
  toggleFormVisibility: () => void;
  addNewInvoice: () => void;
  closeInvoiceForm: () => void;
  updateInvNum: (num: string) => void;
  updateInvType: (type: string) => void;
  updateCustomerAccount: (acc: string) => void;
  updateCustomerName: (name: string) => void;
  updateCardId: (id: string) => void;
  updatePrice: (p: string) => void;
  updateSubscriptionType: (type: string) => void;
  updateQty: (q: string) => void;
  updateDesc: (d: string) => void;
  updateInvoiceDate: (date: string) => void;
  updateEndDate: (date: string) => void;
  updateCurrency: (curr: string) => void;
  addExtraItem: (desc?: string, price?: number, qty?: number, curr?: string) => void;
  removeExtraItem: (id: number) => void;
  updateExtraItem: (id: number, desc: string, price: number, qty: number, curr: string) => void;
  saveCurrentInvoice: () => boolean;
  editSavedInvoice: (invoice: InvoiceData) => void;
  deleteSavedInvoice: (id: number) => void;
  clearAllInvoices: () => void;
  updateInvoiceDateOnly: (invoiceId: number, newDate: string) => void;
  getMainTotal: () => number;
  getExtraItemsTotal: () => number;
  getGrandTotal: () => number;
  getLatestSavedInvoiceOrCurrent: () => InvoiceData;
  openLatestSavedOrCurrentReport: () => void;
  openInvoiceReport: (invoice: InvoiceData) => void;
  openCustomerDisplayMode: (invoice?: InvoiceData) => void;

  // Statements
  statementCustomer: Customer | null;
  statementStartDate: string;
  statementEndDate: string;
  showDateRangeDialog: boolean;
  pendingStatementCustomer: Customer | null;
  requestStatementDateRange: (customer: Customer) => void;
  dismissDateRangeDialog: () => void;
  updateStatementStartDate: (d: string) => void;
  updateStatementEndDate: (d: string) => void;
  setStatementQuickPeriod: (type: string) => void;
  applyDateRangeAndOpenStatement: () => boolean;
  openCustomerStatement: (customer: Customer, startDate?: string, endDate?: string) => void;
  openStatementByAccount: (account: string) => boolean;

  // Exchange Rates & Currency
  exchangeRates: ExchangeRates;
  updateExchangeRates: (rates: ExchangeRates) => void;
  convertCurrency: (amount: number, fromCurrency: string, toCurrency: string) => number;

  // UI & Report Customization
  uiConfig: UiCustomizationConfig;
  updateUiConfig: (config: UiCustomizationConfig) => void;
  updateButtonSize: (size: ButtonSize) => void;
  updateButtonLayout: (layout: ButtonLayout) => void;
  toggleQuickShortcutsBar: (show: boolean) => void;
  toggleButtonVisibility: (buttonId: string) => void;
  toggleButtonQuickShortcut: (buttonId: string) => void;
  setActionButtonVisibility: (buttonId: string, visible: boolean) => void;
  setActionButtonQuickShortcut: (buttonId: string, isShortcut: boolean) => void;
  reorderButtons: (fromIndex: number, toIndex: number) => void;
  resetUiCustomizationToDefault: () => void;
  updateShadedFieldColor: (hex: string, alpha?: number) => void;
  reportConfig: ReportCustomizationConfig;
  updateReportConfig: (config: ReportCustomizationConfig) => void;
  resetReportCustomizationToDefault: () => void;
  updateReportFontScale: (scale: number) => void;
  increaseReportFontScale: () => void;
  decreaseReportFontScale: () => void;
  updateReportFontFamily: (font: string) => void;
  toggleReportElement: (field: string, enabled: boolean) => void;
  setAppThemePreset: (presetId: string) => void;
  setHomeScreenStyle: (styleId: string) => void;

  // Modals visibility
  showCustomersModal: boolean;
  setCustomersModalVisible: (visible: boolean, tab?: number) => void;
  customersModalInitialTab: number;
  showSavedInvoicesModal: boolean;
  setSavedInvoicesModalVisible: (visible: boolean) => void;
  showSettingsModal: boolean;
  setSettingsModalVisible: (visible: boolean) => void;
  showExitConfirmDialog: boolean;
  setExitConfirmDialogVisible: (visible: boolean) => void;

  // Room / Local Backup Snapshots
  roomSnapshots: RoomBackupSnapshot[];
  createLocalRoomBackup: (title?: string, note?: string) => void;
  restoreFromRoomSnapshot: (snapshot: RoomBackupSnapshot) => boolean;
  deleteRoomSnapshot: (id: number) => void;
  exportBackupJson: () => string;
  importBackupJson: (json: string) => { success: boolean; message: string; count?: number };

  // Toast & PDF export notification
  toastMessage: string | null;
  showToast: (msg: string) => void;
  clearToast: () => void;
  exportedPdf: ExportedPdfInfo | null;
  setExportedPdf: (info: ExportedPdfInfo | null) => void;
  dismissExportedPdfDialog: () => void;

  // Actions Runner
  executeActionButton: (button: AppActionButton) => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Screens
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('MAIN');

  // Config & Data
  const [storeConfig, setStoreConfigState] = useState<StoreConfig>(StorageService.getStoreConfig);
  const [customers, setCustomersState] = useState<Customer[]>(StorageService.getCustomers);
  const [savedInvoices, setSavedInvoicesState] = useState<InvoiceData[]>(StorageService.getSavedInvoices);
  const [exchangeRates, setExchangeRatesState] = useState<ExchangeRates>(StorageService.getExchangeRates);
  const [uiConfig, setUiConfigState] = useState<UiCustomizationConfig>(StorageService.getUiConfig);
  const [reportConfig, setReportConfigState] = useState<ReportCustomizationConfig>(StorageService.getReportConfig);
  const [nextReceiptVoucherNum, setNextReceiptVoucherNum] = useState<number>(StorageService.getNextReceiptVoucherNum);
  const [nextPaymentVoucherNum, setNextPaymentVoucherNum] = useState<number>(StorageService.getNextPaymentVoucherNum);
  const [roomSnapshots, setRoomSnapshotsState] = useState<RoomBackupSnapshot[]>(StorageService.getRoomSnapshots);

  // Form State
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState<number | null>(null);
  const [invoiceDate, setInvoiceDate] = useState<string>(ArabicNumberHelper.formatDateTime());
  const [invNum, setInvNum] = useState<string>('1');
  const [invType, setInvType] = useState<string>('نقداً');
  const [customerAccount, setCustomerAccount] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [cardId, setCardId] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [subscriptionType, setSubscriptionType] = useState<string>('months');
  const [qty, setQty] = useState<string>('3');
  const [desc, setDesc] = useState<string>('تجديد باقة تميز');
  const [endDate, setEndDate] = useState<string>('');
  const [currency, setCurrency] = useState<string>('YER');
  const [extraItems, setExtraItems] = useState<ExtraItem[]>([]);
  const [previewInvoice, setPreviewInvoice] = useState<InvoiceData | null>(null);

  // Statement State
  const [statementCustomer, setStatementCustomer] = useState<Customer | null>(null);
  const [statementStartDate, setStatementStartDate] = useState<string>('');
  const [statementEndDate, setStatementEndDate] = useState<string>('');
  const [showDateRangeDialog, setShowDateRangeDialog] = useState<boolean>(false);
  const [pendingStatementCustomer, setPendingStatementCustomer] = useState<Customer | null>(null);

  // Modals
  const [showCustomersModal, setShowCustomersModal] = useState<boolean>(false);
  const [customersModalInitialTab, setCustomersModalInitialTab] = useState<number>(-1);
  const [showSavedInvoicesModal, setShowSavedInvoicesModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showExitConfirmDialog, setShowExitConfirmDialog] = useState<boolean>(false);

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [exportedPdf, setExportedPdf] = useState<ExportedPdfInfo | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const clearToast = () => {
    setToastMessage(null);
  };

  const dismissExportedPdfDialog = () => {
    setExportedPdf(null);
  };

  // Calculate Next Invoice Number
  const getNextInvoiceNumber = (): string => {
    let max = 0;
    for (const inv of savedInvoices) {
      const num = parseInt(ArabicNumberHelper.toEngDigits(inv.invNum), 10) || 0;
      if (num > max) max = num;
    }
    return (max + 1).toString();
  };

  // Initial calculations & setup
  useEffect(() => {
    if (!invNum || invNum === '1') {
      const next = getNextInvoiceNumber();
      setInvNum(next);
    }
    calculateExpiryDate(qty, subscriptionType, invoiceDate);
  }, []);

  const calculateExpiryDate = (qtyVal: string, subType: string, dateStr: string) => {
    if (editingInvoiceId !== null) return;
    if (subType === 'tournament') return;
    const months = parseInt(ArabicNumberHelper.toEngDigits(qtyVal), 10) || 3;
    const baseDate = ArabicNumberHelper.parseDate(dateStr) || new Date();
    const d = new Date(baseDate.getTime());
    d.setMonth(d.getMonth() + months);
    d.setDate(d.getDate() - 1);
    setEndDate(ArabicNumberHelper.formatDateOnly(d));
  };

  const navigateTo = (screen: AppScreen) => {
    setCurrentScreen(screen);
  };

  // Customers Helper
  const recalculateCustomerBalance = (c: Customer): Customer => {
    let currentBalance = 0;
    const updatedTransactions = c.transactions.map(t => {
      if (t.type === 'قبض') {
        currentBalance -= t.amount;
      } else if (t.type === 'صرف' || t.type === 'فاتورة' || t.type === 'افتتاح') {
        currentBalance += t.amount;
      } else {
        currentBalance += t.amount;
      }
      return { ...t, balanceAfter: currentBalance };
    });
    return { ...c, balance: currentBalance, transactions: updatedTransactions };
  };

  const saveCustomers = (newCustomers: Customer[]) => {
    setCustomersState(newCustomers);
    StorageService.saveCustomers(newCustomers);
  };

  const findCustomerByAccount = (account: string): Customer | undefined => {
    const clean = ArabicNumberHelper.toEngDigits(account).trim();
    return customers.find(c => ArabicNumberHelper.toEngDigits(c.accountNumber).trim() === clean);
  };

  const getNextCustomerAccount = (): string => {
    let max = 1000;
    for (const c of customers) {
      const num = parseInt(ArabicNumberHelper.toEngDigits(c.accountNumber), 10) || 1000;
      if (num > max) max = num;
    }
    return (max + 1).toString();
  };

  const addCustomer = (
    name: string,
    phone: string,
    address: string,
    initialBalance: number,
    customAccount?: string
  ): boolean => {
    if (!name.trim()) {
      showToast('❌ يرجى إدخال اسم العميل.');
      return false;
    }
    const cleanCustom = ArabicNumberHelper.toEngDigits(customAccount || '').trim();
    const acc = cleanCustom || getNextCustomerAccount();

    if (customers.some(c => ArabicNumberHelper.toEngDigits(c.accountNumber).trim() === acc)) {
      showToast(`❌ رقم حساب العميل (${acc}) موجود بالفعل! لا يمكن تكرار رقم الحساب.`);
      return false;
    }

    const initialTx: TransactionRecord[] = initialBalance !== 0 ? [
      {
        date: ArabicNumberHelper.formatDateTime(),
        type: 'افتتاح',
        amount: initialBalance,
        currency: 'YER',
        note: 'افتتاحي',
        balanceAfter: initialBalance,
      }
    ] : [];

    const newCustomer: Customer = {
      id: Date.now(),
      accountNumber: acc,
      name: name.trim(),
      phone: ArabicNumberHelper.toEngDigits(phone).trim(),
      address: address.trim(),
      balance: initialBalance,
      transactions: initialTx,
    };

    const updated = [...customers, newCustomer];
    saveCustomers(updated);
    showToast(`✅ تم إضافة العميل ${name} برقم حساب ${acc}`);
    return true;
  };

  const editCustomer = (
    account: string,
    newName: string,
    newPhone: string,
    newAddress: string,
    newInitialBalance?: number
  ) => {
    const clean = ArabicNumberHelper.toEngDigits(account).trim();
    const idx = customers.findIndex(c => ArabicNumberHelper.toEngDigits(c.accountNumber).trim() === clean);
    if (idx === -1) return;

    const c = customers[idx];
    let updatedTx = [...c.transactions];

    if (newInitialBalance !== undefined) {
      const openIdx = updatedTx.findIndex(t => t.type === 'افتتاح');
      if (openIdx !== -1) {
        if (newInitialBalance === 0 && updatedTx.length > 1) {
          updatedTx.splice(openIdx, 1);
        } else {
          updatedTx[openIdx] = {
            ...updatedTx[openIdx],
            amount: newInitialBalance,
            note: 'افتتاحي'
          };
        }
      } else if (newInitialBalance !== 0) {
        updatedTx.unshift({
          date: ArabicNumberHelper.formatDateTime(),
          type: 'افتتاح',
          amount: newInitialBalance,
          currency: 'YER',
          note: 'افتتاحي',
          balanceAfter: newInitialBalance
        });
      }
    }

    const updated = recalculateCustomerBalance({
      ...c,
      name: newName.trim() || c.name,
      phone: ArabicNumberHelper.toEngDigits(newPhone),
      address: newAddress.trim(),
      transactions: updatedTx
    });

    const newCustomers = [...customers];
    newCustomers[idx] = updated;
    saveCustomers(newCustomers);
    showToast('✅ تم تعديل بيانات العميل بنجاح.');
  };

  const deleteCustomer = (account: string): boolean => {
    const clean = ArabicNumberHelper.toEngDigits(account).trim();
    const updated = customers.filter(c => ArabicNumberHelper.toEngDigits(c.accountNumber).trim() !== clean);
    if (updated.length !== customers.length) {
      saveCustomers(updated);
      showToast('تم حذف العميل بنجاح.');
      return true;
    }
    return false;
  };

  const selectCustomerForInvoice = (customer: Customer) => {
    setCustomerAccount(customer.accountNumber);
    setCustomerName(customer.name);
    showToast(`✅ تم اختيار العميل: ${customer.name} (حساب: ${customer.accountNumber})`);
  };

  const generateNewCustomerAccount = () => {
    const next = getNextCustomerAccount();
    setCustomerAccount(next);
    showToast(`⚡ تم تعيين رقم حساب جديد: ${next}`);
  };

  // Currency Converter
  const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
    const from = fromCurrency === 'USD' ? '$' : fromCurrency;
    const to = toCurrency === 'USD' ? '$' : toCurrency;
    if (from === to) return amount;

    let rate = 1;
    const key = `${from}->${to}`;
    switch (key) {
      case '$->YER':
        rate = exchangeRates.usdToYer;
        break;
      case 'YER->$':
        rate = exchangeRates.yerToUsd;
        break;
      case '$->SAR':
        rate = exchangeRates.usdToSar;
        break;
      case 'SAR->$':
        rate = exchangeRates.sarToUsd;
        break;
      case 'YER->SAR':
        rate = exchangeRates.yerToSar;
        break;
      case 'SAR->YER':
        rate = exchangeRates.sarToYer;
        break;
      default:
        rate = 1;
    }
    return rate > 0 ? amount * rate : amount;
  };

  // Vouchers
  const voucherExists = (vNum: string, type: string, excludeVoucherNum?: string, excludeAccount?: string): boolean => {
    const cleanNum = ArabicNumberHelper.toEngDigits(vNum).trim();
    if (!cleanNum) return false;
    const cleanExcludeNum = excludeVoucherNum ? ArabicNumberHelper.toEngDigits(excludeVoucherNum).trim() : null;
    const cleanExcludeAcc = excludeAccount ? ArabicNumberHelper.toEngDigits(excludeAccount).trim() : null;

    for (const c of customers) {
      const isExcludedAcc = cleanExcludeAcc && ArabicNumberHelper.toEngDigits(c.accountNumber).trim() === cleanExcludeAcc;
      for (const t of c.transactions) {
        if (t.type !== type) continue;
        const num = t.voucherNum ? ArabicNumberHelper.toEngDigits(t.voucherNum).trim() : '';
        const note = ArabicNumberHelper.toEngDigits(t.note || '');

        const matches = (num && num === cleanNum) || note.includes(`(${cleanNum})`) || note.includes(`رقم ${cleanNum}`);
        if (matches) {
          if (isExcludedAcc && cleanExcludeNum) {
            const isSelf = (num && num === cleanExcludeNum) || note.includes(`(${cleanExcludeNum})`) || note.includes(`رقم ${cleanExcludeNum}`);
            if (isSelf) continue;
          }
          return true;
        }
      }
    }
    return false;
  };

  const getUniqueNextReceiptVoucherNum = (): string => {
    let num = nextReceiptVoucherNum;
    while (voucherExists(num.toString(), 'قبض')) {
      num++;
    }
    const next = num + 1;
    setNextReceiptVoucherNum(next);
    StorageService.saveNextReceiptVoucherNum(next);
    return num.toString();
  };

  const getUniqueNextPaymentVoucherNum = (): string => {
    let num = nextPaymentVoucherNum;
    while (voucherExists(num.toString(), 'صرف')) {
      num++;
    }
    const next = num + 1;
    setNextPaymentVoucherNum(next);
    StorageService.saveNextPaymentVoucherNum(next);
    return num.toString();
  };

  const addReceiptVoucher = (
    account: string,
    amount: number,
    curr: string,
    note: string,
    date?: string,
    voucherNum?: string
  ): boolean => {
    const cleanAcc = ArabicNumberHelper.toEngDigits(account).trim();
    if (!cleanAcc || amount <= 0) {
      showToast('❌ يرجى إدخال رقم الحساب والمبلغ بشكل صحيح.');
      return false;
    }

    const custIdx = customers.findIndex(c => ArabicNumberHelper.toEngDigits(c.accountNumber).trim() === cleanAcc);
    if (custIdx === -1) {
      showToast(`⚠️ هذا الحساب (${cleanAcc}) غير موجود في النظام!`);
      return false;
    }

    const cleanVNum = voucherNum ? ArabicNumberHelper.toEngDigits(voucherNum).trim() : '';
    const vNum = cleanVNum || getUniqueNextReceiptVoucherNum();

    if (voucherExists(vNum, 'قبض')) {
      showToast(`❌ رقم سند القبض (${vNum}) موجود بالفعل! لا يمكن تكرار رقم السند.`);
      return false;
    }

    const parsedNum = parseInt(cleanVNum, 10);
    if (!isNaN(parsedNum) && parsedNum >= nextReceiptVoucherNum) {
      setNextReceiptVoucherNum(parsedNum + 1);
      StorageService.saveNextReceiptVoucherNum(parsedNum + 1);
    }

    const customer = customers[custIdx];
    const dateToUse = date?.trim() || ArabicNumberHelper.formatDateTime();

    const newTx: TransactionRecord = {
      date: dateToUse,
      type: 'قبض',
      amount,
      currency: curr,
      note: note.trim(),
      voucherNum: vNum,
      balanceAfter: 0,
    };

    const updated = recalculateCustomerBalance({
      ...customer,
      transactions: [...customer.transactions, newTx]
    });

    const newCustomers = [...customers];
    newCustomers[custIdx] = updated;
    saveCustomers(newCustomers);
    showToast(`✅ تم تسديد مبلغ ${ArabicNumberHelper.formatAmount(amount)} ${curr} بالسند رقم (${vNum})`);
    return true;
  };

  const addPaymentVoucher = (
    account: string,
    amount: number,
    curr: string,
    note: string,
    date?: string,
    voucherNum?: string
  ): boolean => {
    const cleanAcc = ArabicNumberHelper.toEngDigits(account).trim();
    if (!cleanAcc || amount <= 0) {
      showToast('❌ يرجى إدخال رقم الحساب والمبلغ بشكل صحيح.');
      return false;
    }

    const custIdx = customers.findIndex(c => ArabicNumberHelper.toEngDigits(c.accountNumber).trim() === cleanAcc);
    if (custIdx === -1) {
      showToast(`⚠️ هذا الحساب (${cleanAcc}) غير موجود في النظام!`);
      return false;
    }

    const cleanVNum = voucherNum ? ArabicNumberHelper.toEngDigits(voucherNum).trim() : '';
    const vNum = cleanVNum || getUniqueNextPaymentVoucherNum();

    if (voucherExists(vNum, 'صرف')) {
      showToast(`❌ رقم سند الصرف (${vNum}) موجود بالفعل! لا يمكن تكرار رقم السند.`);
      return false;
    }

    const parsedNum = parseInt(cleanVNum, 10);
    if (!isNaN(parsedNum) && parsedNum >= nextPaymentVoucherNum) {
      setNextPaymentVoucherNum(parsedNum + 1);
      StorageService.saveNextPaymentVoucherNum(parsedNum + 1);
    }

    const customer = customers[custIdx];
    const dateToUse = date?.trim() || ArabicNumberHelper.formatDateTime();

    const newTx: TransactionRecord = {
      date: dateToUse,
      type: 'صرف',
      amount,
      currency: curr,
      note: note.trim(),
      voucherNum: vNum,
      balanceAfter: 0,
    };

    const updated = recalculateCustomerBalance({
      ...customer,
      transactions: [...customer.transactions, newTx]
    });

    const newCustomers = [...customers];
    newCustomers[custIdx] = updated;
    saveCustomers(newCustomers);
    showToast(`✅ تم صرف مبلغ ${ArabicNumberHelper.formatAmount(amount)} ${curr} بالسند رقم (${vNum})`);
    return true;
  };

  const editVoucher = (
    oldVoucherNum: string,
    type: string,
    targetAccount: string,
    newAmount: number,
    newCurrency: string,
    newNote: string,
    newDate: string,
    newVoucherNum?: string,
    origAccount?: string
  ): boolean => {
    const cleanOld = ArabicNumberHelper.toEngDigits(oldVoucherNum).trim();
    const cleanNew = newVoucherNum ? ArabicNumberHelper.toEngDigits(newVoucherNum).trim() : cleanOld;
    const cleanTarget = ArabicNumberHelper.toEngDigits(targetAccount).trim();

    if (cleanNew !== cleanOld && voucherExists(cleanNew, type, cleanOld, origAccount)) {
      showToast(`❌ رقم سند ال${type} (${cleanNew}) موجود بالفعل في سند آخر!`);
      return false;
    }

    // Find original customer and tx
    let origCustIdx = -1;
    let origTxIdx = -1;

    for (let i = 0; i < customers.length; i++) {
      const c = customers[i];
      if (origAccount && ArabicNumberHelper.toEngDigits(c.accountNumber).trim() !== ArabicNumberHelper.toEngDigits(origAccount).trim()) {
        continue;
      }
      for (let j = 0; j < c.transactions.length; j++) {
        const t = c.transactions[j];
        if (t.type === type && (
          (t.voucherNum && ArabicNumberHelper.toEngDigits(t.voucherNum).trim() === cleanOld) ||
          t.note.includes(`(${cleanOld})`) ||
          t.note.includes(`رقم ${cleanOld}`)
        )) {
          origCustIdx = i;
          origTxIdx = j;
          break;
        }
      }
      if (origCustIdx !== -1) break;
    }

    if (origCustIdx === -1 || origTxIdx === -1) {
      showToast('❌ تعذر العثور على السند الأصلي.');
      return false;
    }

    const origCust = customers[origCustIdx];
    const origTx = origCust.transactions[origTxIdx];

    const updatedTx: TransactionRecord = {
      ...origTx,
      voucherNum: cleanNew,
      amount: newAmount,
      currency: newCurrency,
      note: newNote.trim(),
      date: newDate.trim() || origTx.date,
    };

    const newCustomers = [...customers];

    if (ArabicNumberHelper.toEngDigits(origCust.accountNumber).trim() === cleanTarget) {
      // Same customer
      const newTxList = [...origCust.transactions];
      newTxList[origTxIdx] = updatedTx;
      newCustomers[origCustIdx] = recalculateCustomerBalance({ ...origCust, transactions: newTxList });
    } else {
      // Different customer
      const targetCustIdx = customers.findIndex(c => ArabicNumberHelper.toEngDigits(c.accountNumber).trim() === cleanTarget);
      if (targetCustIdx === -1) {
        showToast('❌ الحساب الجديد غير موجود.');
        return false;
      }
      // Remove from orig
      const origTxList = origCust.transactions.filter((_, idx) => idx !== origTxIdx);
      newCustomers[origCustIdx] = recalculateCustomerBalance({ ...origCust, transactions: origTxList });
      // Add to target
      const targetCust = customers[targetCustIdx];
      newCustomers[targetCustIdx] = recalculateCustomerBalance({
        ...targetCust,
        transactions: [...targetCust.transactions, updatedTx]
      });
    }

    saveCustomers(newCustomers);
    showToast(`✅ تم تعديل سند ال${type} رقم (${cleanNew}) بنجاح.`);
    return true;
  };

  const deleteVoucher = (voucherNum: string, type: string, account?: string): boolean => {
    const cleanNum = ArabicNumberHelper.toEngDigits(voucherNum).trim();
    let found = false;

    const newCustomers = customers.map(c => {
      if (account && ArabicNumberHelper.toEngDigits(c.accountNumber).trim() !== ArabicNumberHelper.toEngDigits(account).trim()) {
        return c;
      }
      const filtered = c.transactions.filter(t => {
        if (t.type !== type) return true;
        const vNum = t.voucherNum ? ArabicNumberHelper.toEngDigits(t.voucherNum).trim() : '';
        const matches = (vNum && vNum === cleanNum) || t.note.includes(`(${cleanNum})`) || t.note.includes(`رقم ${cleanNum}`);
        if (matches) {
          found = true;
          return false;
        }
        return true;
      });
      return recalculateCustomerBalance({ ...c, transactions: filtered });
    });

    if (found) {
      saveCustomers(newCustomers);
      showToast(`✅ تم حذف سند ال${type} رقم (${voucherNum}) بنجاح.`);
      return true;
    }
    showToast('❌ تعذر العثور على السند.');
    return false;
  };

  const getAllVouchers = (type: string): VoucherItem[] => {
    const list: VoucherItem[] = [];
    for (const c of customers) {
      for (const t of c.transactions) {
        if (t.type === type && t.voucherNum) {
          list.push({
            voucherNum: t.voucherNum,
            type: t.type,
            account: c.accountNumber,
            customerName: c.name,
            date: t.date,
            amount: t.amount,
            currency: t.currency,
            note: t.note,
          });
        }
      }
    }
    return list.sort((a, b) => (parseInt(b.voucherNum, 10) || 0) - (parseInt(a.voucherNum, 10) || 0));
  };

  // Invoice Totals
  const getMainTotal = (): number => {
    return parseFloat(ArabicNumberHelper.toEngDigits(price)) || 0;
  };

  const getExtraItemsTotal = (): number => {
    let sum = 0;
    for (const item of extraItems) {
      const itemTotal = (item.price || 0) * (item.qty || 1);
      sum += convertCurrency(itemTotal, item.currency, currency);
    }
    return sum;
  };

  const getGrandTotal = (): number => {
    return getMainTotal() + getExtraItemsTotal();
  };

  const saveInvoices = (newInvoices: InvoiceData[]) => {
    setSavedInvoicesState(newInvoices);
    StorageService.saveInvoices(newInvoices);
  };

  const saveCurrentInvoice = (): boolean => {
    const cleanInvNum = ArabicNumberHelper.toEngDigits(invNum).trim();
    const p = parseFloat(ArabicNumberHelper.toEngDigits(price)) || 0;
    const q = parseFloat(ArabicNumberHelper.toEngDigits(qty)) || 3;

    if (!cleanInvNum || parseInt(cleanInvNum, 10) <= 0) {
      showToast('⚠️ رقم الفاتورة يجب أن يكون رقماً صحيحاً أكبر من صفر.');
      return false;
    }
    if (p <= 0 && extraItems.length === 0) {
      showToast('⚠️ يرجى إدخال سعر الاشتراك أو إضافة تفاصيل إضافية بالمبلغ.');
      return false;
    }
    if (q <= 0) {
      showToast('⚠️ العدد يجب أن يكون أكبر من صفر.');
      return false;
    }

    const grandTotal = getGrandTotal();
    if (grandTotal <= 0) {
      showToast('⚠️ المبلغ الإجمالي يجب أن يكون أكبر من صفر.');
      return false;
    }

    let acc = ArabicNumberHelper.toEngDigits(customerAccount).trim();
    let customer = acc ? findCustomerByAccount(acc) : undefined;

    if (!customer && customerName.trim()) {
      customer = customers.find(c => c.name.trim().toLowerCase() === customerName.trim().toLowerCase());
      if (customer) {
        acc = customer.accountNumber;
      }
    }

    if (invType === 'أجل') {
      if (!customer && !customerName.trim()) {
        showToast('⚠️ يرجى إدخال اسم المشترك أو رقم حسابه لإنشاء الحساب وحفظ الفاتورة الآجل.');
        return false;
      }
      if (!customer) {
        const targetAcc = acc && !customers.some(c => ArabicNumberHelper.toEngDigits(c.accountNumber).trim() === acc)
          ? acc
          : getNextCustomerAccount();

        customer = {
          id: Date.now(),
          accountNumber: targetAcc,
          name: customerName.trim(),
          phone: '',
          address: '',
          balance: 0,
          transactions: [],
        };
        saveCustomers([...customers, customer]);
        acc = targetAcc;
      }
    }

    const dateToUse = invoiceDate.trim() || ArabicNumberHelper.formatDateTime();
    let finalInvNum = cleanInvNum;

    // Check duplicate
    if (editingInvoiceId !== null) {
      const isDuplicate = savedInvoices.some(
        it => it.id !== editingInvoiceId && ArabicNumberHelper.toEngDigits(it.invNum).trim() === cleanInvNum
      );
      if (isDuplicate) {
        showToast(`❌ رقم الفاتورة (${cleanInvNum}) موجود بالفعل في فاتورة أخرى!`);
        return false;
      }
    } else {
      const isDuplicate = savedInvoices.some(
        it => ArabicNumberHelper.toEngDigits(it.invNum).trim() === cleanInvNum
      );
      if (isDuplicate) {
        finalInvNum = getNextInvoiceNumber();
      }
    }

    const mainDesc = desc.trim() || 'تجديد باقة تميز';

    if (editingInvoiceId !== null) {
      const existing = savedInvoices.find(it => it.id === editingInvoiceId);
      if (existing) {
        const updatedInvoice: InvoiceData = {
          id: existing.id,
          invNum: finalInvNum,
          invType,
          customerAccount: acc,
          customerName: customerName.trim() || customer?.name || '',
          cardId: cardId.trim(),
          price: p,
          type: subscriptionType,
          qty: q,
          desc: mainDesc,
          endDate: existing.endDate || endDate,
          currency,
          extraItems,
          grandTotal,
          createdAt: dateToUse,
        };

        const updatedInvoices = savedInvoices.map(it => it.id === editingInvoiceId ? updatedInvoice : it);
        saveInvoices(updatedInvoices);

        // Update customer transaction if أجل
        if (invType === 'أجل' && acc) {
          const custIdx = customers.findIndex(c => ArabicNumberHelper.toEngDigits(c.accountNumber).trim() === acc);
          if (custIdx !== -1) {
            const targetCust = customers[custIdx];
            const updatedTx: TransactionRecord = {
              date: dateToUse,
              type: 'فاتورة',
              amount: grandTotal,
              currency,
              note: `فاتورة رقم (${finalInvNum}) - ${mainDesc}`,
              voucherNum: finalInvNum,
              balanceAfter: 0,
            };

            const existingTxIdx = targetCust.transactions.findIndex(t =>
              t.type === 'فاتورة' && (
                (t.voucherNum && ArabicNumberHelper.toEngDigits(t.voucherNum).trim() === existing.invNum) ||
                t.note.includes(`(${existing.invNum})`) ||
                t.note.includes(`رقم ${existing.invNum}`)
              )
            );

            let newTxList: TransactionRecord[];
            if (existingTxIdx !== -1) {
              newTxList = [...targetCust.transactions];
              newTxList[existingTxIdx] = updatedTx;
            } else {
              newTxList = [...targetCust.transactions, updatedTx];
            }

            const recalculated = recalculateCustomerBalance({ ...targetCust, transactions: newTxList });
            const newCusts = [...customers];
            newCusts[custIdx] = recalculated;
            saveCustomers(newCusts);
          }
        }

        showToast(`✅ تم حفظ تعديلات الفاتورة رقم ${finalInvNum} بنجاح.`);
        setPreviewInvoice(updatedInvoice);
        setEditingInvoiceId(null);
        setIsFormVisible(false);
        resetInvoiceInputs();
        return true;
      }
    }

    // New invoice
    const newInvoice: InvoiceData = {
      id: Date.now(),
      invNum: finalInvNum,
      invType,
      customerAccount: acc,
      customerName: customerName.trim() || customer?.name || '',
      cardId: cardId.trim(),
      price: p,
      type: subscriptionType,
      qty: q,
      desc: mainDesc,
      endDate,
      currency,
      extraItems,
      grandTotal,
      createdAt: dateToUse,
    };

    saveInvoices([...savedInvoices, newInvoice]);

    if (invType === 'أجل' && acc) {
      const custIdx = customers.findIndex(c => ArabicNumberHelper.toEngDigits(c.accountNumber).trim() === acc);
      if (custIdx !== -1) {
        const targetCust = customers[custIdx];
        const newTx: TransactionRecord = {
          date: dateToUse,
          type: 'فاتورة',
          amount: grandTotal,
          currency,
          note: `فاتورة رقم (${finalInvNum}) - ${mainDesc}`,
          voucherNum: finalInvNum,
          balanceAfter: 0,
        };
        const recalculated = recalculateCustomerBalance({ ...targetCust, transactions: [...targetCust.transactions, newTx] });
        const newCusts = [...customers];
        newCusts[custIdx] = recalculated;
        saveCustomers(newCusts);
      }
      showToast(`✅ تم حفظ الفاتورة وإضافة ${grandTotal} ${currency} لحساب العميل ${acc}`);
    } else {
      showToast(`✅ تم حفظ الفاتورة النقدية رقم ${finalInvNum} بإجمالي ${ArabicNumberHelper.formatAmount(grandTotal)} ${currency}`);
    }

    setPreviewInvoice(newInvoice);
    setIsFormVisible(false);
    resetInvoiceInputs();
    return true;
  };

  const resetInvoiceInputs = () => {
    const next = getNextInvoiceNumber();
    setInvNum(next);
    setCustomerName('');
    setCardId('');
    setPrice('');
    setCurrency('YER');
    setDesc('تجديد باقة تميز');
    setCustomerAccount('');
    setQty('3');
    setExtraItems([]);
    const now = ArabicNumberHelper.formatDateTime();
    setInvoiceDate(now);
    calculateExpiryDate('3', 'months', now);
  };

  const addNewInvoice = () => {
    resetInvoiceInputs();
    setIsFormVisible(true);
    setEditingInvoiceId(null);
    showToast('تم تجهيز فاتورة جديدة تلقائياً.');
  };

  const closeInvoiceForm = () => {
    setIsFormVisible(false);
    setEditingInvoiceId(null);
    showToast('تم إغلاق الفاتورة والعودة للرئيسية.');
  };

  const editSavedInvoice = (invoice: InvoiceData) => {
    setEditingInvoiceId(invoice.id);
    setIsFormVisible(true);
    setInvoiceDate(invoice.createdAt || ArabicNumberHelper.formatDateTime());
    setInvNum(invoice.invNum);
    setInvType(invoice.invType);
    setCustomerAccount(invoice.customerAccount);
    setCustomerName(invoice.customerName);
    setCardId(invoice.cardId);
    setPrice(invoice.price > 0 ? invoice.price.toString() : '');
    setSubscriptionType(invoice.type);
    setQty(invoice.qty > 0 ? invoice.qty.toString() : '1');
    setDesc(invoice.desc || 'تجديد باقة تميز');
    setEndDate(invoice.endDate);
    setCurrency(invoice.currency);
    setExtraItems(invoice.extraItems || []);
    setShowSavedInvoicesModal(false);
    setCurrentScreen('MAIN');
    showToast(`تم تحميل الفاتورة رقم ${invoice.invNum} للتعديل.`);
  };

  const deleteSavedInvoice = (id: number) => {
    const inv = savedInvoices.find(it => it.id === id);
    const updated = savedInvoices.filter(it => it.id !== id);
    saveInvoices(updated);

    if (inv && inv.invType === 'أجل' && inv.customerAccount) {
      const cleanAcc = ArabicNumberHelper.toEngDigits(inv.customerAccount).trim();
      const cleanInvNum = ArabicNumberHelper.toEngDigits(inv.invNum).trim();
      const custIdx = customers.findIndex(c => ArabicNumberHelper.toEngDigits(c.accountNumber).trim() === cleanAcc);
      if (custIdx !== -1) {
        const cust = customers[custIdx];
        const filteredTx = cust.transactions.filter(t => {
          if (t.type !== 'فاتورة') return true;
          const vNum = t.voucherNum ? ArabicNumberHelper.toEngDigits(t.voucherNum).trim() : '';
          const matches = (vNum && vNum === cleanInvNum) || t.note.includes(`(${cleanInvNum})`) || t.note.includes(`رقم ${cleanInvNum}`);
          return !matches;
        });
        const recalculated = recalculateCustomerBalance({ ...cust, transactions: filteredTx });
        const newCusts = [...customers];
        newCusts[custIdx] = recalculated;
        saveCustomers(newCusts);
      }
    }
    showToast('تم حذف الفاتورة بنجاح.');
  };

  const clearAllInvoices = () => {
    saveInvoices([]);
    showToast('تم حذف جميع الفواتير المحفوظة.');
  };

  const updateInvoiceDateOnly = (invoiceId: number, newDate: string) => {
    const updated = savedInvoices.map(it => it.id === invoiceId ? { ...it, createdAt: newDate } : it);
    saveInvoices(updated);
    showToast(`✅ تم تعديل تاريخ الفاتورة إلى ${newDate}`);
  };

  const getLatestSavedInvoiceOrCurrent = (): InvoiceData => {
    if (savedInvoices.length > 0) {
      return savedInvoices[savedInvoices.length - 1];
    }
    return {
      id: 0,
      invNum: invNum || '1',
      invType,
      customerAccount,
      customerName,
      cardId,
      price: parseFloat(ArabicNumberHelper.toEngDigits(price)) || 0,
      type: subscriptionType,
      qty: parseFloat(ArabicNumberHelper.toEngDigits(qty)) || 1,
      desc: desc || 'تجديد باقة تميز',
      endDate,
      currency,
      extraItems,
      grandTotal: getGrandTotal(),
      createdAt: invoiceDate || ArabicNumberHelper.formatDateTime(),
    };
  };

  const openLatestSavedOrCurrentReport = () => {
    const inv = getLatestSavedInvoiceOrCurrent();
    setPreviewInvoice(inv);
    setCurrentScreen('INVOICE_REPORT');
  };

  const openInvoiceReport = (invoice: InvoiceData) => {
    setPreviewInvoice(invoice);
    setCurrentScreen('INVOICE_REPORT');
  };

  const openCustomerDisplayMode = (invoice?: InvoiceData) => {
    const target = invoice || getLatestSavedInvoiceOrCurrent();
    setPreviewInvoice(target);
    setCurrentScreen('CUSTOMER_INVOICE_DISPLAY');
  };

  // Statement Methods
  const requestStatementDateRange = (customer: Customer) => {
    const today = new Date();
    const todayStr = ArabicNumberHelper.formatDateOnly(today);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startStr = ArabicNumberHelper.formatDateOnly(startOfMonth);

    setPendingStatementCustomer(customer);
    setStatementStartDate(startStr);
    setStatementEndDate(todayStr);
    setShowDateRangeDialog(true);
  };

  const dismissDateRangeDialog = () => {
    setShowDateRangeDialog(false);
    setPendingStatementCustomer(null);
  };

  const setStatementQuickPeriod = (type: string) => {
    const today = new Date();
    const endStr = ArabicNumberHelper.formatDateOnly(today);
    let startStr = endStr;

    switch (type) {
      case 'today':
        startStr = endStr;
        break;
      case 'this_month': {
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        startStr = ArabicNumberHelper.formatDateOnly(start);
        break;
      }
      case 'last_month': {
        const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const end = new Date(today.getFullYear(), today.getMonth(), 0);
        setStatementStartDate(ArabicNumberHelper.formatDateOnly(start));
        setStatementEndDate(ArabicNumberHelper.formatDateOnly(end));
        return;
      }
      case '3_months': {
        const start = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
        startStr = ArabicNumberHelper.formatDateOnly(start);
        break;
      }
      case '6_months': {
        const start = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
        startStr = ArabicNumberHelper.formatDateOnly(start);
        break;
      }
      case 'all':
        startStr = '01/01/2020';
        break;
      case 'custom':
        setStatementStartDate('');
        setStatementEndDate('');
        return;
    }
    setStatementStartDate(startStr);
    setStatementEndDate(endStr);
  };

  const applyDateRangeAndOpenStatement = (): boolean => {
    const customer = pendingStatementCustomer || statementCustomer;
    if (!customer) {
      showToast('❌ لم يتم تحديد عميل.');
      return false;
    }

    if (!statementStartDate.trim() || !statementEndDate.trim()) {
      showToast('الرجاء تحديد تاريخ البداية والنهاية');
      return false;
    }

    const s = ArabicNumberHelper.parseDate(statementStartDate);
    const e = ArabicNumberHelper.parseDate(statementEndDate);
    if (!s || !e) {
      showToast('الرجاء إدخال تاريخ صحيح بصيغة: يوم/شهر/سنة');
      return false;
    }

    if (s > e) {
      showToast('تاريخ البداية يجب أن يكون قبل تاريخ النهاية');
      return false;
    }

    setStatementCustomer(customer);
    setPendingStatementCustomer(null);
    setShowDateRangeDialog(false);
    setShowCustomersModal(false);
    setCurrentScreen('CUSTOMER_STATEMENT');
    return true;
  };

  const openCustomerStatement = (customer: Customer, startDate: string = '', endDate: string = '') => {
    setStatementCustomer(customer);
    setStatementStartDate(startDate);
    setStatementEndDate(endDate);
    setCurrentScreen('CUSTOMER_STATEMENT');
  };

  const openStatementByAccount = (account: string): boolean => {
    const clean = ArabicNumberHelper.toEngDigits(account).trim();
    const cust = findCustomerByAccount(clean);
    if (!cust) {
      showToast('❌ لا يوجد عميل بهذا الرقم.');
      return false;
    }
    requestStatementDateRange(cust);
    return true;
  };

  // Form field updaters
  const updateInvNum = (num: string) => setInvNum(ArabicNumberHelper.toEngDigits(num));

  const updateInvType = (type: string) => {
    let newAcc = customerAccount;
    if (type === 'أجل' && customerName.trim() && !newAcc) {
      const match = customers.find(c => c.name.trim().toLowerCase() === customerName.trim().toLowerCase());
      newAcc = match ? match.accountNumber : getNextCustomerAccount();
    }
    setInvType(type);
    setCustomerAccount(newAcc);
  };

  const updateCustomerAccount = (acc: string) => {
    const clean = ArabicNumberHelper.toEngDigits(acc).trim();
    const match = findCustomerByAccount(clean);
    setCustomerAccount(clean);
    if (match) {
      setCustomerName(match.name);
    }
  };

  const updateCustomerName = (name: string) => {
    const cleanName = name.trim();
    const match = customers.find(c => c.name.trim().toLowerCase() === cleanName.toLowerCase());
    let newAcc = customerAccount;
    if (match) {
      newAcc = match.accountNumber;
    } else if (invType === 'أجل' && cleanName && !customerAccount) {
      newAcc = getNextCustomerAccount();
    }
    setCustomerName(name);
    setCustomerAccount(newAcc);
  };

  const updateCardId = (id: string) => setCardId(ArabicNumberHelper.toEngDigits(id));
  const updatePrice = (p: string) => setPrice(ArabicNumberHelper.toEngDigits(p));

  const updateSubscriptionType = (type: string) => {
    setSubscriptionType(type);
    calculateExpiryDate(qty, type, invoiceDate);
  };

  const updateQty = (q: string) => {
    const clean = ArabicNumberHelper.toEngDigits(q);
    setQty(clean);
    calculateExpiryDate(clean, subscriptionType, invoiceDate);
  };

  const updateDesc = (d: string) => setDesc(d);

  const updateInvoiceDate = (date: string) => {
    setInvoiceDate(date);
    calculateExpiryDate(qty, subscriptionType, date);
  };

  const updateEndDate = (d: string) => setEndDate(d);
  const updateCurrency = (curr: string) => setCurrency(curr);

  const addExtraItem = (d: string = '', p: number = 0, q: number = 1, curr: string = currency) => {
    setExtraItems(prev => [
      ...prev,
      { id: Date.now() + Math.random(), description: d, type: 'بطولة', price: p, qty: q, currency: curr }
    ]);
  };

  const removeExtraItem = (id: number) => {
    setExtraItems(prev => prev.filter(it => it.id !== id));
  };

  const updateExtraItem = (id: number, d: string, p: number, q: number, curr: string) => {
    setExtraItems(prev => prev.map(it => it.id === id ? { ...it, description: d, price: p, qty: q, currency: curr } : it));
  };

  // UI & Report Config
  const updateUiConfig = (newConfig: UiCustomizationConfig) => {
    setUiConfigState(newConfig);
    StorageService.saveUiConfig(newConfig);
  };

  const updateButtonSize = (size: ButtonSize) => {
    updateUiConfig({ ...uiConfig, buttonSize: size });
    showToast(`تم تغيير حجم الأزرار إلى: ${size}`);
  };

  const updateButtonLayout = (layout: ButtonLayout) => {
    updateUiConfig({ ...uiConfig, buttonLayout: layout });
    showToast(`تم تغيير نمط التخطيط إلى: ${layout}`);
  };

  const toggleQuickShortcutsBar = (show: boolean) => {
    updateUiConfig({ ...uiConfig, showQuickShortcutsBar: show });
  };

  const toggleButtonVisibility = (buttonId: string) => {
    const target = uiConfig.buttons.find(b => b.id === buttonId);
    const willBeVisible = target ? !target.isVisible : true;
    const buttons = uiConfig.buttons.map(b => b.id === buttonId ? { ...b, isVisible: !b.isVisible } : b);
    updateUiConfig({ ...uiConfig, buttons });
    showToast(willBeVisible ? `✅ تم إظهار زر (${target?.label || ''}) في الواجهة الرئيسية` : `👁️ تم إخفاء زر (${target?.label || ''}) من الواجهة الرئيسية`);
  };

  const toggleButtonQuickShortcut = (buttonId: string) => {
    const buttons = uiConfig.buttons.map(b => b.id === buttonId ? { ...b, isQuickShortcut: !b.isQuickShortcut } : b);
    updateUiConfig({ ...uiConfig, buttons });
  };

  const setActionButtonVisibility = (buttonId: string, visible: boolean) => {
    const buttons = uiConfig.buttons.map(b => b.id === buttonId ? { ...b, isVisible: visible } : b);
    updateUiConfig({ ...uiConfig, buttons });
    showToast(visible ? '✅ تم إظهار الزر في الواجهة' : '👁️ تم إخفاء الزر');
  };

  const setActionButtonQuickShortcut = (buttonId: string, isShortcut: boolean) => {
    const buttons = uiConfig.buttons.map(b => b.id === buttonId ? { ...b, isQuickShortcut: isShortcut } : b);
    updateUiConfig({ ...uiConfig, buttons });
    showToast(isShortcut ? '⭐ تم تثبيت الزر في شريط الاختصارات' : 'تم إلغاء تثبيت الزر');
  };

  const reorderButtons = (fromIndex: number, toIndex: number) => {
    const list = [...uiConfig.buttons];
    if (fromIndex >= 0 && toIndex >= 0 && fromIndex < list.length && toIndex < list.length) {
      const [item] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, item);
      updateUiConfig({ ...uiConfig, buttons: list });
    }
  };

  const resetUiCustomizationToDefault = () => {
    updateUiConfig(defaultUiCustomizationConfig);
    showToast('🔄 تم استعادة الترتيب والأحجام الافتراضية.');
  };

  const updateShadedFieldColor = (hex: string, alpha: number = 1.0) => {
    updateUiConfig({ ...uiConfig, shadedFieldColorHex: hex, shadedFieldAlpha: alpha });
    showToast('✅ تم حفظ لون وشفافية الحقول.');
  };

  const setAppThemePreset = (presetId: string) => {
    updateUiConfig({ ...uiConfig, themePresetId: presetId });
    showToast(`🎨 تم تطبيق الثيم: ${presetId}`);
  };

  const setHomeScreenStyle = (styleId: string) => {
    updateUiConfig({ ...uiConfig, homeScreenStyleId: styleId });
    showToast(`📱 تم تغيير شكل الواجهة إلى: ${styleId}`);
  };

  const updateReportConfig = (newConfig: ReportCustomizationConfig) => {
    setReportConfigState(newConfig);
    StorageService.saveReportConfig(newConfig);
  };

  const resetReportCustomizationToDefault = () => {
    updateReportConfig(defaultReportCustomizationConfig);
    showToast('🔄 تم استعادة إعدادات التقارير الافتراضية.');
  };

  const updateReportFontScale = (scale: number) => {
    const percent = Math.round(scale * 100);
    updateReportConfig({ ...reportConfig, fontScalePercent: Math.min(180, Math.max(70, percent)) });
  };

  const increaseReportFontScale = () => {
    const current = reportConfig.fontScalePercent / 100;
    const next = Math.min(1.8, current + 0.1);
    updateReportFontScale(next);
    showToast(`🔍 حجم خط التقارير: ${Math.round(next * 100)}%`);
  };

  const decreaseReportFontScale = () => {
    const current = reportConfig.fontScalePercent / 100;
    const next = Math.max(0.6, current - 0.1);
    updateReportFontScale(next);
    showToast(`🔍 حجم خط التقارير: ${Math.round(next * 100)}%`);
  };

  const updateReportFontFamily = (font: string) => {
    updateReportConfig({ ...reportConfig, fontFamily: font });
    showToast(`✅ تم تغيير نوع الخط إلى: ${font}`);
  };

  const toggleReportElement = (field: string, enabled: boolean) => {
    const key = field as keyof ReportCustomizationConfig;
    updateReportConfig({ ...reportConfig, [key]: enabled });
  };

  // Store Config
  const updateStoreConfig = (config: StoreConfig) => {
    setStoreConfigState(config);
    StorageService.saveStoreConfig(config);
    showToast('✅ تم حفظ إعدادات المحل بنجاح.');
  };

  const updateStoreLogo = (base64: string) => {
    const updated = { ...storeConfig, logoBase64: base64 };
    updateStoreConfig(updated);
  };

  const resetStoreLogo = () => {
    const updated = { ...storeConfig, logoBase64: '' };
    updateStoreConfig(updated);
    showToast('✅ تم استعادة الشعار الافتراضي.');
  };

  const updateExchangeRates = (rates: ExchangeRates) => {
    setExchangeRatesState(rates);
    StorageService.saveExchangeRates(rates);
    showToast('✅ تم حفظ أسعار العملات بنجاح.');
  };

  // Modals
  const setCustomersModalVisible = (visible: boolean, tab: number = -1) => {
    setCustomersModalInitialTab(tab);
    setShowCustomersModal(visible);
  };

  const setSavedInvoicesModalVisible = (visible: boolean) => {
    setShowSavedInvoicesModal(visible);
  };

  const setSettingsModalVisible = (visible: boolean) => {
    setShowSettingsModal(visible);
  };

  const setExitConfirmDialogVisible = (visible: boolean) => {
    setShowExitConfirmDialog(visible);
  };

  // Room Local Snapshots & Backup
  const createLocalRoomBackup = (title: string = '', note: string = '') => {
    const snapshotTitle = title.trim() || `نسخة احتياطية ${ArabicNumberHelper.formatDateTime()}`;
    const backupJson = StorageService.buildFullBackupJson();
    const snapshot: RoomBackupSnapshot = {
      id: Date.now(),
      title: snapshotTitle,
      timestamp: ArabicNumberHelper.formatDateTime(),
      invoiceCount: savedInvoices.length,
      customerCount: customers.length,
      backupDataJson: backupJson,
      note: note.trim(),
    };
    const updated = [snapshot, ...roomSnapshots];
    setRoomSnapshotsState(updated);
    StorageService.saveRoomSnapshots(updated);
    showToast(`✅ تم حفظ النسخة الاحتياطية بنجاح (${snapshot.invoiceCount} فاتورة، ${snapshot.customerCount} عميل)`);
  };

  const restoreFromRoomSnapshot = (snapshot: RoomBackupSnapshot): boolean => {
    const res = importBackupJson(snapshot.backupDataJson);
    if (res.success) {
      showToast(`✅ تم استعادة البيانات بنجاح من النسخة (${snapshot.title}).`);
      return true;
    }
    showToast(`❌ فشل استعادة النسخة: ${res.message}`);
    return false;
  };

  const deleteRoomSnapshot = (id: number) => {
    const updated = roomSnapshots.filter(s => s.id !== id);
    setRoomSnapshotsState(updated);
    StorageService.saveRoomSnapshots(updated);
    showToast('تم حذف النسخة الاحتياطية.');
  };

  const exportBackupJson = (): string => {
    return StorageService.buildFullBackupJson();
  };

  const importBackupJson = (json: string): { success: boolean; message: string; count?: number } => {
    try {
      let clean = json.trim();
      if (clean.startsWith('```')) {
        const idx = clean.indexOf('\n');
        clean = idx !== -1 ? clean.substring(idx + 1) : clean.replace(/```json|```/g, '');
        if (clean.endsWith('```')) clean = clean.substring(0, clean.length - 3);
        clean = clean.trim();
      }

      const root = JSON.parse(clean);
      let invList = root.savedInvoices || root.invoices || [];
      let custList = root.customers || root.clients || [];

      if (Array.isArray(root)) {
        if (root.length > 0 && (root[0].invNum || root[0].cardId || root[0].grandTotal)) {
          invList = root;
        } else if (root.length > 0 && (root[0].accountNumber || root[0].transactions)) {
          custList = root;
        }
      }

      if (invList.length > 0) {
        saveInvoices(invList);
      }
      if (custList.length > 0) {
        saveCustomers(custList);
      }
      if (root.storeConfig) {
        updateStoreConfig(root.storeConfig);
      }
      if (root.exchangeRates) {
        updateExchangeRates(root.exchangeRates);
      }
      if (root.nextReceiptVoucherNum) {
        setNextReceiptVoucherNum(root.nextReceiptVoucherNum);
        StorageService.saveNextReceiptVoucherNum(root.nextReceiptVoucherNum);
      }
      if (root.nextPaymentVoucherNum) {
        setNextPaymentVoucherNum(root.nextPaymentVoucherNum);
        StorageService.saveNextPaymentVoucherNum(root.nextPaymentVoucherNum);
      }

      showToast(`✅ تم استيراد البيانات بنجاح (${invList.length} فاتورة، ${custList.length} عميل)`);
      return { success: true, message: 'نجاح', count: invList.length };
    } catch (e: any) {
      return { success: false, message: e?.message || 'تنسيق الملف غير صالح' };
    }
  };

  // Action Buttons Runner
  const executeActionButton = (button: AppActionButton) => {
    switch (button.actionType) {
      case 'PERCENTAGE_CALCULATOR':
        setCurrentScreen('PERCENTAGE_CALCULATOR');
        break;
      case 'FULL_CALCULATOR':
        setCurrentScreen('FULL_CALCULATOR');
        break;
      case 'CURRENCY_CONVERTER':
        setCurrentScreen('CURRENCY_CONVERTER');
        break;
      case 'NEW_INVOICE':
        addNewInvoice();
        break;
      case 'OPEN_REPORT':
        openLatestSavedOrCurrentReport();
        break;
      case 'CUSTOMER_DISPLAY':
        openCustomerDisplayMode();
        break;
      case 'PRINT_INVOICE': {
        const inv = getLatestSavedInvoiceOrCurrent();
        setPreviewInvoice(inv);
        setCurrentScreen('INVOICE_REPORT');
        setTimeout(() => window.print(), 300);
        break;
      }
      case 'EXPORT_PDF': {
        const inv = getLatestSavedInvoiceOrCurrent();
        setPreviewInvoice(inv);
        setCurrentScreen('INVOICE_REPORT');
        showToast('يرجى الضغط على زر "تصدير PDF" أو "طباعة" لحفظ الفاتورة بصيغة PDF.');
        break;
      }
      case 'SAVED_INVOICES':
        setShowSavedInvoicesModal(true);
        break;
      case 'CUSTOMERS':
        setCustomersModalVisible(true, -1);
        break;
      case 'RECEIPT_VOUCHER':
        setCustomersModalVisible(true, 0); // Tab 0 = سند قبض
        break;
      case 'PAYMENT_VOUCHER':
        setCustomersModalVisible(true, 1); // Tab 1 = سند صرف
        break;
      case 'ALL_CUSTOMERS':
        setCustomersModalVisible(true, 2); // Tab 2 = جميع العملاء
        break;
      case 'REPORT_CONTROL':
        setShowSettingsModal(true);
        break;
      case 'ROOM_BACKUP':
        setShowSettingsModal(true);
        break;
      case 'SETTINGS':
        setShowSettingsModal(true);
        break;
      case 'EXIT_APP':
        setShowExitConfirmDialog(true);
        break;
      case 'CUSTOM_PACKAGE': {
        const p = parseFloat(button.customParam || '') || 0;
        if (p > 0) setPrice(p.toString());
        if (button.customDesc) setDesc(button.customDesc);
        setIsFormVisible(true);
        showToast(`⚡ تم تطبيق باقة (${button.label})`);
        break;
      }
      case 'CUSTOM_STATEMENT': {
        const acc = (button.customParam || '').trim();
        const c = findCustomerByAccount(acc);
        if (c) {
          openCustomerStatement(c);
        } else {
          showToast(`❌ لم يتم العثور على عميل برقم الحساب (${acc})`);
        }
        break;
      }
      case 'CUSTOM_PHONE':
        if (button.customParam) {
          window.location.href = `tel:${button.customParam}`;
        }
        break;
      case 'CUSTOM_URL':
        if (button.customParam) {
          const url = button.customParam.startsWith('http') ? button.customParam : `https://${button.customParam}`;
          window.open(url, '_blank');
        }
        break;
      default:
        showToast(`إجراء: ${button.label}`);
    }
  };

  return (
    <InvoiceContext.Provider
      value={{
        currentScreen,
        navigateTo,
        storeConfig,
        updateStoreConfig,
        updateStoreLogo,
        resetStoreLogo,
        customers,
        addCustomer,
        editCustomer,
        deleteCustomer,
        findCustomerByAccount,
        getNextCustomerAccount,
        selectCustomerForInvoice,
        generateNewCustomerAccount,
        nextReceiptVoucherNum,
        nextPaymentVoucherNum,
        addReceiptVoucher,
        addPaymentVoucher,
        editVoucher,
        deleteVoucher,
        getAllVouchers,
        savedInvoices,
        isFormVisible,
        editingInvoiceId,
        invoiceDate,
        invNum,
        invType,
        customerAccount,
        customerName,
        cardId,
        price,
        subscriptionType,
        qty,
        desc,
        endDate,
        currency,
        extraItems,
        previewInvoice,
        setFormVisible: setIsFormVisible,
        toggleFormVisibility: () => setIsFormVisible(prev => !prev),
        addNewInvoice,
        closeInvoiceForm,
        updateInvNum,
        updateInvType,
        updateCustomerAccount,
        updateCustomerName,
        updateCardId,
        updatePrice,
        updateSubscriptionType,
        updateQty,
        updateDesc,
        updateInvoiceDate,
        updateEndDate,
        updateCurrency,
        addExtraItem,
        removeExtraItem,
        updateExtraItem,
        saveCurrentInvoice,
        editSavedInvoice,
        deleteSavedInvoice,
        clearAllInvoices,
        updateInvoiceDateOnly,
        getMainTotal,
        getExtraItemsTotal,
        getGrandTotal,
        getLatestSavedInvoiceOrCurrent,
        openLatestSavedOrCurrentReport,
        openInvoiceReport,
        openCustomerDisplayMode,
        statementCustomer,
        statementStartDate,
        statementEndDate,
        showDateRangeDialog,
        pendingStatementCustomer,
        requestStatementDateRange,
        dismissDateRangeDialog,
        updateStatementStartDate: setStatementStartDate,
        updateStatementEndDate: setStatementEndDate,
        setStatementQuickPeriod,
        applyDateRangeAndOpenStatement,
        openCustomerStatement,
        openStatementByAccount,
        exchangeRates,
        updateExchangeRates,
        convertCurrency,
        uiConfig,
        updateUiConfig,
        updateButtonSize,
        updateButtonLayout,
        toggleQuickShortcutsBar,
        toggleButtonVisibility,
        toggleButtonQuickShortcut,
        setActionButtonVisibility,
        setActionButtonQuickShortcut,
        reorderButtons,
        resetUiCustomizationToDefault,
        updateShadedFieldColor,
        reportConfig,
        updateReportConfig,
        resetReportCustomizationToDefault,
        updateReportFontScale,
        increaseReportFontScale,
        decreaseReportFontScale,
        updateReportFontFamily,
        toggleReportElement,
        setAppThemePreset,
        setHomeScreenStyle,
        showCustomersModal,
        setCustomersModalVisible,
        customersModalInitialTab,
        showSavedInvoicesModal,
        setSavedInvoicesModalVisible,
        showSettingsModal,
        setSettingsModalVisible,
        showExitConfirmDialog,
        setExitConfirmDialogVisible,
        roomSnapshots,
        createLocalRoomBackup,
        restoreFromRoomSnapshot,
        deleteRoomSnapshot,
        exportBackupJson,
        importBackupJson,
        toastMessage,
        showToast,
        clearToast,
        exportedPdf,
        setExportedPdf,
        dismissExportedPdfDialog,
        executeActionButton,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = (): InvoiceContextType => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};
