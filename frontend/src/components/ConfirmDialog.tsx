import React from 'react';
import './ConfirmDialog.css';

interface Props {
    title?: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog: React.FC<Props> = ({ title, message, confirmLabel = 'Delete', cancelLabel = 'Cancel', onConfirm, onCancel }) => {
    return (
        <div className="modal-overlay">
            <div className="modal" role="dialog" aria-modal="true">
                <div className="modal-header">
                    <h2>{title || 'Confirm'}</h2>
                    <button className="modal-close" onClick={onCancel} aria-label="Close">×</button>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                <div className="modal-actions">
                    <button className="btn-secondary" onClick={onCancel}>{cancelLabel}</button>
                    <button className="btn-primary" onClick={onConfirm}>{confirmLabel}</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
