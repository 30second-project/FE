import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SubmissionSearch from './SubmissionSearch';
import SubmissionDetails from './SubmissionDetails';

const SubmissionTable = () => {
    const [submissions, setSubmissions] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [category, setCategory] = useState("name");
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchSubmissions = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/submissions');
            console.log(response.data);
            setSubmissions(response.data);
        } catch (error) {
            console.error("제출 데이터를 불러오는 중 오류가 발생했습니다!", error);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/submissions/search?keyword=${searchKeyword}&category=${category}`);
            setSubmissions(response.data);
        } catch (error) {
            console.error("제출을 검색하는 중 오류가 발생했습니다!", error);
        }
    };

    const handleDownloadExcelWithSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/submissions/download/search?keyword=${searchKeyword}&category=${category}`, {
                responseType: 'blob', // 서버에서 바이너리 파일을 받을 때 설정
            });
    
            // Blob 객체 URL 생성 및 다운로드 처리
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', '제출리스트_검색결과.xlsx');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); // 다운로드 후 링크 요소 제거
        } catch (error) {
            console.error("검색된 엑셀 파일 다운로드 중 오류가 발생했습니다!", error);
        }
    };
    

    const openModal = (submission) => {
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
        <div>
            <h1>제출 리스트</h1>
            <SubmissionSearch
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
                category={category}
                setCategory={setCategory}
                handleSearch={handleSearch}
            />
            <button onClick={handleDownloadExcelWithSearch} disabled={submissions.length === 0}>엑셀 다운로드</button>
            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>이름</th>
                        <th>사용자 ID</th>
                        <th>연락처</th>
                        <th>제출 시간</th>
                        <th>개인정보 동의</th>
                        <th>작품 URL</th>
                        <th>작업</th>
                    </tr>
                </thead>
                <tbody>
                    {submissions.map(submission => (
                        <tr key={submission.id}>
                            <td>{submission.id}</td>
                            <td>{submission.name}</td>
                            <td>{submission.userId}</td>
                            <td>{submission.contact}</td>
                            <td>{submission.submissionTime}</td>
                            <td>{submission.agreement ? "동의함" : "동의하지 않음"}</td>
                            <td>
                                {submission.videos.length > 0
                                    ? submission.videos.map(video => <div key={video.id}>{video.videoUrl}</div>)
                                    : "비디오 없음"}
                            </td>
                            <td>
                                <button onClick={() => openModal(submission)}>세부 정보 보기</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <SubmissionDetails
                isOpen={isModalOpen}
                onClose={closeModal}
                submission={selectedSubmission}
            />
        </div>
    );
};

export default SubmissionTable;
