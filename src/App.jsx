import { useState, useEffect, useRef } from "react";

function App() {
  const [poemArr, setPoemArr] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [linePositions, setLinePositions] = useState([]); // Store positions for each line
  const containerRef = useRef(null);

  useEffect(() => {
    fetch("./Duolouge.json")
      .then((res) => res.json())
      .then((data) => {
        setPoemArr(data);
        // Pre-generate random positions for all lines
        const positions = data.map(() => ({
          top: Math.random() * 80 + 10, // 10% to 90% from top
          left: Math.random() * 60 + 5  // 5% to 65% from left
        }));
        setLinePositions(positions);
      });
  }, []);

  useEffect(() => {
    const advanceLine = () => {
      setCurrentIdx((idx) => (idx + 1 < poemArr.length ? idx + 1 : idx));
    };
    window.addEventListener("keydown", advanceLine);
    window.addEventListener("mousedown", advanceLine);
    return () => {
      window.removeEventListener("keydown", advanceLine);
      window.removeEventListener("mousedown", advanceLine);
    };
  }, [poemArr.length]);

  useEffect(() => {
    if (poemArr.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIdx((idx) => (idx + 1 < poemArr.length ? idx + 1 : idx));
    }, 1000);
    return () => clearInterval(interval);
  }, [poemArr.length]);

  // Removed auto-scroll effect - lines now appear from top instead

  return (
    <div className="">
      <div
        id="container"
        ref={containerRef}
      >
        {poemArr.slice(0, currentIdx + 1).map((line, i) => {
          const position = linePositions[i];
          if (!position) return null;
          
          const isCurrentLine = i === currentIdx;
          
          return (
            <p 
              className={`text Words-line color-${i % 6} ${isCurrentLine ? 'animate' : 'static'}`}
              key={i}
              style={{
                position: 'absolute',
                top: `${position.top}%`,
                left: `${position.left}%`,
                animationDelay: isCurrentLine ? '0s' : 'none'
              }}
            >
              {line}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export default App;