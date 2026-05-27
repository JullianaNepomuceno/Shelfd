import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import authService from '../services/authService';
import mediaService, { MediaItemRequest, MediaItemResponse, MediaStatus, MediaType } from '../services/mediaService';
import shelfService, { ShelfResponse } from '../services/shelfService';
import './shelf.css';

const MEDIA_TYPES: { label: string; value: MediaType }[] = [
    { label: 'Movie', value: 'MOVIE' },
    { label: 'Book', value: 'BOOK' },
    { label: 'Comic / Manga', value: 'COMIC' },
    { label: 'TV Show', value: 'TV_SHOW' },
    { label: 'Game', value: 'GAME' },
];

const MEDIA_STATUSES: { label: string; value: MediaStatus }[] = [
    { label: 'Finished', value: 'FINISHED' },
    { label: 'Unfinished', value: 'UNFINISHED' },
    { label: 'In-Progress', value: 'IN_PROGRESS' },
];

interface MediaFormState {
    title: string;
    creator: string;
    coverUrl: string;
    mediaLink: string;
    rating: string;
    comment: string;
    type: MediaType;
    status: MediaStatus;
}

const emptyForm: MediaFormState = {
    title: '',
    creator: '',
    coverUrl: '',
    mediaLink: '',
    rating: '',
    comment: '',
    type: 'MOVIE',
    status: 'UNFINISHED',
};

