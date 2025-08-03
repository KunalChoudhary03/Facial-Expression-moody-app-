import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import './FacialExpressionDetector.css';
import axios from 'axios';

const FacialExpressionDetector = ({ setSongs }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

useEffect(() => {
  const loadModels = async () => {
    const MODEL_URL = '/models';
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL); // Needed for outline
    setModelsLoaded(true);
  };

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error('Webcam access error:', error);
    }
  };

  loadModels().then(startVideo);
}, []);

useEffect(() => {
  if (!modelsLoaded) return;

  const video = videoRef.current;
  const canvas = canvasRef.current;

  const handlePlay = () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const interval = setInterval(async () => {
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (detection) {
        const resized = faceapi.resizeResults(detection, {
          width: canvas.width,
          height: canvas.height,
        });

        faceapi.draw.drawDetections(canvas, resized);
        faceapi.draw.drawFaceLandmarks(canvas, resized);
        faceapi.draw.drawFaceExpressions(canvas, resized);
      }
    }, 100); // detect every 100ms

    return () => clearInterval(interval);
  };

  video.addEventListener('playing', handlePlay);
  return () => video.removeEventListener('playing', handlePlay);
}, [modelsLoaded]);


 const detectMoodOnce = async () => {
  document.querySelectorAll('audio').forEach((audio) => audio.pause());

  if (!modelsLoaded) return;

  const video = videoRef.current;
  const canvas = canvasRef.current;

  const detection = await faceapi
    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceExpressions();

  if (!detection) {
    alert('No face detected!');
    return;
  }

  const ctx = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const resized = faceapi.resizeResults(detection, {
    width: canvas.width,
    height: canvas.height,
  });
  faceapi.draw.drawDetections(canvas, resized);
  faceapi.draw.drawFaceExpressions(canvas, resized);

  const expressions = detection.expressions;
  const mood = Object.keys(expressions).reduce((a, b) =>
    expressions[a] > expressions[b] ? a : b
  );

  console.log('Detected Mood:', mood);

  try {
    const response = await axios.get(`http://localhost:3000/songs?mood=${mood}`);
    console.log('Fetched Songs:', response.data);
    setSongs(response.data.songs); 
  } catch (error) {
    console.error('Failed to fetch songs:', error);
  }
};


  return (
    <div className="container">
      <div className="video-box">
        <video ref={videoRef} autoPlay muted className="video" />
        <canvas ref={canvasRef} className="canvas" />
        <button className="detect-button" onClick={detectMoodOnce}>
          Detect Mood
        </button>
      </div>
    </div>
  );
};

export default FacialExpressionDetector;
