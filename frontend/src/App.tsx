import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import PublicShelvesPage from './pages/PublicShelvesPage';
import ShelfPage from './pages/ShelfPage';
import ProfilePage from './pages/ProfilePage';
import MonthlyTopShelvesPage from './pages/MonthlyTopShelvesPage';
import authService from './services/authService';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return authService.isLoggedIn() ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/dashboard" element={
                    <PrivateRoute>
                        <DashboardPage />
                    </PrivateRoute>
                } />
                <Route path="/public-shelves" element={
                    <PrivateRoute>
                        <PublicShelvesPage />
                    </PrivateRoute>
                } />
                <Route path="/monthly-top-shelves" element={
                    <PrivateRoute>
                        <MonthlyTopShelvesPage />
                    </PrivateRoute>
                } />
                <Route path="/profile" element={
                    <PrivateRoute>
                        <ProfilePage />
                    </PrivateRoute>
                } />
                <Route path="/shelf/:shelfId" element={
                    <PrivateRoute>
                        <ShelfPage />
                    </PrivateRoute>
                } />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
