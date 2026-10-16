import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

function RecipeTimer({ onClose }) {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  // Preset times (in minutes)
  const presets = [1, 5, 10, 15, 20, 30];

  useEffect(() => {
    if (isRunning && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, timeLeft]);

  const handleComplete = () => {
    setIsRunning(false);
    setIsPaused(false);
    
    // Toast
    toast.success('⏰ Time\'s up!', {
      duration: 10000,
      icon: '🔔',
    });

    // Sound (using Web Audio API)
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1.5);

      // Play 3 beeps
      setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.frequency.value = 800;
        gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        osc2.start(audioContext.currentTime);
        osc2.stop(audioContext.currentTime + 0.3);
      }, 400);

      setTimeout(() => {
        const osc3 = audioContext.createOscillator();
        const gain3 = audioContext.createGain();
        osc3.connect(gain3);
        gain3.connect(audioContext.destination);
        osc3.frequency.value = 800;
        gain3.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        osc3.start(audioContext.currentTime);
        osc3.stop(audioContext.currentTime + 0.3);
      }, 800);
    } catch (e) {
      console.log('Audio error:', e);
    }

    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('⏰ Time\'s up!', {
        body: 'Your recipe timer has finished.',
        icon: '/pwa-192x192.png',
      });
    }
  };

  const handleStart = () => {
    const total = minutes * 60 + seconds;
    if (total <= 0) {
      toast.error('Please set a time');
      return;
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    setTimeLeft(total);
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(0);
  };

  const handlePreset = (mins) => {
    setMinutes(mins);
    setSeconds(0);
  };

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = (() => {
    const total = minutes * 60 + seconds;
    if (total === 0) return 0;
    return ((total - timeLeft) / total) * 100;
  })();

  return (
    <div className="fixed inset-0 z-[100] bg-warm-brown/95 dark:bg-dark-bg/95 backdrop-blur-md flex items-center justify-center p-4">
      
      <div className="bg-white dark:bg-dark-card rounded-3xl p-8 max-w-md w-full shadow-2xl border border-warm-brown/10 dark:border-dark-text/10 relative">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-warm-brown/10 dark:bg-dark-text/10 hover:bg-warm-brown/20 dark:hover:bg-dark-text/20 text-warm-brown dark:text-dark-text flex items-center justify-center transition-colors text-xl"
        >
          ✕
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-orange-accent/10 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
            ⏱️
          </div>
          <h2 className="font-serif text-3xl font-bold text-warm-brown dark:text-dark-text">
            Recipe Timer
          </h2>
        </div>

        {/* Timer Display */}
        {isRunning || timeLeft > 0 ? (
          <div className="text-center mb-8">
            
            {/* Progress Circle */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-warm-brown/10 dark:text-dark-text/10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  className="text-orange-accent transition-all duration-1000"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="font-serif text-5xl font-bold text-warm-brown dark:text-dark-text">
                    {formatTime(timeLeft)}
                  </p>
                  {isPaused && (
                    <p className="text-sm text-orange-accent font-medium mt-1">PAUSED</p>
                  )}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={handlePause}
                className="px-6 py-3 bg-orange-accent text-white rounded-xl font-medium hover:bg-orange-accent/90 transition-colors"
              >
                {isPaused ? '▶️ Resume' : '⏸️ Pause'}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-warm-brown/10 dark:bg-dark-text/10 text-warm-brown dark:text-dark-text rounded-xl font-medium hover:bg-warm-brown/20 dark:hover:bg-dark-text/20 transition-colors"
              >
                🔄 Reset
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Presets */}
            <div className="mb-6">
              <p className="text-sm font-medium text-warm-brown/60 dark:text-dark-text/60 mb-3 text-center">
                Quick Presets
              </p>
              <div className="grid grid-cols-3 gap-2">
                {presets.map(mins => (
                  <button
                    key={mins}
                    onClick={() => handlePreset(mins)}
                    className={`py-3 rounded-xl font-medium transition-colors ${
                      minutes === mins && seconds === 0
                        ? 'bg-orange-accent text-white'
                        : 'bg-cream dark:bg-dark-bg text-warm-brown dark:text-dark-text hover:bg-orange-accent/10'
                    }`}
                  >
                    {mins} min
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Time */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div>
                <label className="block text-sm font-medium text-warm-brown dark:text-dark-text mb-2">
                  Minutes
                </label>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={minutes}
                  onChange={(e) => setMinutes(Math.max(0, Math.min(99, parseInt(e.target.value) || 0)))}
                  className="w-full px-4 py-3 rounded-xl border border-warm-brown/10 dark:border-dark-text/10 bg-cream/50 dark:bg-dark-bg/50 text-warm-brown dark:text-dark-text text-center font-serif text-2xl font-bold focus:outline-none focus:border-orange-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-brown dark:text-dark-text mb-2">
                  Seconds
                </label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                  className="w-full px-4 py-3 rounded-xl border border-warm-brown/10 dark:border-dark-text/10 bg-cream/50 dark:bg-dark-bg/50 text-warm-brown dark:text-dark-text text-center font-serif text-2xl font-bold focus:outline-none focus:border-orange-accent transition-colors"
                />
              </div>
            </div>

            {/* Start */}
            <button
              onClick={handleStart}
              className="w-full py-4 bg-orange-accent text-white rounded-2xl font-semibold hover:bg-orange-accent/90 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-accent/30"
            >
              ▶️ Start Timer
            </button>
          </>
        )}

        {/* Info */}
        <p className="text-xs text-warm-brown/40 dark:text-dark-text/40 text-center mt-6">
          💡 You'll get a notification and sound when time is up.
        </p>
      </div>
    </div>
  );
}

export default RecipeTimer;