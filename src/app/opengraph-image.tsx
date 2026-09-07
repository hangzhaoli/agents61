import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Agents61 — 61 Investment Masters Analyze Your Stock';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0052d9 0%, #003da6 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: 800,
              color: '#0052d9',
            }}
          >
            61
          </div>
          <span style={{ fontSize: '32px', fontWeight: 700, color: 'white' }}>
            Agents61
          </span>
        </div>
        <div
          style={{
            fontSize: '56px',
            fontWeight: 800,
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.2,
            maxWidth: '900px',
          }}
        >
          One Stock. 61 Minds. One Verdict.
        </div>
        <div
          style={{
            fontSize: '24px',
            color: 'rgba(255,255,255,0.8)',
            marginTop: '24px',
            textAlign: 'center',
          }}
        >
          AI-powered investment committee reports
        </div>
      </div>
    ),
    { ...size }
  );
}
