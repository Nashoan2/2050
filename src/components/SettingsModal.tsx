import React, { useState } from 'react';
import { useInvoice } from '../context/InvoiceContext';
import { AlmamlakaLogoBadge } from './LogoBadge';
import { ArabicNumberHelper } from '../utils/arabic';
import {
  X,
  Store,
  DollarSign,
  Layout,
  FileText,
  HardDrive,
  Palette,
  Upload,
  Download,
  Trash2,
  RotateCcw,
  Plus,
  Eye,
  EyeOff,
  Check,
  Save,
  Clock
} from 'lucide-react';
import { ButtonLayout, ButtonSize, StoreConfig, ExchangeRates } from '../types';

type SettingsTab = 'STORE' | 'RATES' | 'UI' | 'REPORT' | 'BACKUP' | 'THEME';

export const SettingsModal: React.FC = () => {
  const {
    showSettingsModal,
    setSettingsModalVisible,
    storeConfig,
    updateStoreConfig,
    updateStoreLogo,
    resetStoreLogo,
    exchangeRates,
    updateExchangeRates,
    uiConfig,
    updateButtonSize,
    updateButtonLayout,
    toggleQuickShortcutsBar,
    toggleButtonVisibility,
    toggleButtonQuickShortcut,
    resetUiCustomizationToDefault,
    setAppThemePreset,
    reportConfig,
    updateReportConfig,
    resetReportCustomizationToDefault,
    updateReportFontScale,
    updateReportFontFamily,
    toggleReportElement,
    roomSnapshots,
    createLocalRoomBackup,
    restoreFromRoomSnapshot,
    deleteRoomSnapshot,
    exportBackupJson,
    importBackupJson,
    showToast,
  } = useInvoice();

  const [activeTab, setActiveTab] = useState<SettingsTab>('STORE');

  // Form states
  const [storeForm, setStoreForm] = useState<StoreConfig>(storeConfig);
  const [ratesForm, setRatesForm] = useState<ExchangeRates>(exchangeRates);
  const [newSnapshotTitle, setNewSnapshotTitle] = useState('');

  if (!showSettingsModal) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      updateStoreLogo(base64);
      setStoreForm(prev => ({ ...prev, logoBase64: base64 }));
      showToast('✅ تم تحديث وحفظ شعار المتجر بنجاح!');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreConfig(storeForm);
  };

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    updateExchangeRates(ratesForm);
  };

  const handleDownloadBackupFile = () => {
    const jsonStr = exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Mamlaka_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    showToast('✅ تم تحميل ملف النسخة الاحتياطية بنجاح!');
  };

  const handleImportBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      const res = importBackupJson(content);
      if (res.success) {
        showToast(`✅ تم استعادة النسخة بنجاح (${res.count || 0} فاتورة)!`);
      } else {
        showToast(`❌ ${res.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-[#0F172A] text-slate-100 rounded-2xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden border border-slate-700">
        {/* Top Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <span>⚙️</span> المطور عبد العزيز راجح
            </h2>
          </div>
          <button
            onClick={() => setSettingsModalVisible(false)}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-1 overflow-x-auto p-2 bg-slate-950/60 border-b border-slate-800 text-xs sm:text-sm">
          {[
            { id: 'STORE', label: 'المتجر والشعار', icon: Store },
            { id: 'RATES', label: 'أسعار العملات', icon: DollarSign },
            { id: 'UI', label: 'تخصيص الواجهة', icon: Layout },
            { id: 'REPORT', label: 'تخصيص التقارير', icon: FileText },
            { id: 'BACKUP', label: 'النسخ الاحتياطي', icon: HardDrive },
            { id: 'THEME', label: 'المظهر والثيمات', icon: Palette },
          ].map(tab => {
            const IconComp = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? 'bg-purple-700 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: Store & Logo */}
          {activeTab === 'STORE' && (
            <form onSubmit={handleSaveStore} className="space-y-4 max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-900 rounded-xl border border-slate-800">
                <AlmamlakaLogoBadge size={80} logoBase64={storeForm.logoBase64} />
                <div className="space-y-2 flex-1 text-center sm:text-right">
                  <span className="font-bold text-sm text-white block">شعار المحل / الشركة</span>
                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    <label className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      رفع شعار جديد
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        resetStoreLogo();
                        setStoreForm(prev => ({ ...prev, logoBase64: '' }));
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg text-xs cursor-pointer"
                    >
                      استعادة الشعار الأصلي
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">اسم المحل (بالعربي)</label>
                  <input
                    type="text"
                    value={storeForm.storeNameAr}
                    onChange={(e) => setStoreForm({ ...storeForm, storeNameAr: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-900 rounded-lg border border-slate-700 font-bold text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">اسم المحل (بالإنجليزي)</label>
                  <input
                    type="text"
                    value={storeForm.storeNameEn}
                    onChange={(e) => setStoreForm({ ...storeForm, storeNameEn: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-900 rounded-lg border border-slate-700 font-bold text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">الفرع</label>
                  <input
                    type="text"
                    value={storeForm.branch}
                    onChange={(e) => setStoreForm({ ...storeForm, branch: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-900 rounded-lg border border-slate-700 font-bold text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">رقم الهاتف</label>
                  <input
                    type="text"
                    value={storeForm.phone}
                    onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-900 rounded-lg border border-slate-700 font-bold text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">العنوان (بالعربي)</label>
                <input
                  type="text"
                  value={storeForm.addressAr}
                  onChange={(e) => setStoreForm({ ...storeForm, addressAr: e.target.value })}
                  className="w-full h-10 px-3 bg-slate-900 rounded-lg border border-slate-700 font-bold text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">شروط وملاحظات الفاتورة</label>
                <textarea
                  rows={3}
                  value={storeForm.terms}
                  onChange={(e) => setStoreForm({ ...storeForm, terms: e.target.value })}
                  className="w-full p-3 bg-slate-900 rounded-lg border border-slate-700 font-bold text-sm text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-extrabold rounded-xl shadow cursor-pointer transition-colors"
              >
                حفظ بيانات المتجر 💾
              </button>
            </form>
          )}

          {/* TAB 2: Exchange Rates */}
          {activeTab === 'RATES' && (
            <form onSubmit={handleSaveRates} className="space-y-4 max-w-xl mx-auto">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                <h3 className="font-black text-sm text-emerald-400">أسعار التحويل المعتمدة للنظام</h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">سعر الدولار مقابل الريال اليمني (1 $ = ؟ ريال يمني)</label>
                    <input
                      type="number"
                      step="any"
                      value={ratesForm.usdToYer}
                      onChange={(e) => setRatesForm({ ...ratesForm, usdToYer: parseFloat(e.target.value) || 0 })}
                      className="w-full h-10 px-3 bg-slate-950 rounded-lg border border-slate-700 font-black text-emerald-400 text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">سعر الدولار مقابل الريال السعودي (1 $ = ؟ ريال سعودي)</label>
                    <input
                      type="number"
                      step="any"
                      value={ratesForm.usdToSar}
                      onChange={(e) => setRatesForm({ ...ratesForm, usdToSar: parseFloat(e.target.value) || 0 })}
                      className="w-full h-10 px-3 bg-slate-950 rounded-lg border border-slate-700 font-black text-emerald-400 text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">سعر الريال السعودي مقابل اليمني (1 SAR = ؟ ريال يمني)</label>
                    <input
                      type="number"
                      step="any"
                      value={ratesForm.sarToYer}
                      onChange={(e) => setRatesForm({ ...ratesForm, sarToYer: parseFloat(e.target.value) || 0 })}
                      className="w-full h-10 px-3 bg-slate-950 rounded-lg border border-slate-700 font-black text-emerald-400 text-base"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow cursor-pointer transition-colors"
              >
                حفظ أسعار الصرف 💰
              </button>
            </form>
          )}

          {/* TAB 3: UI Customizer */}
          {activeTab === 'UI' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              {/* Button Sizes */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-black text-slate-300 block">حجم الأزرار الرئيسية:</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['COMPACT', 'MEDIUM', 'LARGE'] as ButtonSize[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => updateButtonSize(size)}
                      className={`py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        uiConfig.buttonSize === size
                          ? 'bg-purple-700 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {size === 'COMPACT' ? 'صغير' : size === 'MEDIUM' ? 'متوسط (افتراضي)' : 'كبير بارز'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Button Layout */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-black text-slate-300 block">تخطيط الأزرار الرئيسية:</span>
                <div className="grid grid-cols-2 gap-2">
                  {(['SINGLE', 'DOUBLE'] as ButtonLayout[]).map((layout) => (
                    <button
                      key={layout}
                      onClick={() => updateButtonLayout(layout)}
                      className={`py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        uiConfig.buttonLayout === layout
                          ? 'bg-purple-700 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {layout === 'SINGLE' ? 'عمود واحد كامل' : 'عمودان متجاوران (شبكة)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Shortcuts Bar Toggle */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-white block">شريط الاختصارات السريعة (2x2)</span>
                  <span className="text-xs text-slate-400">إظهار كروت محول العملات والعملاء والحاسبة بأعلى الشاشة</span>
                </div>
                <input
                  type="checkbox"
                  checked={uiConfig.showQuickShortcutsBar}
                  onChange={(e) => toggleQuickShortcutsBar(e.target.checked)}
                  className="w-5 h-5 rounded accent-purple-600 cursor-pointer"
                />
              </div>

              {/* Action Buttons Visibility & Shortcut Toggles */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2.5">
                <span className="text-xs font-black text-slate-300 block">إدارة ظهور أزرار التطبيق:</span>
                <div className="space-y-1.5 divide-y divide-slate-800">
                  {uiConfig.buttons.map(btn => (
                    <div key={btn.id} className="pt-2 flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-2">
                        <span>{btn.iconEmoji}</span>
                        {btn.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleButtonQuickShortcut(btn.id)}
                          className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer ${
                            btn.isQuickShortcut
                              ? 'bg-amber-900/60 text-amber-300 border border-amber-600'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          اختصار سريع
                        </button>
                        <button
                          onClick={() => toggleButtonVisibility(btn.id)}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                            btn.isVisible
                              ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-600/60 hover:bg-emerald-900/80'
                              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                          }`}
                          title={btn.isVisible ? 'انقر لإخفاء الزر من الواجهة الرئيسية' : 'انقر لإظهار وتفعيل الزر في الواجهة الرئيسية'}
                        >
                          {btn.isVisible ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
                          <span>{btn.isVisible ? 'ظاهر' : 'مخفي'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={resetUiCustomizationToDefault}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                استعادة الترتيب الافتراضي للأزرار
              </button>
            </div>
          )}

          {/* TAB 4: Reports Customizer */}
          {activeTab === 'REPORT' && (
            <div className="space-y-4 max-w-2xl mx-auto text-xs">
              {/* Font Family */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-black text-slate-300 block">نوع خط التقارير والفواتير:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Cairo', 'Tajawal', 'Almarai', 'Amiri'].map(font => (
                    <button
                      key={font}
                      onClick={() => updateReportFontFamily(font)}
                      className={`py-2 rounded-lg font-bold transition-colors cursor-pointer ${
                        reportConfig.fontFamily === font
                          ? 'bg-purple-700 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Scale */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-black text-slate-300">مقياس حجم الخط في التقرير:</span>
                  <span className="font-black text-purple-400">{reportConfig.fontScalePercent}%</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="160"
                  value={reportConfig.fontScalePercent}
                  onChange={(e) => updateReportFontScale(parseInt(e.target.value, 10) / 100)}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              {/* Elements Visibility */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2.5">
                <span className="font-black text-slate-300 block">إظهار وإخفاء عناصر التقرير:</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'showLogo', label: 'شعار المتجر' },
                    { key: 'showStoreInfo', label: 'بيانات المتجر' },
                    { key: 'showDateTime', label: 'التاريخ والوقت' },
                    { key: 'showBranch', label: 'الفرع' },
                    { key: 'showAmountInWords', label: 'المبلغ كتابة (تفقيط)' },
                    { key: 'showWatermark', label: 'العلامة المائية' },
                    { key: 'showTermsAndNotes', label: 'الشروط والملاحظات' },
                    { key: 'showSignatures', label: 'التوقيعات' },
                    { key: 'showStampSeal', label: 'الختم الإلكتروني' },
                  ].map(elem => (
                    <label key={elem.key} className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800 cursor-pointer">
                      <span className="text-slate-300 font-semibold">{elem.label}</span>
                      <input
                        type="checkbox"
                        checked={!!(reportConfig as any)[elem.key]}
                        onChange={(e) => toggleReportElement(elem.key, e.target.checked)}
                        className="rounded accent-purple-600"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* 🎨 تخصيص الألوان وتظليل الحقول والنصوص المظللة */}
              <div className="bg-slate-900 p-4 rounded-xl border border-purple-800/60 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-black text-sm text-purple-300 flex items-center gap-1.5">
                    <span>🎨</span> تخصيص الألوان وتظليل الحقول والنصوص المظللة
                  </span>
                  <span className="text-[11px] text-slate-400">تُطبق على الفاتورة، كشف الحساب، وسند القبض والصرف</span>
                </div>

                {/* Live Preview Box */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 block">معاينة مباشرة للحقل المظلل:</span>
                  <div
                    className="p-3 rounded-lg border-2 text-center transition-all duration-150"
                    style={{
                      backgroundColor: reportConfig.tableHeaderBgHex || '#EBF5FB',
                      borderColor: reportConfig.tableBorderColorHex || '#0070BA',
                      color: reportConfig.tableHeaderTextColorHex || reportConfig.primaryTextColorHex || '#111827',
                    }}
                  >
                    <span className="font-black text-sm block">نموذج الحقل المظلل والنصوص</span>
                    <span className="text-xs font-bold opacity-80">هكذا سيظهر تظليل الجداول وسندات القبض والصرف والفواتير</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* 1. Shaded Field Background Color */}
                  <div className="space-y-2 p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-200">لون تظليل خلفية الحقول:</label>
                      <input
                        type="color"
                        value={reportConfig.tableHeaderBgHex || '#EBF5FB'}
                        onChange={(e) => updateReportConfig({ ...reportConfig, tableHeaderBgHex: e.target.value })}
                        className="w-8 h-8 rounded border border-slate-700 cursor-pointer bg-transparent"
                      />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: 'سماوي', hex: '#EBF5FB' },
                        { label: 'أزرق ناعم', hex: '#E0F2FE' },
                        { label: 'بنفسجي', hex: '#F3E8FF' },
                        { label: 'عنبري', hex: '#FEF3C7' },
                        { label: 'زمردي', hex: '#ECFDF5' },
                        { label: 'رمادي', hex: '#F1F5F9' },
                        { label: 'وردي', hex: '#FFF1F2' },
                        { label: 'أبيض', hex: '#FFFFFF' },
                      ].map(c => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => updateReportConfig({ ...reportConfig, tableHeaderBgHex: c.hex })}
                          className={`px-2 py-1 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                            (reportConfig.tableHeaderBgHex || '#EBF5FB').toLowerCase() === c.hex.toLowerCase()
                              ? 'border-purple-400 text-white bg-purple-900/60'
                              : 'border-slate-700 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Shaded Text Color */}
                  <div className="space-y-2 p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-200">لون النصوص المظللة:</label>
                      <input
                        type="color"
                        value={reportConfig.tableHeaderTextColorHex || '#111827'}
                        onChange={(e) => updateReportConfig({ ...reportConfig, tableHeaderTextColorHex: e.target.value })}
                        className="w-8 h-8 rounded border border-slate-700 cursor-pointer bg-transparent"
                      />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: 'أسود داكن', hex: '#111827' },
                        { label: 'كحلي', hex: '#1E3A8A' },
                        { label: 'بنفسجي غامق', hex: '#4C1D95' },
                        { label: 'أخضر داكن', hex: '#065F46' },
                        { label: 'عنابي', hex: '#991B1B' },
                        { label: 'رمادي داكن', hex: '#374151' },
                      ].map(c => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => updateReportConfig({ ...reportConfig, tableHeaderTextColorHex: c.hex })}
                          className={`px-2 py-1 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                            (reportConfig.tableHeaderTextColorHex || '#111827').toLowerCase() === c.hex.toLowerCase()
                              ? 'border-purple-400 text-white bg-purple-900/60'
                              : 'border-slate-700 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Table & Field Border Color */}
                  <div className="space-y-2 p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-200">لون حدود وإطار الجداول:</label>
                      <input
                        type="color"
                        value={reportConfig.tableBorderColorHex || '#0070BA'}
                        onChange={(e) => updateReportConfig({ ...reportConfig, tableBorderColorHex: e.target.value })}
                        className="w-8 h-8 rounded border border-slate-700 cursor-pointer bg-transparent"
                      />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: 'أزرق المملكة', hex: '#0070BA' },
                        { label: 'كحلي', hex: '#1E40AF' },
                        { label: 'بنفسجي', hex: '#7C3AED' },
                        { label: 'زمردي', hex: '#059669' },
                        { label: 'أحمر', hex: '#DC2626' },
                        { label: 'رمادي', hex: '#64748B' },
                      ].map(c => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => updateReportConfig({ ...reportConfig, tableBorderColorHex: c.hex })}
                          className={`px-2 py-1 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                            (reportConfig.tableBorderColorHex || '#0070BA').toLowerCase() === c.hex.toLowerCase()
                              ? 'border-purple-400 text-white bg-purple-900/60'
                              : 'border-slate-700 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4. Header & Title Color */}
                  <div className="space-y-2 p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-200">لون ترويسة التقرير والعناوين:</label>
                      <input
                        type="color"
                        value={reportConfig.headerColorHex || '#5E258D'}
                        onChange={(e) => updateReportConfig({ ...reportConfig, headerColorHex: e.target.value })}
                        className="w-8 h-8 rounded border border-slate-700 cursor-pointer bg-transparent"
                      />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: 'بنفسجي ملكي', hex: '#5E258D' },
                        { label: 'كحلي غامق', hex: '#0F172A' },
                        { label: 'أزرق بحري', hex: '#0369A1' },
                        { label: 'أخضر غامق', hex: '#064E3B' },
                        { label: 'أحمر قرمزي', hex: '#881337' },
                      ].map(c => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => updateReportConfig({ ...reportConfig, headerColorHex: c.hex })}
                          className={`px-2 py-1 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                            (reportConfig.headerColorHex || '#5E258D').toLowerCase() === c.hex.toLowerCase()
                              ? 'border-purple-400 text-white bg-purple-900/60'
                              : 'border-slate-700 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Signatures Name inputs */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">اسم المحاسب (للتوقيع)</label>
                  <input
                    type="text"
                    value={reportConfig.accountantSignatureName}
                    onChange={(e) => updateReportConfig({ ...reportConfig, accountantSignatureName: e.target.value })}
                    className="w-full h-9 px-3 bg-slate-950 rounded border border-slate-700 font-bold text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">اسم المدير (للتوقيع)</label>
                  <input
                    type="text"
                    value={reportConfig.managerSignatureName}
                    onChange={(e) => updateReportConfig({ ...reportConfig, managerSignatureName: e.target.value })}
                    className="w-full h-9 px-3 bg-slate-950 rounded border border-slate-700 font-bold text-white text-xs"
                  />
                </div>
              </div>

              <button
                onClick={resetReportCustomizationToDefault}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                استعادة الإعدادات الافتراضية للتقارير
              </button>
            </div>
          )}

          {/* TAB 5: Local Backup Snapshots & Import/Export */}
          {activeTab === 'BACKUP' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              {/* File Export / Import */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                <span className="font-black text-sm text-white block">ملفات النسخ الاحتياطي (JSON)</span>
                <p className="text-xs text-slate-400">
                  يمكنك تصدير نسخة كاملة من قاعدة البيانات تشمل جميع الفواتير والعملاء والإعدادات وحفظها على جهازك أو استيرادها في أي وقت.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleDownloadBackupFile}
                    className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    تحميل ملف النسخة الاحتياطية (Export)
                  </button>

                  <label className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer border border-slate-700">
                    <Upload className="w-4 h-4" />
                    استيراد نسخة احتياطية (Import)
                    <input type="file" accept=".json" onChange={handleImportBackupFile} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Local Snapshots (Equivalent to Room Database Snapshots) */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                <span className="font-black text-sm text-white block">النسخ الاحتياطي المحلي السريع (قاعدة البيانات)</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSnapshotTitle}
                    onChange={(e) => setNewSnapshotTitle(e.target.value)}
                    placeholder="مسمى النسخة (مثال: قبل نهاية الشهر)..."
                    className="flex-1 h-10 px-3 bg-slate-950 rounded-xl border border-slate-700 text-xs font-bold text-white"
                  />
                  <button
                    onClick={() => {
                      createLocalRoomBackup(newSnapshotTitle);
                      setNewSnapshotTitle('');
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    <Save className="w-4 h-4" />
                    إنشاء نسخة محلياً
                  </button>
                </div>

                <div className="space-y-2 pt-2 divide-y divide-slate-800">
                  {roomSnapshots.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs font-bold">
                      لا توجد نسخ احتياطية محلية محفوظة بعد.
                    </div>
                  ) : (
                    roomSnapshots.map(s => (
                      <div key={s.id} className="pt-2 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-white block">{s.title}</span>
                          <span className="text-[11px] text-slate-400">
                            {s.timestamp} | {s.invoiceCount} فاتورة | {s.customerCount} عميل
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من استعادة النسخة (${s.title})؟ سيتم استبدال البيانات الحالية.`)) {
                                restoreFromRoomSnapshot(s);
                              }
                            }}
                            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[11px] cursor-pointer"
                          >
                            استعادة
                          </button>
                          <button
                            onClick={() => deleteRoomSnapshot(s.id)}
                            className="p-1.5 text-red-400 hover:bg-slate-800 rounded cursor-pointer"
                            title="حذف النسخة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Theme Presets */}
          {activeTab === 'THEME' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <span className="text-xs font-black text-slate-300 block">اختر ثيم ألوان النظام:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'ROYAL_PURPLE', title: 'المملكة الملكي 👑', desc: 'البنفسجي الفاخر مع لمسات ملكية مذهبة', color: 'from-[#5E258D] to-[#8B5CF6]' },
                  { id: 'MODERN_NAVY', title: 'الكحلي العصري 💎', desc: 'أزرق كحلي عميق مع أزرق سماوي احترافي', color: 'from-[#0F172A] to-[#0284C7]' },
                  { id: 'EMERALD_PRO', title: 'الزمرد المالي 🌿', desc: 'أخضر زمردي مع درجات النعناع المنعشة', color: 'from-[#065F46] to-[#10B981]' },
                  { id: 'DARK_LUXURY', title: 'الفخامة الداكنة 🖤', desc: 'مظهر أسود ليلي فخم مع ذهبي لامع مريح للعين', color: 'from-[#18181B] to-[#3F3F46]' },
                  { id: 'IMPERIAL_RUBY', title: 'الياقوت الإمبراطوري 🔴', desc: 'أحمر قرمزي نبيذي دافئ وأنيق', color: 'from-[#881337] to-[#E11D48]' },
                  { id: 'SUNSET_GOLD', title: 'الغروب الذهبي 🌅', desc: 'برتقالي عنبري دافئ وذهبي مشرق', color: 'from-[#C2410C] to-[#F97316]' },
                ].map(th => (
                  <div
                    key={th.id}
                    onClick={() => setAppThemePreset(th.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      uiConfig.themePresetId === th.id
                        ? 'bg-slate-800 border-purple-500 ring-2 ring-purple-500/40'
                        : 'bg-slate-900 border-slate-800 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${th.color} shrink-0 shadow-md`} />
                      <div>
                        <span className="font-black text-sm text-white block">{th.title}</span>
                        <span className="text-xs text-slate-400">{th.desc}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Credit */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-bold">
          <span className="text-purple-400">✨ المطور عبد العزيز راجح</span>
          <span className="text-slate-500">نظام المملكة للإلكترونيات</span>
        </div>
      </div>
    </div>
  );
};
