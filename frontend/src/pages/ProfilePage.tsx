import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import profileService, { Profile, Analytics } from '../services/profileService';
import ChartPieCanvas from '../components/ChartPieCanvas';
import './profile.css';

const ShelfdLogoWhite: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <rect x="1"  y="3"  width="4" height="16" rx="1" fill="#C4532A" />
        <rect x="7"  y="5"  width="3" height="14" rx="1" fill="rgba(255,255,255,0.5)" />
        <rect x="12" y="2"  width="5" height="17" rx="1" fill="rgba(255,255,255,0.3)" />
        <rect x="19" y="6"  width="2" height="13" rx="1" fill="rgba(255,255,255,0.6)" />
        <rect x="0"  y="18" width="22" height="2"  rx="1" fill="rgba(255,255,255,0.2)" />
    </svg>
);

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    useEffect(() => {
        profileService.getProfile().then(p => {
            setProfile(p);
            setUsername(p.username);
            setFirstName(p.firstName || '');
            setLastName(p.lastName || '');
        }).catch(() => {});
        profileService.getAnalytics().then(a => setAnalytics(a)).catch(() => {});
    }, []);

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
    }, [previewUrl]);

    const onSave = async () => {
        try {
            const updated = await profileService.updateProfile({ username, firstName, lastName });
            setProfile(updated);
            if (avatarFile) {
                const withAvatar = await profileService.uploadAvatar(avatarFile);
                setProfile(withAvatar);
            }
            alert('Profile saved');
        } catch (err: any) {
            if (err.response && err.response.status === 409) {
                alert('Username already taken');
            } else {
                alert('Failed to save profile');
            }
        }
    };

    return (
        <div className="profile-page">
            <nav className="profile-nav">
                <button className="profile-nav__brand" onClick={() => navigate('/dashboard')}>
                    <ShelfdLogoWhite />
                    <span>Shelfd</span>
                </button>
                <div className="profile-nav__center">
                    <NavLink
                        to="/public-shelves"
                        className={({ isActive }) =>
                            `profile-nav__link${isActive ? ' profile-nav__link--active' : ''}`
                        }
                    >
                        Discover
                    </NavLink>
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `profile-nav__link${isActive ? ' profile-nav__link--active' : ''}`
                        }
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/monthly-top-shelves"
                        className={({ isActive }) =>
                            `profile-nav__link${isActive ? ' profile-nav__link--active' : ''}`
                        }
                    >
                        Monthly Top Shelves
                    </NavLink>
                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            `profile-nav__link${isActive ? ' profile-nav__link--active' : ''}`
                        }
                    >
                        Profile
                    </NavLink>
                </div>
                <div className="profile-nav__right">
                    <span className="profile-nav__user">@{profile?.username || authService.getUser()?.username}</span>
                    <button className="btn-logout" onClick={() => { authService.logout(); navigate('/login'); }}>
                        Log out
                    </button>
                </div>
            </nav>

                <main className="profile-main">
                    <header className="profile-header">
                        <h1>Profile</h1>
                        <p>Customize your profile and view personal analytics.</p>
                    </header>

                    <section className="profile-grid">
                        <div className="profile-card">
                            <div className="profile-avatar">
                                {profile?.avatarUrl ? (
                                    <img src={profile.avatarUrl} alt="avatar" />
                                ) : (
                                    <div className="profile-avatar__placeholder">{profile?.username?.charAt(0).toUpperCase() || '?'}</div>
                                )}
                            </div>
                            <label className="form-row">
                                <div>Username</div>
                                <input value={username} onChange={e => setUsername(e.target.value)} />
                            </label>
                            <label className="form-row">
                                <div>First name</div>
                                <input value={firstName} onChange={e => setFirstName(e.target.value)} />
                            </label>
                            <label className="form-row">
                                <div>Last name</div>
                                <input value={lastName} onChange={e => setLastName(e.target.value)} />
                            </label>
                            <label className="form-row">
                                <div>Avatar</div>
                                <input type="file" accept="image/*" onChange={e => {
                                    const f = e.target.files ? e.target.files[0] : null;
                                    if (f) {
                                        // client-side validation: max 2MB
                                        if (f.size > 2 * 1024 * 1024) { alert('Avatar must be <= 2MB'); return; }
                                        const allowed = ['image/jpeg','image/png','image/webp'];
                                        if (!allowed.includes(f.type)) { alert('Only JPG, PNG or WEBP allowed'); return; }
                                        setAvatarFile(f);
                                        setPreviewUrl(URL.createObjectURL(f));
                                    } else {
                                        setAvatarFile(null);
                                        setPreviewUrl(null);
                                    }
                                }} />
                                {previewUrl && <img src={previewUrl} alt="preview" style={{ width: 96, height: 96, borderRadius: '50%', marginTop: 8, objectFit: 'cover' }} />}
                            </label>
                            <div style={{ marginTop: 10 }}>
                                <button onClick={onSave} className="btn-save">Save</button>
                            </div>
                        </div>

                        <div className="profile-card profile-analytics">
                            <h3>Personalized Analytics</h3>
                            {analytics ? (
                                <div className="analytics-list">
                                    <div>Total media tracked: <strong>{analytics.totalMedia}</strong></div>
                                    <div>Finished: <strong>{analytics.finishedCount}</strong></div>
                                    <div>Unfinished: <strong>{analytics.unfinishedCount}</strong></div>
                                    <div>Average rating: <strong>{(analytics.averageRating || 0).toFixed(2)}</strong></div>
                                    <div className="breakdown">
                                        <h4>By type</h4>
                                        <div style={{ maxWidth: 300 }}>
                                            <ChartPieCanvas
                                                labels={Object.keys(analytics.mediaTypeBreakdown || {})}
                                                data={Object.values(analytics.mediaTypeBreakdown || {}) as number[]}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>Loading analytics…</div>
                            )}
                        </div>
                    </section>
                </main>
        </div>
    );
};

export default ProfilePage;
