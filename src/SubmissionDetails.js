import React from 'react';
import Modal from "react-modal";

const SubmissionDetails = ({ isOpen, onClose, submission }) => {
    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="제출 세부 정보">
            <h2>제출 세부 정보</h2>
            {submission && (
                <div>
                    <p><strong>이름:</strong> {submission.memberName}</p>
                    <p><strong>사용자 ID:</strong> {submission.memberId}</p> {/* 이 데이터가 submission에 있는지 확인 */}
                    <p><strong>연락처:</strong> {submission.contact}</p> {/* 이 데이터를 전달하는지 확인 */}
                    <p><strong>제출 시간:</strong> {submission.submissionTime?.toString()}</p> {/* null 안전하게 처리 */}
                    <p><strong>개인정보 동의:</strong> {submission.agreement ? "동의함" : "동의하지 않음"}</p>
                    <h3>작품 URL</h3>
                    {submission.videos && submission.videos.length > 0 ? (
                        <ul>
                            {submission.videos.map(video => (
                                <li key={video.id}>{video.videoUrl}</li>
                            ))}
                        </ul>
                    ) : (
                        <span>비디오 없음</span>
                    )}
                </div>
            )}
            <button onClick={onClose}>닫기</button>
        </Modal>
    );
};

export default SubmissionDetails;
