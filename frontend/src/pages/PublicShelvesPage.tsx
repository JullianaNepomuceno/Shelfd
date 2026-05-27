import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import shelfService, { ShelfResponse } from '../services/shelfService';
import './public-shelves.css';

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

    return (
        <div className="public-shelves">
            <nav className="public-shelves__nav">
                <button className="btn-back" onClick={() => navigate('/dashboard')}>Back</button>
                <div className="public-shelves__nav-right">
                    <span className="public-shelves__user">@{user?.username}</span>
                    <button className="btn-logout" onClick={() => { authService.logout(); navigate('/login'); }}>
                        Log out
                    </button>
                </div>
            </nav>

            <main className="public-shelves__main">
                <header className="public-shelves__header">
                    <h1>Public Shelves</h1>
                    <p>Browse community shelves and explore new picks.</p>
                </header>

                {error && <p className="public-shelves__error">{error}</p>}

                {loading ? (
                    <p className="public-shelves__loading">Loading public shelves...</p>
                ) : shelves.length === 0 ? (
                    <div className="public-shelves__empty">
                        <p>No public shelves yet.</p>
                        <p>Create one and toggle it to public to share.</p>
                    </div>
                ) : (
                    <section className="public-shelves__grid">
                        {shelves.map(shelf => (
                            <article key={shelf.id} className="public-shelf-card">
                                <div className="public-shelf-card__header">
                                    <h2>{shelf.name}</h2>
                                    <button
                                        className="public-shelf-card__open"
                                        onClick={() => navigate(`/shelf/${shelf.id}`)}>
                                        Open shelf
                                    </button>
                                </div>
                                {shelf.description && (
                                    <p className="public-shelf-card__desc">{shelf.description}</p>
                                )}
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
