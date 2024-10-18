import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './drop-file-input.css';
import upload from "../../image/upload.png";

const ImgDrop = (props) => {
    const wrapperRef = useRef(null);
    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState(null); // 파일 URL을 저장할 상태 추가
    const [imgText, setimgText] = useState("");

    useEffect(() => {
        // existingImage에서 URL이 있을 경우 파일 URL을 설정
        if (props.existingImage && props.existingImage.url) {
            setFileUrl(props.existingImage.url);
        }
    }, [props.existingImage]);

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
            const imageUrl = URL.createObjectURL(newFile); // 파일 URL 생성
            setFileUrl(imageUrl); // 파일 URL 설정

            if (typeof props.onImageChange === 'function') {
                props.onImageChange({
                    file: newFile,
                    url: imageUrl // URL도 함께 전달
                });
            }
        }
    };

    const fileRemove = () => {
        setFile(null);
        setFileUrl(null); // URL도 초기화
        if (typeof props.onImageChange === 'function') {
            props.onImageChange(null); // 부모 컴포넌트에 null 전달
        }
    };

    // 파일 크기를 KB 단위로 변환하는 함수
    const formatFileSize = (sizeInBytes) => {
        return (sizeInBytes / 1024).toFixed(2) + ' KB'; // 소수점 두 자리까지 표시
    };

    const updatePlaceholder = () => {
        if (window.innerWidth < 1024) {
            setimgText("여기를 터치하여 파일을 첨부해주세요");
        } else {
            setimgText("이미지 파일을 여기로 드래그 하세요");
        }
    };

    useEffect(() => {
        updatePlaceholder();
        window.addEventListener("resize", updatePlaceholder);

        return () => window.removeEventListener("resize", updatePlaceholder);
    }, []);

    return (
        <div ref={wrapperRef} className="drop-file-input" onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDrop={onDrop}>
            {!file ? ( // 파일이 없을 경우 드롭 영역 표시
                <>
                    <div className="drop-file-input__label label2">
                        <img src={upload} className='upload' alt="Upload" /><br />
                        <b className='file-b'>{imgText}</b><br />
                        <p className='drop-smalltext file-b'>
                            ※ 권장 사이즈: 1280 X 720 px (가로형)
                        </p>
                    </div>
                    <input type="file" accept="image/*" onChange={onFileDrop} />
                </>
            ) : ( // 파일이 선택되었을 때 미리보기 표시
                <div className="drop-file-preview">
                    <div className="drop-file-preview__item">
                        <div className="drop-file-preview__item__info">
                            {fileUrl && (
                                <div className="image-preview">
                                    <img src={fileUrl} alt="Preview" className="image-element" />
                                </div>
                            )}
                            <p>{file.name}</p>
                            <p>{formatFileSize(file.size)}</p>
                        </div>
                        <span className="drop-file-preview__item__del" onClick={fileRemove}>x</span>
                    </div>
                </div>
            )}
        </div>
    );
};

// PropTypes 설정
ImgDrop.propTypes = {
    onImageChange: PropTypes.func.isRequired, // 이미지 변경 핸들러 추가
    existingImage: PropTypes.shape({ // 기존 이미지 prop 타입 정의
        url: PropTypes.string
    })
};

// 기본 props 설정
ImgDrop.defaultProps = {
    onImageChange: () => {}, // 기본적으로 빈 함수
    existingImage: {} // 기본적으로 빈 객체
};

export default ImgDrop;
