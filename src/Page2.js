import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "./Header";
import "./css/Page1.css";
import "./css/Page2.css";
import circle2 from '../src/image/page2.png';
import right from "./image/right.png";
import left from "./image/left.png"; 

function Page2() {
    const Server_IP = process.env.REACT_APP_Server_IP;
    const location = useLocation();
    const { works } = location.state || { works: [] };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
    const [isChecked, setIsChecked] = useState(false); 
    const { memberInfo } = location.state || {}; // 회원 정보 가져오기
    
    const navigate = useNavigate(); 
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const openModal = (videoUrl) => {
        setSelectedVideoUrl(videoUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedVideoUrl(null);
    };

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked); 
    };

    // 필수 필드 검증 함수
    const validateRequiredFields = () => {
        for (let work of works) {
            if (!work.title || !work.description || !work.director || !work.videoFile) {
                return false;
            }
        }
        return true;
    };

    // 제출 버튼 클릭 시 모달 오픈
    const handleOpenConfirmModal = () => {
        if (!isChecked) {
            alert('모든 내용을 확인하고 동의해야 출품할 수 있습니다.');
            window.scrollTo(0, 400);
            return;
        }
        if (!validateRequiredFields()) {
            alert('모든 필수 항목을 입력해주세요.');
            return;
        }
        setConfirmModalOpen(true);
    };

    // 확인 모달의 확인 버튼 클릭 시 handleSubmit 호출
    const handleSubmit = (e) => {
        e.preventDefault(); // 이벤트 방지
    
        if (validateRequiredFields()) {
            // 회원 정보 백엔드에 저장
            axios
                .post(`${Server_IP}/api/saveMemberInfo`, memberInfo)
                .then((response) => {
                    if (response.status === 200) {
                        // 회원 정보 저장 성공 후 작품 정보 업로드
                        const formData = new FormData();
                        formData.append("memberId", memberInfo.memberId);
                        formData.append("userName", memberInfo.userName);
                        formData.append("contact", memberInfo.contact);
    
                        works.forEach((work) => {
                            formData.append('files', work.videoFile);
                        });
    
                        const videoDTOList = works.map(work => ({
                            title: work.title,
                            description: work.description,
                            director: work.director,
                            actors: work.actors,
                            additionalInfo: work.additionalInfo,
                            videoUrl: work.videoUrl,
                            thumbnailUrl: work.thumbnailUrl,
                        }));
    
                        formData.append('videoDTOList', JSON.stringify(videoDTOList));
    
                        const currentTime = new Date().toISOString();
                        formData.append('submissionTime', currentTime);
    
                        // 작품 정보 업로드
                        return axios.post(`${Server_IP}/api/upload`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        });
                    }
                })
                .then(response => {
                    console.log("제출 성공:", response.data);
                    navigate('/page3', { state: { works, memberInfo } });
                })
                .catch(error => {
                    console.error("제출 실패:", error);
                    alert('제출에 실패했습니다.');
                });
        } else {
            alert('모든 필수 항목을 입력해주세요.');
        }
    
        setConfirmModalOpen(false);
    };
    
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
                <ul className="box box2-1">
                    <li className="first first_option">출품 시<br /> 유의사항</li>
                    <li className="second">
                        <div className='notice'>
                            출품 시 유의사항<br />
                            1) 행정공제회 회원만 출품 자격이 주어지며, 최대 3개까지 출품할 수 있습니다.<br />
                            2) 출품작은 모든 연령대가 감상할 수 있는 전체 관람가 등급을 요합니다.<br />
                            3) 음란, 욕설, 비방, 정치, 광고 등 본 영화제 주제 및 내용에 부합하지 않은 경우 및 영상 길이가 기준 규격과 다소 상이한 경우 배제될 수 있습니다.<br />
                            4) 출품 적합 여부 확인 후 업로드가 진행됨에 따라 POBA 30초 모바일 영화제 사이트에 출품작 업로드까지 일정 기간 소요될 수 있습니다.<br />
                            5) 출품 후에는 수정할 수 없으며, 제출한 자료는 일체 반환하지 않습니다.<br />
                            6) 음악 및 영상을 포함한 모든 저작권 및 초상권 문제가 없도록 저작권자의 사용 승인(협의)가 완료된 소스를 사용하시길 권장드립니다.<br />
                            7) 출품작에 대한 저작권 및 소유권은 출품자에게 있으며, 출품작의 초상권, 저작권 관련 분쟁 발생 시 책임은 출품자에게 있습니다.<br />
                            8) 출품자는 출품과 동시에 출품작을 행정공제회 필요에 따라 활용을 허락한 것으로 봅니다.<br />
                            9) 총상금 2,000만 원(36명 내외, 중복 수상 불가)으로 출품자에게 일괄 지급되며, 제세공과금(22%)를 원천징수한 후 차액이 지급됩니다.
                            <br />
                        </div>
                    </li>
                </ul>

                <ul className="box box2-2">
                    <li className="first first2">저작권 이용<br /><span className="middle">·</span><br />일반 규정 및<br/> 개인정보 이용<br/> 동의</li>
                    <li className="second">
                        <div className='notice'>
                        저작권 이용 <br />
                        1) 출품 유의 사항에 기재되어 있는 저작권 및 사용권 내용과 동의합니다. <br />
                            2) 출품작에 대한 저작권 및 소유권은 출품자에게 있으며, 수상 후에도 출품자에게 귀속됩니다. <br />
                            3) 주최사는 출품작을 영리 또는 비영리 목적으로 독점적 공표, 복제, 공연, 공중송신, 방송, 전송, 전시 및 배포(이하 ‘공표 등’) 할 수 있는 권리를 갖습니다. <br />
                            4) 출품작에 실질적인 개변이 없고, 내용, 형식, 제호의 동일성이 유지되는 범위 내에서 출품작의 포맷, 크기 등 형식을 수정 또는 변경할 수 있으며, 이를 주최사의 필요에 따라 활용할 수 있습니다. <br />
                            5) 출품작에 쓰인 음악, 영상 등 저작권 및 초상권 등 기타 권리에 대한 문제와 관련해 주최사가 개별적으로 확인하지 않으며, 저작권 침해 등 발생하는 어떠한 문제도 주최사는 책임지지 않습니다. <br />
                            <br />
                            일반 규정 및 개인정보 이용 동의 <br />
                            1) 출품 유의 사항에 안내된 내용에 따라 출품 적합 여부 확인 후 업로드가 진행되며, 적합하지 않을 경우 심사에서 제외됩니다. <br />
                            2) 출품 적합 여부 확인 후 업로드가 진행됨에 따라 POBA 30초 모바일 영화제 사이트에 출품작 업로드까지 일정 기간 소요될 수 있습니다. <br />
                            3) 심사 일정은 사전 고지하지 않으며, 주최사의 사정에 따라 입상작 수와 부상이 변경될 수 있습니다. <br />
                            4) 본인 작품(표절 등)이 아니거나, 신청접수일 기준으로 타 영상 공모전 수상작은 심사에서 제외하며, 수상 후에라도 위반 사실이 밝혀졌을 경우 취소(상금 반환)합니다. <br />
                            5) 향후 출품작의 저작권과 관련한 분쟁이 발생할 경우, 한국저작권위원회에 조정을 신청하여 해결할 수 있으며, 양 당사자는 원활한 분쟁 해결을 위해 상호 노력합니다. <br />
                            6) 출품자는 제3자의 저작권, 초상권, 기타 권리를 침해하지 않도록 주의의무를 다하며, 이에 관한 분쟁 책임은 출품자에게 있습니다. <br />
                            7) 주최사는 출품작을 영화제 종료 이후에도 출품 사이트에 전시할 수 있으며, 출품자는 이에 동의합니다. <br />
                            8) 주최사는 출품작 심사 및 상영, 홍보 등 영화제 관련 사항을 위해 출품신청서의 개인정보를 수집한다. <br />
                            9) 개인정보 처리 목적이 달성된 후에 개인정보를 파기합니다. <br />
                        </div>
                    </li>
                </ul>

                <div className='yes'>
                    <input type='checkbox'  checked={isChecked} onChange={handleCheckboxChange}></input><span className="check-text">모든 내용을 확인하였으며 이에 동의합니다.</span>
                </div>

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
                                        {work.videoFile ? (
                                            <>
                                             <video
    onClick={() => {
        const videoUrl = URL.createObjectURL(work.videoFile);
        openModal(videoUrl);

        // 모달이 닫힐 때 URL 해제
        const handleModalClose = () => {
            URL.revokeObjectURL(videoUrl);
            document.removeEventListener('modalClose', handleModalClose);
        };

        document.addEventListener('modalClose', handleModalClose);
    }}
    className="videoPreview"
    muted
    playsInline

    preload="metadata" // 메타데이터를 미리 로드하여 첫 프레임 표시
>
    <source
        src={URL.createObjectURL(work.videoFile)} // URL 생성
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
                            <ul className="box drop thumbnail-box">
                                <li className="first"><span className='Tbr'>작품</span> <span className='Tbr'>썸네일</span> <span className='Tbr'>첨부</span></li>
                                <li className="show">
                                    <div className="showBorder">
                                        {work.thumbnail ? (
                                            <>
                                                <img
                                                    src={URL.createObjectURL(work.thumbnail)} 
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
                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <button className="close-button" onClick={closeModal}>
                                <i className="xi-close-circle-o"></i>
                            </button>
                            {selectedVideoUrl && (
                                <video className="modalVideo" controls playsInline>
                                    <source src={selectedVideoUrl} type="video/mp4" />
                                    브라우저가 비디오 태그를 지원하지 않습니다.
                                </video>
                            )}
                        </div>
                    </div>
                )}
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

                {confirmModalOpen && (
                    <div className="modal-overlay2">
                        <div className="modal-content2">
                            <h3 className='modal-text1'>!&nbsp;&nbsp;잠깐&nbsp;&nbsp;!</h3>
                            <p className='modal-text2'>
                            출품 정보를 모두 정확하게 기재하셨나요?<br></br>
                            출품 후에는 내용 수정 및 출품 취소가<br/> 
                            불가능합니다.
                            </p>
                            <p className='modal-text3'>
                                출품하시겠습니까?
                            </p>
                            <div className='modal-submit'>
                            <button onClick={handleSubmit} className='resultBtn1'>확인</button>
                            <button onClick={() => setConfirmModalOpen(false)} className='resultBtn2'>취소</button>
                            </div>
                        </div>
                    </div>
                )}
            </section>
            <ul className='page2Btn'>
                <li className='what' onClick={() => navigate(-1)}><img src={left} alt="이전" />이전</li>
                <li className='what2' onClick={handleOpenConfirmModal}>출품하기<img src={right} alt="출품하기" /></li>
            </ul>
        </div>
    );
}

export default Page2;
