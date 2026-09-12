import React from 'react';

export const Background: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-none bg-black"
      style={{
        backgroundImage: "url('/bg/bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Optional overlay to ensure glassmorphism text stays readable if the image is too bright */}
      <div className="absolute inset-0 bg-black/40"></div>
    </div>
  );
};
