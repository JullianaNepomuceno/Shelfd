import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLeftPanel, { ShelfdLogoInk } from '../components/AuthLeftPanel';
import authService from '../services/authService';
import './auth.css';

const SPINE_BOOKS = [
    { height: 110, color: '#8B2E12', title: 'Dune' },
    { height: 140, color: '#4A5568', title: 'Foundation' },
    { height: 95,  color: '#2D6A4F', title: 'Watchmen' },
    { height: 125, color: '#C4532A', title: 'Pride & Prejudice' },
    { height: 80,  color: '#8B7355', title: 'Sapiens' },
    { height: 150, color: '#1A365D', title: 'LOTR' },
    { height: 105, color: '#553C9A', title: 'Arrival' },
    { height: 90,  color: '#744210', title: 'Parasite' },
    { height: 130, color: '#276749', title: 'Spirited Away' },
    { height: 115, color: '#742A2A', title: 'Daredevil' },
];

const GoogleIcon: React.FC = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const GitHubIcon: React.FC = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
);

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await authService.login(formData);
            authService.saveSession(data);
            navigate('/dashboard');
        } catch (err: any) {
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-layout">
            <AuthLeftPanel
                tagline={"Your digital shelf for books,\ncomics, movies & TV."}
                quote="A reader lives a thousand lives before he dies."
                quoteAuthor="George R.R. Martin"
                books={SPINE_BOOKS}
            />

            <main className="auth-right">
                <div className="auth-right-inner">
                    <div className="auth-right-logo">
                        <ShelfdLogoInk />
                        <span className="auth-right-logo__name">Shelfd</span>
                    </div>

                    <div className="form-header">
                        <h1 className="form-title">Welcome back</h1>
                        <p className="form-subtitle">
                            Don't have an account?{' '}
                            <a onClick={() => navigate('/signup')} role="button" tabIndex={0}>Sign up free</a>
                        </p>
                    </div>

                    {error && <p style={{ color: 'red', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input id="email" name="email" type="email" className="form-input"
                                placeholder="you@example.com" value={formData.email}
                                onChange={handleChange} autoComplete="email" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <div className="password-wrapper">
                                <input id="password" name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-input password-input"
                                    placeholder="••••••••" value={formData.password}
                                    onChange={handleChange} autoComplete="current-password" required />
                                <button type="button" className="password-toggle"
                                    onClick={() => setShowPassword(v => !v)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                    <i className={showPassword ? 'ti ti-eye-off' : 'ti ti-eye'} />
                                </button>
                            </div>
                        </div>

                        <div className="forgot-link">
                            <a href="/forgot-password">Forgot your password?</a>
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Logging in...' : 'Log in'}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <div className="auth-divider__line" />
                        <span className="auth-divider__text">or continue with</span>
                        <div className="auth-divider__line" />
                    </div>

                    <div className="oauth-grid">
                        <button type="button" className="btn-oauth"><GoogleIcon />Google</button>
                        <button type="button" className="btn-oauth"><GitHubIcon />GitHub</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
