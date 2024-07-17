// MainComponent.js wraps the player and the model component
import React from 'react';
import ThreeDModel from './ThreeDModel';
import Player from './Player';
import './MainComponent.css';

function MainComponent() {
  return (
    <div className="main-container">
 <Player />     
      <ThreeDModel />
     
    </div>
  );
}

export default MainComponent;