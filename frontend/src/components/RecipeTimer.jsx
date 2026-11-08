import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Timer, Play, Pause, RotateCcw, Bell, X } from 'lucide-react';

function RecipeTimer({ onClose }) {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

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
    
    toast.success("Time's up!", {
      duration: 10000,
      icon: <Bell className="text-guava-pink" />,
    });

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

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification("Time's up!", {
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

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    setTimeLeft(total);
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => setIsPaused(!isPaused);

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
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      
      <div className="bg-white dark:bg-dark-card rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-warm-brown/10 dark:border-gray-800 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[#FAF7F0] dark:bg-gray-800 text-gray-400 hover:text-warm-brown flex items-center justify-center transition-colors"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-guava-peach rounded-full flex items-center justify-center mx-auto mb-4">
            <Timer size={24} className="text-warm-brown" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-warm-brown dark:text-white">
            Timer
          </h2>
        </div>

        {/* Timer Display */}
        {isRunning || timeLeft > 0 ? (
          <div className="text-center mb-8">
            
            {/* Progress Circle */}
            <div className="relative w-56 h-56 mx-auto mb-8">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-gray-100 dark:text-gray-800"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="text-guava-pink transition-all duration-1000"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="font-serif text-6xl font-bold text-warm-brown dark:text-white tracking-tight">
                  {formatTime(timeLeft)}
                </p>
                {isPaused && (
                  <p className="text-xs text-guava-pink font-bold tracking-widest uppercase mt-2">Paused</p>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handlePause}
                className="w-14 h-14 bg-guava-pink text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-guava-pink/30"
              >
                {isPaused ? <Play size={24} fill="currentColor" className="ml-1" /> : <Pause size={24} fill="currentColor" />}
              </button>
              <button
                onClick={handleReset}
                className="w-14 h-14 bg-gray-100 dark:bg-gray-800 text-warm-brown dark:text-white rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <RotateCcw size={22} />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Presets */}
            <div className="mb-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">Quick Presets</p>
              <div className="grid grid-cols-3 gap-2">
                {presets.map(mins => (
                  <button
                    key={mins}
                    onClick={() => handlePreset(mins)}
                    className={`py-3 rounded-xl text-sm font-bold transition-colors ${
                      minutes === mins && seconds === 0
                        ? 'bg-guava-pink text-white shadow-md'
                        : 'bg-[#FAF7F0] dark:bg-gray-800 text-warm-brown dark:text-gray-300 hover:bg-guava-peach dark:hover:bg-gray-700'
                    }`}
                  >
                    {mins} min
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Time */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 text-center">Min</label>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={minutes}
                  onChange={(e) => setMinutes(Math.max(0, Math.min(99, parseInt(e.target.value) || 0)))}
                  className="w-full py-4 rounded-2xl border-none bg-[#FAF7F0] dark:bg-gray-800 text-warm-brown dark:text-white text-center font-serif text-3xl font-bold focus:outline-none focus:ring-2 focus:ring-guava-pink transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 text-center">Sec</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                  className="w-full py-4 rounded-2xl border-none bg-[#FAF7F0] dark:bg-gray-800 text-warm-brown dark:text-white text-center font-serif text-3xl font-bold focus:outline-none focus:ring-2 focus:ring-guava-pink transition-all"
                />
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStart}
              className="w-full py-4 bg-warm-brown dark:bg-white text-white dark:text-warm-brown rounded-2xl font-bold text-sm tracking-widest uppercase hover:bg-guava-pink dark:hover:bg-guava-pink dark:hover:text-white transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Play size={18} fill="currentColor" /> Start Timer
            </button>
          </>
        )}

        {/* Info */}
        <p className="text-xs text-gray-400 text-center mt-8 flex items-center justify-center gap-2">
          <Bell size={14} /> You will be notified when time is up.
        </p>
      </div>
    </div>
  );
}

export default RecipeTimer;