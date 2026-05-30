import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './monthly-top-shelves.css';
import Navbar from "../components/Navbar";

const MonthlyTopShelvesPage: React.FC = () => {
    const navigate = useNavigate();
    const user = authService.getUser();

    return (
        <div className="monthly-top">
            <Navbar />

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
