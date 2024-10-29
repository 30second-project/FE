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

    const fetchSubmissions = async () => {
        try {
            const response = await axios.get(`${Server_IP}/api/submissions`);
            console.log("서버에서 받은 데이터:", response.data);
            if (Array.isArray(response.data)) {
                setSubmissions(response.data);
            } else {
                console.error("제출 데이터 형식이 올바르지 않습니다:", response.data);
                setSubmissions([]);
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
            if (Array.isArray(response.data)) {
                setSubmissions(response.data);
            } else {
                console.error("검색 결과 형식이 올바르지 않습니다:", response.data);
                setSubmissions([]);
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

    const openDetailsModal = (submission) => {
        setSelectedSubmission(submission);
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
                { submissions.map((submission, index) => {
    // 비디오 정보를 직접 가져오기
    const displayedVideos = [
        { title: submission.title, videoUrl: submission.videoUrl }, // 첫 번째 비디오
        // 여기서 두 번째, 세 번째 비디오를 추가해야 합니다.
        // 예를 들어 submission.videos가 있으면 여기서 추가.
        { title: submission.videos[1]?.title, videoUrl: submission.videos[1]?.videoUrl }, // 두 번째 비디오
        { title: submission.videos[2]?.title, videoUrl: submission.videos[2]?.videoUrl }  // 세 번째 비디오
    ];

    // 각 비디오 제목을 로그로 출력
    displayedVideos.forEach((video, videoIndex) => {
        console.log(`출품작${videoIndex + 1} 제목:`, video.title || '제목 없음');
    });

    return (
        <tr key={submission.id}>
            <td>{index + 1}</td>
            <td>{convertToKST(submission.submissionTime)}</td>
            <td>{submission.userName}</td>
            <td>{submission.memberId}</td>
            <td>{submission.contact || "연락처 없음"}</td>
            {Array.from({ length: 3 }, (_, videoIndex) => (
                <td key={videoIndex}>
                    {displayedVideos[videoIndex]?.title ? (
                        <span onClick={() => openDetailsModal(submission)}>
                            {displayedVideos[videoIndex].title}
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
                <SubmissionDetails submission={selectedSubmission} onClose={closeModal} />
            )}
        </div>
    );
};

export default SubmissionTable;
