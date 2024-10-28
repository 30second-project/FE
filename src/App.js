import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';

function App() {
    const [works, setWorks] = useState([
        { title: '', description: '', director: '', actors: '', additionalInfo: '', videoFile: null, thumbnail: null }
    ]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Page1 works={works} setWorks={setWorks} />} />
                <Route path="/page2" element={<Page2 works={works} />} />
                <Route path="/page3" element={<Page3 />} />
            </Routes>
        </Router>
    );
}

export default App;
