import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Group, Wedge, Text, Circle } from 'react-konva';

const SEGMENTS = [
  { number: 0, color: '#ff69b4' },
  { number: 1, color: '#4169e1' },
  { number: 2, color: '#00ced1' },
  { number: 3, color: '#dc143c' },
  { number: 4, color: '#ffd700' },
  { number: 5, color: '#8a2be2' },
  { number: 6, color: '#ffff00' },
  { number: 7, color: '#1e90ff' },
  { number: 8, color: '#ff4500' },
  { number: 9, color: '#9400d3' },
];

const RADIUS = 120;
const WHEEL_SIZE = 300;

const SpinningWheelCanvas = ({ centerText = '270-9' }) => {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    let animFrame;
    const rotate = () => {
      setAngle(prev => (prev + 1) % 460); // Adjust speed here
      animFrame = requestAnimationFrame(rotate);
    };
    rotate();
    return () => cancelAnimationFrame(animFrame);
  }, []);

  return (
    <div style={{ width: WHEEL_SIZE, margin: 'auto' }}>
      <Stage width={WHEEL_SIZE} height={WHEEL_SIZE}>
        <Layer>
          {/* Rotating wheel group */}
          <Group x={WHEEL_SIZE / 2} y={WHEEL_SIZE / 2} rotation={angle}>
            {SEGMENTS.map((seg, i) => {
              const anglePerSegment = 360 / SEGMENTS.length;
              const startAngle = i * anglePerSegment;
              const midAngle = startAngle + anglePerSegment / 2;
              const radians = (midAngle * Math.PI) / 180;
              const textX = Math.cos(radians) * (RADIUS * 0.7);
              const textY = Math.sin(radians) * (RADIUS * 0.7);

              return (
                <Group key={i}>
                  <Wedge
                    radius={RADIUS}
                    angle={anglePerSegment}
                    fill={seg.color}
                    rotation={startAngle}
                  />
                  <Text
                    text={String(seg.number)}
                    x={textX - 10}
                    y={textY - 10}
                    fontSize={20}
                    fontStyle="bold"
                    fill="#000"
                  />
                </Group>
              );
            })}
          </Group>

          {/* Static center circle */}
          <Group x={WHEEL_SIZE / 2} y={WHEEL_SIZE / 2}>
            <Circle radius={40} fill="white" stroke="black" strokeWidth={3} />
            <Text
              text={centerText}
              fontSize={18}
              fontStyle="bold"
              fill="#0033cc"
              align="center"
              verticalAlign="middle"
              x={-30}
              y={-10}
              width={60}
              height={20}
            />
          </Group>
        </Layer>
      </Stage>
    </div>
  );
};

export default SpinningWheelCanvas;
