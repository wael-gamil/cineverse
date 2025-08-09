import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0c1117',
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(66, 165, 245, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(66, 165, 245, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(66, 165, 245, 0.1) 0%, transparent 50%)
          `,
        }}
      >
        {/* Main Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            background:
              'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(12, 48, 83, 0.849) 50%, rgba(0, 0, 0, 0.96) 100%)',
            borderRadius: '32px',
            border: '3px solid #42a5f5',
            maxWidth: '1000px',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(66, 165, 245, 0.25)',
          }}
        >
          {/* Logo Section */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #42a5f5, #ffffff)',
                marginRight: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                boxShadow: '0 10px 25px rgba(66, 165, 245, 0.3)',
              }}
            >
              🎬
            </div>
            <div
              style={{
                fontSize: '72px',
                fontWeight: '900',
                background: 'linear-gradient(90deg, #42a5f5, #ffffff, #42a5f5)',
                backgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '0.15rem',
              }}
            >
              CINEVERSE
            </div>
          </div>

          {/* Main Tagline */}
          <div
            style={{
              fontSize: '42px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '20px',
              lineHeight: '1.1',
            }}
          >
            Discover, Track & Review
          </div>

          <div
            style={{
              fontSize: '36px',
              fontWeight: '600',
              color: '#42a5f5',
              marginBottom: '32px',
              lineHeight: '1.1',
            }}
          >
            Movies & TV Series
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: '20px',
              color: '#cbd5e0',
              marginBottom: '40px',
              maxWidth: '700px',
              lineHeight: '1.4',
            }}
          >
            Your ultimate platform for cinema exploration with personalized
            watchlists, community reviews, and content discovery
          </div>

          {/* Feature Icons */}
          <div
            style={{
              display: 'flex',
              gap: '40px',
              fontSize: '18px',
              color: '#e2e8f0',
              fontWeight: '600',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>🎭</span>
              <span>Movies</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>📺</span>
              <span>TV Series</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>⭐</span>
              <span>Reviews</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>📋</span>
              <span>Watchlists</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
