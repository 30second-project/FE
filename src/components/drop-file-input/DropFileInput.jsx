import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './drop-file-input.css';
import upload from "../../image/upload.png";

const DropFileInput = ({ onFileChange, existingFile }) => {
    const wrapperRef = useRef(null);
    const [file, setFile] = useState(existingFile ? existingFile.videoFile : null);
    const [videoDuration, setVideoDuration] = useState(existingFile ? existingFile.videoDuration : '0:00');
    const [videoUrl, setVideoUrl] = useState(existingFile ? existingFile.videoUrl : null);
    const [posterUrl, setPosterUrl] = useState(null); // 포스터 URL 상태 추가
    const [Text, setText] = useState("");

    useEffect(() => {
        if (existingFile) {
            setFile(existingFile.videoFile);
            setVideoDuration(existingFile.videoDuration);
            setVideoUrl(existingFile.videoUrl);
            setPosterUrl(existingFile.posterUrl); // 기존 포스터 URL 설정
        } else {
            setFile(null);
            setVideoDuration('0:00');
            setVideoUrl(null);
            setPosterUrl(null); // 포스터 URL 초기화
        }
    }, [existingFile]);

    const onDragEnter = () => wrapperRef.current.classList.add('dragover');
    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');
    const onDrop = () => wrapperRef.current.classList.remove('dragover');
    const onFileDrop = (e) => {
        const newFile = e.target.files[0];
        if (newFile) {
            setFile(newFile);
    
            const newVideoUrl = URL.createObjectURL(newFile); 
            setVideoUrl(newVideoUrl);
    
            const videoElement = document.createElement('video');
            videoElement.src = newVideoUrl;
    
            videoElement.onloadedmetadata = () => {
                const duration = Math.floor(videoElement.duration);
                const minutes = Math.floor(duration / 60);
                const seconds = duration % 60;
                const formattedDuration = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`; // 여기에 formattedDuration을 정의
    
                setVideoDuration(formattedDuration);
    
                // 비디오의 첫 번째 프레임을 포스터로 사용하기 위해 currentTime을 0으로 설정
                videoElement.currentTime = 0.001;
    
                videoElement.addEventListener('seeked', () => {
                    setPosterUrl(newVideoUrl);
                });
    
                onFileChange({
                    videoFile: newFile,
                    videoName: newFile.name,
                    videoSize: newFile.size,
                    videoDuration: formattedDuration, // 이제 정의된 formattedDuration을 사용
                    videoUrl: newVideoUrl,
                    posterUrl: newVideoUrl, // 포스터 URL 전달
                });
    
                // iOS 메모리 관리를 위해 URL 해제
                URL.revokeObjectURL(newVideoUrl);
            };
        }
    };
    
    

    const fileRemove = () => {
        setFile(null);
        setVideoDuration('0:00');
        setVideoUrl(null);
        setPosterUrl(null); // 포스터 URL 초기화
        onFileChange(null);
    };

    const formatFileSize = (sizeInBytes) => {
        return (sizeInBytes / 1024).toFixed(2) + ' KB';
    };

    const updatePlaceholder = () => {
        if (window.innerWidth < 1024) {
            setText("여기를 터치하여 파일을 첨부해주세요");
        } else {
            setText("파일을 여기로 드래그 하세요");
        }
    };

    useEffect(() => {
        updatePlaceholder();
        window.addEventListener("resize", updatePlaceholder);

        return () => window.removeEventListener("resize", updatePlaceholder);
    }, []);

    return (
        <div ref={wrapperRef} className="drop-file-input" onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDrop={onDrop}>
            {!file ? (
                <>
                    <div className="drop-file-input__label">
                        <img src={upload} className='upload' alt="Upload" /><br />
                        <b className='file-b'>{Text}</b><br />
                        <p className='drop-smalltext file-b'>
                            영상 업로드시 영상 크기에 따라 10~60초 가량 소모됩니다.<br />
                            ※ 모든 형식의 비디오를 지원합니다.
                        </p>
                    </div>
                    <input type="file" onChange={onFileDrop} accept="video/*" />
                </>
            ) : (
                <div className="drop-file-preview">
                    <div className="drop-file-preview__item">
                        <div className="drop-file-preview__item__info">
                            {videoUrl && (
                                <div className="video-preview">
                                    <video 
                                        className="uploaded-video" 
                                        muted 
                                        playsInline 
                                       
                                    >
                                        <source src={videoUrl} type="video/mp4" />
                                        브라우저가 비디오 태그를 지원하지 않습니다.
                                    </video>
                                </div>
                            )}
                            <p>{file.name}</p>
                            <p>{formatFileSize(file.size)} ({videoDuration})</p>
                        </div>
                        <span className="drop-file-preview__item__del" onClick={fileRemove}>x</span>
                    </div>
                </div>
            )}
        </div>
    );
};

DropFileInput.propTypes = {
    onFileChange: PropTypes.func.isRequired,
    existingFile: PropTypes.object,
};

DropFileInput.defaultProps = {
    onFileChange: () => {},
    existingFile: null,
};

export default DropFileInput;
