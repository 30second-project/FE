import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import "./css/Page1.css";
import "./css/Page2.css";

function SubmissionDetails() {
    const Server_IP = process.env.REACT_APP_Server_IP;
    const location = useLocation();
    const [works, setWorks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);

    const openModal = (videoUrl) => {
        setSelectedVideoUrl(videoUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedVideoUrl(null);
    };

    useEffect(() => {
        // 페이지 로드 시 영상 데이터를 백엔드에서 가져오기
        const fetchVideoData = async () => {
            try {
                const memberId = location.state?.memberId; // 회원 ID를 location에서 가져옴
                const response = await axios.get(`${Server_IP}/api/submission/videos/${memberId}`);
                setWorks(response.data); // 가져온 데이터로 works 상태 업데이트
            } catch (error) {
                console.error("Error fetching video data:", error);
            }
        };

        fetchVideoData();
        window.scrollTo(0, 0);
    }, [location.state, Server_IP]);

    return (
        <div>
            <hr />
            <section>
                {works.map((work, index) => (
                    <div key={index} className='page2'>
                        <p className="info">출품정보 확인</p>
                        <ul className="box box1">
                            <li className="first">작품제목<span className="red">*</span></li>
                            <li className="second">{work.title}</li>
                        </ul>
                        <ul className="box box4">
                            <li className="first">작품내용</li>
                            <li className="second">{work.description}</li>
                        </ul>
                        <ul className="box box1">
                            <li className="first">감독명</li>
                            <li className="second">{work.director}</li>
                        </ul>
                        <ul className="box box1">
                            <li className="first">배우명</li>
                            <li className="second">{work.actors}</li>
                        </ul>
                        <ul className="box box1">
                            <li className="first">추가정보</li>
                            <li className="second">{work.additionalInfo}</li>
                        </ul>
                    
                        <div className="two-columns">
                            <ul className="box drop video-box">
                                <li className="first"><span className='Tbr'>작품 영상</span> 첨부</li>
                                <li className="show">
                                    <div className="showBorder">
                                        {work.videoUrl ? (
                                            <>
                                                <video
                                                    onClick={() => openModal(work.videoUrl)}
                                                    className="videoPreview"
                                                    controls
                                                >
                                                    <source src={work.videoUrl} type="video/mp4" />
                                                    브라우저가 비디오 태그를 지원하지 않습니다.
                                                </video>
                                            </>
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
                                        {work.thumbnailUrl ? (
                                            <img
                                                src={work.thumbnailUrl}
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

                        {index < works.length - 1 && <hr className="page2Line" />}
                    </div>
                ))}
                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <button className="close-button" onClick={closeModal}>
                                <i className="xi-close-circle-o"></i>
                            </button>
                            {selectedVideoUrl && (
                                <video className="modalVideo" controls>
                                    <source src={selectedVideoUrl} type="video/mp4" />
                                    브라우저가 비디오 태그를 지원하지 않습니다.
                                </video>
                            )}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}

export default SubmissionDetails;
