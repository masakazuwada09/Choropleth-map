import { useState, useRef } from 'react';

const ResizableSidebar = ({ children, initialWidth = 250 }) => {
  const [width, setWidth] = useState(initialWidth);
  const sidebarRef = useRef(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const onMouseDown = (e, direction) => {
    startX.current = e.clientX;
    startWidth.current = sidebarRef.current.offsetWidth;

    const onMouseMove = (e) => {
      let newWidth;
      if (direction === 'right') {
        newWidth = startWidth.current + e.clientX - startX.current;
      } else {
        newWidth = startWidth.current - (e.clientX - startX.current);
      }
      setWidth(newWidth);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div
      ref={sidebarRef}
      style={{ width }}
      className="relative bg-white border-r border-gray-200"
    >
      <div className="p-2">
        {children}
      </div>
      {/* Left resizer */}
      <div
        onMouseDown={(e) => onMouseDown(e, 'left')}
        className="absolute left-0 top-0 h-full w-2 bg-gray-300 cursor-ew-resize"
      />
      {/* Right resizer */}
      <div
        onMouseDown={(e) => onMouseDown(e, 'right')}
        className="absolute right-0 top-0 h-full w-2 bg-gray-300 cursor-ew-resize"
      />
    </div>
  );
};

export default ResizableSidebar;
