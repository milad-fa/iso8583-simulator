import React, { useState } from 'react';
import { Send, Shuffle, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { MTI_TYPES, ISO_FIELDS } from '../data/fields';
import { 
  buildMessage, 
  messageToHex, 
  validateField, 
  generateTestData,
  formatCardNumber,
  formatAmount 
} from '../utils/iso8583';

export default function MessageBuilder({ onMessageBuilt }) {
  const [selectedMTI, setSelectedMTI] = useState('0200');
  const [fields, setFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [copied, setCopied] = useState(false);

  const handleFieldChange = (fieldNum, value) => {
    setFields(prev => ({
      ...prev,
      [fieldNum]: value
    }));

    // اعتبارسنجی
    const validation = validateField(fieldNum, value);
    setValidationErrors(prev => ({
      ...prev,
      [fieldNum]: validation.valid ? null : validation.error
    }));
  };

  const handleBuildMessage = () => {
    const message = buildMessage(selectedMTI, fields);
    onMessageBuilt(message);
  };

  const handleGenerateTest = () => {
    const testData = generateTestData(selectedMTI);
    setFields(testData.fields);
    onMessageBuilt(testData);
  };

  const handleCopyHex = () => {
    const message = buildMessage(selectedMTI, fields);
    const hex = messageToHex(message);
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const commonFields = [2, 3, 4, 7, 11, 37, 39, 41, 42, 49];

  return (
    <div className="card">
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '8px',
        }}>
          ساخت پیام جدید
        </h3>
        <p style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
        }}>
          فیلدهای مورد نیاز را پر کنید و پیام ISO 8583 بسازید
        </p>
      </div>

      {/* انتخاب MTI */}
      <div style={{ marginBottom: '24px' }}>
        <label className="label">نوع پیام (MTI)</label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
        }}>
          {Object.entries(MTI_TYPES).map(([code, info]) => (
            <div
              key={code}
              onClick={() => setSelectedMTI(code)}
              style={{
                padding: '16px',
                background: selectedMTI === code 
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)'
                  : 'var(--bg-secondary)',
                borderRadius: '12px',
                border: selectedMTI === code
                  ? '2px solid var(--primary)'
                  : '1px solid rgba(255, 255, 255, 0.05)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{
                fontSize: '18px',
                fontWeight: 700,
                color: info.color,
                marginBottom: '4px',
                fontFamily: 'monospace',
              }}>
                {code}
              </div>
              <div style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                fontWeight: 600,
              }}>
                {info.name}
              </div>
              <div style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                marginTop: '4px',
              }}>
                {info.category}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* فیلدها */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        {commonFields.map(fieldNum => {
          const field = ISO_FIELDS[fieldNum];
          if (!field) return null;

          return (
            <div key={fieldNum}>
              <label className="label">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>فیلد {fieldNum}: {field.name}</span>
                  {field.required && (
                    <span style={{ color: 'var(--error)', fontSize: '12px' }}>*</span>
                  )}
                </div>
              </label>
              <input
                type="text"
                className="input"
                placeholder={field.example}
                value={fields[fieldNum] || ''}
                onChange={(e) => handleFieldChange(fieldNum, e.target.value)}
                style={{
                  borderColor: validationErrors[fieldNum] ? 'var(--error)' : undefined,
                }}
              />
              {validationErrors[fieldNum] && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '6px',
                  color: 'var(--error)',
                  fontSize: '12px',
                }}>
                  <AlertCircle size={14} />
                  {validationErrors[fieldNum]}
                </div>
              )}
              <div style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                marginTop: '4px',
              }}>
                {field.description} • نوع: {field.type} • طول: {field.length}
              </div>
            </div>
          );
        })}
      </div>

      {/* دکمه‌های عملیات */}
      <div style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
      }}>
        <button
          className="btn btn-primary"
          onClick={handleBuildMessage}
          style={{ flex: 1, minWidth: '150px' }}
        >
          <Send size={18} />
          ساخت پیام
        </button>

        <button
          className="btn btn-secondary"
          onClick={handleGenerateTest}
          style={{ flex: 1, minWidth: '150px' }}
        >
          <Shuffle size={18} />
          تولید داده تستی
        </button>

        <button
          className="btn btn-secondary"
          onClick={handleCopyHex}
          disabled={Object.keys(fields).length === 0}
          style={{ minWidth: '150px' }}
        >
          {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
          {copied ? 'کپی شد!' : 'کپی Hex'}
        </button>
      </div>
    </div>
  );
}
