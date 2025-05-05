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
  const inputRef = useRef(null);

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

  const startTest = () => {
    if (typingTests.length > 0) {
      setIsTestRunning(true);
      setTimeLeft(15);
      setUserInput('');
      setResults(null);
      setCurrentText(typingTests[Math.floor(Math.random() * typingTests.length)]);
      inputRef.current?.focus();
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

  const handleInput = (e) => {
    if (isTestRunning) {
      setUserInput(e.target.value);
    }
  };

  const renderText = () => {
    return currentText.split('').map((char, index) => {
      let color = '#ffffff';
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
    <div className="container">
      <h2>Typing Test Simulator</h2>
      
      {!isTestRunning && !results && (
        <button 
          className="start-button"
          onClick={startTest} 
          disabled={typingTests.length === 0}
        >
          Start Test
        </button>
      )}

      {isTestRunning && (
        <>
          <div className="timer">
            Time Left: {timeLeft}s
          </div>
          <div className="text-display">
            {renderText()}
          </div>
          <textarea
            ref={inputRef}
            value={userInput}
            onChange={handleInput}
            className="input-area"
            disabled={!isTestRunning}
            autoFocus
          />
        </>
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
    </div>
  );
}

export default App;