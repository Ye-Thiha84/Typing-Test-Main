import { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [typingTests, setTypingTests] = useState([]);
  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(15);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [results, setResults] = useState(null);
  const inputDivRef = useRef(null);

  const fetchApi = async () => {
    try {
      const typingResponse = await axios.get('http://localhost:8181/api/typing-tests');
      setTypingTests(typingResponse.data.texts);
      setCurrentText(typingResponse.data.texts[Math.floor(Math.random() * typingResponse.data.texts.length)]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  useEffect(() => {
    let timer;
    if (isTestRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTestRunning) {
      endTest();
    }
    return () => clearInterval(timer);
  }, [isTestRunning, timeLeft]);

  useEffect(() => {
    if (isTestRunning && inputDivRef.current) {
      inputDivRef.current.focus();
    }
  }, [isTestRunning]);

  const startTest = () => {
    if (typingTests.length > 0) {
      setIsTestRunning(true);
      setTimeLeft(15);
      setUserInput('');
      setResults(null);
      setCurrentText(typingTests[Math.floor(Math.random() * typingTests.length)]);
    }
  };

  const endTest = () => {
    setIsTestRunning(false);
    const wordsTyped = userInput.trim().split(/\s+/).length;
    const correctChars = userInput.split('').reduce((acc, char, i) => 
      acc + (char === currentText[i] ? 1 : 0), 0);
    const accuracy = (correctChars / userInput.length * 100) || 0;
    const wpm = Math.round((wordsTyped / 15) * 60);
    
    setResults({
      wpm: isNaN(wpm) ? 0 : wpm,
      accuracy: accuracy.toFixed(2),
      correctChars,
      totalChars: userInput.length
    });
  };

  const handleKeyPress = (e) => {
    if (!isTestRunning) return;

    e.preventDefault();
    
    if (e.key === 'Backspace') {
      setUserInput(prev => prev.slice(0, -1));
    } else if (e.key.length === 1) {
      setUserInput(prev => prev + e.key);
    }
  };

  const renderText = () => {
    return currentText.split('').map((char, index) => {
      let color = 'black';
      if (index < userInput.length) {
        color = userInput[index] === char ? '#4CAF50' : '#FF5252';
      }
      return (
        <span 
          key={index} 
          style={{ 
            color,
            backgroundColor: index === userInput.length ? '#555' : 'transparent',
            transition: 'all 0.2s ease'
          }}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Rapid Type</h1>
        <p className="description">
          Boost your typing speed with instant feedback. Practice, improve, and track your progress in real-time.
        </p>
      </header>

      <main className="main-content">
        {!isTestRunning && !results && (
          <button 
            className="start-button"
            onClick={startTest} 
            disabled={typingTests.length === 0}
          >
            Start Typing Test
          </button>
        )}

        {isTestRunning && (
          <div className="test-container">
            <div className="timer">
              Time Left: {timeLeft}s
            </div>
            <div className="text-display">
              {renderText()}
            </div>
            <div
              ref={inputDivRef}
              tabIndex={0}
              onKeyDown={handleKeyPress}
              className="input-div"
              style={{
                position: 'absolute',
                opacity: 0,
                height: 0,
                width: 0,
                overflow: 'hidden'
              }}
            />
          </div>
        )}

        {results && (
          <div className="results">
            <h3>Test Results</h3>
            <p>Words per Minute (WPM): {results.wpm}</p>
            <p>Accuracy: {results.accuracy}%</p>
            <p>Correct Characters: {results.correctChars}</p>
            <p>Total Characters: {results.totalChars}</p>
            <button 
              className="start-button"
              onClick={startTest}
            >
              Try Again
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;