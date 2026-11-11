
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
  Clock3,
  ChefHat,
  Plus,
  Minus,
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

  const totalTime = minutes * 60 + seconds;
  const circumference = 2 * Math.PI * 44;

  const progress =
    totalTime > 0
      ? Math.min(100, Math.max(0, ((totalTime - timeLeft) / totalTime) * 100))
      : 0;

  const formatTime = (value) => {
    const mins = Math.floor(value / 60);
    const secs = value % 60;

    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Notification sound
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

  // Countdown
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
        intervalRef.current = null;

        setIsRunning(false);
        setIsPaused(false);
        setIsFinished(true);

        toast.success("Time's up! Your recipe is ready.", {
          duration: 10000,
          icon: <Bell size={18} />,
        });

        playAlarm();

        if (
          typeof Notification !== 'undefined' &&
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
        intervalRef.current = null;
      }
    };
  }, [isRunning, isPaused]);

  // Start
  const handleStart = async () => {
    const total = minutes * 60 + seconds;

    if (total <= 0) {
      toast.error('Please set a time first!');
      return;
    }

    if (
      typeof Notification !== 'undefined' &&
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

  // Reset
  const handleReset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsRunning(false);
    setIsPaused(false);
    setIsFinished(false);
    setTimeLeft(0);
    deadlineRef.current = null;
  };

  // Presets
  const handlePreset = (mins) => {
    setMinutes(mins);
    setSeconds(0);
    setTimeLeft(0);
    setIsFinished(false);
  };

  // Change custom time
  const changeMinutes = (amount) => {
    setMinutes((current) => Math.max(0, Math.min(99, current + amount)));
    setIsFinished(false);
  };

  const changeSeconds = (amount) => {
    setSeconds((current) => {
      const next = current + amount;

      if (next > 59) return 59;
      if (next < 0) return 0;

      return next;
    });

    setIsFinished(false);
  };

  const isActive = isRunning || isPaused || isFinished;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#472417]/65 p-4 backdrop-blur-lg"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="timer-title"
        className="relative my-auto w-full max-w-[470px] overflow-hidden rounded-[18px] border border-white/70 bg-[#FDFAF9] shadow-[0_30px_100px_rgba(69,32,19,0.28)] animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#EDC7B9]/40 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-[#ECE0CD]/30 blur-2xl" />

        <div className="relative p-6 sm:p-8">

          {/* Top bar */}
          <div className="mb-7 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EDC7B9]/50 text-[#5A3325]">
                <ChefHat size={23} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[2.5px] text-[#996E5E]">
                  Saveurs Kitchen
                </p>
                <p className="text-sm font-bold text-[#5A3325]">
                  Cooking companion
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close timer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#897067] shadow-sm transition-all hover:bg-[#ECE0CD] hover:text-[#5A3325]"
            >
              <X size={19} />
            </button>
          </div>

          {/* Title */}
          <div className="mb-7 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#EDC7B9] bg-white/80 px-4 py-2">
              <Sparkles size={13} className="text-[#996E5E]" />
              <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#996E5E]">
                A little time, a lot of flavor
              </span>
            </div>

            <h2
              id="timer-title"
              className="font-serif text-3xl font-bold tracking-tight text-[#5A3325] sm:text-4xl"
            >
              Cooking Timer
            </h2>

            <p className="mt-2 text-sm text-[#9A8279]">
              Make every minute count.
            </p>
          </div>

          {/* Active Timer */}
          {isActive ? (
            <div className="text-center">

              <div className="relative mx-auto mb-5 h-64 w-64 max-w-full">
                <svg
                  className="h-full w-full -rotate-90"
                  viewBox="0 0 100 100"
                  aria-hidden="true"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="#F2E8E4"
                    strokeWidth="5"
                  />

                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke={isFinished ? '#EADFC8' : '#EB9D81'}
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={
                      circumference * (1 - progress / 100)
                    }
                    className="transition-all duration-300"
                  />
                </svg>

                <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-white shadow-[inset_0_0_30px_rgba(237,199,185,0.25)]">
                  {isFinished ? (
                    <>
                      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#EADFC8]/35 text-[#4E9A70]">
                        <CheckCircle2 size={36} />
                      </div>

                      <p className="font-serif text-2xl font-bold text-[#5A3325]">
                        Time's Up!
                      </p>

                      <p className="mt-2 text-xs text-[#9A8279]">
                        Your recipe is ready
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="mb-2 flex items-center gap-2 text-[#B3806E]">
                        <Timer size={17} />
                        <span className="text-[10px] font-bold uppercase tracking-[2px]">
                          {isPaused ? 'On pause' : 'Time remaining'}
                        </span>
                      </div>

                      <p className="font-serif text-[58px] font-bold leading-none tracking-tight text-[#5A3325] tabular-nums">
                        {formatTime(timeLeft)}
                      </p>

                      <p className={`mt-3 text-xs font-semibold ${
                        isPaused ? 'text-[#B7A487]' : 'text-[#996E5E]'
                      }`}>
                        {isPaused ? 'Take your time' : 'Cooking in progress'}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {!isFinished && (
                <div className="mx-auto mb-7 max-w-[260px]">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-medium text-[#9A8279]">
                      Cooking progress
                    </span>
                    <span className="font-bold text-[#5A3325]">
                      {Math.round(progress)}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-[#F2E8E4]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#EDC7B9] to-[#EB9D81] transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-3">
                {!isFinished && (
                  <button
                    type="button"
                    onClick={handlePause}
                    aria-label={isPaused ? 'Resume timer' : 'Pause timer'}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5A3325] text-white shadow-lg shadow-[#5A3325]/15 transition-all hover:-translate-y-1 hover:bg-[#7B4836]"
                  >
                    {isPaused ? (
                      <Play size={22} fill="currentColor" />
                    ) : (
                      <Pause size={22} fill="currentColor" />
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleReset}
                  className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-[#EDC7B9] bg-white px-7 text-sm font-bold text-[#5A3325] transition-all hover:bg-[#F9EEEA]"
                >
                  <RotateCcw size={17} />
                  {isFinished ? 'New timer' : 'Reset timer'}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Quick presets */}
              <div className="mb-7">
                <div className="mb-4 flex items-center justify-center gap-2">
                  <Clock3 size={15} className="text-[#B3806E]" />
                  <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#9A8279]">
                    Choose a duration
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {presets.map((mins) => {
                    const selected = minutes === mins && seconds === 0;

                    return (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => handlePreset(mins)}
                        className={`group rounded-2xl border px-2 py-4 transition-all duration-200 ${
                          selected
                            ? 'border-[#EB9D81] bg-[#F9E7E0] shadow-sm shadow-[#EB9D81]/20'
                            : 'border-[#F2E8E4] bg-white hover:-translate-y-0.5 hover:border-[#EDC7B9] hover:bg-[#FBF3F0]'
                        }`}
                      >
                        <span className={`block font-serif text-2xl font-bold ${
                          selected ? 'text-[#5A3325]' : 'text-[#7D5E53]'
                        }`}>
                          {mins}
                        </span>

                        <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[1px] text-[#A9938B]">
                          minutes
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom time */}
              <div className="mb-6 rounded-[18px] border border-[#F2E8E4] bg-white/80 p-5">
                <div className="mb-5 text-center">
                  <p className="text-sm font-bold text-[#5A3325]">
                    Custom duration
                  </p>
                  <p className="mt-1 text-xs text-[#AB9992]">
                    Set the perfect time for your recipe
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Minutes */}
                  <div className="rounded-2xl bg-[#FAF2EF] p-3">
                    <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-[1.5px] text-[#997C72]">
                      Minutes
                    </p>

                    <div className="flex items-center justify-between gap-1">
                      <button
                        type="button"
                        onClick={() => changeMinutes(-1)}
                        aria-label="Decrease minutes"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#7D5E53] transition hover:bg-[#EDC7B9]"
                      >
                        <Minus size={14} />
                      </button>

                      <input
                        type="number"
                        min="0"
                        max="99"
                        value={minutes}
                        onChange={(e) => {
                          setMinutes(
                            Math.max(0, Math.min(99, Number(e.target.value) || 0))
                          );
                          setIsFinished(false);
                        }}
                        className="w-full min-w-0 bg-transparent text-center font-serif text-3xl font-bold text-[#5A3325] outline-none tabular-nums"
                        aria-label="Minutes"
                      />

                      <button
                        type="button"
                        onClick={() => changeMinutes(1)}
                        aria-label="Increase minutes"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#7D5E53] transition hover:bg-[#EDC7B9]"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Seconds */}
                  <div className="rounded-2xl bg-[#FBF8F3] p-3">
                    <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-[1.5px] text-[#A99B86]">
                      Seconds
                    </p>

                    <div className="flex items-center justify-between gap-1">
                      <button
                        type="button"
                        onClick={() => changeSeconds(-1)}
                        aria-label="Decrease seconds"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#998B75] transition hover:bg-[#ECE0CD]"
                      >
                        <Minus size={14} />
                      </button>

                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={seconds}
                        onChange={(e) => {
                          setSeconds(
                            Math.max(0, Math.min(59, Number(e.target.value) || 0))
                          );
                          setIsFinished(false);
                        }}
                        className="w-full min-w-0 bg-transparent text-center font-serif text-3xl font-bold text-[#5A3325] outline-none tabular-nums"
                        aria-label="Seconds"
                      />

                      <button
                        type="button"
                        onClick={() => changeSeconds(1)}
                        aria-label="Increase seconds"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#998B75] transition hover:bg-[#ECE0CD]"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-center text-[11px] text-[#AB9992]">
                  Selected time: <span className="font-bold text-[#7D5E53]">{formatTime(totalTime)}</span>
                </p>
              </div>

              {/* Start button */}
              <button
                type="button"
                onClick={handleStart}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#5A3325] py-4 text-sm font-bold text-white shadow-lg shadow-[#5A3325]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#7B4836] hover:shadow-xl"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                  <Play size={16} fill="currentColor" />
                </span>
                Start cooking
              </button>
            </>
          )}

          {/* Footer */}
          <div className="mt-7 flex items-center justify-center gap-2 border-t border-[#F2E8E4] pt-5">
            <Bell size={14} className="text-[#B3806E]" />
            <p className="text-[10px] text-[#AB9992]">
              We'll let you know when your timer is complete.
            </p>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="flex h-1.5">
          <div className="flex-1 bg-[#EDC7B9]" />
          <div className="flex-1 bg-[#EB9D81]" />
          <div className="flex-1 bg-[#ECE0CD]" />
          <div className="flex-1 bg-[#E6D6C6]" />
          <div className="flex-1 bg-[#EADFC8]" />
        </div>
      </div>
    </div>
  );
}

export default RecipeTimer;
