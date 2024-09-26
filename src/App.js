import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Editor from './components/body/editor/editor';
import NavBar from './components/header/navbar';
import Login from './components/auth/login';
//import { UserProvider } from './components/context/userContext'; // Import the provider



function App() {
  useEffect(() => {
    document.title = 'My Editor';
  }, []);

  return (
      <div className="App">
        <Router>
          <NavBar />
          <Routes>
            <Route path="/editor" element={<Editor />} />
            <Route path="/" element={<Login />} />
          </Routes>
        </Router>
      </div>
   
  );
}

export default App;
