import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'CineVerse';
  const subtitle =
    searchParams.get('subtitle') || 'Discover Movies & TV Series';

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
          backgroundImage:
            'radial-gradient(circle at 25px 25px, #1a202c 2%, transparent 0%), radial-gradient(circle at 75px 75px, #2d3748 2%, transparent 0%)',
          backgroundSize: '100px 100px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            background:
              'linear-gradient(135deg, rgba(66, 165, 245, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%)',
            borderRadius: '24px',
            border: '2px solid #42a5f5',
            maxWidth: '900px',
            textAlign: 'center',
          }}
        >
          {/* Logo/Title */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #42a5f5, #ffffff)',
                marginRight: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              🎬
            </div>
            <div
              style={{
                fontSize: '64px',
                fontWeight: '900',
                background: 'linear-gradient(90deg, #42a5f5, #ffffff, #42a5f5)',
                backgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '0.1rem',
              }}
            >
              CINEVERSE
            </div>
          </div>

          {/* Main Title */}
          <div
            style={{
              fontSize: '48px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '16px',
              lineHeight: '1.2',
            }}
          >
            {title}
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '24px',
              color: '#a0aec0',
              marginBottom: '24px',
            }}
          >
            {subtitle}
          </div>

          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: '30px',
              fontSize: '18px',
              color: '#e2e8f0',
            }}
          >
            <span>📽️ Movies</span>
            <span>📺 TV Series</span>
            <span>⭐ Reviews</span>
            <span>📋 Watchlists</span>
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
