import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SubmissionSearch from './SubmissionSearch';
import SubmissionDetails from './SubmissionDetails';
import Modal from './Modal';
import '../src/css/SubmissionTable.css'; // 경로 수정

const SubmissionTable = () => {
    const Server_IP = process.env.REACT_APP_Server_IP;
    const [submissions, setSubmissions] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [category, setCategory] = useState("name");
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVideoUrl, setSelectedVideoUrl] = useState(null); // 선택된 비디오 URL 상태 추가

    const fetchSubmissions = async () => {
        try {
            const response = await axios.get(`${Server_IP}/api/submissions`);
            console.log("Fetched submissions:", response.data); // 데이터 구조 확인을 위한 로그
            if (Array.isArray(response.data)) {
                setSubmissions(response.data);
            } else {
                console.error("제출 데이터 형식이 올바르지 않습니다:", response.data);
                setSubmissions([]); // 빈 배열로 초기화
            }
        } catch (error) {
            console.error("제출 데이터를 불러오는 중 오류가 발생했습니다!", error);
        }
    };

    const convertToKST = (submissionTime) => {
        const utcSubmissionTime = submissionTime.endsWith('Z') ? submissionTime : `${submissionTime}Z`;
        const curr = new Date(utcSubmissionTime);
        return curr.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`${Server_IP}/api/submissions/search?keyword=${searchKeyword}&category=${category}`);
            console.log("Search results:", response.data); // 검색 결과 확인
            if (Array.isArray(response.data)) {
                setSubmissions(response.data);
            } else {
                console.error("검색 결과 형식이 올바르지 않습니다:", response.data);
                setSubmissions([]); // 빈 배열로 초기화
            }
        } catch (error) {
            console.error("제출을 검색하는 중 오류가 발생했습니다!", error);
        }
    };

    const handleDownloadExcelWithSearch = async () => {
        try {
            const response = await axios.get(`${Server_IP}/api/submissions/download`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', '제출리스트_검색결과.xlsx');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("검색된 엑셀 파일 다운로드 중 오류가 발생했습니다!", error);
        }
    };

    const openModal = (videoUrl) => {
        if (!videoUrl) {
            console.error("비디오 URL이 존재하지 않습니다.");
            return;
        }
        setSelectedVideoUrl(videoUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedVideoUrl(null); // 선택된 비디오 URL 초기화
        setIsModalOpen(false); // 모달 닫기
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    return (
        <div className="submission-table-container">
            <div className="search-container">
                <SubmissionSearch
                    searchKeyword={searchKeyword}
                    setSearchKeyword={setSearchKeyword}
                    category={category}
                    setCategory={setCategory}
                    handleSearch={handleSearch}
                />
                <button className="download-btn" onClick={handleDownloadExcelWithSearch} disabled={submissions.length === 0}>
                    엑셀 다운로드
                </button>
            </div>

            <table className="submission-table">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제출타임라인</th>
                        <th>성함</th>
                        <th>아이디</th>
                        <th>연락처</th>
                        <th>출품작1</th>
                        <th>출품작2</th>
                        <th>출품작3</th>
                        <th>동의</th>
                    </tr>
                </thead>
                <tbody>
                {submissions.map((submission, index) => {
                    const videoLinks = submission.videos && Array.isArray(submission.videos) ? submission.videos : [];

                    // 비디오가 3개 미만인 경우, 나머지 칸을 '없음'으로 채우기 위한 작업
                    const emptySlots = 3 - videoLinks.length;
                    const displayedVideos = [...videoLinks, ...Array(emptySlots).fill({ title: '없음', videoUrl: null })];

                    return (
                        <tr key={submission.id}>
                            <td>{index + 1}</td>
                            <td>{convertToKST(submission.submissionTime)}</td>
                            <td>{submission.name}</td>
                            <td>{submission.memberId}</td>
                            <td>{submission.contact || "연락처 없음"}</td>
                            {displayedVideos.map((video, videoIndex) => (
                                <td key={videoIndex}>
                                    {video.title !== '없음' ? (
                                        <>
                                            <span onClick={() => openModal(video.videoUrl)}>{video.title}</span>
                                            <button onClick={() => openModal(video.videoUrl)}>보기</button>
                                        </>
                                    ) : (
                                        '없음'
                                    )}
                                </td>
                            ))}
                            <td>{submission.agreement ? "확인" : "확인"}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

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
        </div>
    );
};

export default SubmissionTable;
