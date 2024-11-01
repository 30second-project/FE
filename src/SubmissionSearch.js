import React from 'react';
import '../src/css/SubmissionSearch.css'; // CSS 파일 불러오기

const SubmissionSearch = ({ searchKeyword, setSearchKeyword, category, setCategory, handleSearch }) => {
    const handleSearchClick = () => {
        handleSearch(); // 유효한 검색어가 있을 경우 검색 실행
    };

    // 키보드 이벤트 핸들러 추가
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearchClick(); // 엔터키가 눌렸을 때 검색 수행
        }
    };

    return (
        <div className="search-container">
            <input
                type="text"
                placeholder="키워드로 검색"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={handleKeyPress} // 엔터키 이벤트 핸들러 추가
            />
            <select onChange={(e) => setCategory(e.target.value)} value={category}>
                <option value="userName">이름</option>
                <option value="memberId">사용자 ID</option>
            </select>
            <button onClick={handleSearchClick}>검색</button>
        </div>
    );
};

export default SubmissionSearch;
