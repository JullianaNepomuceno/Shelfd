import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ShelfPage from './ShelfPage';
import mediaService from '../services/mediaService';
import shelfService from '../services/shelfService';

jest.mock('../services/mediaService', () => {
    const actual = jest.requireActual('../services/mediaService');
    return {
        __esModule: true,
        ...actual,
        default: {
            getMediaItems: jest.fn(),
            addMediaItem: jest.fn(),
            updateMediaItem: jest.fn(),
        },
    };
});

jest.mock('../services/shelfService', () => ({
    __esModule: true,
    default: {
        getShelfById: jest.fn(),
        getPublicShelves: jest.fn(),
        getMyShelves: jest.fn(),
        createShelf: jest.fn(),
        updateShelf: jest.fn(),
        deleteShelf: jest.fn(),
    },
}));

jest.mock('../services/authService', () => ({
    __esModule: true,
    default: {
        getUser: () => ({ username: 'tester' }),
        logout: jest.fn(),
        isLoggedIn: () => true,
    },
}));

const mockMediaService = mediaService as unknown as {
    getMediaItems: jest.Mock;
};

const mockShelfService = shelfService as unknown as {
    getShelfById: jest.Mock;
};

const renderPage = () => render(
    <MemoryRouter initialEntries={['/shelf/1']}>
        <Routes>
            <Route path="/shelf/:shelfId" element={<ShelfPage />} />
        </Routes>
    </MemoryRouter>
);

test('rating input shows only for finished status', async () => {
    mockShelfService.getShelfById.mockResolvedValueOnce({
        id: 1,
        name: 'Shelf',
        description: '',
        isPublic: true,
        ownerUsername: 'tester',
        createdAt: '2026-05-27T00:00:00Z',
    });
    mockMediaService.getMediaItems.mockResolvedValueOnce([]);

    renderPage();

    const addButton = await screen.findByText('+ Add Media');
    fireEvent.click(addButton);

    await waitFor(() => {
        expect(screen.queryByLabelText(/your rating/i)).not.toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/status/i), { target: { value: 'FINISHED' } });

    expect(screen.getByLabelText(/your rating/i)).toBeInTheDocument();
});
