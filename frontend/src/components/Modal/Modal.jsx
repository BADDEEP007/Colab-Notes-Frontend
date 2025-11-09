import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useFocusTrap, useFocusRestore } from '../../hooks/useKeyboardShortcuts';
import './Modal.css';

/**
 * Modal Component System
 * 
 * A flexible modal system with glassmorphism styling, backdrop blur,
 * and smooth scale animations.
 * 
 * @component
 * @example
 * <Modal isOpen={isOpen} onClose={handleClose}>
 *   <ModalHeader>Title</ModalHeader>
 *   <ModalBody>Content</ModalBody>
 *   <ModalFooter>Actions</ModalFooter>
 * </Modal>
 */

/**
 * ModalOverlay - Backdrop with blur effect
 */
export const ModalOverlay = ({ onClick, blur = true }) => {
  return (
    <div 
      className={`modal-overlay ${blur ? 'modal-overlay-blur' : ''}`}
      onClick={onClick}
      aria-hidden="true"
    />
  );
};

ModalOverlay.propTypes = {
  onClick: PropTypes.func,
  blur: PropTypes.bool,
};

/**
 * ModalContent - Main content container with glass styling
 */
export const ModalContent = ({ children, className = '' }) => {
  return (
    <div className={`modal-content scale-in ${className}`}>
      {children}
    </div>
  );
};

ModalContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

/**
 * ModalHeader - Header section with title and close button
 */
export const ModalHeader = ({ children, onClose, className = '' }) => {
  return (
    <div className={`modal-header ${className}`}>
      <h2 className="modal-title">{children}</h2>
      {onClose && (
        <button
          className="modal-close-button"
          onClick={onClose}
          aria-label="Close modal"
          type="button"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
};

ModalHeader.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func,
  className: PropTypes.string,
};

/**
 * ModalBody - Body section for main content
 */
export const ModalBody = ({ children, className = '' }) => {
  return (
    <div className={`modal-body ${className}`}>
      {children}
    </div>
  );
};

ModalBody.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

/**
 * ModalFooter - Footer section for action buttons
 */
export const ModalFooter = ({ children, className = '' }) => {
  return (
    <div className={`modal-footer ${className}`}>
      {children}
    </div>
  );
};

ModalFooter.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

/**
 * Modal - Main modal component
 */
const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  className = '',
  closeOnOverlayClick = true,
  closeOnEscape = true,
}) => {
  const modalRef = useRef(null);

  // Implement focus trap to keep focus within modal
  useFocusTrap(modalRef, isOpen);

  // Restore focus to previously focused element when modal closes
  useFocusRestore(isOpen);

  // Handle escape key press
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal-container" 
      role="dialog" 
      aria-modal="true"
      ref={modalRef}
    >
      <ModalOverlay onClick={handleOverlayClick} blur={true} />
      <div className="modal-wrapper" onClick={handleOverlayClick}>
        <ModalContent className={className}>
          {children}
        </ModalContent>
      </div>
    </div>
  );
};

Modal.propTypes = {
  /** Whether the modal is open */
  isOpen: PropTypes.bool.isRequired,
  /** Function to call when modal should close */
  onClose: PropTypes.func.isRequired,
  /** Modal content */
  children: PropTypes.node.isRequired,
  /** Additional CSS classes for modal content */
  className: PropTypes.string,
  /** Whether clicking overlay closes modal */
  closeOnOverlayClick: PropTypes.bool,
  /** Whether pressing Escape closes modal */
  closeOnEscape: PropTypes.bool,
};

export default Modal;
