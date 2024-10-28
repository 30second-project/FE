import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './drop-file-input.css';
import upload from "../../image/upload.png";

const ImgDrop = ({ onImageChange, existingFile }) => {
    const wrapperRef = useRef(null);
    const [file, setFile] = useState(existingFile?.file || null);
    const [fileUrl, setFileUrl] = useState(existingFile?.url || null);
    const [imgText, setImgText] = useState("");

    const onDragEnter = () => wrapperRef.current.classList.add('dragover');
    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');
    const onDrop = () => wrapperRef.current.classList.remove('dragover');

    useEffect(() => {
        if (existingFile) {
            setFile(existingFile.file);
            setFileUrl(existingFile.url);
        } else {
            setFile(null);
            setFileUrl(null);
        }
    }, [existingFile]);

    const onFileDrop = (e) => {
        const newFile = e.target.files[0];
        if (newFile) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validTypes.includes(newFile.type)) {
                alert('이미지 파일(JPEG, PNG, GIF)만 업로드할 수 있습니다.');
                return;
            }

            const imageUrl = URL.createObjectURL(newFile);
            setFile(newFile);
            setFileUrl(imageUrl);

            if (typeof onImageChange === 'function') {
                onImageChange({
                    file: newFile,
                    fileName: newFile.name,
                    fileSize: newFile.size,
                    url: imageUrl
                });
            }
        }
    };

    const fileRemove = () => {
        if (fileUrl) {
            URL.revokeObjectURL(fileUrl);
        }
        setFile(null);
        setFileUrl(null);
        onImageChange(null);
    };

    const formatFileSize = (sizeInBytes) => {
        return (sizeInBytes / 1024).toFixed(2) + ' KB';
    };

    const updatePlaceholder = () => {
        setImgText(window.innerWidth < 1024 ? "여기를 터치하여 파일을 첨부해주세요" : "이미지 파일을 여기로 드래그 하세요");
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
                    <div className="drop-file-input__label label2">
                        <img src={upload} className='upload' alt="Upload" /><br />
                        <b className='file-b'>{imgText}</b><br />
                        <p className='drop-smalltext file-b'>
                            ※ 권장 사이즈: 1280 X 720 px (가로형)
                        </p>
                    </div>
                    <input type="file" accept="image/*" onChange={onFileDrop} />
                </>
            ) : (
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

ImgDrop.propTypes = {
    onImageChange: PropTypes.func.isRequired,
    existingFile: PropTypes.shape({
        file: PropTypes.object,
        url: PropTypes.string,
    })
};

ImgDrop.defaultProps = {
    onImageChange: () => {},
    existingFile: null
};

export default ImgDrop;
