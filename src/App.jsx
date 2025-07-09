import { useState, useEffect, useRef } from "react";

function App() {
  const [poemArr, setPoemArr] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedLines, setSelectedLines] = useState([[], [], []]);
  const containerRef = useRef(null);
  const fruitIconsRef = useRef(null);

  useEffect(() => {
    fetch("./Duolouge.json")
      .then((res) => res.json())
      .then((data) => {
        setPoemArr(data);
        const getRandomLines = (count) => {
          const shuffled = [...data].sort(() => 0.5 - Math.random());
          return shuffled.slice(0, count);
        };
        setSelectedLines([
          getRandomLines(8),
          getRandomLines(8), 
          getRandomLines(8)
        ]);
      });
  }, []);

  const spinSlotMachine = () => {
    if (isSpinning || poemArr.length === 0) return;
    
    setIsSpinning(true);
    
    // Fruit icon rotation animation
    if (fruitIconsRef.current) {
      let rotation = 0;
      const fruitAnimation = setInterval(() => {
        rotation += 15;
        fruitIconsRef.current.style.transform = `rotate(${rotation}deg)`;
      }, 50);
      
      setTimeout(() => {
        clearInterval(fruitAnimation);
        if (fruitIconsRef.current) {
          fruitIconsRef.current.style.transform = 'rotate(0deg)';
        }
      }, 2500);
    }

    const getRandomLinesForReel = () => {
      const numLines = 8 + Math.floor(Math.random() * 3); // 8-10 lines per reel
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
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [poemArr.length, isSpinning]);

  return (
    <div className="slot-machine">
      <div className="lever-instruction">
          {isSpinning ? '🎲 Spinning...' : '🎯 Pull the lever!'}
        </div>
      <div 
        className={`slot-lever clickable ${isSpinning ? 'spinning' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          spinSlotMachine();
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
          spinSlotMachine();
        }}
        style={{ cursor: isSpinning ? 'not-allowed' : 'pointer' }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            spinSlotMachine();
          }
        }}
      >
        <div className={`lever-handle ${isSpinning ? 'pulled' : ''}`}></div>
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
                poemArr.map((line, i) => (
                  <p 
                    key={i}
                    className="text reel-line"
                  >
                    {line}
                  </p>
                ))
              ) : (
                selectedLines[columnIndex] && selectedLines[columnIndex].map((line, lineIndex) => (
                  <p 
                    key={lineIndex}
                    className="text selected-line"
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
       <div className="slot-header">
        <h1>🎰 A Duologue on You 🎰</h1>
      </div>
    </div>
  );
}

export default App;