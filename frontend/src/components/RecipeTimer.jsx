
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Bell,
  X,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

function RecipeTimer({ onClose }) {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const intervalRef = useRef(null);
  const deadlineRef = useRef(null);

  const presets = [1, 5, 10, 15, 20, 30];

  // Play a notification sound
  const playAlarm = () => {
    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContextClass) return;

      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = 'sine';
      oscillator.frequency.value = 800;

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 1.5
      );

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 1.5);

      oscillator.onended = () => audioContext.close();
    } catch (error) {
      console.log('Audio error:', error);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (!isRunning || isPaused) return;

    intervalRef.current = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.ceil((deadlineRef.current - Date.now()) / 1000)
      );

      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        setIsPaused(false);
        setIsFinished(true);

        toast.success("Time's up! Your recipe is ready.", {
          duration: 10000,
          icon: <Bell className="text-[#E88FA5]" />,
        });

        playAlarm();

        if (
          'Notification' in window &&
          Notification.permission === 'granted'
        ) {
          new Notification("Time's up!", {
            body: 'Your recipe timer has finished.',
            icon: '/pwa-192x192.png',
          });
        }
      }
    }, 250);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused]);

  // Start timer
  const handleStart = async () => {
    const total = minutes * 60 + seconds;

    if (total <= 0) {
      toast.error('Please set a time first!');
      return;
    }

    if (
      'Notification' in window &&
      Notification.permission === 'default'
    ) {
      try {
        await Notification.requestPermission();
      } catch (error) {
        console.log('Notification permission error:', error);
      }
    }

    deadlineRef.current = Date.now() + total * 1000;

    setTimeLeft(total);
    setIsFinished(false);
    setIsPaused(false);
    setIsRunning(true);
  };

  // Pause / Resume
  const handlePause = () => {
    if (isPaused) {
      deadlineRef.current = Date.now() + timeLeft * 1000;
      setIsPaused(false);
    } else {
      const remaining = Math.max(
        0,
        Math.ceil((deadlineRef.current - Date.now()) / 1000)
      );

      setTimeLeft(remaining);
      setIsPaused(true);
    }
  };

  // Reset timer
  const handleReset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setIsRunning(false);
    setIsPaused(false);
    setIsFinished(false);
    setTimeLeft(0);
    deadlineRef.current = null;
  };

  // Quick presets
  const handlePreset = (mins) => {
    setMinutes(mins);
    setSeconds(0);
    setIsFinished(false);
  };

  // Format timer display
  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;

    return `${m.toString().padStart(2, '0')}:${s
      .toString()
      .padStart(2, '0')}`;
  };

  // Progress calculation
  const totalTime = minutes * 60 + seconds;

  const progress =
    totalTime > 0
      ? Math.min(100, ((totalTime - timeLeft) / totalTime) * 100)
      : 0;

  const circumference = 2 * Math.PI * 45;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1A1512]/75 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="timer-title"
        className="relative w-full max-w-[420px] max-h-[90vh] overflow-y-auto rounded-[30px] border border-[#EEE7DF] bg-[#FFFEFC] p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.25)] animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close timer"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#FAF7F0] text-[#8B8179] hover:bg-[#F5D8C8] hover:text-[#28221E] transition-all"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="mb-7 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E88FA5]/15 text-[#D77F96]">
            <Timer size={27} />
          </div>

          <p className="mb-1 text-[10px] font-bold uppercase tracking-[3px] text-[#718B68]">
            Saveurs Kitchen
          </p>

          <h2
            id="timer-title"
            className="font-serif text-3xl font-bold text-[#28221E]"
          >
            Cooking Timer
          </h2>

          <p className="mt-2 text-xs text-[#A49A91]">
            Every minute brings deliciousness closer.
          </p>
        </div>

        {/* Active Timer */}
        {isRunning || isPaused || isFinished ? (
          <div className="text-center">

            {/* Progress Circle */}
            <div className="relative mx-auto mb-7 h-56 w-56">

              <svg
                className="h-full w-full -rotate-90"
                viewBox="0 0 100 100"
                aria-hidden="true"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#F0EAE3"
                  strokeWidth="4"
                />

                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#E88FA5"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={
                    circumference * (1 - progress / 100)
                  }
                  className="transition-all duration-300"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">

                {isFinished ? (
                  <>
                    <CheckCircle2
                      size={35}
                      className="mb-2 text-[#718B68]"
                    />
                    <p className="font-serif text-2xl font-bold text-[#718B68]">
                      Time's Up!
                    </p>
                    <p className="mt-1 text-xs text-[#A49A91]">
                      Your timer has finished
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-serif text-[54px] font-bold tracking-tight text-[#28221E] tabular-nums">
                      {formatTime(timeLeft)}
                    </p>

                    <p
                      className={`mt-2 text-[10px] font-bold uppercase tracking-[3px] ${
                        isPaused
                          ? 'text-[#D77F96]'
                          : 'text-[#718B68]'
                      }`}
                    >
                      {isPaused ? 'Paused' : 'Cooking...'}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Progress Label */}
            {!isFinished && (
              <p className="mb-6 text-xs text-[#A49A91]">
                {Math.round(progress)}% completed
              </p>
            )}

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-4">

              {!isFinished && (
                <button
                  type="button"
                  onClick={handlePause}
                  aria-label={isPaused ? 'Resume timer' : 'Pause timer'}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E88FA5] text-white shadow-lg shadow-[#E88FA5]/25 hover:scale-105 hover:bg-[#D77F96] transition-all"
                >
                  {isPaused ? (
                    <Play size={23} fill="currentColor" />
                  ) : (
                    <Pause size={23} fill="currentColor" />
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={handleReset}
                className="flex h-14 items-center justify-center gap-2 rounded-full bg-[#FAF7F0] px-6 text-sm font-semibold text-[#51453D] hover:bg-[#F5D8C8] transition-all"
              >
                <RotateCcw size={18} />
                {isFinished ? 'New Timer' : 'Reset'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Quick Presets */}
            <div className="mb-7">

              <div className="mb-3 flex items-center justify-center gap-2">
                <Sparkles size={14} className="text-[#E88FA5]" />
                <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#A49A91]">
                  Quick Presets
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {presets.map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => handlePreset(mins)}
                    className={`rounded-xl py-3 text-sm font-bold transition-all duration-200 ${
                      minutes === mins && seconds === 0
                        ? 'bg-[#E88FA5] text-white shadow-md shadow-[#E88FA5]/20'
                        : 'bg-[#FAF7F0] text-[#51453D] hover:bg-[#F5D8C8]'
                    }`}
                  >
                    {mins} min
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Time */}
            <div className="mb-7">
              <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-[2px] text-[#A49A91]">
                Or set your own time
              </p>

              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label
                    htmlFor="timer-minutes"
                    className="mb-2 block text-center text-xs font-semibold text-[#8B8179]"
                  >
                    Minutes
                  </label>

                  <input
                    id="timer-minutes"
                    type="number"
                    min="0"
                    max="99"
                    value={minutes}
                    onChange={(e) =>
                      setMinutes(
                        Math.max(
                          0,
                          Math.min(99, Number(e.target.value) || 0)
                        )
                      )
                    }
                    className="w-full rounded-2xl border border-[#EEE7DF] bg-[#FAF7F0] py-4 text-center font-serif text-3xl font-bold text-[#28221E] outline-none focus:border-[#E88FA5] focus:ring-2 focus:ring-[#E88FA5]/15 transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="timer-seconds"
                    className="mb-2 block text-center text-xs font-semibold text-[#8B8179]"
                  >
                    Seconds
                  </label>

                  <input
                    id="timer-seconds"
                    type="number"
                    min="0"
                    max="59"
                    value={seconds}
                    onChange={(e) =>
                      setSeconds(
                        Math.max(
                          0,
                          Math.min(59, Number(e.target.value) || 0)
                        )
                      )
                    }
                    className="w-full rounded-2xl border border-[#EEE7DF] bg-[#FAF7F0] py-4 text-center font-serif text-3xl font-bold text-[#28221E] outline-none focus:border-[#E88FA5] focus:ring-2 focus:ring-[#E88FA5]/15 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              type="button"
              onClick={handleStart}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#28221E] py-4 text-sm font-bold uppercase tracking-[2px] text-white shadow-lg hover:bg-[#E88FA5] hover:shadow-[#E88FA5]/20 transition-all duration-300"
            >
              <Play size={18} fill="currentColor" />
              Start Cooking
            </button>
          </>
        )}

        {/* Footer Info */}
        <div className="mt-7 flex items-center justify-center gap-2 border-t border-[#F0EAE3] pt-5">
          <Bell size={14} className="text-[#718B68]" />
          <p className="text-[11px] text-[#A49A91]">
            You'll be notified when your timer is complete.
          </p>
        </div>

      </div>
    </div>
  );
}

export default RecipeTimer;