const ShelfPage: React.FC = () => {
    const navigate = useNavigate();
    const { shelfId } = useParams();
    const user = authService.getUser();

    const parsedShelfId = useMemo(() => Number(shelfId), [shelfId]);

    const [shelf, setShelf] = useState<ShelfResponse | null>(null);
    const [items, setItems] = useState<MediaItemResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<MediaFormState>(emptyForm);

    const [editingItem, setEditingItem] = useState<MediaItemResponse | null>(null);
    const [editForm, setEditForm] = useState<MediaFormState>(emptyForm);
    const [updating, setUpdating] = useState(false);

    const isOwner = shelf?.ownerUsername && user?.username
        ? shelf.ownerUsername === user.username
        : false;

    useEffect(() => {
        if (!Number.isFinite(parsedShelfId)) {
            setError('Invalid shelf id.');
            setLoading(false);
            return;
        }

        const loadData = async () => {
            try {
                const [shelfData, mediaData] = await Promise.all([
                    shelfService.getShelfById(parsedShelfId),
                    mediaService.getMediaItems(parsedShelfId),
                ]);
                setShelf(shelfData);
                setItems(mediaData);
            } catch (err) {
                setError('Failed to load shelf data.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [parsedShelfId]);

    const updateField = (field: keyof MediaFormState, value: string) => {
        setForm(prev => {
            const next = { ...prev, [field]: value };
            if (field === 'status' && value !== 'FINISHED') {
                next.rating = '';
            }
            return next;
        });
    };

    const updateEditField = (field: keyof MediaFormState, value: string) => {
        setEditForm(prev => {
            const next = { ...prev, [field]: value };
            if (field === 'status' && value !== 'FINISHED') {
                next.rating = '';
            }
            return next;
        });
    };

    const parseRating = (value: string): number | undefined => {
        const trimmed = value.trim();
        if (!trimmed) return undefined;
        const numeric = Number(trimmed);
        if (Number.isNaN(numeric) || numeric < 1 || numeric > 10) {
            return undefined;
        }
        return numeric;
    };

    const handleSubmit = async () => {
        if (!form.title.trim()) {
            setError('Title is required.');
            return;
        }

        const ratingValue = form.status === 'FINISHED' ? parseRating(form.rating) : undefined;
        if (form.status === 'FINISHED' && form.rating.trim() && ratingValue === undefined) {
            setError('Rating must be a number between 1 and 10.');
            return;
        }

        const payload: MediaItemRequest = {
            title: form.title.trim(),
            creator: form.creator.trim(),
            coverUrl: form.coverUrl.trim() || undefined,
            mediaLink: form.mediaLink.trim() || undefined,
            comment: form.comment.trim() || undefined,
            type: form.type,
            status: form.status,
            rating: ratingValue,
        };

        setSaving(true);
        setError('');
        try {
            const created = await mediaService.addMediaItem(parsedShelfId, payload);
            setItems(prev => [created, ...prev]);
            setForm(emptyForm);
            setShowForm(false);
        } catch (err) {
            setError('Failed to add media item.');
        } finally {
            setSaving(false);
        }
    };

    const openEdit = (item: MediaItemResponse) => {
        setEditingItem(item);
        setEditForm({
            title: item.title || '',
            creator: item.creator || '',
            coverUrl: item.coverUrl || '',
            mediaLink: item.mediaLink || '',
            rating: item.rating ? String(item.rating) : '',
            comment: item.comment || '',
            type: item.type,
            status: item.status,
        });
    };

    const handleUpdate = async () => {
        if (!editingItem) return;
        if (!editForm.title.trim()) {
            setError('Title is required.');
            return;
        }

        const ratingValue = editForm.status === 'FINISHED' ? parseRating(editForm.rating) : undefined;
        if (editForm.status === 'FINISHED' && editForm.rating.trim() && ratingValue === undefined) {
            setError('Rating must be a number between 1 and 10.');
            return;
        }

        const payload: MediaItemRequest = {
            title: editForm.title.trim(),
            creator: editForm.creator.trim(),
            coverUrl: editForm.coverUrl.trim() || undefined,
            mediaLink: editForm.mediaLink.trim() || undefined,
            comment: editForm.comment.trim() || undefined,
            type: editForm.type,
            status: editForm.status,
            rating: ratingValue,
        };

        setUpdating(true);
        setError('');
        try {
            const updated = await mediaService.updateMediaItem(parsedShelfId, editingItem.id, payload);
            setItems(prev => prev.map(item => (item.id === updated.id ? updated : item)));
            setEditingItem(null);
        } catch (err) {
            setError('Failed to update media item.');
        } finally {
            setUpdating(false);
        }
    };

    const closeEdit = () => {
        setEditingItem(null);
    };

    return (
        <div className="shelf-page">
            <nav className="shelf-nav">
                <button className="btn-back" onClick={() => navigate('/dashboard')}>Back</button>
                <div className="shelf-nav__right">
                    <span className="shelf-nav__user">@{user?.username}</span>
                    <button className="btn-logout" onClick={() => { authService.logout(); navigate('/login'); }}>
                        Log out
                    </button>
                </div>
            </nav>

            <main className="shelf-main">
                <header className="shelf-header">
                    <div>
                        <h1 className="shelf-title">{shelf ? shelf.name : 'Shelf'}</h1>
                        <p className="shelf-subtitle">
                            {shelf ? shelf.description || 'Track your media here.' : 'Track your media here.'}
                        </p>
                        {shelf && (
                            <p className="shelf-owner">Owner: {shelf.ownerUsername}</p>
                        )}
                    </div>
                    {isOwner && (
                        <button className="btn-primary" onClick={() => setShowForm(v => !v)}>
                            {showForm ? 'Close' : '+ Add Media'}
                        </button>
                    )}
                </header>

                {error && <p className="shelf-error">{error}</p>}

                {showForm && isOwner && (
                    <section className="media-form">
                        <div className="media-form__row">
                            <div className="media-form__field">
                                <label htmlFor="media-title">Title</label>
                                <input
                                    id="media-title"
                                    value={form.title}
                                    onChange={e => updateField('title', e.target.value)}
                                    placeholder="Name of the media"
                                />
                            </div>
                            <div className="media-form__field">
                                <label htmlFor="media-creator">Author / Publisher</label>
                                <input
                                    id="media-creator"
                                    value={form.creator}
                                    onChange={e => updateField('creator', e.target.value)}
                                    placeholder="Creator, author, or publisher"
                                />
                            </div>
                        </div>

                        <div className="media-form__row">
                            <div className="media-form__field">
                                <label htmlFor="media-cover">Cover image URL</label>
                                <input
                                    id="media-cover"
                                    value={form.coverUrl}
                                    onChange={e => updateField('coverUrl', e.target.value)}
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="media-form__field">
                                <label htmlFor="media-link">Where to watch / buy</label>
                                <input
                                    id="media-link"
                                    value={form.mediaLink}
                                    onChange={e => updateField('mediaLink', e.target.value)}
                                    placeholder="Streaming or store link"
                                />
                            </div>
                        </div>

                        <div className="media-form__row">
                            <div className="media-form__field">
                                <label htmlFor="media-type">Type</label>
                                <select id="media-type" value={form.type} onChange={e => updateField('type', e.target.value)}>
                                    {MEDIA_TYPES.map(type => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="media-form__field">
                                <label htmlFor="media-status">Status</label>
                                <select id="media-status" value={form.status} onChange={e => updateField('status', e.target.value)}>
                                    {MEDIA_STATUSES.map(status => (
                                        <option key={status.value} value={status.value}>{status.label}</option>
                                    ))}
                                </select>
                            </div>
                            {form.status === 'FINISHED' && (
                                <div className="media-form__field">
                                    <label htmlFor="media-rating">Your rating</label>
                                    <input
                                        id="media-rating"
                                        type="number"
                                        min={1}
                                        max={10}
                                        value={form.rating}
                                        onChange={e => updateField('rating', e.target.value)}
                                        placeholder="1 - 10"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="media-form__row">
                            <div className="media-form__field media-form__field--full">
                                <label htmlFor="media-comment">Comment</label>
                                <textarea
                                    id="media-comment"
                                    rows={4}
                                    value={form.comment}
                                    onChange={e => updateField('comment', e.target.value)}
                                    placeholder="What did you think? Notes, vibes, or highlights."
                                />
                            </div>
                        </div>

                        {form.coverUrl.trim() && (
                            <div className="media-form__preview">
                                <img src={form.coverUrl} alt="Cover preview" />
                            </div>
                        )}

                        <div className="media-form__actions">
                            <button className="btn-primary" onClick={handleSubmit} disabled={saving}>
                                {saving ? 'Saving...' : 'Save media'}
                            </button>
                            <button className="btn-secondary" onClick={() => setShowForm(false)}>
                                Cancel
                            </button>
                        </div>
                    </section>
                )}

                {loading ? (
                    <p className="shelf-loading">Loading media...</p>
                ) : items.length === 0 ? (
                    <div className="shelf-empty">
                        <p>No media here yet.</p>
                        <p>Add your first item to get started.</p>
                    </div>
                ) : (
                    <section className="media-grid">
                        {items.map(item => (
                            <article key={item.id} className="media-card">
                                {item.coverUrl ? (
                                    <img src={item.coverUrl} alt="Cover" className="media-card__cover" />
                                ) : (
                                    <div className="media-card__cover media-card__cover--empty">No cover</div>
                                )}
                                <div className="media-card__body">
                                    <div className="media-card__header">
                                        <h3>{item.title}</h3>
                                        {item.status === 'FINISHED' && item.rating && (
                                            <span className="media-card__rating">{item.rating}/10</span>
                                        )}
                                    </div>
                                    <p className="media-card__creator">{item.creator || 'Unknown creator'}</p>
                                    <div className="media-card__meta">
                                        <span>{item.type.replace('_', ' ')}</span>
                                        <span>-</span>
                                        <span>{item.status.replace('_', ' ')}</span>
                                    </div>
                                    {item.comment && <p className="media-card__comment">{item.comment}</p>}
                                    {item.mediaLink && (
                                        <a className="media-card__link" href={item.mediaLink} target="_blank" rel="noreferrer">
                                            Open link
                                        </a>
                                    )}
                                    {isOwner && (
                                        <button className="media-card__edit" onClick={() => openEdit(item)}>
                                            Edit
                                        </button>
                                    )}
                                </div>
                            </article>
                        ))}
                    </section>
                )}
            </main>

            {editingItem && (
                <div className="modal-overlay" role="dialog" aria-modal="true">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Edit media</h2>
                            <button className="modal-close" onClick={closeEdit} aria-label="Close">x</button>
                        </div>
                        <div className="modal-body">
                            <div className="media-form__row">
                                <div className="media-form__field">
                                    <label htmlFor="edit-title">Title</label>
                                    <input
                                        id="edit-title"
                                        value={editForm.title}
                                        onChange={e => updateEditField('title', e.target.value)}
                                    />
                                </div>
                                <div className="media-form__field">
                                    <label htmlFor="edit-creator">Author / Publisher</label>
                                    <input
                                        id="edit-creator"
                                        value={editForm.creator}
                                        onChange={e => updateEditField('creator', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="media-form__row">
                                <div className="media-form__field">
                                    <label htmlFor="edit-cover">Cover image URL</label>
                                    <input
                                        id="edit-cover"
                                        value={editForm.coverUrl}
                                        onChange={e => updateEditField('coverUrl', e.target.value)}
                                    />
                                </div>
                                <div className="media-form__field">
                                    <label htmlFor="edit-link">Where to watch / buy</label>
                                    <input
                                        id="edit-link"
                                        value={editForm.mediaLink}
                                        onChange={e => updateEditField('mediaLink', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="media-form__row">
                                <div className="media-form__field">
                                    <label htmlFor="edit-type">Type</label>
                                    <select id="edit-type" value={editForm.type} onChange={e => updateEditField('type', e.target.value)}>
                                        {MEDIA_TYPES.map(type => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="media-form__field">
                                    <label htmlFor="edit-status">Status</label>
                                    <select id="edit-status" value={editForm.status} onChange={e => updateEditField('status', e.target.value)}>
                                        {MEDIA_STATUSES.map(status => (
                                            <option key={status.value} value={status.value}>{status.label}</option>
                                        ))}
                                    </select>
                                </div>
                                {editForm.status === 'FINISHED' && (
                                    <div className="media-form__field">
                                        <label htmlFor="edit-rating">Your rating</label>
                                        <input
                                            id="edit-rating"
                                            type="number"
                                            min={1}
                                            max={10}
                                            value={editForm.rating}
                                            onChange={e => updateEditField('rating', e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="media-form__row">
                                <div className="media-form__field media-form__field--full">
                                    <label htmlFor="edit-comment">Comment</label>
                                    <textarea
                                        id="edit-comment"
                                        rows={4}
                                        value={editForm.comment}
                                        onChange={e => updateEditField('comment', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-primary" onClick={handleUpdate} disabled={updating}>
                                {updating ? 'Saving...' : 'Save changes'}
                            </button>
                            <button className="btn-secondary" onClick={closeEdit}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShelfPage;
