import React from 'react';
import Svg, { Rect } from 'react-native-svg';



export default function WaveformAudio({isPlaying}: {isPlaying: boolean}) {
  
  const generateWaveform = () => {
    const barCount = 40;
    const bars = [];
    
    for (let i = 0; i < barCount; i++) {
      const barHeight = Math.random() * 120 + 15;
      const distanceFromCenter = Math.abs(i - 20);
      const opacity = distanceFromCenter <= 5 ? 1 : Math.max(0.5, 1 - (distanceFromCenter * 0.05));
      
      bars.push(
        <Rect
          key={i}
          x={i * 10}
          y={(100 - barHeight) / 2}
          width={2}
          height={barHeight}
          fill="#974908"
          opacity={opacity}
        />
      );
    }

    return bars;
  };

  return (
      <Svg width={"100%"} height={100}>
        {generateWaveform()}
      </Svg>
  );
}
