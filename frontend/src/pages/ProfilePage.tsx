import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import profileService, { Profile, Analytics } from '../services/profileService';
import ChartPieCanvas from '../components/ChartPieCanvas';
import './profile.css';
import Navbar from '../components/Navbar';

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        profileService.getProfile().then(p => {
            setProfile(p);
            setUsername(p.username);
            setFirstName(p.firstName || '');
            setLastName(p.lastName || '');
        }).catch(() => {});

        profileService.getAnalytics().then(a => setAnalytics(a)).catch(() => {});
    }, []);

    useEffect(() => {
        return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
    }, [previewUrl]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        if (!f) { setAvatarFile(null); setPreviewUrl(null); return; }
        if (f.size > 2 * 1024 * 1024) { alert('Avatar must be ≤ 2 MB'); return; }
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
            alert('Only JPG, PNG or WEBP allowed'); return;
        }
        setAvatarFile(f);
        setPreviewUrl(URL.createObjectURL(f));
    };

    const onSave = async () => {
        setSaving(true);
        try {
            const updated = await profileService.updateProfile({ username, firstName, lastName });
            setProfile(updated);
            if (avatarFile) {
                const withAvatar = await profileService.uploadAvatar(avatarFile);
                setProfile(withAvatar);
            }
            alert('Profile saved!');
        } catch (err: any) {
            if (err.response?.status === 409) {
                alert('Username already taken');
            } else {
                alert('Failed to save profile');
            }
        } finally {
            setSaving(false);
        }
    };

    const navLink = (to: string, label: string) => (
        <NavLink to={to} className={({ isActive }) =>
            `profile-nav__link${isActive ? ' profile-nav__link--active' : ''}`}>
            {label}
        </NavLink>
    );

    const initials = (profile?.username?.charAt(0) ?? '?').toUpperCase();

    return (
        <div className="profile-page">

            {/* ── Navbar ── */}
            <Navbar />

            {/* ── Main ── */}
            <main className="profile-main">
                <header className="profile-header">
                    <h1>Profile</h1>
                    <p>Customize your profile and view your media analytics.</p>
                </header>

                <section className="profile-grid">

                    {/* ── Left: edit card ── */}
                    <div className="profile-card">
                        <div className="profile-avatar">
                            {previewUrl ? (
                                <img src={previewUrl} alt="preview" />
                            ) : profile?.avatarUrl ? (
                                <img src={profile.avatarUrl} alt="avatar" />
                            ) : (
                                <div className="profile-avatar__placeholder">{initials}</div>
                            )}
                            <div>
                                <div style={{ fontFamily: 'var(--font-display, serif)', fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>
                                    @{profile?.username ?? '—'}
                                </div>
                                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                                    {profile?.firstName} {profile?.lastName}
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <label className="form-label">Username</label>
                            <input className="form-input" value={username}
                                placeholder="bookworm42"
                                onChange={e => setUsername(e.target.value)} />
                        </div>

                        <div className="form-row">
                            <label className="form-label">First name</label>
                            <input className="form-input" value={firstName}
                                placeholder="Alex"
                                onChange={e => setFirstName(e.target.value)} />
                        </div>

                        <div className="form-row">
                            <label className="form-label">Last name</label>
                            <input className="form-input" value={lastName}
                                placeholder="Morgan"
                                onChange={e => setLastName(e.target.value)} />
                        </div>

                        <div className="form-row">
                            <label className="form-label">Avatar</label>
                            <div className="file-input">
                                <input type="file" accept="image/*" onChange={handleAvatarChange} />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button className="btn-save" onClick={onSave} disabled={saving}>
                                {saving ? 'Saving…' : 'Save changes'}
                            </button>
                        </div>
                    </div>

                    {/* ── Right: analytics card ── */}
                    <div className="profile-card profile-analytics">
                        <h3>Your Analytics</h3>
                        {analytics ? (
                            <div className="analytics-list">
                                <div>
                                    <span>Total media tracked</span>
                                    <strong>{analytics.totalMedia}</strong>
                                </div>
                                <div>
                                    <span>Finished</span>
                                    <strong>{analytics.finishedCount}</strong>
                                </div>
                                <div>
                                    <span>Unfinished</span>
                                    <strong>{analytics.unfinishedCount}</strong>
                                </div>
                                <div>
                                    <span>Average rating</span>
                                    <strong>{(analytics.averageRating ?? 0).toFixed(1)} / 10</strong>
                                </div>
                                <div className="breakdown">
                                    <h4>Media type breakdown</h4>
                                    <div>
                                        <ChartPieCanvas
                                            labels={Object.keys(analytics.mediaTypeBreakdown ?? {})}
                                            data={Object.values(analytics.mediaTypeBreakdown ?? {}) as number[]}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p style={{ color: 'var(--muted)', fontSize: 13 }}>Loading analytics…</p>
                        )}
                    </div>

                </section>
            </main>
        </div>
    );
};

export default ProfilePage;
