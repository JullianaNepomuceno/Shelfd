import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import statsService, { MonthlyStats, RankEntry, TopShelfEntry } from '../services/statsService';
import authService from '../services/authService';
import './monthly-top-shelves.css';

const BAR_COLORS = ['#BA7517', '#888780', '#854F0B', '#534AB7', '#1D9E75'];
const RANK_COLORS: Record<number, string> = { 1: '#BA7517', 2: '#888780', 3: '#854F0B' };

const BillboardChart: React.FC<{ title: string; entries: RankEntry[] }> = ({ title, entries }) => {
    const max = Math.max(...entries.map(e => e.count), 1);
    return (
        <div className="monthly-card">
            <p className="monthly-section-title">{title}</p>
            {entries.length === 0 ? (
                <p style={{ color: 'var(--muted)', fontSize: 13, padding: '12px 0' }}>No data yet.</p>
            ) : entries.map((entry, i) => {
                const rank = i + 1;
                const pct = Math.round((entry.count / max) * 100);
                return (
                    <React.Fragment key={entry.label}>
                        <div className="monthly-row">
                            <span className="monthly-rank" style={{ color: RANK_COLORS[rank] ?? 'var(--muted, #888)' }}>
                                {rank}
                            </span>
                            <div className="monthly-bar-wrapper">
                                <div className="monthly-bar-header">
                                    <span className="monthly-bar-label" style={{ fontWeight: rank <= 3 ? 600 : 400 }}>
                                        {entry.label}
                                    </span>
                                    <span className="monthly-bar-count">{entry.count}</span>
                                </div>
                                <div className="monthly-bar-track">
                                    <div className="monthly-bar-fill"
                                        style={{ width: `${pct}%`, background: BAR_COLORS[i] ?? '#888' }} />
                                </div>
                            </div>
                        </div>
                        {rank < entries.length && <hr className="monthly-divider" />}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

const TopShelvesSection: React.FC<{ shelves: TopShelfEntry[] }> = ({ shelves }) => {
    const navigate = useNavigate();
    return (
        <div className="monthly-card">
            <p className="monthly-section-title">Top shelves this month</p>
            {shelves.length === 0 ? (
                <p style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
                    No rated public shelves yet. Be the first to share one!
                </p>
            ) : (
                <div className="monthly-top-shelves-grid">
                    {shelves.map((shelf, i) => {
                        const rank = i + 1;
                        return (
                            <div key={shelf.id} className="monthly-shelf-card"
                                onClick={() => navigate(`/shelf/${shelf.id}`)}>
                                <div className="monthly-shelf-card__header">
                                    <span className="monthly-shelf-rank"
                                        style={{ color: RANK_COLORS[rank] ?? 'var(--muted)' }}>
                                        {rank}
                                    </span>
                                    <span className="monthly-shelf-name">{shelf.name}</span>
                                </div>
                                <p className="monthly-shelf-owner">by @{shelf.ownerUsername}</p>
                                <p className="monthly-shelf-meta">
                                    ⭐ {shelf.ratingAverage.toFixed(1)} · {shelf.ratingCount} ratings
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const MonthlyTopShelvesPage: React.FC = () => {
    const [stats, setStats] = useState<MonthlyStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const user = authService.getUser();

    useEffect(() => {
        statsService.getMonthlyStats()
            .then(data => setStats(data))
            .catch(() => setError('Failed to load stats.'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="monthly-top">
            <Navbar />

            <main className="monthly-top__main">

                {/* ── Community section ── */}
                <header className="monthly-top__header">
                    <h1>Monthly Top Shelves</h1>
                    <p>Community highlights and rankings for this month.</p>
                </header>

                {error && <p style={{ color: '#e53e3e', fontSize: 13 }}>{error}</p>}

                {loading ? (
                    <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px 0' }}>
                        Loading stats...
                    </p>
                ) : stats ? (
                    <>
                        <div className="monthly-charts-grid">
                            <BillboardChart title="Top media types" entries={stats.topMediaTypes} />
                            <BillboardChart title="Top genres"      entries={stats.topGenres} />
                        </div>
                        <TopShelvesSection shelves={stats.topShelves} />

                        {/* ── Personal section ── */}
                        <div className="monthly-personal-header">
                            <h2 className="monthly-personal-title">Your personal top picks</h2>
                            <p className="monthly-personal-subtitle">
                                Based on everything @{user?.username} has tracked.
                            </p>
                        </div>

                        <div className="monthly-charts-grid">
                            <BillboardChart
                                title="Your top media types"
                                entries={stats.personalTopMediaTypes ?? []}
                            />
                            <BillboardChart
                                title="Your top genres"
                                entries={stats.personalTopGenres ?? []}
                            />
                        </div>
                    </>
                ) : null}
            </main>
        </div>
    );
};

export default MonthlyTopShelvesPage;
