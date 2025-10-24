import React, { useRef } from 'react';

function TiltedCard({
  imageSrc,
  altText,
  captionText,
  containerWidth = '260px',
  containerHeight = '260px',
  imageWidth = '260px',
  imageHeight = '260px',
  rotateAmplitude = 14,
  scaleOnHover = 1.15,
  showTooltip = false,
  displayOverlayContent = false,
  overlayContent = null,
}) {
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const rx = ((cy / rect.height) - 0.5) * -rotateAmplitude;
    const ry = ((cx / rect.width) - 0.5) * rotateAmplitude;
    el.style.transform =
      `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scaleOnHover}) translateZ(0)`;
  };

  const handleMouseEnter = () => {
    const el = containerRef.current;
    if (!el) return;
    el.style.transition = 'transform 120ms ease';
  };

  const handleMouseLeave = () => {
    const el = containerRef.current;
    if (!el) return;
    el.style.transition = 'transform 220ms ease';
    el.style.transform = 'perspective(700px) rotateX(0) rotateY(0) scale(1)';
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        width: containerWidth,
        height: containerHeight,
        borderRadius: '18px',
        overflow: 'hidden',
        position: 'relative',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
        display: 'grid',
        placeItems: 'center',
        background: 'linear-gradient(135deg, rgba(108, 140, 255, 0.15), rgba(23,210,194,0.15))',
        boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
      }}
      aria-label={captionText}
    >
      <img
        src={imageSrc}
        alt={altText}
        style={{
          height: imageHeight,
          objectFit: 'cover',
          display: 'block',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
        draggable={false}
      />

      {displayOverlayContent && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            pointerEvents: 'none',
            paddingBottom: '8px',
            background:
              'linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.2) 35%, rgba(0,0,0,0) 70%)',
          }}
        >
          {overlayContent}
        </div>
      )}

      {showTooltip && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: 'rgba(0,0,0,0.55)',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: 8,
            fontSize: 12,
            pointerEvents: 'none',
          }}
        >
          {captionText}
        </div>
      )}
    </div>
  );
}

export default TiltedCard;