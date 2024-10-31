import React, { useState } from 'react';
import "./css/Page1.css";
import "./css/Page2.css";

function SubmissionDetails({ submission, selectedVideo, onClose }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);

    const openModal = (videoUrl) => {
        setSelectedVideoUrl(videoUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedVideoUrl(null);
        onClose();  // 부모 모달 닫기 함수 호출
    };

    if (!selectedVideo) return null;

    return (
        <div>
            <hr />
            <section>
                <h2>{submission.userName}의 출품작 상세 정보</h2>

                <div className='page2'>
                    <p className="info">출품정보 확인</p>
                    <ul className="box box1">
               <button onClick={onClose} className="close-button">닫기</button>

                        <li className="first">작품제목<span className="red">*</span></li>
                        <li className="second">{selectedVideo.title}</li>
                    </ul>
                    <ul className="box box4">
                        <li className="first">작품내용<span className="red">*</span></li>
                        <li className="second">{selectedVideo.description}</li>
                    </ul>
                    <ul className="box box1">
                        <li className="first">감독명<span className="red">*</span></li>
                        <li className="second">{selectedVideo.director}</li>
                    </ul>
                    <ul className="box box1">
                        <li className="first">배우명</li>
                        <li className="second">{selectedVideo.actors}</li>
                    </ul>
                    <ul className="box box1">
                        <li className="first">추가정보</li>
                        <li className="second">{selectedVideo.additionalInfo}</li>
                    </ul>

                    <div className="two-columns">
                        <ul className="box drop video-box">
                            <li className="first"><span className='Tbr'>작품 영상</span> 첨부</li>
                            <li className="show">
                                <div className="showBorder">
                                    {selectedVideo.videoUrl ? (
                                        <video
                                            onClick={() => openModal(selectedVideo.videoUrl)}
                                            className="videoPreview"
                                            controls
                                        >
                                            <source src={selectedVideo.videoUrl} type="video/mp4" />
                                            브라우저가 비디오 태그를 지원하지 않습니다.
                                        </video>
                                    ) : (
                                        <span>영상이 업로드되지 않았습니다.</span>
                                    )}
                                </div>
                            </li>
                        </ul>
                        <ul className="box drop thumbnail-box">
                            <li className="first"><span className='Tbr'>작품 썸네일</span> 첨부</li>
                            <li className="show">
                                <div className="showBorder">
                                    {selectedVideo.thumbnailUrl ? (
                                        <img
                                            src={selectedVideo.thumbnailUrl}
                                            alt="썸네일"
                                            className="plusImage"
                                        />
                                    ) : (
                                        <span>썸네일이 업로드되지 않았습니다.</span>
                                    )}
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {isModalOpen && selectedVideoUrl && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <video src={selectedVideoUrl} controls />
                            <button onClick={closeModal} className="close-button">닫기</button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}

export default SubmissionDetails;
