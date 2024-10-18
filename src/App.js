import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Page1 from './Page1';
import Page2 from './Page2';

function App() {
    const [works, setWorks] = useState([
        {
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
        },
        // 초기 값으로 다른 작업 추가 가능
    ]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Page1 works={works} setWorks={setWorks} />} />
                <Route path="/page2" element={<Page2 works={works} />} />
            </Routes>
        </Router>
    );
}

export default App;
