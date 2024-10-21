import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import CCapture from 'ccapture.js';

const Scene = ({ isRecording, capturer }) => {
  const boxRef = useRef();

  // Rotate the box
  useFrame(() => {
    if (boxRef.current) {
      boxRef.current.rotation.x += 0.01; // Rotate along X axis
      boxRef.current.rotation.y += 0.01; // Rotate along Y axis
    }

    // Capture the frame if recording
    if (isRecording && capturer) {
      capturer.capture(boxRef.current.parent); // Capture the entire canvas
    }
  });

  return (
    <Box ref={boxRef} args={[1, 1, 1]} position={[0, 0, 0]}>
      <meshStandardMaterial attach="material" color="orange" />
    </Box>
  );
};

const CaptureCanvas = () => {
  const [isRecording, setIsRecording] = useState(false);
  const capturerRef = useRef(null);

  useEffect(() => {
    // Initialize the capturer
    capturerRef.current = new CCapture({
      format: 'webm',
      framerate: 60,
      verbose: true,
    });
  }, []);

  const startRecording = () => {
    capturerRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    capturerRef.current.stop();
    capturerRef.current.save(); // Automatically save the captured video
    setIsRecording(false);
  };

  return (
    <div>
      <Canvas style={{ height: '480px', width: '640px' }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Scene isRecording={isRecording} capturer={capturerRef.current} />
      </Canvas>
      <div>
        <button onClick={startRecording} disabled={isRecording}>
          Start Recording
        </button>
        <button onClick={stopRecording} disabled={!isRecording}>
          Stop Recording
        </button>
      </div>
      <p>Press the buttons to start and stop recording.</p>
    </div>
  );
};

const App = () => {
  return (
    <div>
      <h1>Canvas Capture Example with Three.js</h1>
      <CaptureCanvas />
    </div>
  );
};

export default App;
