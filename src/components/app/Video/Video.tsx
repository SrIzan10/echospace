import React from 'react';

interface VideoProps {
  src: string;
  autoPlay?: boolean;
  controls?: boolean;
  width?: string | number;
  height?: string | number;
  className?: string;
  muted?: boolean;
}

export default function Video({
  src,
  autoPlay = false,
  controls = true,
  width = '100%',
  height = 'auto',
  className = '',
  muted = false,
}: VideoProps) {
  return (
    <video
      src={src}
      autoPlay={autoPlay}
      controls={controls}
      width={width}
      height={height}
      className={className}
      muted={muted}
    >
      Your browser does not support the video tag.
    </video>
  );
}