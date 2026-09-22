'use client';

import { useEffect, useRef } from 'react';
import './success-modal.css';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuccessModal = ({ isOpen, onClose }: SuccessModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="success-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="success-modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-modal-title"
        aria-describedby="success-modal-description"
      >
        <div className="success-modal-icon" aria-hidden="true">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 id="success-modal-title" className="success-modal-title">
          Заказ успешно оформлен!
        </h2>
        <p id="success-modal-description" className="success-modal-text">
          Мы свяжемся с вами в ближайшее время для подтверждения заказа.
        </p>

        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="success-modal-button"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
};
