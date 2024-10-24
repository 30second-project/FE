// Modal.js
import React from 'react';
import '../src/css/Modal.css'; // 모달 스타일을 위한 CSS 파일 (선택 사항)

const Modal = ({ children, onClose }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    닫기
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
