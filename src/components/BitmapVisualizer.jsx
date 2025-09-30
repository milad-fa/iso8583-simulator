import React from 'react';
import { Check } from 'lucide-react';

export default function BitmapVisualizer({ activeFields = [] }) {
  const renderBit = (index) => {
    const fieldNum = index + 2; // Field numbers start from 2
    const isActive = activeFields.includes(fieldNum);
    
    return (
      <div
        key={index}
        style={{
          width: '100%',
          aspectRatio: '1',
          background: isActive 
            ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
            : 'var(--bg-tertiary)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          fontWeight: 600,
          color: isActive ? 'white' : 'var(--text-muted)',
          border: isActive 
            ? '2px solid rgba(34, 197, 94, 0.5)'
            : '1px solid rgba(255, 255, 255, 0.05)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          position: 'relative',
        }}
        title={`فیلد ${fieldNum}`}
        className={isActive ? 'pulse' : ''}
      >
        {isActive ? <Check size={14} /> : fieldNum}
      </div>
    );
  };

  return (
    <div className="card">
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          نقشه بیتی (Bitmap)
        </h3>
        <p style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
        }}>
          فیلدهای فعال در پیام به صورت بصری
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(16, 1fr)',
        gap: '6px',
        marginBottom: '16px',
      }}>
        {Array.from({ length: 64 }, (_, i) => renderBit(i))}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        background: 'var(--bg-secondary)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Check size={16} color="white" />
          </div>
          <div>
            <div style={{
              fontSize: '24px',
              fontWeight: 800,
              color: 'var(--success)',
            }}>
              {activeFields.length}
            </div>
            <div style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
            }}>
              فیلد فعال
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              borderRadius: '4px',
            }} />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              فعال
            </span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              background: 'var(--bg-tertiary)',
              borderRadius: '4px',
            }} />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              غیرفعال
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
