import React from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface SpineBook {
    height: number;
    color: string;
    title: string;
}

interface AuthLeftPanelProps {
    tagline: string;
    quote: string;
    quoteAuthor: string;
    books: SpineBook[];
}

// ── Logo (white version for dark panel) ───────────────────────────────────────

export const ShelfdLogoWhite: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <rect x="1"  y="3"  width="4" height="16" rx="1" fill="#C4532A" />
        <rect x="7"  y="5"  width="3" height="14" rx="1" fill="rgba(255,255,255,0.5)" />
        <rect x="12" y="2"  width="5" height="17" rx="1" fill="rgba(255,255,255,0.3)" />
        <rect x="19" y="6"  width="2" height="13" rx="1" fill="rgba(255,255,255,0.6)" />
        <rect x="0"  y="18" width="22" height="2"  rx="1" fill="rgba(255,255,255,0.2)" />
    </svg>
);

// ── Logo (ink version for light panel) ────────────────────────────────────────

export const ShelfdLogoInk: React.FC = () => (
    <svg width="44" height="44" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <rect x="1"  y="3"  width="4" height="16" rx="1" fill="#C4532A" />
        <rect x="7"  y="5"  width="3" height="14" rx="1" fill="rgba(26,22,16,0.45)" />
        <rect x="12" y="2"  width="5" height="17" rx="1" fill="rgba(26,22,16,0.28)" />
        <rect x="19" y="6"  width="2" height="13" rx="1" fill="rgba(26,22,16,0.55)" />
        <rect x="0"  y="18" width="22" height="2"  rx="1" fill="rgba(26,22,16,0.15)" />
    </svg>
);

// ── Left decorative panel ─────────────────────────────────────────────────────

const AuthLeftPanel: React.FC<AuthLeftPanelProps> = ({ tagline, quote, quoteAuthor, books }) => (
    <aside className="auth-left" aria-hidden="true">
        <div className="auth-left__grid" />

        <div className="auth-brand">
            <div className="auth-brand__name">
                <ShelfdLogoWhite />
                Shelfd
            </div>
            <p className="auth-brand__tagline">{tagline}</p>
        </div>

        <div className="spine-stack-wrapper">
            <div className="spine-stack">
                {books.map((book, i) => (
                    <div
                        key={i}
                        className="spine-book"
                        style={{ height: book.height, background: book.color }}
                    >
                        <span className="spine-book__title">{book.title}</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="auth-quote">
            <blockquote>"{quote}"</blockquote>
            <cite>— {quoteAuthor}</cite>
        </div>
    </aside>
);

export default AuthLeftPanel;