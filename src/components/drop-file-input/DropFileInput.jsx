import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './drop-file-input.css';
import upload from "../../image/upload.png";
import { useEffect } from 'react';
const DropFileInput = (props) => {
    const wrapperRef = useRef(null);
    const [file, setFile] = useState(null);
    const [videoDuration, setVideoDuration] = useState('0:00'); 
    const [Text, setText] = useState("");

    const onDragEnter = () => wrapperRef.current.classList.add('dragover');
    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');
    const onDrop = () => wrapperRef.current.classList.remove('dragover');

    const onFileDrop = (e) => {
        const newFile = e.target.files[0];
        if (newFile) {
            console.log('Selected File:', newFile); 
            setFile(newFile);

            
            const videoElement = document.createElement('video');
            videoElement.src = URL.createObjectURL(newFile);
            videoElement.onloadedmetadata = () => {
                const duration = Math.floor(videoElement.duration);
                const minutes = Math.floor(duration / 60);
                const seconds = duration % 60;
                const formattedDuration = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
                setVideoDuration(formattedDuration);
                
              
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
        setVideoDuration('0:00'); 
        if (typeof props.onFileChange === 'function') {
            props.onFileChange(null); 
        }
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
                            <p>{file.name}</p>
                            <p>{formatFileSize(file.size)} ({videoDuration})</p> {/* 비디오 길이 표시 */}
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
};

DropFileInput.defaultProps = {
    onFileChange: () => {},
};

export default DropFileInput;
