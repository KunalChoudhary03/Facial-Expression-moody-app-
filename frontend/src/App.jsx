import React, { useState } from 'react'
import FacialExpressionDetector from './components/FacialExpression'
import MoodSongs from './components/MoodSongs'
import './app.css'
const App = () => {
    const [songs, setSongs] = useState([
    
  ]);

  return (
    <div>

      <h1>Detect Your Mood and Listen Music</h1>
      <FacialExpressionDetector setSongs = {setSongs} />
     <MoodSongs songs={songs} />

    </div>
  )
}

export default App
