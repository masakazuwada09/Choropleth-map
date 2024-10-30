import Spline from '@splinetool/react-spline';
import React,{ useRef } from 'react';


function InteractiveCube() {
  const cube = useRef();

  function onLoad(spline) {
    const obj = spline.findObjectByName('Cube');
    console.log('load', { spline, obj });
    cube.current = obj;
  }

  function moveObj() {
    cube.current.position.x += 50;
  }

  return (
    <div className = "absolute mb-[500px]" style={{ width: '180vh', height: '90vh' }}>
      <Spline
        scene="/src/spline/interactive_cube.spline"
        onLoad={onLoad}
      />
    </div>

  );
}

export default InteractiveCube;
