import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; 
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Page1 />} /> 
        <Route path="/page2" element={<Page2 />} />
        <Route path="/page3" element={<Page3 />} />
      </Routes>
    </Router>
  );
};

export default App;
