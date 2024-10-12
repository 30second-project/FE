import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import Header from "./Header";
import "./css/Page1.css";
import "./css/Page2.css";
import circle2 from '../src/image/page2.png';
import right from "./image/right.png";
import left from "./image/left.png";

function Page2() {
    const location = useLocation();
    const { works } = location.state || { works: [] };
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

    const handleSubmit = async () => {
        const formData = new FormData();

        works.forEach((work, index) => {
            if (work.thumbnail) formData.append(`thumbnail_${index}`, work.thumbnail);
            if (work.videoFile) formData.append(`video_${index}`, work.videoFile);

            formData.append(`title_${index}`, work.title);
            formData.append(`description_${index}`, work.description);
            formData.append(`director_${index}`, work.director);
            formData.append(`actors_${index}`, work.actors);
            formData.append(`additionalInfo_${index}`, work.additionalInfo);
        });

        try {
            const response = await axios.post('병덕쓰 주소', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div>
            <Header />
            <div className="circlezone">
                <img src={circle2} className="circle1" alt="circle1" />
            </div>
            <ul className="circleText">
                <li>01. 정보 입력</li>
                <li className='red'>02. 동의 및 정보 확인</li>
                <li>03. 출품 완료</li>
            </ul>
            <hr />
            <section>
                {works.map((work, index) => (
                    <div key={index}>
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

                        {/* 2칸 구성: 비디오 재생과 썸네일 첨부 */}
                        <div className="two-columns">
                            {/* 작품 영상 첨부 */}
                            <ul className="box drop video-box">
                                <li className="first">작품 영상 첨부</li>
                                <li className="show">
                                    <div className="showBorder">
                                        {work.videoFile ? (
                                            <>
                                                {/* 비디오 표시, 클릭 시 모달 열림 */}
                                                <video
                                                    onClick={() => openModal(URL.createObjectURL(work.videoFile))}
                                                    className="videoPreview"
                                                >
                                                    <source
                                                        src={URL.createObjectURL(work.videoFile)}
                                                        type="video/mp4"
                                                    />
                                                    브라우저가 비디오 태그를 지원하지 않습니다.
                                                </video>
                                                <div>
                                                    <span className="font">{work.videoFile.name || '업로드되지 않음'}&nbsp; ({work.videoDuration || '0:00'})</span><br />
                                                </div>
                                            </>
                                        ) : (
                                            <span>영상이 업로드되지 않았습니다.</span>
                                        )}
                                    </div>
                                </li>
                            </ul>

                            {/* 작품 썸네일 첨부 */}
                            <ul className="box drop thumbnail-box">
                                <li className="first">작품 썸네일 첨부</li>
                                <li className="show">
                                    <div className="showBorder">
                                        {work.thumbnail ? ( // thumbnail이 존재하는 경우에만 확인
                                            <>
                                                <img
                                                    src={URL.createObjectURL(work.thumbnail)} // 썸네일이 File 객체인 경우
                                                    alt="썸네일"
                                                    className="plusImage"
                                                />
                                                <div>
                                                    <span className="font">{work.thumbnail.name || '업로드되지 않음'}</span><br />
                                                </div>
                                            </>
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

                {/* 모달 컴포넌트 */}
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
            <ul className='page2Btn'>
                <Link to="/"><li className='what'><img src={left} alt="이전" />이전</li></Link>
                <Link to="/page3"><li className='what2' onClick={handleSubmit}>출품하기<img src={right} alt="출품하기" /></li></Link>
            </ul>
            {/*업로드 진행 창이 필요할 수 있습니다.*/}
        </div>
    );
}

export default Page2;
