import Spline from '@splinetool/react-spline';
import React,{ useRef, useEffect } from 'react';


function Interface() {
  const cube = useRef();

  function onLoad(spline) {
    const obj = spline.findObjectByName('Cube');
    console.log('load', { spline, obj });
    cube.current = obj;
  }
  const handleSplineLoad = (spline) => {
    if (spline && spline.scene && spline.scene.controls) {
      spline.scene.controls.enableRotate = false;
      spline.scene.controls.enableZoom = false;
      spline.scene.controls.enablePan = false;
    }
  };
  function moveObj() {
    cube.current.position.x += 50;
  }
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'ArrowRight') {
        moveObj();
      }
    }
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  return (
    <div className="absolute z-10" style={{ width: '50vw', height: '100vh', transform: 'scale(50%)' }}>
  <Spline
    scene="/src/spline/interface.spline"
    onLoad={handleSplineLoad}
    
  />
</div>


  );
}

export default Interface;
