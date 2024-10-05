import Spline from '@splinetool/react-spline';
import React,{ useRef } from 'react';


function Distorting() {
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
    <div className = "absolute" style={{ width: '500vw', height: '100vh' }}>
      <Spline
        scene="/src/spline/distorting.spline"
        onLoad={onLoad}
      />
    </div>

  );
}

export default Distorting;
