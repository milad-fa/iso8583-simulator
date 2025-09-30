import React, { useState } from 'react';
import Header from './components/Header';
import MessageBuilder from './components/MessageBuilder';
import MessageViewer from './components/MessageViewer';
import BitmapVisualizer from './components/BitmapVisualizer';
import Statistics from './components/Statistics';
import { parseBitmap } from './utils/iso8583';

function App() {
  const [currentMessage, setCurrentMessage] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const handleMessageBuilt = (message) => {
    setCurrentMessage(message);
    
    // اضافه کردن به تاریخچه
    setTransactions(prev => [
      ...prev,
      {
        ...message,
        timestamp: new Date(),
        success: Math.random() > 0.2, // شبیه‌سازی موفقیت
        time: Math.random() * 500, // شبیه‌سازی زمان پاسخ
      }
    ]);
  };

  const activeFields = currentMessage ? parseBitmap(currentMessage.bitmap) : [];

  return (
    <div className="app">
      <Header />
      
      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '32px 24px',
      }}>
        {/* آمار */}
        <Statistics transactions={transactions} />

        {/* محتوای اصلی */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '24px',
        }}>
          {/* ستون چپ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <MessageBuilder onMessageBuilt={handleMessageBuilt} />
            <BitmapVisualizer activeFields={activeFields} />
          </div>

          {/* ستون راست */}
          <div>
            <MessageViewer message={currentMessage} />
          </div>
        </div>

        {/* راهنما */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '16px',
          }}>
            📚 راهنمای سریع
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px',
          }}>
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--primary)',
                marginBottom: '8px',
              }}>
                ۱. انتخاب نوع پیام (MTI)
              </div>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                lineHeight: '1.6',
              }}>
                نوع تراکنش خود را انتخاب کنید. برای تراکنش‌های معمولی از 0200 استفاده کنید.
              </p>
            </div>

            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--primary)',
                marginBottom: '8px',
              }}>
                ۲. پر کردن فیلدها
              </div>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                lineHeight: '1.6',
              }}>
                فیلدهای ضروری را پر کنید یا از دکمه "تولید داده تستی" استفاده کنید.
              </p>
            </div>

            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--primary)',
                marginBottom: '8px',
              }}>
                ۳. ساخت و مشاهده
              </div>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                lineHeight: '1.6',
              }}>
                روی "ساخت پیام" کلیک کنید تا پیام شما آماده شود و در سمت راست نمایش داده شود.
              </p>
            </div>
          </div>
        </div>

        {/* فوتر */}
        <div style={{
          marginTop: '48px',
          padding: '24px',
          textAlign: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        }}>
          <p style={{
            fontSize: '14px',
            color: 'var(--text-muted)',
          }}>
            ساخته شده با ❤️ برای جامعه توسعه‌دهندگان
          </p>
          <p style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            marginTop: '8px',
          }}>
            ISO 8583 Web Simulator v1.0.0 • Open Source
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
