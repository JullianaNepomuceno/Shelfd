import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import shelfService, { ShelfResponse } from '../services/shelfService';
import './dashboard.css';
import ConfirmDialog from '../components/ConfirmDialog';

const ShelfdLogoWhite: React.FC = () => (
    <svg width="28" height="28" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <rect x="1"  y="3"  width="4" height="16" rx="1" fill="#C4532A" />
        <rect x="7"  y="5"  width="3" height="14" rx="1" fill="rgba(255,255,255,0.5)" />
        <rect x="12" y="2"  width="5" height="17" rx="1" fill="rgba(255,255,255,0.3)" />
        <rect x="19" y="6"  width="2" height="13" rx="1" fill="rgba(255,255,255,0.6)" />
        <rect x="0"  y="18" width="22" height="2"  rx="1" fill="rgba(255,255,255,0.2)" />
    </svg>
);

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const user = authService.getUser();

    const [shelves, setShelves] = useState<ShelfResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [newShelfName, setNewShelfName] = useState('');
    const [newShelfDesc, setNewShelfDesc] = useState('');
    const [newShelfPublic, setNewShelfPublic] = useState(false);
    const [creating, setCreating] = useState(false);

    const [editingShelfId, setEditingShelfId] = useState<number | null>(null);
    const [editShelfName, setEditShelfName] = useState('');
    const [editShelfDesc, setEditShelfDesc] = useState('');
    const [editShelfPublic, setEditShelfPublic] = useState(false);
    const [savingEditId, setSavingEditId] = useState<number | null>(null);

    useEffect(() => {
        fetchShelves();
    }, []);

    const fetchShelves = async () => {
        try {
            const data = await shelfService.getMyShelves();
            setShelves(data);
        } catch (err) {
            setError('Failed to load shelves.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateShelf = async () => {
        if (!newShelfName.trim()) return;
        setCreating(true);
        try {
            const created = await shelfService.createShelf({
                name: newShelfName,
                description: newShelfDesc,
                isPublic: newShelfPublic,
            });
            setShelves(prev => [...prev, created]);
            setNewShelfName('');
            setNewShelfDesc('');
            setNewShelfPublic(false);
            setShowForm(false);
        } catch (err) {
            setError('Failed to create shelf.');
        } finally {
            setCreating(false);
        }
    };

    const startEditShelf = (shelf: ShelfResponse) => {
        setEditingShelfId(shelf.id);
        setEditShelfName(shelf.name);
        setEditShelfDesc(shelf.description || '');
        setEditShelfPublic(shelf.isPublic);
    };

    const cancelEditShelf = () => {
        setEditingShelfId(null);
        setEditShelfName('');
        setEditShelfDesc('');
        setEditShelfPublic(false);
    };

    const handleUpdateShelf = async (id: number) => {
        if (!editShelfName.trim()) return;
        setSavingEditId(id);
        try {
            const updated = await shelfService.updateShelf(id, {
                name: editShelfName,
                description: editShelfDesc,
                isPublic: editShelfPublic,
            });
            setShelves(prev => prev.map(shelf => (shelf.id === id ? updated : shelf)));
            cancelEditShelf();
        } catch (err) {
            setError('Failed to update shelf.');
        } finally {
            setSavingEditId(null);
        }
    };

    const [confirmDeleteShelfId, setConfirmDeleteShelfId] = useState<number | null>(null);

    const handleDeleteShelf = (id: number) => {
        setConfirmDeleteShelfId(id);
    };

    const confirmDeleteShelf = async () => {
        const id = confirmDeleteShelfId;
        if (!id) return;
        try {
            await shelfService.deleteShelf(id);
            setShelves(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            setError('Failed to delete shelf.');
        } finally {
            setConfirmDeleteShelfId(null);
        }
    };

    const cancelDeleteShelf = () => setConfirmDeleteShelfId(null);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <div className="dashboard">

            {/* ── Navbar ── */}
            <nav className="dashboard-nav">
                <div className="dashboard-nav__left">
                    <div className="dashboard-nav__brand">
                        <ShelfdLogoWhite />
                        <span>Shelfd</span>
                    </div>
                </div>
                <div className="dashboard-nav__center">
                    <NavLink
                        to="/public-shelves"
                        className={({ isActive }) =>
                            `dashboard-nav__link${isActive ? ' dashboard-nav__link--active' : ''}`
                        }
                    >
                        Discover
                    </NavLink>
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `dashboard-nav__link${isActive ? ' dashboard-nav__link--active' : ''}`
                        }
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/monthly-top-shelves"
                        className={({ isActive }) =>
                            `dashboard-nav__link${isActive ? ' dashboard-nav__link--active' : ''}`
                        }
                    >
                        Monthly Top Shelves
                    </NavLink>
                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            `dashboard-nav__link${isActive ? ' dashboard-nav__link--active' : ''}`
                        }
                    >
                        Profile
                    </NavLink>
                </div>
                <div className="dashboard-nav__right">
                    <span className="dashboard-nav__user">@{user?.username}</span>
                    <button className="btn-logout" onClick={handleLogout}>Log out</button>
                </div>
            </nav>

            {/* ── Main content ── */}
            <main className="dashboard-main">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">My Shelves</h1>
                    <div className="dashboard-header__actions">
                        <button className="btn-new-shelf" onClick={() => setShowForm(v => !v)}>
                            + New Shelf
                        </button>
                    </div>
                </div>

                {error && <p className="dashboard-error">{error}</p>}

                {showForm && (
                    <div className="new-shelf-form">
                        <input className="shelf-input" placeholder="Shelf name"
                            value={newShelfName} onChange={e => setNewShelfName(e.target.value)} />
                        <input className="shelf-input" placeholder="Description (optional)"
                            value={newShelfDesc} onChange={e => setNewShelfDesc(e.target.value)} />
                        <label className="shelf-toggle">
                            <input
                                type="checkbox"
                                checked={newShelfPublic}
                                onChange={e => setNewShelfPublic(e.target.checked)}
                            />
                            <span>Make this shelf public</span>
                        </label>
                        <div className="new-shelf-form__actions">
                            <button className="btn-create" onClick={handleCreateShelf} disabled={creating}>
                                {creating ? 'Creating...' : 'Create'}
                            </button>
                            <button className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </div>
                )}

                {loading ? (
                    <p className="dashboard-loading">Loading your shelves...</p>
                ) : shelves.length === 0 ? (
                    <div className="dashboard-empty">
                        <p>You have no shelves yet.</p>
                        <p>Create one to start tracking your media!</p>
                    </div>
                ) : (
                    <div className="shelves-grid">
                        {shelves.map(shelf => (
                            (() => {
                                const isEditing = editingShelfId === shelf.id;
                                return (
                            <div key={shelf.id} className="shelf-card"
                                onClick={() => { if (!isEditing) navigate(`/shelf/${shelf.id}`); }}>
                                <div className="shelf-card__header">
                                    {isEditing ? (
                                        <input
                                            className="shelf-input shelf-input--edit"
                                            value={editShelfName}
                                            onChange={e => setEditShelfName(e.target.value)}
                                        />
                                    ) : (
                                        <div className="shelf-card__title">
                                            <h2 className="shelf-card__name">{shelf.name}</h2>
                                            <span className={`shelf-visibility-badge ${shelf.isPublic ? 'shelf-visibility-badge--public' : 'shelf-visibility-badge--private'}`}>
                                                {shelf.isPublic ? 'Public' : 'Private'}
                                            </span>
                                        </div>
                                    )}
                                    <div className="shelf-card__actions">
                                        {!isEditing && (
                                            <button
                                                className="shelf-card__edit"
                                                onClick={e => { e.stopPropagation(); startEditShelf(shelf); }}>
                                                Edit
                                            </button>
                                        )}
                                        <button className="shelf-card__delete shelf-card__delete--trash"
                                            onClick={e => { e.stopPropagation(); handleDeleteShelf(shelf.id); }}
                                            aria-label="Delete shelf">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                                <path d="M3 6h18" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M10 11v6" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M14 11v6" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                {isEditing ? (
                                    <div className="shelf-card__edit-body">
                                        <input
                                            className="shelf-input shelf-input--edit"
                                            placeholder="Description (optional)"
                                            value={editShelfDesc}
                                            onChange={e => setEditShelfDesc(e.target.value)}
                                        />
                                        <label className="shelf-toggle shelf-toggle--compact">
                                            <input
                                                type="checkbox"
                                                checked={editShelfPublic}
                                                onChange={e => setEditShelfPublic(e.target.checked)}
                                            />
                                            <span>Public shelf</span>
                                        </label>
                                        <div className="shelf-card__edit-actions">
                                            <button
                                                className="btn-create"
                                                onClick={e => { e.stopPropagation(); handleUpdateShelf(shelf.id); }}
                                                disabled={savingEditId === shelf.id}>
                                                {savingEditId === shelf.id ? 'Saving...' : 'Save'}
                                            </button>
                                            <button
                                                className="btn-cancel"
                                                onClick={e => { e.stopPropagation(); cancelEditShelf(); }}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {shelf.description && (
                                            <p className="shelf-card__desc">{shelf.description}</p>
                                        )}
                                        <span className="shelf-card__visibility">
                                            {shelf.isPublic ? 'Public shelf' : 'Private shelf'}
                                        </span>
                                    </>
                                )}
                            </div>
                                );
                            })()
                        ))}
                    </div>
                )}
            </main>
            {confirmDeleteShelfId !== null && (
                <ConfirmDialog
                    title="Delete shelf"
                    message="Are you sure you want to delete this shelf and all its media? This action cannot be undone."
                    confirmLabel="Delete shelf"
                    cancelLabel="Cancel"
                    onConfirm={confirmDeleteShelf}
                    onCancel={cancelDeleteShelf}
                />
            )}
        </div>
    );
};

export default DashboardPage;
