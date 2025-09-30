import React from 'react';
import { CreditCard, Zap, Github } from 'lucide-react';

export default function Header() {
  return (
    <header style={{
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
          }}>
            <CreditCard size={24} color="white" />
          </div>
          
          <div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '4px',
            }}>
              شبیه‌ساز ISO 8583
            </h1>
            <p style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <Zap size={14} />
              ابزار حرفه‌ای تست تراکنش‌های بانکی
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{
            padding: '8px 16px',
            background: 'rgba(34, 197, 94, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(34, 197, 94, 0.2)',
          }}>
            <span style={{ color: 'var(--success)', fontSize: '13px', fontWeight: 600 }}>
              نسخه 1.0.0
            </span>
          </div>
          
          <a
            href="https://github.com/milad-fa/iso8583-simulator"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
            }}
          >
            <Github size={18} />
            گیت‌هاب
          </a>
        </div>
      </div>
    </header>
  );
}
