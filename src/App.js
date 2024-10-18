import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
import SubmissionTable from './SubmissionTable';

const App = () => {
  const [works, setWorks] = useState([{
    title: '',
    description: '',
    director: '',
    actors: '',
    additionalInfo: '',
    videoFile: null,
    videoName: '',
    videoSize: '',
    videoDuration: '',
    videoUrl: '',
    thumbnail: null,
    imgName: '',
    imgSize: '',
    imgType: '',
    thumbnailUrl: '',
  }]);

  const updateWorkInfo = (index, data) => {
    const updatedWorks = [...works];
    updatedWorks[index] = { ...updatedWorks[index], ...data };
    setWorks(updatedWorks);
  };

  const handleAddPlusPage = () => {
    if (works.length < 3) {
      setWorks([...works, { title: '', description: '', director: '', actors: '', additionalInfo: '', videoFile: null }]);
    }
  };

  const handleRemoveWork = (index) => {
    const newWorks = works.filter((_, i) => i !== index);
    setWorks(newWorks);
  };

  const handleFileChange = (index, fileData) => {
    const newWorks = [...works];
    if (fileData) {
      newWorks[index].videoFile = fileData.videoFile;
      newWorks[index].videoName = fileData.videoFile.name;
      newWorks[index].videoDuration = fileData.videoDuration;
      newWorks[index].videoUrl = fileData.videoUrl;
    } else {
      newWorks[index].videoFile = null;
      newWorks[index].videoName = '';
      newWorks[index].videoSize = '';
      newWorks[index].videoDuration = '';
      newWorks[index].videoUrl = '';
    }
    setWorks(newWorks);
  };

  const updateImageFileData = (index, fileData) => {
    const newWorks = [...works];
    if (fileData && fileData.file instanceof File) {
      const thumbnailUrl = URL.createObjectURL(fileData.file);
      newWorks[index].thumbnail = fileData.file;
      newWorks[index].imgName = fileData.name;
      newWorks[index].imgSize = (fileData.size / 1024).toFixed(2) + ' KB';
      newWorks[index].imgType = fileData.type;
      newWorks[index].thumbnailUrl = thumbnailUrl;
    } else {
      newWorks[index].thumbnail = null;
      newWorks[index].imgName = '';
      newWorks[index].imgSize = '';
      newWorks[index].imgType = '';
      newWorks[index].thumbnailUrl = '';
    }
    setWorks(newWorks);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Page1 
          works={works} 
          setWorks={setWorks}
          updateWorkInfo={updateWorkInfo} 
          handleFileChange={handleFileChange}
          updateImageFileData={updateImageFileData}
          handleAddPlusPage={handleAddPlusPage}
          handleRemoveWork={handleRemoveWork} 
        />} /> 
        <Route path="/page2" element={<Page2 works={works} />} />
        <Route path="/page3" element={<Page3 />} />
        <Route path="/AdminPage" element={<SubmissionTable />} />
      </Routes>
    </Router>
  );
};

export default App;
