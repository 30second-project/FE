import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SubmissionSearch from './SubmissionSearch';
import SubmissionDetails from './SubmissionDetails';
import '../src/css/SubmissionTable.css';

const SubmissionTable = () => {
    const Server_IP = process.env.REACT_APP_Server_IP;
    const [submissions, setSubmissions] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [category, setCategory] = useState("name");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [searchResults, setSearchResults] = useState([]);

    const fetchSubmissions = async () => {
        try {
            const response = await axios.get(`${Server_IP}/api/submissions`);
            console.log("서버에서 받은 데이터:", response.data);

            if (Array.isArray(response.data)) {
                const uniqueSubmissions = Array.from(new Map(response.data.map(submission => [submission.memberId, submission])).values());

                const submissionsWithVideos = await Promise.all(
                    uniqueSubmissions.map(async (submission) => {
                        const videos = await fetchVideoData(submission.memberId);
                        submission.submissionTime = formatSubmissionTime(submission.submissionTime);
                        return { ...submission, videos };
                    })
                );
                setSubmissions(submissionsWithVideos);
                setSearchResults(submissionsWithVideos); // 전체 데이터도 searchResults에 저장
            } else {
                console.error("제출 데이터 형식이 올바르지 않습니다:", response.data);
                setSubmissions([]);
                setSearchResults([]); // 검색 결과도 초기화
            }
        } catch (error) {
            console.error("제출 데이터를 불러오는 중 오류가 발생했습니다!", error);
        }
    };

    const formatSubmissionTime = (timeArray) => {
        if (!Array.isArray(timeArray) || timeArray.length < 7) {
            console.error("유효하지 않은 submissionTime:", timeArray);
            return '';
        }
        const [year, month, day, hours, minutes, seconds] = timeArray;
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const convertToKST = (submissionTime) => {
        if (typeof submissionTime !== 'string') {
            console.error("submissionTime은 문자열이어야 합니다:", submissionTime);
            return '';
        }
        const utcSubmissionTime = submissionTime.endsWith('Z') ? submissionTime : `${submissionTime}Z`;
        const curr = new Date(utcSubmissionTime);
        return isNaN(curr.getTime()) ? '' : curr.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
    };

    const handleSearch = async () => {
        if (!searchKeyword.trim()) {
            // 검색어가 없으면 전체 제출 데이터를 가져옴
            await fetchSubmissions();
            return; // 추가적인 검색 처리 필요 없음
        }
    
        try {
            const response = await axios.get(`${Server_IP}/api/submissions/search?keyword=${searchKeyword}&category=${category}`);
            console.log("검색 결과:", response.data);
    
            if (Array.isArray(response.data) && response.data.length > 0) {
                // category에 따라 필터링 키 설정
                const key = category === "name" ? "userName" : "memberId";
                
                const uniqueSubmissions = Array.from(new Map(response.data.map(submission => [submission[key], submission])).values());
                const submissionsWithVideos = await Promise.all(uniqueSubmissions.map(async (submission) => {
                    const videos = await fetchVideoData(submission.memberId);
                    return {
                        ...submission,
                        videos,
                        submissionTime: formatSubmissionTime(submission.submissionTime)
                    };
                }));
    
                setSubmissions(submissionsWithVideos);
                setSearchResults(submissionsWithVideos); // 검색 결과 저장
            } else {
                console.log("검색된 제출작이 없습니다.");
                setSubmissions([]);
                setSearchResults([]); // 검색 결과도 초기화
            }
        } catch (error) {
            console.error("제출을 검색하는 중 오류가 발생했습니다!", error);
        }
    };
    

    const handleDownloadExcel = async () => {
        try {
            // 검색 결과가 있을 경우 해당 키워드로 다운로드 요청
            const url = searchResults.length > 0 
                ? `${Server_IP}/api/submissions/download?keyword=${searchKeyword}&category=${category}`
                : `${Server_IP}/api/submissions/download`; // 검색 결과가 없으면 전체 데이터 다운로드 요청
    
            const response = await axios.get(url, {
                responseType: 'blob',
            });
    
            const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', searchResults.length > 0 ? '제출리스트_검색결과.xlsx' : '제출리스트_전체.xlsx');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error(searchResults.length > 0 ? "검색된 엑셀 파일 다운로드 중 오류가 발생했습니다!" : "전체 엑셀 파일 다운로드 중 오류가 발생했습니다!", error);
            alert("엑셀 다운로드 중 오류가 발생했습니다!"); // 사용자 알림
        }
    };

    const fetchVideoData = async (memberId) => {
        try {
            const response = await axios.get(`${Server_IP}/api/submission/videos/${memberId}`);
            if (Array.isArray(response.data)) {
                console.log("가져온 비디오 데이터:", response.data);
                return response.data;
            } else {
                console.error("비디오 데이터 형식이 올바르지 않습니다:", response.data);
                return [];
            }
        } catch (error) {
            console.error("Error fetching video data:", error);
            return [];
        }
    };

    const openDetailsModal = async (submission, videoIndex) => {
        const videos = await fetchVideoData(submission.memberId);
        const selectedVideo = videos[videoIndex] || {};
        setSelectedSubmission({ ...submission, videos });
        setSelectedVideo(selectedVideo);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedSubmission(null);
        setIsModalOpen(false);
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
                <button 
                    className="download-btn" 
                    onClick={handleDownloadExcel}
                >
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
                        const displayedVideos = [
                            submission.videos?.[0]?.title || '없음',
                            submission.videos?.[1]?.title || '없음',
                            submission.videos?.[2]?.title || '없음'
                        ];

                        return (
                            <tr key={submission.id}>
                                <td>{index + 1}</td>
                                <td>{convertToKST(submission.submissionTime)}</td>
                                <td>{submission.userName}</td>
                                <td>{submission.memberId}</td>
                                <td>{submission.contact || "연락처 없음"}</td>
                                {displayedVideos.map((videoTitle, videoIndex) => (
                                    <td key={videoIndex}>
                                        {videoTitle !== '없음' ? (
                                            <span onClick={() => openDetailsModal(submission, videoIndex)}>
                                                {videoTitle}
                                            </span>
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

            {isModalOpen && selectedSubmission && (
                <SubmissionDetails
                    submission={selectedSubmission}
                    selectedVideo={selectedVideo}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default SubmissionTable;
