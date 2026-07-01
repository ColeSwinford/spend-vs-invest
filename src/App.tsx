import { useState } from 'react';

export default function App() {
  const [displayValue, setDisplayValue] = useState<string>('');
  const [numericValue, setNumericValue] = useState<number>(0);
  
  const ANNUAL_RETURN_RATE = 0.07;
  const MAX_YEAR = 40;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawString = e.target.value.replace(/\D/g, '');
    
    if (rawString === '') {
      setDisplayValue('');
      setNumericValue(0);
      return;
    }

    const number = parseInt(rawString, 10);
    setNumericValue(number);
    setDisplayValue(number.toLocaleString('en-US'));
  };

  const invested20 = numericValue === 0 ? 0 : numericValue * Math.pow(1 + ANNUAL_RETURN_RATE, 20);
  const invested40 = numericValue === 0 ? 0 : numericValue * Math.pow(1 + ANNUAL_RETURN_RATE, 40);

  // Generate data points for decades, scaled against the 40-year maximum
  const chartData = [0, 10, 20, 30, 40].map((year) => {
    const val = numericValue === 0 ? 0 : numericValue * Math.pow(1 + ANNUAL_RETURN_RATE, year);
    const heightPercent = numericValue === 0 ? 0 : (val / invested40) * 100;
    return { year, val, heightPercent };
  });

  const formatCompact = (val: number) => {
    if (val === 0) return '0';
    if (val >= 1000000) return '$' + (val / 1000000).toFixed(1) + 'M';
    if (val >= 1000) return '$' + (val / 1000).toFixed(1) + 'k';
    return '$' + Math.round(val).toString();
  };

  return (
    <main style={{ 
      minHeight: '100vh',
      width: '100vw',
      margin: 0,
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#000000',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      
      <div style={{
        maxWidth: '400px',
        width: '100%',
        padding: '32px',
        borderRadius: '24px',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
        color: '#FFFFFF',
      }}>
        <h1 style={{ marginTop: 0, fontSize: '24px', fontWeight: 600, letterSpacing: '-0.5px' }}>
          Spend vs. Invest
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '15px', lineHeight: '1.4', marginBottom: '32px' }}>
          See what your money could become at a 7% real return.
        </p>
        
        {/* Split Results Section */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          <div style={{ 
            flex: 1,
            padding: '24px 16px', 
            borderRadius: '16px', 
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px', fontWeight: 600 }}>
              20 Years
            </div>
            <div style={{ fontSize: '28px', fontWeight: 600, letterSpacing: '-0.5px' }}>
              ${invested20.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
          </div>

          <div style={{ 
            flex: 1,
            padding: '24px 16px', 
            borderRadius: '16px', 
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px', fontWeight: 600 }}>
              40 Years
            </div>
            <div style={{ fontSize: '28px', fontWeight: 600, letterSpacing: '-0.5px' }}>
              ${invested40.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>

        {/* Visual CSS Gradient Chart */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-end', 
          justifyContent: 'space-between', 
          height: '160px', 
          marginBottom: '40px',
          padding: '0 8px'
        }}>
          {chartData.map((data) => (
            <div key={data.year} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '48px', height: '100%', justifyContent: 'flex-end' }}>
              {/* Value floating above the bar */}
              <div style={{ 
                fontSize: '11px', 
                color: 'rgba(255, 255, 255, 0.8)', 
                marginBottom: '8px', 
                opacity: numericValue > 0 ? 1 : 0, 
                transition: 'opacity 0.2s',
                fontWeight: 500
              }}>
                {formatCompact(data.val)}
              </div>
              
              {/* The Gradient Bar */}
              <div style={{
                width: '100%',
                height: `${data.heightPercent}%`,
                minHeight: numericValue === 0 ? '4px' : '8px', // Slightly larger min-height so year 0 is visible when compounding gets massive
                background: 'linear-gradient(to top, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.85))',
                borderRadius: '6px',
                marginBottom: '8px',
                transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)' 
              }} />
              
              {/* X-Axis Label */}
              <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', fontWeight: 600, letterSpacing: '0.5px' }}>
                {data.year === 0 ? 'NOW' : `${data.year}Y`}
              </div>
            </div>
          ))}
        </div>

        {/* Input Section */}
        <div>
          <label htmlFor="amount" style={{ display: 'block', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '12px', fontWeight: 600 }}>
            Money Spent Today
          </label>
          <div style={{ 
            position: 'relative', 
            display: 'flex', 
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '16px',
            padding: '4px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}>
            <span style={{ 
              position: 'absolute', 
              left: '20px', 
              fontSize: '28px', 
              fontWeight: 400,
              color: '#FFFFFF',
              opacity: 0.4
            }}>
              $
            </span>
            <input
              id="amount"
              type="text"
              inputMode="numeric"
              value={displayValue}
              onChange={handleInputChange}
              placeholder="0"
              style={{ 
                width: '100%', 
                padding: '20px 20px 20px 50px', 
                fontSize: '32px', 
                fontWeight: 500,
                boxSizing: 'border-box',
                border: 'none',
                background: 'transparent',
                color: '#FFFFFF',
                outline: 'none'
              }}
            />
          </div>
        </div>

      </div>
    </main>
  );
}