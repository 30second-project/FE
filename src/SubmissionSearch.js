import React from 'react';

const SubmissionSearch = ({ searchKeyword, setSearchKeyword, category, setCategory, handleSearch }) => {
    return (
        <div>
            <input
                type="text"
                placeholder="키워드로 검색"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <select onChange={(e) => setCategory(e.target.value)} value={category}>
                <option value="name">이름</option>
                <option value="userId">사용자 ID</option>
            </select>
            <button onClick={handleSearch}>검색</button>
        </div>
    );
};

export default SubmissionSearch;
