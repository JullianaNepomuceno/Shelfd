import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './Navbar.css';

const ShelfdLogoWhite: React.FC = () => (
    <svg width="28" height="28" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <rect x="1"  y="3"  width="4" height="16" rx="1" fill="#C4532A" />
        <rect x="7"  y="5"  width="3" height="14" rx="1" fill="rgba(255,255,255,0.5)" />
        <rect x="12" y="2"  width="5" height="17" rx="1" fill="rgba(255,255,255,0.3)" />
        <rect x="19" y="6"  width="2" height="13" rx="1" fill="rgba(255,255,255,0.6)" />
        <rect x="0"  y="18" width="22" height="2"  rx="1" fill="rgba(255,255,255,0.2)" />
    </svg>
);

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const user = authService.getUser();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const navLink = (to: string, label: string) => (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `navbar__link${isActive ? ' navbar__link--active' : ''}`
            }
        >
            {label}
        </NavLink>
    );

    return (
        <nav className="navbar">
            <button className="navbar__brand" onClick={() => navigate('/dashboard')}>
                <ShelfdLogoWhite />
                <span>Shelfd</span>
            </button>

            <div className="navbar__center">
                {navLink('/public-shelves', 'Discover')}
                {navLink('/dashboard', 'Dashboard')}
                {navLink('/monthly-top-shelves', 'Monthly Top')}
                {navLink('/profile', 'Profile')}
            </div>

            <div className="navbar__right">
                <span className="navbar__user">@{user?.username}</span>
                <button className="navbar__logout" onClick={handleLogout}>
                    Log out
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
