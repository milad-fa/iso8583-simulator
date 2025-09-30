import React from 'react';
import { Eye, Code, FileText, Package } from 'lucide-react';
import { MTI_TYPES, ISO_FIELDS, RESPONSE_CODES } from '../data/fields';
import { formatCardNumber, formatAmount, messageToHex } from '../utils/iso8583';

export default function MessageViewer({ message }) {
  if (!message) {
    return (
      <div className="card" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px',
        textAlign: 'center',
      }}>
        <Package size={64} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
        <h3 style={{
          fontSize: '18px',
          fontWeight: 700,
          color: 'var(--text-secondary)',
          marginBottom: '8px',
        }}>
          هنوز پیامی ساخته نشده
        </h3>
        <p style={{
          fontSize: '14px',
          color: 'var(--text-muted)',
        }}>
          یک پیام جدید بسازید تا اینجا نمایش داده شود
        </p>
      </div>
    );
  }

  const mtiInfo = MTI_TYPES[message.mti];
  const hex = messageToHex(message);

  return (
    <div className="card">
      {/* هدر پیام */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px',
        padding: '20px',
        background: 'var(--bg-secondary)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          background: `linear-gradient(135deg, ${mtiInfo?.color || '#6366f1'} 0%, ${mtiInfo?.color || '#8b5cf6'} 100%)`,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 4px 12px ${mtiInfo?.color || '#6366f1'}40`,
        }}>
          <Eye size={28} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '28px',
            fontWeight: 800,
            color: mtiInfo?.color || 'var(--primary)',
            fontFamily: 'monospace',
            marginBottom: '4px',
          }}>
            {message.mti}
          </div>
          <div style={{
            fontSize: '15px',
            color: 'var(--text-secondary)',
            fontWeight: 600,
          }}>
            {mtiInfo?.name || 'نامشخص'}
          </div>
          <div style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            marginTop: '2px',
          }}>
            {mtiInfo?.category || ''}
          </div>
        </div>
      </div>

      {/* نمایش Hex */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px',
        }}>
          <Code size={18} color="var(--primary)" />
          <h4 style={{
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}>
            پیام Hex
          </h4>
        </div>
        <div style={{
          padding: '16px',
          background: 'var(--bg-secondary)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          fontFamily: 'monospace',
          fontSize: '13px',
          color: 'var(--primary)',
          wordBreak: 'break-all',
          lineHeight: '1.8',
          direction: 'ltr',
          textAlign: 'left',
        }}>
          {hex}
        </div>
      </div>

      {/* فیلدها */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
        }}>
          <FileText size={18} color="var(--primary)" />
          <h4 style={{
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}>
            فیلدهای پیام
          </h4>
          <span className="badge badge-info">
            {Object.keys(message.fields).length} فیلد
          </span>
        </div>

        <div style={{
          display: 'grid',
          gap: '12px',
        }}>
          {Object.entries(message.fields).sort((a, b) => parseInt(a[0]) - parseInt(b[0])).map(([fieldNum, value]) => {
            const field = ISO_FIELDS[fieldNum];
            if (!field) return null;

            // فرمت کردن مقدار
            let displayValue = value;
            if (fieldNum === '2' || fieldNum === '35') {
              displayValue = formatCardNumber(value, field.mask);
            } else if (fieldNum === '4') {
              displayValue = formatAmount(value) + ' ریال';
            } else if (fieldNum === '39') {
              const responseInfo = RESPONSE_CODES[value];
              if (responseInfo) {
                displayValue = (
                  <span className={`badge badge-${responseInfo.type}`}>
                    {value} - {responseInfo.text}
                  </span>
                );
              }
            }

            return (
              <div
                key={fieldNum}
                style={{
                  padding: '16px',
                  background: 'var(--bg-secondary)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.3s ease',
                }}
                className="fade-in"
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '28px',
                      height: '28px',
                      background: 'var(--primary)',
                      color: 'white',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}>
                      {fieldNum}
                    </span>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                    }}>
                      {field.name}
                    </span>
                  </div>
                  {field.required && (
                    <span className="badge badge-error" style={{ fontSize: '11px' }}>
                      الزامی
                    </span>
                  )}
                </div>

                <div style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '8px',
                  fontFamily: fieldNum === '39' ? 'inherit' : 'monospace',
                }}>
                  {displayValue}
                </div>

                <div style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                }}>
                  {field.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
