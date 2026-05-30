import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import authService from '../services/authService';
import mediaService, { MediaItemRequest, MediaItemResponse, SeriesStatus, UserStatus, MediaType } from '../services/mediaService';
import shelfService, { ShelfResponse } from '../services/shelfService';
import './shelf.css';
import ConfirmDialog from '../components/ConfirmDialog';
import Navbar from "../components/Navbar";

const MEDIA_TYPES: { label: string; value: MediaType }[] = [
    { label: 'Movie', value: 'MOVIE' },
    { label: 'Book', value: 'BOOK' },
    { label: 'Comic / Manga', value: 'COMIC' },
    { label: 'TV Show', value: 'TV_SHOW' },
    { label: 'Game', value: 'GAME' },
];

const SERIES_STATUSES: { label: string; value: SeriesStatus }[] = [
    { label: 'Finished', value: 'FINISHED' },
    { label: 'Unfinished', value: 'UNFINISHED' },
    { label: 'In-Progress', value: 'IN_PROGRESS' },
];

const USER_STATUSES: { label: string; value: UserStatus }[] = [
    { label: 'Finished', value: 'FINISHED' },
    { label: 'Unfinished', value: 'UNFINISHED' },
    { label: 'In-Progress', value: 'IN_PROGRESS' },
];

interface MediaFormState {
    title: string;
    creator: string;
    coverUrl: string;
    mediaLink: string;
    rating: number | null;
    comment: string;
    type: MediaType;
    seriesStatus: SeriesStatus;
    userStatus: UserStatus;
    genres: string;
}

