import React, { useRef, useEffect, useState } from "react";

function WebcamCapture() {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const enableWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError("⚠️ Webcam access denied! Please enable your webcam to continue.");
        // Handle test termination if webcam is disabled
      }
    };
  
    enableWebcam();
  }, []);
  

  return (
    <div>
      <h3>Webcam Preview</h3>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <video ref={videoRef} autoPlay playsInline width="400" height="300" />
      )}
    </div>
  );
}

export default WebcamCapture;
