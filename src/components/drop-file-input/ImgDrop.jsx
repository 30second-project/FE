import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './drop-file-input.css';
import upload from "../../image/upload.png";

const ImgDrop = (props) => {
    const wrapperRef = useRef(null);
    const [file, setFile] = useState(null);

    const onDragEnter = () => wrapperRef.current.classList.add('dragover');
    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');
    const onDrop = () => wrapperRef.current.classList.remove('dragover');

    const onFileDrop = (e) => {
        const newFile = e.target.files[0]; // 첫 번째 파일만 가져옴
        if (newFile) {
            // 파일 형식 체크 (예: 이미지 형식만 허용)
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validTypes.includes(newFile.type)) {
                alert('이미지 파일(JPEG, PNG, GIF)만 업로드할 수 있습니다.');
                return; // 유효하지 않은 형식이면 종료
            }

            if (file) {
                alert('하나 이상의 파일을 업로드할 수 없습니다.');
                return; // 이미 파일이 선택된 경우 종료
            }

            setFile(newFile);
            if (typeof props.onFileChange === 'function') {
                props.onImageChange(newFile); 
                const fileData = {
                    file: newFile,
                    name: newFile.name,
                    size: newFile.size,
                    type: newFile.type,
                    // 추가적인 메타데이터가 필요하면 여기에 추가할 수 있음
                };
                props.onFileChange(fileData); // 부모 컴포넌트에 메타데이터 전달
            }
        }
    };

    const fileRemove = () => {
        setFile(null);
        if (typeof props.onFileChange === 'function') {
            props.onFileChange(null); // 부모 컴포넌트에 null 전달
        }
    };

    // 파일 크기를 KB 단위로 변환하는 함수
    const formatFileSize = (sizeInBytes) => {
        return (sizeInBytes / 1024).toFixed(2) + ' KB'; // 소수점 두 자리까지 표시
    };

    return (
        <>
            <div
                ref={wrapperRef}
                className="drop-file-input"
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                <div className="drop-file-input__label label2">
                    <img src={upload} className='upload' alt="Upload" /><br />
                    <b className='file-b'>이미지 파일을 여기로 드래그 하세요</b><br />
                    <p className='drop-smalltext file-b'>
                        ※ 권장 사이즈: 1280 X 720 px (가로형)
                    </p>
                </div>
                <input type="file" accept="image/*" onChange={onFileDrop} />
            </div>
            {file && ( // 파일이 있을 경우에만 미리보기 표시
                <div className="drop-file-preview">
                    <div className="drop-file-preview__item">
                        <div className="drop-file-preview__item__info">
                            <p>{file.name}</p>
                            <p>{formatFileSize(file.size)}</p>
                        </div>
                        <span className="drop-file-preview__item__del" onClick={fileRemove}>x</span>
                    </div>
                </div>
            )}
        </>
    );
};

// PropTypes 설정
ImgDrop.propTypes = {
    onFileChange: PropTypes.func.isRequired, // 필수 prop으로 설정
};

// 기본 props 설정
ImgDrop.defaultProps = {
    onFileChange: () => {}, // 기본적으로 빈 함수
};

export default ImgDrop;
