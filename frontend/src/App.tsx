import React from 'react';
import './App.css';
import ChatBox from './components/ChatBox';

const App: React.FC = () => {
  return (
    <div className="App">
      <main>
        <ChatBox />
      </main>
    </div>
  );
}

export default App;
