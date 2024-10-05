import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './drop-file-input.css';
import upload from "../../image/upload.png";

const DropFileInput = (props) => {
    const wrapperRef = useRef(null);
    const [file, setFile] = useState(null);
    const [videoDuration, setVideoDuration] = useState('0:00'); // 비디오 길이 상태

    const onDragEnter = () => wrapperRef.current.classList.add('dragover');
    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');
    const onDrop = () => wrapperRef.current.classList.remove('dragover');

    const onFileDrop = (e) => {
        const newFile = e.target.files[0];
        if (newFile) {
            console.log('Selected File:', newFile); // 파일 정보 로그
            setFile(newFile);

            // 비디오 길이 계산
            const videoElement = document.createElement('video');
            videoElement.src = URL.createObjectURL(newFile);
            videoElement.onloadedmetadata = () => {
                const duration = Math.floor(videoElement.duration);
                const minutes = Math.floor(duration / 60);
                const seconds = duration % 60;
                const formattedDuration = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
                setVideoDuration(formattedDuration);
                
                // 부모 컴포넌트에 비디오 메타데이터 전달
                if (typeof props.onFileChange === 'function') {
                    props.onFileChange({
                        videoFile: newFile,
                        videoName: newFile.name,
                        videoSize: newFile.size,
                        videoDuration: formattedDuration,
                        videoUrl: URL.createObjectURL(newFile),
                    });
                }
            };
        }
    };

    const fileRemove = () => {
        setFile(null);
        setVideoDuration('0:00'); // 비디오 길이 초기화
        if (typeof props.onFileChange === 'function') {
            props.onFileChange(null); // 부모 컴포넌트에 null 전달
        }
    };

    const formatFileSize = (sizeInBytes) => {
        return (sizeInBytes / 1024).toFixed(2) + ' KB';
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
                <div className="drop-file-input__label">
                    <img src={upload} className='upload' alt="Upload" /><br />
                    <b className='file-b'>파일을 여기로 드래그 하세요</b><br />
                    <p className='drop-smalltext file-b'>
                        영상 업로드시 영상 크기에 따라 10~60초 가량 소모됩니다.<br />
                        ※ 모든 형식의 비디오를 지원합니다.
                    </p>
                </div>
                <input type="file" onChange={onFileDrop} accept="video/*" />
            </div>
            {file && ( 
                <div className="drop-file-preview">
                   
                    <div className="drop-file-preview__item">
                        <div className="drop-file-preview__item__info">
                            <p>{file.name}
                            {formatFileSize(file.size)}
                             ({videoDuration})</p> {/* 비디오 길이 표시 */}
                        </div>
                        <span className="drop-file-preview__item__del" onClick={fileRemove}>x</span>
                    </div>
                </div>
            )}
        </>
    );
};

// PropTypes 설정
DropFileInput.propTypes = {
    onFileChange: PropTypes.func.isRequired, // 필수 prop으로 설정
};

// 기본 props 설정
DropFileInput.defaultProps = {
    onFileChange: () => {}, // 기본적으로 빈 함수
};

export default DropFileInput;
