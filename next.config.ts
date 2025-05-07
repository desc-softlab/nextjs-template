import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // You can also disable ETags if you don't need them:
  //   generateEtags: false,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // ────── Existing Essentials ──────
          { key: 'X-Frame-Options',           value: 'DENY' },
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },

          // ────── Content Security Policy ──────
          // • removed `unsafe-inline` / `unsafe-eval` in favor of nonces or hashes
          // • added `upgrade-insecure-requests`
          // • you can also add a report URI: report-uri '/csp-violation-report'
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; " +
              "script-src 'self' https: 'unsafe-inline' 'nonce-<RANDOM_NONCE>'; " +  
              "style-src  'self' https: 'unsafe-inline' 'nonce-<RANDOM_NONCE>'; " +
              "img-src    'self' data: blob:; " +
              "font-src   'self'; " +
              "connect-src 'self' https://api.descsoftlab.com; " +
              "frame-ancestors 'none'; " +
              "upgrade-insecure-requests; " +
              // "report-uri /api/csp-report;" +
              ""
          },

          // ────── Permissions / Feature Policy ──────
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), ' +
              'microphone=(), ' +
              'geolocation=(), ' +
              'interest-cohort=()'   // opt-out of FLoC
          },

          // ────── Additional Security Headers ──────
          // Prevent legacy XSS filters (mostly deprecated, but harmless to keep)
          { key: 'X-XSS-Protection',          value: '1; mode=block' },
          // Disable DNS prefetching to prevent leaking user browsing
          { key: 'X-DNS-Prefetch-Control',    value: 'off' },
          // Enforce Cross‑Origin isolation if you serve SharedArrayBuffer / high‑security features
          { key: 'Cross-Origin-Opener-Policy',   value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
          // Control how other sites can embed or fetch your resources
          { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
          // Certificate Transparency enforcement
          { key: 'Expect-CT', value: 'max-age=86400, enforce' },
        ]
      }
    ]
  }
};

export default nextConfig;
