import Spline from '@splinetool/react-spline';
import React,{ useRef } from 'react';


function HumanLungs() {
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
    <div className = "absolute mr-[290px] mt-[-380px]" style={{ width: '20vw', height: '40vh' }}>
      <Spline
        scene="/src/spline/human_lungs3.spline"
        onLoad={onLoad}
      />
    </div>

  );
}

export default HumanLungs;
