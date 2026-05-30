import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import shelfService, { ShelfResponse } from '../services/shelfService';
import './public-shelves.css';
import Navbar from '../components/Navbar';

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
                <Navbar />
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