const emptyForm: MediaFormState = {
    title: '',
    creator: '',
    coverUrl: '',
    mediaLink: '',
    rating: null,
    comment: '',
    type: 'MOVIE',
    seriesStatus: 'UNFINISHED',
    userStatus: 'UNFINISHED',
    genres: '',
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
    const [formCoverFile, setFormCoverFile] = useState<File | null>(null);
    const [formCoverPreview, setFormCoverPreview] = useState('');

    const [editingItem, setEditingItem] = useState<MediaItemResponse | null>(null);
    const [editForm, setEditForm] = useState<MediaFormState>(emptyForm);
    const [updating, setUpdating] = useState(false);
    const [editCoverFile, setEditCoverFile] = useState<File | null>(null);
    const [editCoverPreview, setEditCoverPreview] = useState('');
    const [copyStatus, setCopyStatus] = useState('');
    const [shelfRatingInput, setShelfRatingInput] = useState<number | null>(null);
    const [mediaRatingInputs, setMediaRatingInputs] = useState<Record<number, number>>({});
    const [ratingNotice, setRatingNotice] = useState('');

    const isOwner = shelf?.ownerUsername && user?.username
        ? shelf.ownerUsername === user.username
        : false;

    const canRate = shelf ? shelf.isPublic || isOwner : false;

    const buildStarDisplay = (average?: number) => {
        if (average === undefined || average === null) return '';
        const clamped = Math.max(0, Math.min(5, Math.round(average / 2)));
        const filled = '★★★★★'.slice(0, clamped);
        const empty = '☆☆☆☆☆'.slice(0, 5 - clamped);
        return `${filled}${empty}`;
    };

    const formatStatus = (value?: string | null) => {
        if (!value) return '';
        return value.replace('_', ' ');
    };

    const buildHalfStarInput = (
        value: number | null,
        onChange: (next: number) => void,
        label: string,
    ) => (
        <div className="star-input" role="radiogroup" aria-label={label}>
            {Array.from({ length: 5 }, (_, index) => {
                const fill = Math.max(0, Math.min(1, (value ?? 0) - index));
                return (
                    <div key={index} className="star-input__cell">
                        <span className="star-input__base">★</span>
                        <span className="star-input__fill" style={{ width: `${fill * 100}%` }}>★</span>
                        <button
                            type="button"
                            className="star-input__hit star-input__hit--left"
                            onClick={() => onChange(index + 0.5)}
                            aria-label={`${index + 0.5} stars`}
                        />
                        <button
                            type="button"
                            className="star-input__hit star-input__hit--right"
                            onClick={() => onChange(index + 1)}
                            aria-label={`${index + 1} stars`}
                        />
                    </div>
                );
            })}
        </div>
    );

    const updateCoverPreview = (
        file: File | null,
        setPreview: React.Dispatch<React.SetStateAction<string>>,
    ) => {
        setPreview(prev => {
            if (prev) {
                URL.revokeObjectURL(prev);
            }
            if (!file) {
                return '';
            }
            return URL.createObjectURL(file);
        });
    };

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
            if (field === 'userStatus' && value !== 'FINISHED') {
                next.rating = null;
                next.comment = '';
            }
            return next;
        });
    };

    const updateEditField = (field: keyof MediaFormState, value: string) => {
        setEditForm(prev => {
            const next = { ...prev, [field]: value };
            if (field === 'userStatus' && value !== 'FINISHED') {
                next.rating = null;
                next.comment = '';
            }
            return next;
        });
    };

    const handleFormCoverChange = (file: File | null) => {
        setFormCoverFile(file);
        updateCoverPreview(file, setFormCoverPreview);
    };

    const handleEditCoverChange = (file: File | null) => {
        setEditCoverFile(file);
        updateCoverPreview(file, setEditCoverPreview);
    };

    const handleSubmit = async () => {
        if (!form.title.trim()) {
            setError('Title is required.');
            return;
        }

        if (form.userStatus === 'FINISHED' && form.rating !== null) {
            if (form.rating < 0.5 || form.rating > 5) {
                setError('Rating must be between 0.5 and 5 stars.');
                return;
            }
        }

        const ratingValue = form.userStatus === 'FINISHED' && form.rating !== null
            ? Math.round(form.rating * 2)
            : undefined;
        const genres = form.genres
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean);

        const payload: MediaItemRequest = {
            title: form.title.trim(),
            creator: form.creator.trim(),
            coverUrl: form.coverUrl.trim() || undefined,
            mediaLink: form.mediaLink.trim() || undefined,
            comment: form.userStatus === 'FINISHED' ? form.comment.trim() || undefined : undefined,
            type: form.type,
            seriesStatus: form.seriesStatus,
            userStatus: form.userStatus,
            genres: genres.length ? genres : undefined,
            rating: ratingValue,
        };

        setSaving(true);
        setError('');
        try {
            const created = await mediaService.addMediaItem(parsedShelfId, payload);
            const withCover = formCoverFile
                ? await mediaService.uploadCoverImage(parsedShelfId, created.id, formCoverFile)
                : created;

            setItems(prev => [withCover, ...prev]);
            setForm(emptyForm);
            setFormCoverFile(null);
            setFormCoverPreview('');
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
            rating: item.rating ? item.rating / 2 : null,
            comment: item.comment || '',
            type: item.type,
            seriesStatus: item.seriesStatus,
            userStatus: item.userStatus,
            genres: item.genres ? item.genres.join(', ') : '',
        });
        setEditCoverFile(null);
        setEditCoverPreview(item.coverImageUrl || item.coverUrl || '');
    };

    const handleUpdate = async () => {
        if (!editingItem) return;
        if (!editForm.title.trim()) {
            setError('Title is required.');
            return;
        }

        if (editForm.userStatus === 'FINISHED' && editForm.rating !== null) {
            if (editForm.rating < 0.5 || editForm.rating > 5) {
                setError('Rating must be between 0.5 and 5 stars.');
                return;
            }
        }

        const ratingValue = editForm.userStatus === 'FINISHED' && editForm.rating !== null
            ? Math.round(editForm.rating * 2)
            : undefined;
        const genres = editForm.genres
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean);

        const payload: MediaItemRequest = {
            title: editForm.title.trim(),
            creator: editForm.creator.trim(),
            coverUrl: editForm.coverUrl.trim() || undefined,
            mediaLink: editForm.mediaLink.trim() || undefined,
            comment: editForm.userStatus === 'FINISHED' ? editForm.comment.trim() || undefined : undefined,
            type: editForm.type,
            seriesStatus: editForm.seriesStatus,
            userStatus: editForm.userStatus,
            genres: genres.length ? genres : undefined,
            rating: ratingValue,
        };

        setUpdating(true);
        setError('');
        try {
            const updated = await mediaService.updateMediaItem(parsedShelfId, editingItem.id, payload);
            const withCover = editCoverFile
                ? await mediaService.uploadCoverImage(parsedShelfId, editingItem.id, editCoverFile)
                : updated;

            setItems(prev => prev.map(item => (item.id === withCover.id ? withCover : item)));
            setEditingItem(null);
            setEditCoverFile(null);
            setEditCoverPreview('');
        } catch (err) {
            setError('Failed to update media item.');
        } finally {
            setUpdating(false);
        }
    };

    const closeEdit = () => {
        setEditingItem(null);
        setEditCoverFile(null);
        setEditCoverPreview('');
    };

    const handleRateShelf = async () => {
        if (!shelf || !canRate) return;
        if (!shelfRatingInput) {
            setError('Rating must be between 1 and 5 stars.');
            return;
        }
        setError('');
        try {
            const updated = await shelfService.rateShelf(shelf.id, shelfRatingInput * 2);
            setShelf(updated);
            setShelfRatingInput(null);
            setRatingNotice('Thanks for rating!');
        } catch (err) {
            setError('Failed to save shelf rating.');
        } finally {
            window.setTimeout(() => setRatingNotice(''), 2000);
        }
    };

    const handleRateMediaItem = async (itemId: number) => {
        if (!canRate) return;
        const ratingValue = mediaRatingInputs[itemId];
        if (!ratingValue) {
            setError('Rating must be between 1 and 5 stars.');
            return;
        }
        setError('');
        try {
            const updated = await mediaService.rateMediaItem(parsedShelfId, itemId, ratingValue * 2);
            setItems(prev => prev.map(item => (item.id === itemId ? updated : item)));
            setMediaRatingInputs(prev => ({ ...prev, [itemId]: 0 }));
        } catch (err) {
            setError('Failed to save media rating.');
        }
    };

    const [confirmDeleteMediaId, setConfirmDeleteMediaId] = useState<number | null>(null);

    const handleDeleteMedia = (itemId: number) => {
        if (!isOwner) return;
        setConfirmDeleteMediaId(itemId);
    };

    const confirmDeleteMedia = async () => {
        const itemId = confirmDeleteMediaId;
        if (!itemId) return;
        setError('');
        try {
            await mediaService.deleteMediaItem(parsedShelfId, itemId);
            setItems(prev => prev.filter(i => i.id !== itemId));
        } catch (err) {
            setError('Failed to delete media item.');
        } finally {
            setConfirmDeleteMediaId(null);
        }
    };

    const cancelDeleteMedia = () => setConfirmDeleteMediaId(null);

    const handleCopyLink = async () => {
        if (!shelf || !shelf.isPublic) return;
        const url = `${window.location.origin}/shelf/${shelf.id}`;
        try {
            await navigator.clipboard.writeText(url);
            setCopyStatus('Link copied!');
        } catch (err) {
            setCopyStatus('Copy failed.');
        }
        window.setTimeout(() => setCopyStatus(''), 2000);
    };

    return (
        <div className="shelf-page">
            <nav className="shelf-nav">
                <Navbar />
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
                        {shelf && (
                            <div className="rating-summary">
                                {shelf.ratingCount ? (
                                    <span>
                                        {buildStarDisplay(shelf.ratingAverage)} ({shelf.ratingCount})
                                    </span>
                                ) : (
                                    <span>No community ratings yet.</span>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="shelf-header__actions">
                        {shelf?.isPublic && (
                            <div className="copy-link">
                                <button className="btn-secondary" onClick={handleCopyLink}>
                                    Copy link
                                </button>
                                {copyStatus && <span className="copy-link__status">{copyStatus}</span>}
                            </div>
                        )}
                        {shelf && canRate && (
                            <div className="rating-control">
                                <div className="star-picker" role="radiogroup" aria-label="Rate this shelf">
                                    {Array.from({ length: 5 }, (_, index) => {
                                        const value = index + 1;
                                        const isActive = shelfRatingInput !== null && value <= shelfRatingInput;
                                        return (
                                            <button
                                                key={value}
                                                type="button"
                                                className={`star-button${isActive ? ' star-button--active' : ''}`}
                                                onClick={() => setShelfRatingInput(value)}
                                                aria-checked={isActive}
                                                role="radio">
                                                ★
                                            </button>
                                        );
                                    })}
                                </div>
                                <button className="btn-secondary" onClick={handleRateShelf}>
                                    Rate shelf
                                </button>
                                {ratingNotice && <span className="copy-link__status">{ratingNotice}</span>}
                            </div>
                        )}
                        {isOwner && (
                            <button className="btn-primary" onClick={() => setShowForm(v => !v)}>
                                {showForm ? 'Close' : '+ Add Media'}
                            </button>
                        )}
                    </div>
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
                                <label htmlFor="media-genres">Genres</label>
                                <input
                                    id="media-genres"
                                    value={form.genres}
                                    onChange={e => updateField('genres', e.target.value)}
                                    placeholder="e.g. fantasy, mystery"
                                />
                            </div>
                            <div className="media-form__field">
                                <label htmlFor="media-type">Type</label>
                                <select id="media-type" value={form.type} onChange={e => updateField('type', e.target.value)}>
                                    {MEDIA_TYPES.map(type => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="media-form__row">
                            <div className="media-form__field">
                                <label htmlFor="media-series-status">Series status</label>
                                <select id="media-series-status" value={form.seriesStatus} onChange={e => updateField('seriesStatus', e.target.value)}>
                                    {SERIES_STATUSES.map(status => (
                                        <option key={status.value} value={status.value}>{status.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="media-form__field">
                                <label htmlFor="media-user-status">Your status</label>
                                <select id="media-user-status" value={form.userStatus} onChange={e => updateField('userStatus', e.target.value)}>
                                    {USER_STATUSES.map(status => (
                                        <option key={status.value} value={status.value}>{status.label}</option>
                                    ))}
                                </select>
                            </div>
                            {form.userStatus === 'FINISHED' && (
                                <div className="media-form__field">
                                    <label>Your rating</label>
                                    {buildHalfStarInput(form.rating, next => setForm(prev => ({ ...prev, rating: next })), 'Your rating')}
                                </div>
                            )}
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
                                <label htmlFor="media-upload">Cover upload</label>
                                <input
                                    id="media-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={e => handleFormCoverChange(e.target.files ? e.target.files[0] : null)}
                                />
                            </div>
                        </div>

                        <div className="media-form__row">
                            <div className="media-form__field media-form__field--full">
                                <label htmlFor="media-link">Where to watch / buy</label>
                                <input
                                    id="media-link"
                                    value={form.mediaLink}
                                    onChange={e => updateField('mediaLink', e.target.value)}
                                    placeholder="Streaming or store link"
                                />
                            </div>
                        </div>

                        {form.userStatus === 'FINISHED' && (
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
                        )}

                        {(formCoverPreview || form.coverUrl.trim()) && (
                            <div className="media-form__preview">
                                <img src={formCoverPreview || form.coverUrl} alt="Cover preview" />
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
                                {item.coverImageUrl || item.coverUrl ? (
                                    <img src={item.coverImageUrl || item.coverUrl} alt="Cover" className="media-card__cover" />
                                ) : (
                                    <div className="media-card__cover media-card__cover--empty">No cover</div>
                                )}
                                <div className="media-card__body">
                                    <div className="media-card__header">
                                        <h3>{item.title}</h3>
                                        {item.userStatus === 'FINISHED' && item.rating && (
                                            <span className="media-card__rating">{buildStarDisplay(item.rating)} ({item.rating / 2}/5)</span>
                                        )}
                                    </div>
                                    <p className="media-card__creator">{item.creator || 'Unknown creator'}</p>
                                    <div className="media-card__meta">
                                        <span>{(item.type || '').replace('_', ' ')}</span>
                                        <span>-</span>
                                        <span>Series: {formatStatus(item.seriesStatus)}</span>
                                        <span>-</span>
                                        <span>You: {formatStatus(item.userStatus)}</span>
                                    </div>
                                    {item.genres && item.genres.length > 0 && (
                                        <div className="media-card__genres">
                                            {item.genres.map(genre => (
                                                <span key={genre} className="media-card__genre">{genre}</span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="media-card__ratings">
                                        {item.ratingCount ? (
                                            <span>{buildStarDisplay(item.ratingAverage)} ({item.ratingCount})</span>
                                        ) : (
                                            <span>No community ratings yet.</span>
                                        )}
                                    </div>
                                    {canRate && (
                                        <div className="media-card__rate">
                                            <div className="star-picker star-picker--compact" role="radiogroup" aria-label="Rate this media">
                                                {Array.from({ length: 5 }, (_, index) => {
                                                    const value = index + 1;
                                                    const current = mediaRatingInputs[item.id] || 0;
                                                    const isActive = value <= current;
                                                    return (
                                                        <button
                                                            key={value}
                                                            type="button"
                                                            className={`star-button${isActive ? ' star-button--active' : ''}`}
                                                            onClick={() => setMediaRatingInputs(prev => ({
                                                                ...prev,
                                                                [item.id]: value,
                                                            }))}
                                                            aria-checked={isActive}
                                                            role="radio">
                                                            ★
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <button
                                                className="btn-secondary"
                                                onClick={() => handleRateMediaItem(item.id)}>
                                                Rate
                                            </button>
                                        </div>
                                    )}
                                    {item.userStatus === 'FINISHED' && item.comment && (
                                        <p className="media-card__comment">{item.comment}</p>
                                    )}
                                    {item.mediaLink && (
                                        <a className="media-card__link" href={item.mediaLink} target="_blank" rel="noreferrer">
                                            Open link
                                        </a>
                                    )}
                                    {isOwner && (
                                        <>
                                            <button className="media-card__edit" onClick={() => openEdit(item)}>
                                                Edit
                                            </button>
                                            <button className="media-card__delete media-card__delete--dark" onClick={() => handleDeleteMedia(item.id)}>
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            </article>
                        ))}
                    </section>
                )}
            </main>

                {confirmDeleteMediaId !== null && (
                    <ConfirmDialog
                        title="Delete media item"
                        message="Delete this media item? This cannot be undone."
                        confirmLabel="Delete"
                        cancelLabel="Cancel"
                        onConfirm={confirmDeleteMedia}
                        onCancel={cancelDeleteMedia}
                    />
                )}

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
                                    <label htmlFor="edit-genres">Genres</label>
                                    <input
                                        id="edit-genres"
                                        value={editForm.genres}
                                        onChange={e => updateEditField('genres', e.target.value)}
                                        placeholder="e.g. fantasy, mystery"
                                    />
                                </div>
                                <div className="media-form__field">
                                    <label htmlFor="edit-type">Type</label>
                                    <select id="edit-type" value={editForm.type} onChange={e => updateEditField('type', e.target.value)}>
                                        {MEDIA_TYPES.map(type => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="media-form__row">
                                <div className="media-form__field">
                                    <label htmlFor="edit-series-status">Series status</label>
                                    <select id="edit-series-status" value={editForm.seriesStatus} onChange={e => updateEditField('seriesStatus', e.target.value)}>
                                        {SERIES_STATUSES.map(status => (
                                            <option key={status.value} value={status.value}>{status.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="media-form__field">
                                    <label htmlFor="edit-user-status">Your status</label>
                                    <select id="edit-user-status" value={editForm.userStatus} onChange={e => updateEditField('userStatus', e.target.value)}>
                                        {USER_STATUSES.map(status => (
                                            <option key={status.value} value={status.value}>{status.label}</option>
                                        ))}
                                    </select>
                                </div>
                                {editForm.userStatus === 'FINISHED' && (
                                    <div className="media-form__field">
                                        <label>Your rating</label>
                                        {buildHalfStarInput(editForm.rating, next => setEditForm(prev => ({ ...prev, rating: next })), 'Your rating')}
                                    </div>
                                )}
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
                                    <label htmlFor="edit-upload">Cover upload</label>
                                    <input
                                        id="edit-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={e => handleEditCoverChange(e.target.files ? e.target.files[0] : null)}
                                    />
                                </div>
                            </div>

                            <div className="media-form__row">
                                <div className="media-form__field media-form__field--full">
                                    <label htmlFor="edit-link">Where to watch / buy</label>
                                    <input
                                        id="edit-link"
                                        value={editForm.mediaLink}
                                        onChange={e => updateEditField('mediaLink', e.target.value)}
                                    />
                                </div>
                            </div>

                            {editForm.userStatus === 'FINISHED' && (
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
                            )}

                            {editCoverPreview && (
                                <div className="media-form__preview">
                                    <img src={editCoverPreview} alt="Cover preview" />
                                </div>
                            )}
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

