import React, { useEffect, useState } from 'react';
import Header from "./Header";
import "./css/Page1.css";
import circle1 from '../src/image/page1.png';
import DropFileInput from "./components/drop-file-input/DropFileInput";
import ImgDrop from "./components/drop-file-input/ImgDrop";
import plus from "./image/plus.png";
import next from "./image/right.png";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Page1({ works, setWorks }) {
    const location = useLocation();
    const Server_IP = process.env.REACT_APP_Server_IP;
    const [placeholderText, setPlaceholderText] = useState("");
    const [placeholderText2, setPlaceholderText2] = useState("");
    const [placeholderText3, setPlaceholderText3] = useState("");

    const navigate = useNavigate();

    const [otpToken, setOtpToken] = useState(""); // OTP 토큰 값
    const [memberInfo, setMemberInfo] = useState({ userName: '', memberId: '', contact: '' });

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);

        // POST로 넘어온 데이터를 URL에 포함시키도록 리다이렉트 처리
        if (!queryParams.has("USER_NAME") || !queryParams.has("mbrId")) {
            // 만약 쿼리 파라미터에 값이 없다면 POST로 받은 데이터라고 가정
            const urlParams = {
                USER_NAME: memberInfo.userName,
                mbrId: memberInfo.memberId,
                contact: '',
                OTP_TOKEN: 'YOUR_OTP_TOKEN'
            };

            // // URL에 쿼리 파라미터로 추가
            // const searchParams = new URLSearchParams(urlParams);
            // window.location.replace(`${window.location.pathname}?${searchParams.toString()}`);
        } else {
            // URL 쿼리 파라미터로 데이터를 읽어오기
            const userNameFromUrl = queryParams.get('USER_NAME') || '';
            const memberIdFromUrl = queryParams.get('mbrId') || '';
            const contactFromUrl = queryParams.get('contact') || '';
            const otpTokenFromUrl = queryParams.get('OTP_TOKEN') || '';

            // 가져온 데이터를 상태에 저장
            setMemberInfo({
                userName: userNameFromUrl,
                memberId: memberIdFromUrl,
                contact: contactFromUrl,
                otpToken: otpTokenFromUrl
            });
        }
    }, [location.search]);

    useEffect(() => {
        if (memberInfo.otpToken) {
            const backendUrl = `${Server_IP}/api/vendorSsoGate`;

            axios.get(backendUrl, {
                params: { svid: memberInfo.otpToken },
                headers: {
                    "Accept": "application/json"
                },
                withCredentials: true
            })
            .then((response) => {
                const user = response.data.resultMap.user;
                const { mbrNm: userName, mbrId: memberId, hmeTelNo: contact } = user;

                setMemberInfo({ userName, memberId, contact });

                localStorage.setItem("userName", userName);
                localStorage.setItem("memberId", memberId);
                localStorage.setItem("contact", contact);
            })
            .catch((error) => {
                console.error("제휴사 정보 연동 실패", error);
            });
        }
    }, [memberInfo.otpToken]);

    const updateWorkInfo = (index, data) => {
        const updatedWorks = [...works];
        updatedWorks[index] = { ...updatedWorks[index], ...data };
        setWorks(updatedWorks);
    };

    const handleRemoveWork = (index) => {
        const newWorks = works.filter((_, i) => i !== index);
        setWorks(newWorks);
    };

    const handleFileChange = (index, fileData) => {
        const newWorks = [...works];
        if (fileData && fileData.videoFile instanceof File) {
            newWorks[index].videoFile = fileData.videoFile;
            newWorks[index].videoName = fileData.videoFile.name;
            newWorks[index].videoDuration = fileData.videoDuration;
            newWorks[index].videoUrl = fileData.videoUrl;
        } else {
            newWorks[index].videoFile = null;
            newWorks[index].videoName = '';
            newWorks[index].videoSize = '';
            newWorks[index].videoDuration = '';
            newWorks[index].videoUrl = '';
        }
        setWorks(newWorks);
    };

    const updateImageFileData = (index, fileData) => {
        const newWorks = [...works];
        if (fileData && fileData.file instanceof File) {
            const thumbnailUrl = URL.createObjectURL(fileData.file);
            newWorks[index].thumbnail = fileData.file;
            newWorks[index].imgName = fileData.name;
            newWorks[index].imgSize = (fileData.size / 1024).toFixed(2) + ' KB';
            newWorks[index].imgType = fileData.type;
            newWorks[index].thumbnailUrl = thumbnailUrl;
        } else {
            newWorks[index].thumbnail = null;
            newWorks[index].imgName = '';
            newWorks[index].imgSize = '';
            newWorks[index].imgType = '';
            newWorks[index].thumbnailUrl = '';
        }
        setWorks(newWorks);
    };

    const handleAddPlusPage = () => {
        if (works.length < 3) {
            setWorks([...works, {
                title: '',
                description: '',
                director: '',
                actors: '',
                additionalInfo: '',
                videoFile: null,
                videoName: '',
                videoSize: '',
                videoDuration: '',
                videoUrl: '',
                thumbnail: null,
                imgName: '',
                imgSize: '',
                imgType: '',
                thumbnailUrl: '',
            }]);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const validateRequiredFields = () => {
        // 회원 정보 필수 입력 체크
        if (!memberInfo.userName.trim() || !memberInfo.memberId.trim() || !memberInfo.contact.trim()) {
            return false; // 회원 정보 중 하나라도 비어있으면 false 반환
        }
    
        // 작품 정보 필수 입력 체크
        for (let work of works) {
            if (!work.title.trim() || !work.description.trim() || !work.director.trim() || !work.videoFile) {
                return false; // 작품 정보 중 하나라도 비어있으면 false 반환
            }
        }
        
        return true; // 모든 필수 항목이 입력되었으면 true 반환
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateRequiredFields()) {
            navigate('/page2', { state: { works, memberInfo } });
        } else {
            alert('모든 필수 항목을 입력해주세요.');
        }
    };

    const updatePlaceholder = () => {
        if (window.innerWidth < 1024) {
            setPlaceholderText("감독이름을 입력해주세요\n (2명 이상인 경우, 쉼표로 구분해주세요)");
            setPlaceholderText2("배우이름을 입력해주세요\n (2명 이상인 경우, 쉼표로 구분해주세요)");
            setPlaceholderText3("촬영, 편집 등 추가 정보를\n 입력해주세요 (예) 촬영 : 홍길동, 편집 : 홍길동)");
        } else {
            setPlaceholderText("감독이름을 입력해주세요 (2명 이상인 경우, 쉼표로 구분해주세요)");
            setPlaceholderText2("배우이름을 입력해주세요 (2명 이상인 경우, 쉼표로 구분해주세요)");
            setPlaceholderText3("촬영, 편집 등 추가 정보를 입력해주세요 (예) 촬영 : 홍길동, 편집 : 홍길동)");
        }
    };

    useEffect(() => {
        updatePlaceholder();
        window.addEventListener("resize", updatePlaceholder);

        return () => window.removeEventListener("resize", updatePlaceholder);
    }, []);
 
    return (
        <div>
            <Header />
            <div className="circlezone">
                <img src={circle1} className="circle1" alt="circle1" />
            </div>
            <ul className="circleText">
                <li>01. 정보 입력</li>
                <li>02. 동의 및 정보 확인</li>
                <li>03. 출품 완료</li>
            </ul>
            <hr />
            <section>
                <p className="info">1.출품자 정보</p>
                <ul className="box box1">
                    <li className="first">성함<span className="red">*</span></li>
                    <li className="second">
                        <input 
                            type="text" 
                            value={memberInfo.userName} 
                            required
                            placeholder="성함을 입력해주세요" 
                            onChange={(e) => setMemberInfo({ ...memberInfo, userName: e.target.value })} 
                        />
                    </li>
                </ul>
                <ul className="box box2">
                    <li className="first">아이디<span className="red">*</span></li>
                    <li className="second">
                        <input 
                            type="text" 
                            value={memberInfo.memberId} 
                            required
                            placeholder="ID를 입력해주세요" 
                            onChange={(e) => setMemberInfo({ ...memberInfo, memberId: e.target.value })} 
                        />
                    </li>
                </ul>
                <ul className="box box3">
                    <li className="first">연락처<span className="red">*</span></li>
                    <li className="second">
                        <input 
                            type="text" 
                            value={memberInfo.contact} 
                            required
                            placeholder="연락처를 입력해주세요" 
                            onChange={(e) => setMemberInfo({ ...memberInfo, contact: e.target.value })} 
                        />
                    </li>
                </ul>
               
                <p className='info_2'>출품자 정보가 정확하지 않을 경우, 심사에서 제외될 수 있습니다.</p>

                <p className="info">2.작품정보 <span className="three">(최대 3개까지 출품가능합니다)</span></p>
                {works.map((work, index) => (
                    <div key={index}>
                        {works.length > 1 && (
                            <div className="del" onClick={() => handleRemoveWork(index)}>
                                <i className="xi-close-circle-o"></i>
                            </div>
                        )}
                        <ul className="box box1">
                            <li className="first">작품제목<span className="red">*</span></li>
                            <li className="second">
                                <input 
                                    type="text" 
                                    required
                                    className="movieTitle" 
                                    placeholder="작품제목을 입력해주세요"
                                    value={work.title}
                                    onChange={(e) => updateWorkInfo(index, { title: e.target.value })}
                                />
                            </li>
                        </ul>
                        <ul className="box box4">
                            <li className="first">작품내용<span className="red">*</span></li>
                            <li className="second">
                                <textarea 
                                    required
                                    placeholder="작품내용을 입력해주세요"
                                    value={work.description}
                                    onChange={(e) => updateWorkInfo(index, { description: e.target.value })}
                                />
                            </li>
                        </ul>   
                        <ul className="box box1">
                            <li className="first">감독명<span className="red">*</span></li>
                            <li className="second second-textarea">
                                <textarea
                                    className="movieTitle" 
                                    required
                                    placeholder={placeholderText}
                                    value={work.director}
                                    onChange={(e) => updateWorkInfo(index, { director: e.target.value })}
                                />
                            </li>
                        </ul>
                        <ul className="box box1">
                            <li className="first">배우명</li>
                            <li className="second movieInput second-textarea">
                                <textarea 
                                    className="movieTitle" 
                                    placeholder={placeholderText2}
                                    value={work.actors}
                                    onChange={(e) => updateWorkInfo(index, { actors: e.target.value })}
                                />
                            </li>
                        </ul>
                        <ul className="box box1">
                            <li className="first">추가정보</li>
                            <li className="second movieInput second-textarea">
                                <textarea 
                                    className="movieTitle" 
                                    placeholder={placeholderText3}
                                    value={work.additionalInfo}
                                    onChange={(e) => updateWorkInfo(index, { additionalInfo: e.target.value })}
                                />
                            </li>
                        </ul>
                        <ul className="box drop end">
                            <li className="first"><span className='Tbr'>작품 영상</span> 첨부<span className="red">*</span></li>
                            <li className="drop">
                               <DropFileInput 
    onFileChange={(fileData) => handleFileChange(index, fileData)} 
    existingFile={{
        videoFile: work.videoFile,
        videoDuration: work.videoDuration,
        videoUrl: work.videoUrl,
    }}
/>
                            </li>
                        </ul>
                        <ul className="box drop end">
                            <li className="first"><span className='Tbr'>작품</span> <span className='Tbr'>썸네일</span><span className='Tbr'>첨부</span></li>
                            <li className="drop">
                            <ImgDrop 
            thumbnail={work.thumbnail} // 기존 이미지 파일 전달
        
    existingFile={{ file: work.thumbnail, url: work.thumbnailUrl }}
    onImageChange={(fileData) => updateImageFileData(index, fileData)}
/>
        
                            </li>
                        </ul>
                        <p className='Tend'>※ 썸네일이란, 영상을 클릭하기 전에 내용을 미리 보여주는 작은 대표 이미지입니다.</p>
                    </div>
                ))}
            </section>
            
            {works.length < 3 && (
                <button className="plus" onClick={handleAddPlusPage}>
                    <img src={plus} alt="plus" />작품 추가하기
                </button>
            )}
            <button className='next' onClick={handleSubmit}>
                다음 <img src={next} alt="next" />
            </button>
        </div>
    );
}

export default Page1;
