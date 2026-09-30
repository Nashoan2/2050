import { TransactionRecord } from '../types';

export const ArabicNumberHelper = {
  toEngDigits(str?: string | null): string {
    if (!str) return '';
    const arabicChars = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    let result = '';
    for (const ch of str) {
      const idx = arabicChars.indexOf(ch);
      if (idx !== -1) {
        result += idx;
      } else {
        result += ch;
      }
    }
    return result;
  },

  formatAmount(value: number): string {
    if (isNaN(value)) return '0';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  },

  formatDateTime(date: Date = new Date()): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  },

  formatReportDateTime(date: Date = new Date()): string {
    return this.formatDateTime(date);
  },

  formatDateOnly(date: Date = new Date()): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  },

  formatTo24HourDateTime(dateTimeStr: string): string {
    const clean = this.toEngDigits(dateTimeStr).trim();
    const parsed = this.parseDate(clean);
    if (parsed) {
      return this.formatDateTime(parsed);
    }
    return clean
      .replace(/\s*[AP]M?\b/gi, '')
      .replace('مساءً', '')
      .replace('صباحاً', '')
      .replace('م', '')
      .replace('ص', '')
      .trim();
  },

  parseDate(dateStr: string): Date | null {
    if (!dateStr) return null;
    let clean = this.toEngDigits(dateStr).trim()
      .replace(/\bA\b/gi, 'AM')
      .replace(/\bP\b/gi, 'PM')
      .replace('مساءً', 'PM')
      .replace('صباحاً', 'AM')
      .replace('م', 'PM')
      .replace('ص', 'AM');

    // Check if ISO formatted (yyyy-mm-dd)
    if (/^\d{4}-\d{2}-\d{2}/.test(clean)) {
      const d = new Date(clean);
      if (!isNaN(d.getTime())) return d;
    }

    // Pattern dd/MM/yyyy or dd/MM/yyyy HH:mm
    const slashParts = clean.split(/[\s-]+/);
    if (slashParts.length > 0 && slashParts[0].includes('/')) {
      const dateParts = slashParts[0].split('/');
      if (dateParts.length === 3) {
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1;
        const year = parseInt(dateParts[2], 10);
        let hours = 0;
        let minutes = 0;

        if (slashParts.length > 1 && slashParts[1].includes(':')) {
          const timeParts = slashParts[1].split(':');
          hours = parseInt(timeParts[0], 10) || 0;
          minutes = parseInt(timeParts[1], 10) || 0;

          // Check if PM
          if (clean.toUpperCase().includes('PM') && hours < 12) {
            hours += 12;
          } else if (clean.toUpperCase().includes('AM') && hours === 12) {
            hours = 0;
          }
        }

        const d = new Date(year, month, day, hours, minutes);
        if (!isNaN(d.getTime())) return d;
      }
    }

    const fallback = new Date(clean);
    return isNaN(fallback.getTime()) ? null : fallback;
  },

  getCurrencyName(curr: string): string {
    const c = curr?.toUpperCase().trim() || '';
    if (c === '$' || c === 'USD' || c.includes('دولار')) return 'دولار أمريكي';
    if (c === 'SAR' || c === 'SR' || c.includes('سعود')) return 'ريال سعودي';
    if (c === 'YER' || c === 'YR' || c.includes('يمن')) return 'ريال يمني';
    return curr || 'ريال يمني';
  },

  getCurrencySymbol(curr: string): string {
    const clean = curr?.toUpperCase().trim() || '';
    if (clean.includes('YER') || clean === 'YR' || clean.includes('يمن')) return 'YR';
    if (clean.includes('SAR') || clean === 'SR' || clean.includes('سعود')) return 'SR';
    if (clean.includes('USD') || clean === '$' || clean.includes('دولار')) return '$';
    return curr || '$';
  },

  numberToArabicWords(value: number): string {
    const absVal = Math.abs(value);
    if (absVal === 0) return 'صفر';
    const n = Math.floor(absVal);

    const units = [
      '', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة',
      'عشرة', 'إحدى عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر',
      'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'
    ];
    const tens = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
    const hundreds = [
      '', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'
    ];

    function convertGroup(num: number): string {
      let str = '';
      const h = Math.floor(num / 100);
      const rem = num % 100;
      if (h >= 1 && h <= 9) {
        str += hundreds[h];
      }
      if (rem > 0) {
        if (str.length > 0) str += ' و';
        if (rem < 20) {
          str += units[rem];
        } else {
          const t = Math.floor(rem / 10);
          const u = rem % 10;
          if (u > 0) {
            str += units[u] + ' و' + tens[t];
          } else {
            str += tens[t];
          }
        }
      }
      return str;
    }

    const millions = Math.floor(n / 1000000);
    const remMillions = n % 1000000;
    const thousands = Math.floor(remMillions / 1000);
    const remainder = remMillions % 1000;

    const parts: string[] = [];

    if (millions > 0) {
      if (millions === 1) parts.push('مليون');
      else if (millions === 2) parts.push('مليونان');
      else if (millions >= 3 && millions <= 10) parts.push(convertGroup(millions) + ' ملايين');
      else parts.push(convertGroup(millions) + ' مليوناً');
    }

    if (thousands > 0) {
      if (thousands === 1) parts.push('ألف');
      else if (thousands === 2) parts.push('ألفان');
      else if (thousands >= 3 && thousands <= 10) parts.push(convertGroup(thousands) + ' آلاف');
      else parts.push(convertGroup(thousands) + ' ألفاً');
    }

    if (remainder > 0) {
      parts.push(convertGroup(remainder));
    }

    return parts.length > 0 ? parts.join(' و') : 'صفر';
  },

  formatTransactionType(t: TransactionRecord): string {
    const cleanType = (t.type || '').trim();
    let num = t.voucherNum ? this.toEngDigits(t.voucherNum).trim() : '';

    if (!num) {
      const note = this.toEngDigits(t.note || '');
      const match = /(?:رقم\s*\(?|#|\()(\d+)\)?/.exec(note);
      if (match) {
        num = match[1].trim();
      }
    }

    if (cleanType.includes('فاتور')) {
      return num ? `فاتورة ${num}` : 'فاتورة';
    }
    if (cleanType.includes('قبض')) {
      return num ? `قبض ${num}` : 'قبض';
    }
    if (cleanType.includes('صرف')) {
      return num ? `صرف ${num}` : 'صرف';
    }
    if (cleanType.includes('افتتاح')) {
      return 'افتتاحي';
    }
    return num ? `${cleanType} ${num}` : cleanType;
  },

  formatShortTransactionType(t: TransactionRecord): string {
    const cleanType = (t.type || '').trim();
    let num = t.voucherNum ? this.toEngDigits(t.voucherNum).trim() : '';

    if (!num) {
      const note = this.toEngDigits(t.note || '');
      const match = /(?:رقم\s*\(?|#|\()(\d+)\)?/.exec(note);
      if (match) {
        num = match[1].trim();
      }
    }

    if (cleanType.includes('فاتور')) {
      return num ? `ف ${num}` : 'ف';
    }
    if (cleanType.includes('قبض')) {
      return num ? `ق ${num}` : 'ق';
    }
    if (cleanType.includes('صرف')) {
      return num ? `ص ${num}` : 'ص';
    }
    if (cleanType.includes('افتتاح')) {
      return 'افتتاحي';
    }
    return num ? `${cleanType} ${num}` : cleanType;
  },

  cleanStatementNote(note: string): string {
    const trimmed = (note || '').trim();
    if (!trimmed) return '';
    const cleaned = trimmed.replace(
      /^(?:سند\s+رقم\s*(?:\([^)]*\)|\d+)\s*[-–—:]\s*|فاتورة\s+رقم\s*(?:\([^)]*\)|\d+)\s*[-–—:]\s*)/,
      ''
    ).trim();
    if (/^(?:سند\s+رقم\s*(?:\([^)]*\)|\d+)|فاتورة\s+رقم\s*(?:\([^)]*\)|\d+)|فاتورة)$/.test(cleaned)) {
      return '';
    }
    return cleaned;
  }
};
