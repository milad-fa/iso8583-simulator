import { ISO_FIELDS } from '../data/fields';

/**
 * تبدیل عدد به رشته با padding
 */
export function padNumber(num, length) {
  return String(num).padStart(length, '0');
}

/**
 * محاسبه bitmap از فیلدهای موجود
 */
export function calculateBitmap(fields) {
  const bitmap = new Array(128).fill(0);
  
  Object.keys(fields).forEach(fieldNum => {
    const num = parseInt(fieldNum);
    if (num > 1 && num <= 128) {
      bitmap[num - 1] = 1;
    }
  });
  
  // تبدیل به hex
  let hex = '';
  for (let i = 0; i < 128; i += 4) {
    const nibble = bitmap.slice(i, i + 4).join('');
    hex += parseInt(nibble, 2).toString(16).toUpperCase();
  }
  
  return hex;
}

/**
 * پارس bitmap از hex
 */
export function parseBitmap(bitmapHex) {
  const fields = [];
  const binary = parseInt(bitmapHex, 16).toString(2).padStart(128, '0');
  
  for (let i = 0; i < binary.length; i++) {
    if (binary[i] === '1') {
      fields.push(i + 2); // Field numbers start from 2
    }
  }
  
  return fields;
}

/**
 * فرمت کردن مبلغ
 */
export function formatAmount(amount) {
  const num = parseInt(amount) || 0;
  return num.toLocaleString('fa-IR');
}

/**
 * فرمت کردن شماره کارت
 */
export function formatCardNumber(pan, mask = false) {
  if (!pan) return '';
  
  const cleaned = pan.replace(/\s/g, '');
  
  if (mask) {
    return cleaned.replace(/^(\d{4})(\d{2})\d{6}(\d{4})$/, '$1-$2**-****-$3');
  }
  
  return cleaned.replace(/(\d{4})/g, '$1-').slice(0, -1);
}

/**
 * اعتبارسنجی شماره کارت با الگوریتم Luhn
 */
export function validateCardNumber(pan) {
  if (!pan) return false;
  
  const cleaned = pan.replace(/\D/g, '');
  if (cleaned.length < 13 || cleaned.length > 19) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

/**
 * ساخت تاریخ و زمان ISO 8583
 */
export function getISO8583DateTime() {
  const now = new Date();
  
  const month = padNumber(now.getMonth() + 1, 2);
  const day = padNumber(now.getDate(), 2);
  const hours = padNumber(now.getHours(), 2);
  const minutes = padNumber(now.getMinutes(), 2);
  const seconds = padNumber(now.getSeconds(), 2);
  
  return {
    transmissionDateTime: month + day + hours + minutes + seconds, // Field 7
    localTime: hours + minutes + seconds, // Field 12
    localDate: month + day, // Field 13
  };
}

/**
 * تولید STAN (System Trace Audit Number)
 */
export function generateSTAN() {
  return padNumber(Math.floor(Math.random() * 999999) + 1, 6);
}

/**
 * تولید RRN (Retrieval Reference Number)
 */
export function generateRRN() {
  const timestamp = Date.now().toString().slice(-10);
  const random = Math.floor(Math.random() * 100);
  return timestamp + padNumber(random, 2);
}

/**
 * پارس کردن تاریخ ISO 8583
 */
export function parseISO8583Date(dateStr) {
  if (!dateStr || dateStr.length !== 4) return '';
  
  const month = dateStr.substring(0, 2);
  const day = dateStr.substring(2, 4);
  
  const monthNames = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر',
    'مرداد', 'شهریور', 'مهر', 'آبان',
    'آذر', 'دی', 'بهمن', 'اسفند'
  ];
  
  return `${day} ${monthNames[parseInt(month) - 1]}`;
}

/**
 * پارس کردن زمان ISO 8583
 */
