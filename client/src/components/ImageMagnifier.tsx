import { useState } from 'react';
import { useLocation } from 'react-router-dom';

function ImageMagnifier({
  src,
  width,
  height,
  magnifierHeight = 100,
  magnifieWidth = 100,
  zoomLevel = 1.5,
}: {
  src: string;
  width: number;
  height: number;
  magnifierHeight?: number;
  magnifieWidth?: number;
  zoomLevel?: number;
}) {
  const location = useLocation().pathname;
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [showMagnifier, setShowMagnifier] = useState(false);
  return (
    <div
      className="h-full w-full "
      style={{
        position: 'relative',
        height: height,
        width: width,
      }}
    >
      <img
        src={src}
        className="w-full h-full mx-auto xs:object-contain object-cover   object-center"
        // style={{ height: height, width: width }}
        onMouseEnter={e => {
          // update image size and turn-on magnifier
          const elem = e.currentTarget;
          const { width, height } = elem.getBoundingClientRect();
          setSize([width, height]);
          setShowMagnifier(true);
        }}
        onMouseMove={e => {
          // update cursor position
          const elem = e.currentTarget;
          const { top, left } = elem.getBoundingClientRect();

          // calculate cursor position on the image
          const x = e.pageX - left - window.pageXOffset;
          const y = e.pageY - top - window.pageYOffset;
          setXY([x, y]);
        }}
        onMouseLeave={() => {
          // close magnifier
          setShowMagnifier(false);
        }}
        alt={'img'}
      />

      <div
        className="rounded-full border-2 border-red-600"
        style={{
          display: showMagnifier ? '' : 'none',
          position: 'absolute',

          // prevent magnifier blocks the mousemove event of img
          pointerEvents: 'none',
          // set size of magnifier
          height: `${magnifierHeight}px`,
          width: `${magnifieWidth + 45}px`,
          // move element center to cursor pos
          top: `${y - magnifierHeight / 2}px`,
          left: `${x - magnifieWidth / 2}px`,
          opacity: '1', // reduce opacity so you can verify position
          backgroundImage: `url('${src}')`,
          backgroundRepeat: 'no-repeat',

          //calculate zoomed image size
          backgroundSize: `${imgWidth * zoomLevel}px ${
            imgHeight * zoomLevel
          }px`,

          //calculate position of zoomed image.
          backgroundPositionX: `${-x * zoomLevel + magnifieWidth / 2}px`,
          backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`,
        }}
      ></div>
    </div>
  );
}
export default ImageMagnifier;
