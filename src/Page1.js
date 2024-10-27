import React, { useEffect, useState } from 'react';
import Header from "./Header";
import "./css/Page1.css";
import circle1 from '../src/image/page1.png';
import DropFileInput from "./components/drop-file-input/DropFileInput";
import ImgDrop from "./components/drop-file-input/ImgDrop";
import plus from "./image/plus.png";
import next from "./image/right.png";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Page1({ works, setWorks }) {
    const Server_IP = process.env.REACT_APP_Server_IP;
    const [placeholderText, setPlaceholderText] = useState("");
    const [placeholderText2, setPlaceholderText2] = useState("");
    const [placeholderText3, setPlaceholderText3] = useState("");

    const navigate = useNavigate();

    const [memberInfo, setMemberInfo] = useState({
        userName: "namess",
        memberId: "mem1",
        contact: "123123123"
      });
      const [otpToken, setOtpToken] = useState(""); // OTP 토큰 값
    
    //   // OTP 토큰이 있을 때 자동으로 백엔드와 통신해 사용자 정보 받아오기
    
    //   useEffect(() => {
    //     if (otpToken) {
    //       axios
    //         .get("/integrateUser", {
    //           params: { otpToken: otpToken }
    //         })
    //         .then((response) => {
    //           // 성공적으로 사용자 정보 받아오면 상태 업데이트
    //           const { userName, memberId, contact } = response.data;
    //           setMemberInfo({
    //             userName: userName,
    //             memberId: memberId,
    //             contact: contact
    //           });
    //         })
    //         .catch((error) => {
    //           console.error("사용자 정보 연동 실패:", error);
    //         });
    //     }
    //   }, [otpToken]);
    

    // 상태 업데이트 함수
    const updateWorkInfo = (index, data) => {
        const updatedWorks = [...works];
        updatedWorks[index] = { ...updatedWorks[index], ...data };
        setWorks(updatedWorks);
    };

    // 작업 삭제 함수
    const handleRemoveWork = (index) => {
        const newWorks = works.filter((_, i) => i !== index);
        setWorks(newWorks);
    };

    // 파일 변경 처리
    const handleFileChange = (index, fileData) => {
        const newWorks = [...works];
        if (fileData) {
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

    // 이미지 파일 데이터 업데이트
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

    // 페이지 추가 함수
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

    // 필수 필드 검증 함수
    const validateRequiredFields = () => {
        for (let work of works) {
            if (!work.title || !work.description || !work.director || !work.videoFile) {
                return false;
            }
        }
        return true;
    };
   // 제출 처리 함수
   const handleSubmit = (e) => {
    e.preventDefault();
    if (validateRequiredFields()) {
        navigate('/page2', { state: { works } });
    } else {
        alert('모든 필수 항목을 입력해주세요.');
    }
};



    // 플레이스홀더 업데이트 함수
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
                    value={memberInfo.userName || "POBA누리 연동 자동 입력"} 
                    placeholder="POBA누리 연동 자동 입력" 
                    readOnly 
                />
                </li>
            </ul>
            <ul className="box box2">
                <li className="first">아이디<span className="red">*</span></li>
                <li className="second">
                <input 
                    type="text" 
                    value={memberInfo.memberId || "POBA누리 연동 자동 입력"} 
                    placeholder="POBA누리 연동 자동 입력" 
                    readOnly 
                />
                </li>
            </ul>
            <ul className="box box3">
                <li className="first">연락처<span className="red">*</span></li>
                <li className="second">
                <input 
                    type="text" 
                    value={memberInfo.contact || "POBA누리 연동 자동 입력"} 
                    placeholder="POBA누리 연동 자동 입력" 
                    readOnly 
                />
                </li>
            </ul>
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
                            <li className="first"><span className='Tbr'>작품 동영상</span> 첨부<span className="red">*</span></li>
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
                            <li className="first"><span className='Tbr'>작품 썸네일</span> 첨부</li>
                            <li className="drop">
                            <ImgDrop 
            onImageChange={(fileData) => updateImageFileData(index, fileData)}
            existingImage={{
                url: work.thumbnailUrl // 썸네일 URL 전달
            }}
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
