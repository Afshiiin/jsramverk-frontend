import React from 'react';
import Editor from './components/body/editor/editor';
import NavBar from './components/header/navbar';
import { useEffect } from 'react';
function App() {
  useEffect(() => {
    document.title = 'My Editor'
  }, []);
  return (
    <div className="App">
 
 <NavBar />
 <Editor />
</div>
  );
}

export default App;
