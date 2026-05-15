import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './auth.css';

// ── Types ────────────────────────────────────────────────────────────────────

interface FormData {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
}

type MediaType = 'Books' | 'Comics' | 'Movies' | 'TV Shows' | 'Games';
type Genre =
    | 'Fantasy' | 'Sci-Fi' | 'Mystery' | 'Romance'
    | 'Thriller' | 'Horror' | 'Non-fiction' | 'Comedy';

// ── Static data ───────────────────────────────────────────────────────────────

const SPINE_BOOKS = [
    { height: 120, color: '#553C9A', title: 'Dune' },
    { height: 95,  color: '#2D6A4F', title: 'Watchmen' },
    { height: 145, color: '#1A365D', title: 'LOTR' },
    { height: 108, color: '#C4532A', title: 'Mad Men' },
    { height: 80,  color: '#744210', title: 'Parasite' },
    { height: 130, color: '#4A5568', title: 'Foundation' },
    { height: 100, color: '#6B4C3B', title: 'Sandman' },
    { height: 90,  color: '#742A2A', title: 'Dark' },
    { height: 115, color: '#276749', title: 'Sapiens' },
    { height: 135, color: '#8B2E12', title: 'Shogun' },
];

const MEDIA_TYPES: { label: MediaType; icon: string }[] = [
    { label: 'Books',    icon: 'ti-book' },
    { label: 'Comics',   icon: 'ti-stack' },
    { label: 'Movies',   icon: 'ti-movie' },
    { label: 'TV Shows', icon: 'ti-device-tv' },
    { label: 'Games',    icon: 'ti-device-gamepad-2' },
];

const GENRES: Genre[] = [
    'Fantasy', 'Sci-Fi', 'Mystery', 'Romance',
    'Thriller', 'Horror', 'Non-fiction', 'Comedy',
];

// ── Logo components ───────────────────────────────────────────────────────────

const ShelfdLogoWhite: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <rect x="1"  y="3"  width="4" height="16" rx="1" fill="#C4532A" />
        <rect x="7"  y="5"  width="3" height="14" rx="1" fill="rgba(255,255,255,0.5)" />
        <rect x="12" y="2"  width="5" height="17" rx="1" fill="rgba(255,255,255,0.3)" />
        <rect x="19" y="6"  width="2" height="13" rx="1" fill="rgba(255,255,255,0.6)" />
        <rect x="0"  y="18" width="22" height="2"  rx="1" fill="rgba(255,255,255,0.2)" />
    </svg>
);

const ShelfdLogoInk: React.FC = () => (
    <svg width="44" height="44" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <rect x="1"  y="3"  width="4" height="16" rx="1" fill="#C4532A" />
        <rect x="7"  y="5"  width="3" height="14" rx="1" fill="rgba(26,22,16,0.45)" />
        <rect x="12" y="2"  width="5" height="17" rx="1" fill="rgba(26,22,16,0.28)" />
        <rect x="19" y="6"  width="2" height="13" rx="1" fill="rgba(26,22,16,0.55)" />
        <rect x="0"  y="18" width="22" height="2"  rx="1" fill="rgba(26,22,16,0.15)" />
    </svg>
);

// ── Step indicators ───────────────────────────────────────────────────────────

interface StepIndicatorsProps { current: number; total: number; }

const StepIndicators: React.FC<StepIndicatorsProps> = ({ current, total }) => (
    <div className="step-indicators" role="progressbar" aria-valuenow={current} aria-valuemax={total}>
        {Array.from({ length: total }, (_, i) => {
            const step = i + 1;
            let cls = 'step-dot';
            if (step === current) cls += ' step-dot--active';
            else if (step < current) cls += ' step-dot--done';
            return <div key={step} className={cls} />;
        })}
    </div>
);

// ── Main component ────────────────────────────────────────────────────────────

