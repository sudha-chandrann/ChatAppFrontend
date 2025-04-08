import { useState, useEffect } from 'react';

export default function Loader() {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 1;
      });
    }, 30);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-900 p-8">
      <div className="relative w-64 h-64">
        {/* Orbital particles */}
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className="absolute w-2 h-2 rounded-full bg-indigo-400"
            style={{
              left: '50%',
              top: '50%',
              transform: `rotate(${i * 30}deg) translateY(-120px) rotate(${-i * 30}deg)`,
              opacity: 0.6 + Math.sin(progress / 10 + i) * 0.4,
              boxShadow: '0 0 8px 2px rgba(129, 140, 248, 0.5)',
              animation: `pulse 1.5s ease-in-out infinite ${i * 0.1}s`
            }}
          />
        ))}
        
        {/* Central pulsing orb */}
        <div className="absolute left-1/2 top-1/2 w-16 h-16 bg-indigo-500 rounded-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center animate-pulse">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-indigo-300 rounded-full opacity-80" />
          </div>
        </div>
        
        {/* Spinning ring */}
        <div 
          className="absolute left-1/2 top-1/2 w-48 h-48 border-4 border-t-purple-500 border-r-indigo-500 border-b-blue-500 border-l-violet-500 rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{
            animation: 'spin 3s linear infinite'
          }}
        />
        
        {/* Outer glow ring */}
        <div className="absolute left-1/2 top-1/2 w-56 h-56 border border-indigo-300 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-20" />
      </div>
      
      {/* Progress bar */}
      <div className="w-64 h-2 bg-gray-800 rounded-full mt-12 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Loading text */}
      <div className="mt-6 text-indigo-200 font-medium tracking-wider">
        LOADING... {progress}%
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: rotate(${0}deg) translateY(-120px) rotate(${0}deg) scale(1); }
          50% { transform: rotate(${0}deg) translateY(-120px) rotate(${0}deg) scale(1.5); }
        }
      `}</style>
    </div>
  );
}