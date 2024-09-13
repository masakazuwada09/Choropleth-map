import Spline from '@splinetool/react-spline';
import React,{ useRef } from 'react';


function HumanBiometric() {
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
    <div className = "absolute ml-[540px]" style={{ width: '100vw', height: '100vh' }}>
      <Spline
        scene="/src/spline/biometric_scan.spline"
        onLoad={onLoad}
      />
    </div>

  );
}

export default HumanBiometric;