export function parseISO8583Time(timeStr) {
  if (!timeStr || timeStr.length !== 6) return '';
  
  const hours = timeStr.substring(0, 2);
  const minutes = timeStr.substring(2, 4);
  const seconds = timeStr.substring(4, 6);
  
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * ساخت پیام ISO 8583
 */
export function buildMessage(mti, fields) {
  let message = {
    mti: mti,
    bitmap: calculateBitmap(fields),
    fields: { ...fields }
  };
  
  // اضافه کردن فیلدهای خودکار
  if (!fields[7]) {
    const dateTime = getISO8583DateTime();
    message.fields[7] = dateTime.transmissionDateTime;
  }
  
  if (!fields[11]) {
    message.fields[11] = generateSTAN();
  }
  
  if (!fields[37] && (mti === '0200' || mti === '0400')) {
    message.fields[37] = generateRRN();
  }
  
  return message;
}

/**
 * تبدیل پیام به Hex
 */
export function messageToHex(message) {
  let hex = message.mti;
  hex += message.bitmap;
  
  Object.keys(message.fields).sort((a, b) => parseInt(a) - parseInt(b)).forEach(fieldNum => {
    const field = ISO_FIELDS[fieldNum];
    const value = message.fields[fieldNum];
    
    if (!field) return;
    
    // اضافه کردن طول برای LLVAR و LLLVAR
    if (field.format === 'llvar') {
      hex += padNumber(value.length, 2);
    } else if (field.format === 'lllvar') {
      hex += padNumber(value.length, 3);
    }
    
    // تبدیل value به hex (ساده‌سازی شده)
    hex += value;
  });
  
  return hex;
}

/**
 * پارس پیام از Hex
 */
export function parseMessageFromHex(hex) {
  try {
    const mti = hex.substring(0, 4);
    const bitmap = hex.substring(4, 36);
    const activeFields = parseBitmap(bitmap);
    
    const message = {
      mti: mti,
      bitmap: bitmap,
      fields: {}
    };
    
    let position = 36;
    
    activeFields.forEach(fieldNum => {
      const field = ISO_FIELDS[fieldNum];
      if (!field) return;
      
      let length = field.length;
      
      // خواندن طول برای فیلدهای متغیر
      if (field.format === 'llvar') {
        length = parseInt(hex.substring(position, position + 2));
        position += 2;
      } else if (field.format === 'lllvar') {
        length = parseInt(hex.substring(position, position + 3));
        position += 3;
      }
      
      message.fields[fieldNum] = hex.substring(position, position + length);
      position += length;
    });
    
    return message;
  } catch (error) {
    throw new Error('خطا در پارس پیام: ' + error.message);
  }
}

/**
 * اعتبارسنجی فیلد
 */
export function validateField(fieldNum, value) {
  const field = ISO_FIELDS[fieldNum];
  if (!field) return { valid: false, error: 'فیلد تعریف نشده' };
  
  // بررسی خالی بودن فیلد ضروری
  if (field.required && !value) {
    return { valid: false, error: 'این فیلد الزامی است' };
  }
  
  // بررسی طول
  if (field.format === 'fixed' && value && value.length !== field.length) {
    return { valid: false, error: `طول باید ${field.length} کاراکتر باشد` };
  }
  
  if (value && value.length > field.length) {
    return { valid: false, error: `حداکثر طول: ${field.length} کاراکتر` };
  }
  
  // بررسی نوع داده
  if (value && field.type === 'n' && !/^\d+$/.test(value)) {
    return { valid: false, error: 'فقط عدد مجاز است' };
  }
  
  // بررسی ویژه برای شماره کارت
  if (fieldNum === 2 && value && !validateCardNumber(value)) {
    return { valid: false, error: 'شماره کارت نامعتبر است' };
  }
  
  return { valid: true };
}

/**
 * تولید داده تستی
 */
export function generateTestData(mti = '0200') {
  const dateTime = getISO8583DateTime();
  
  return {
    mti: mti,
    fields: {
      2: '6037997000000001',
      3: '000000',
      4: padNumber(Math.floor(Math.random() * 1000000), 12),
      7: dateTime.transmissionDateTime,
      11: generateSTAN(),
      12: dateTime.localTime,
      13: dateTime.localDate,
      22: '051',
      25: '00',
      37: generateRRN(),
      39: '00',
      41: 'TERM0001',
      42: 'MERCHANT0000001',
      49: '364',
    }
  };
}