const SignUpPage: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        firstName: '', lastName: '', username: '', email: '', password: '',
    });

    const [selectedMedia, setSelectedMedia] = useState<MediaType[]>(['Books', 'Movies']);
    const [selectedGenres, setSelectedGenres] = useState<Genre[]>(['Sci-Fi', 'Thriller']);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const toggleMedia = (media: MediaType) => {
        setSelectedMedia(prev =>
            prev.includes(media) ? prev.filter(m => m !== media) : [...prev, media]
        );
    };

    const toggleGenre = (genre: Genre) => {
        setSelectedGenres(prev =>
            prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
        );
    };

    const handleStep1Submit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handleFinalSubmit = () => {
        // TODO: POST /api/auth/register
        console.log('Registration payload:', { ...formData, mediaTypes: selectedMedia, genres: selectedGenres });
    };

    const initials =
        (formData.firstName.charAt(0) || 'A').toUpperCase() +
        (formData.lastName.charAt(0) || '').toUpperCase();

    const displayUsername = formData.username
        ? (formData.username.startsWith('@') ? formData.username : `@${formData.username}`)
        : '@username';

    return (
        <div className="auth-layout">

            {/* ── Left panel ── */}
            <aside className="auth-left" aria-hidden="true">
                <div className="auth-left__grid" />

                <div className="auth-brand">
                    <div className="auth-brand__name">
                        <ShelfdLogoWhite />
                        Shelfd
                    </div>
                    <p className="auth-brand__tagline">
                        Track. Review. Discover.<br />Build your digital shelf.
                    </p>
                </div>

                {/* Centered spine stack */}
                <div className="spine-stack-wrapper">
                    <div className="spine-stack">
                        {SPINE_BOOKS.map((book, i) => (
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
                    <blockquote>"Not all those who wander are lost."</blockquote>
                    <cite>— J.R.R. Tolkien</cite>
                </div>
            </aside>

            {/* ── Right panel ── */}
            <main className="auth-right">
                <div className="auth-right-inner">

                    {/* Logo above form */}
                    <div className="auth-right-logo">
                        <ShelfdLogoInk />
                        <span className="auth-right-logo__name">Shelfd</span>
                    </div>

                    <StepIndicators current={step} total={3} />

                    {/* ── Step 1: Account details ── */}
                    {step === 1 && (
                        <form onSubmit={handleStep1Submit} noValidate>
                            <div className="form-header">
                                <h1 className="form-title">Create your shelf</h1>
                                <p className="form-subtitle">
                                    Already a member?{' '}
                                    <a onClick={() => navigate('/login')} role="button" tabIndex={0}>Sign in</a>
                                </p>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="firstName" className="form-label">First name</label>
                                    <input id="firstName" name="firstName" type="text" className="form-input"
                                           placeholder="Alex" value={formData.firstName} onChange={handleChange}
                                           autoComplete="given-name" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName" className="form-label">Last name</label>
                                    <input id="lastName" name="lastName" type="text" className="form-input"
                                           placeholder="Morgan" value={formData.lastName} onChange={handleChange}
                                           autoComplete="family-name" required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="username" className="form-label">Username</label>
                                <input id="username" name="username" type="text" className="form-input"
                                       placeholder="bookworm42" value={formData.username} onChange={handleChange}
                                       autoComplete="username" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input id="email" name="email" type="email" className="form-input"
                                       placeholder="you@example.com" value={formData.email} onChange={handleChange}
                                       autoComplete="email" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password" className="form-label">Password</label>
                                <div className="password-wrapper">
                                    <input id="password" name="password"
                                           type={showPassword ? 'text' : 'password'}
                                           className="form-input password-input"
                                           placeholder="8+ characters" value={formData.password}
                                           onChange={handleChange} autoComplete="new-password" minLength={8} required />
                                    <button type="button" className="password-toggle"
                                            onClick={() => setShowPassword(v => !v)}
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                        <i className={showPassword ? 'ti ti-eye-off' : 'ti ti-eye'} />
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="btn-primary">
                                Continue <i className="ti ti-arrow-right" aria-hidden="true" />
                            </button>
                        </form>
                    )}

                    {/* ── Step 2: Preferences ── */}
                    {step === 2 && (
                        <div>
                            <div className="form-header">
                                <h1 className="form-title">What do you love?</h1>
                                <p className="form-subtitle">Pick your media — we'll tailor your shelf.</p>
                            </div>

                            <p className="chip-section-label">Media types</p>
                            <div className="chip-group" role="group" aria-label="Select media types">
                                {MEDIA_TYPES.map(({ label, icon }) => (
                                    <button key={label} type="button"
                                            className={`chip${selectedMedia.includes(label) ? ' chip--selected' : ''}`}
                                            onClick={() => toggleMedia(label)}
                                            aria-pressed={selectedMedia.includes(label)}>
                                        <i className={`ti ${icon}`} aria-hidden="true" />
                                        {label}
                                    </button>
                                ))}
                            </div>

                            <div style={{ marginTop: '20px' }}>
                                <p className="chip-section-label">Genres you enjoy</p>
                                <div className="chip-group" role="group" aria-label="Select genres">
                                    {GENRES.map(genre => (
                                        <button key={genre} type="button"
                                                className={`chip${selectedGenres.includes(genre) ? ' chip--selected' : ''}`}
                                                onClick={() => toggleGenre(genre)}
                                                aria-pressed={selectedGenres.includes(genre)}>
                                            {genre}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button type="button" className="btn-primary" style={{ marginTop: '28px' }}
                                    onClick={() => setStep(3)}>
                                Almost there <i className="ti ti-arrow-right" aria-hidden="true" />
                            </button>
                        </div>
                    )}

                    {/* ── Step 3: Confirmation ── */}
                    {step === 3 && (
                        <div>
                            <div className="form-header">
                                <h1 className="form-title">Your shelf is ready</h1>
                                <p className="form-subtitle">You're all set to start tracking your media.</p>
                            </div>

                            <div className="profile-preview">
                                <div className="profile-preview__header">
                                    <div className="avatar-circle" aria-hidden="true">{initials || 'S'}</div>
                                    <div>
                                        <p className="profile-preview__name">{displayUsername}</p>
                                        <p className="profile-preview__meta">New member · 0 reviews</p>
                                    </div>
                                </div>
                                <div className="stats-grid">
                                    {[{ label: 'On shelf', value: 0 }, { label: 'Reviews', value: 0 }, { label: 'Following', value: 0 }].map(s => (
                                        <div key={s.label} className="stat-card">
                                            <div className="stat-card__number">{s.value}</div>
                                            <div className="stat-card__label">{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button type="button" className="btn-primary" onClick={handleFinalSubmit}>
                                Go to my shelf <i className="ti ti-arrow-right" aria-hidden="true" />
                            </button>

                            <p className="terms-text">
                                By creating an account you agree to the{' '}
                                <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.
                            </p>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

export default SignUpPage;