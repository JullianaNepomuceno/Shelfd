import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './monthly-top-shelves.css';

const ShelfdLogoWhite: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <rect x="1"  y="3"  width="4" height="16" rx="1" fill="#C4532A" />
        <rect x="7"  y="5"  width="3" height="14" rx="1" fill="rgba(255,255,255,0.5)" />
        <rect x="12" y="2"  width="5" height="17" rx="1" fill="rgba(255,255,255,0.3)" />
        <rect x="19" y="6"  width="2" height="13" rx="1" fill="rgba(255,255,255,0.6)" />
        <rect x="0"  y="18" width="22" height="2"  rx="1" fill="rgba(255,255,255,0.2)" />
    </svg>
);

const MonthlyTopShelvesPage: React.FC = () => {
    const navigate = useNavigate();
    const user = authService.getUser();

    return (
        <div className="monthly-top">
            <nav className="monthly-top__nav">
                <button className="monthly-top__brand" onClick={() => navigate('/dashboard')}>
                    <ShelfdLogoWhite />
                    <span>Shelfd</span>
                </button>
                <div className="monthly-top__nav-center">
                    <NavLink
                        to="/public-shelves"
                        className={({ isActive }) =>
                            `monthly-top__link${isActive ? ' monthly-top__link--active' : ''}`
                        }
                    >
                        Discover
                    </NavLink>
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `monthly-top__link${isActive ? ' monthly-top__link--active' : ''}`
                        }
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/monthly-top-shelves"
                        className={({ isActive }) =>
                            `monthly-top__link${isActive ? ' monthly-top__link--active' : ''}`
                        }
                    >
                        Monthly Top Shelves
                    </NavLink>
                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            `monthly-top__link${isActive ? ' monthly-top__link--active' : ''}`
                        }
                    >
                        Profile
                    </NavLink>
                </div>
                <div className="monthly-top__nav-right">
                    <span className="monthly-top__user">@{user?.username}</span>
                    <button className="btn-logout" onClick={() => { authService.logout(); navigate('/login'); }}>
                        Log out
                    </button>
                </div>
            </nav>

            <main className="monthly-top__main">
                <header className="monthly-top__header">
                    <h1>Monthly Top Shelves</h1>
                    <p>Highlights and rankings are coming soon.</p>
                </header>
                <div className="monthly-top__placeholder">
                    <p>Placeholder</p>
                </div>
            </main>
        </div>
    );
};

export default MonthlyTopShelvesPage;
