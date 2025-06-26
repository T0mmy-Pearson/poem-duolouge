import { useState, useEffect, useRef } from "react";

function App() {
  const [poemArr, setPoemArr] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedLines, setSelectedLines] = useState([[], [], []]); // Arrays of lines for each column
  const [spinResults, setSpinResults] = useState([0, 0, 0]); // Final positions for each reel
  const containerRef = useRef(null);

  useEffect(() => {
    fetch("./Duolouge.json")
      .then((res) => res.json())
      .then((data) => {
        setPoemArr(data);
        // Initialize with first few lines for each column
        const getRandomLines = (count) => {
          const shuffled = [...data].sort(() => 0.5 - Math.random());
          return shuffled.slice(0, count);
        };
        setSelectedLines([
          getRandomLines(5),
          getRandomLines(5), 
          getRandomLines(5)
        ]);
      });
  }, []);

  const spinSlotMachine = () => {
    if (isSpinning || poemArr.length === 0) return;
    
    setIsSpinning(true);
    

    const getRandomLinesForReel = () => {
      const numLines = 7 + Math.floor(Math.random() * 3); // 5-7 lines
      const shuffled = [...poemArr].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, numLines);
    };
    
    const newResults = [
      getRandomLinesForReel(),
      getRandomLinesForReel(),
      getRandomLinesForReel()
    ];
    

    setTimeout(() => {
      setSelectedLines(newResults);
    }, 2000); 
    
    setTimeout(() => {
      setIsSpinning(false);
    }, 2500); 
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        spinSlotMachine();
      }
    };
    
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("mousedown", spinSlotMachine);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("mousedown", spinSlotMachine);
    };
  }, [poemArr.length, isSpinning]);

  return (
    <div className="slot-machine">
      <div className="slot-header">
        <h1>A Duologue on You</h1>
        <div className={`fruit-icons ${isSpinning ? 'spinning' : ''}`}></div>
        <button 
          className="spin-button" 
          onClick={spinSlotMachine}
          disabled={isSpinning}
        >
          {isSpinning ? 'Spinning...' : 'Spin'}
        </button>
      </div>
      
      <div id="container" ref={containerRef}>
        {[0, 1, 2].map((columnIndex) => (
          <div 
            key={columnIndex}
            className={`slot-reel column-${columnIndex} ${isSpinning ? 'spinning' : ''}`}
            style={{
              left: `${columnIndex * 33 + 2}%`,
            }}
          >
            <div className="reel-content">
              {isSpinning ? (
                // Show multiple lines scrolling during spin
                poemArr.map((line, i) => (
                  <p 
                    key={i}
                    className={`text reel-line color-${i % 6}`}
                  >
                    {line}
                  </p>
                ))
              ) : (
                // Show multiple selected lines when not spinning
                selectedLines[columnIndex] && selectedLines[columnIndex].map((line, lineIndex) => (
                  <p 
                    key={lineIndex}
                    className={`text selected-line color-${lineIndex % 6}`}
                    style={{
                      animationDelay: `${lineIndex * 0.1}s`
                    }}
                  >
                    {line}
                  </p>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;