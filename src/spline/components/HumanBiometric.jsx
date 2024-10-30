import Spline from '@splinetool/react-spline';
import React,{ useRef } from 'react';


function HumanBiometric() {
  const cube = useRef();

  function onLoad(spline) {
    const obj = spline.findObjectByName('Cube');
    console.log('load', { spline, obj });
    cube.current = obj;
  }


  return (
    <div className = "absolute ml-[1120px] mt-[90px]" style={{ width: '40vw', height: '90vh' }}>
      <Spline
        scene="/src/spline/human_scan.spline"
        onLoad={onLoad}
      />
    </div>

  );
}

export default HumanBiometric;
