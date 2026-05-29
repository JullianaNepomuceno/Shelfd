import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import shelfService, { ShelfResponse } from '../services/shelfService';
import './public-shelves.css';

const ShelfdLogoWhite: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <rect x="1"  y="3"  width="4" height="16" rx="1" fill="#C4532A" />
        <rect x="7"  y="5"  width="3" height="14" rx="1" fill="rgba(255,255,255,0.5)" />
        <rect x="12" y="2"  width="5" height="17" rx="1" fill="rgba(255,255,255,0.3)" />
        <rect x="19" y="6"  width="2" height="13" rx="1" fill="rgba(255,255,255,0.6)" />
        <rect x="0"  y="18" width="22" height="2"  rx="1" fill="rgba(255,255,255,0.2)" />
    </svg>
);

const PublicShelvesPage: React.FC = () => {
    const navigate = useNavigate();
    const user = authService.getUser();

    const [shelves, setShelves] = useState<ShelfResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadPublicShelves = async () => {
            try {
                const data = await shelfService.getPublicShelves();
                setShelves(data);
            } catch (err) {
                setError('Failed to load public shelves.');
            } finally {
                setLoading(false);
            }
        };

        loadPublicShelves();
    }, []);

    const buildStarRating = (average?: number) => {
        if (average === undefined || average === null) return '';
        const clamped = Math.max(0, Math.min(5, Math.round(average / 2)));
        const filled = '★★★★★'.slice(0, clamped);
        const empty = '☆☆☆☆☆'.slice(0, 5 - clamped);
        return `${filled}${empty}`;
    };

    return (
        <div className="public-shelves">
            <nav className="public-shelves__nav">
                <button className="public-shelves__brand" onClick={() => navigate('/dashboard')}>
                    <ShelfdLogoWhite />
                    <span>Shelfd</span>
                </button>
                <div className="public-shelves__nav-center">
                    <NavLink
                        to="/public-shelves"
                        className={({ isActive }) =>
                            `public-shelves__link${isActive ? ' public-shelves__link--active' : ''}`
                        }
                    >
                        Discover
                    </NavLink>
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `public-shelves__link${isActive ? ' public-shelves__link--active' : ''}`
                        }
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/monthly-top-shelves"
                        className={({ isActive }) =>
                            `public-shelves__link${isActive ? ' public-shelves__link--active' : ''}`
                        }
                    >
                        Monthly Top Shelves
                    </NavLink>
                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            `public-shelves__link${isActive ? ' public-shelves__link--active' : ''}`
                        }
                    >
                        Profile
                    </NavLink>
                </div>
                <div className="public-shelves__nav-right">
                    <span className="public-shelves__user">@{user?.username}</span>
                    <button className="btn-logout" onClick={() => { authService.logout(); navigate('/login'); }}>
                        Log out
                    </button>
                </div>
            </nav>

            <main className="public-shelves__main">
                <header className="public-shelves__header">
                    <h1>Discover</h1>
                    <p>Browse community shelves and explore new picks.</p>
                </header>

                {error && <p className="public-shelves__error">{error}</p>}

                {loading ? (
                    <p className="public-shelves__loading">Loading shelves...</p>
                ) : shelves.length === 0 ? (
                    <div className="public-shelves__empty">
                        <p>No shelves to discover yet.</p>
                        <p>Create one and toggle it to public to share.</p>
                    </div>
                ) : (
                    <section className="public-shelves__grid">
                        {shelves.map(shelf => (
                            <article
                                key={shelf.id}
                                className="public-shelf-card"
                                onClick={() => navigate(`/shelf/${shelf.id}`)}>
                                <div className="public-shelf-card__header">
                                    <h2>{shelf.name}</h2>
                                </div>
                                {shelf.description && (
                                    <p className="public-shelf-card__desc">{shelf.description}</p>
                                )}
                                <div className="public-shelf-card__rating">
                                    {shelf.ratingCount ? (
                                        <span>{buildStarRating(shelf.ratingAverage)} ({shelf.ratingCount})</span>
                                    ) : (
                                        <span>No ratings yet</span>
                                    )}
                                </div>
                                <span className="public-shelf-card__owner">Owner: {shelf.ownerUsername}</span>
                            </article>
                        ))}
                    </section>
                )}
            </main>
        </div>
    );
};

export default PublicShelvesPage;
