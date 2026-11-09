
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
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#163F48]/65 p-4 backdrop-blur-lg"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="timer-title"
        className="relative my-auto w-full max-w-[470px] overflow-hidden rounded-[32px] border border-white/70 bg-[#F9FDFD] shadow-[0_30px_100px_rgba(18,60,70,0.28)] animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#B8E8EE]/40 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-[#F2C7DB]/30 blur-2xl" />

        <div className="relative p-6 sm:p-8">

          {/* Top bar */}
          <div className="mb-7 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B8E8EE]/50 text-[#24515B]">
                <ChefHat size={23} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[2.5px] text-[#5C929B]">
                  Saveurs Kitchen
                </p>
                <p className="text-sm font-bold text-[#24515B]">
                  Cooking companion
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close timer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#66858A] shadow-sm transition-all hover:bg-[#F2C7DB] hover:text-[#24515B]"
            >
              <X size={19} />
            </button>
          </div>

          {/* Title */}
          <div className="mb-7 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#B8E8EE] bg-white/80 px-4 py-2">
              <Sparkles size={13} className="text-[#5C929B]" />
              <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#5C929B]">
                A little time, a lot of flavor
              </span>
            </div>

            <h2
              id="timer-title"
              className="font-serif text-3xl font-bold tracking-tight text-[#24515B] sm:text-4xl"
            >
              Cooking Timer
            </h2>

            <p className="mt-2 text-sm text-[#78969B]">
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
                    stroke="#E4F1F2"
                    strokeWidth="5"
                  />

                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke={isFinished ? '#BFE8C8' : '#7ADDF2'}
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={
                      circumference * (1 - progress / 100)
                    }
                    className="transition-all duration-300"
                  />
                </svg>

                <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-white shadow-[inset_0_0_30px_rgba(184,232,238,0.25)]">
                  {isFinished ? (
                    <>
                      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#BFE8C8]/35 text-[#4E9A70]">
                        <CheckCircle2 size={36} />
                      </div>

                      <p className="font-serif text-2xl font-bold text-[#24515B]">
                        Time's Up!
                      </p>

                      <p className="mt-2 text-xs text-[#78969B]">
                        Your recipe is ready
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="mb-2 flex items-center gap-2 text-[#6CAAB5]">
                        <Timer size={17} />
                        <span className="text-[10px] font-bold uppercase tracking-[2px]">
                          {isPaused ? 'On pause' : 'Time remaining'}
                        </span>
                      </div>

                      <p className="font-serif text-[58px] font-bold leading-none tracking-tight text-[#24515B] tabular-nums">
                        {formatTime(timeLeft)}
                      </p>

                      <p className={`mt-3 text-xs font-semibold ${
                        isPaused ? 'text-[#C17D9D]' : 'text-[#5C929B]'
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
                    <span className="font-medium text-[#78969B]">
                      Cooking progress
                    </span>
                    <span className="font-bold text-[#24515B]">
                      {Math.round(progress)}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-[#E4F1F2]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#B8E8EE] to-[#7ADDF2] transition-all duration-300"
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
                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#24515B] text-white shadow-lg shadow-[#24515B]/15 transition-all hover:-translate-y-1 hover:bg-[#34717D]"
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
                  className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-[#B8E8EE] bg-white px-7 text-sm font-bold text-[#24515B] transition-all hover:bg-[#EAF8F9]"
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
                  <Clock3 size={15} className="text-[#6CAAB5]" />
                  <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#78969B]">
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
                            ? 'border-[#7ADDF2] bg-[#DFF7FA] shadow-sm shadow-[#7ADDF2]/20'
                            : 'border-[#E4F1F2] bg-white hover:-translate-y-0.5 hover:border-[#B8E8EE] hover:bg-[#F0FAFB]'
                        }`}
                      >
                        <span className={`block font-serif text-2xl font-bold ${
                          selected ? 'text-[#24515B]' : 'text-[#52777E]'
                        }`}>
                          {mins}
                        </span>

                        <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[1px] text-[#8AA6AA]">
                          minutes
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom time */}
              <div className="mb-6 rounded-[24px] border border-[#E4F1F2] bg-white/80 p-5">
                <div className="mb-5 text-center">
                  <p className="text-sm font-bold text-[#24515B]">
                    Custom duration
                  </p>
                  <p className="mt-1 text-xs text-[#91A9AC]">
                    Set the perfect time for your recipe
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Minutes */}
                  <div className="rounded-2xl bg-[#EFF9FA] p-3">
                    <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-[1.5px] text-[#71949A]">
                      Minutes
                    </p>

                    <div className="flex items-center justify-between gap-1">
                      <button
                        type="button"
                        onClick={() => changeMinutes(-1)}
                        aria-label="Decrease minutes"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#52777E] transition hover:bg-[#B8E8EE]"
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
                        className="w-full min-w-0 bg-transparent text-center font-serif text-3xl font-bold text-[#24515B] outline-none tabular-nums"
                        aria-label="Minutes"
                      />

                      <button
                        type="button"
                        onClick={() => changeMinutes(1)}
                        aria-label="Increase minutes"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#52777E] transition hover:bg-[#B8E8EE]"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Seconds */}
                  <div className="rounded-2xl bg-[#FDF1F6] p-3">
                    <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-[1.5px] text-[#B17E98]">
                      Seconds
                    </p>

                    <div className="flex items-center justify-between gap-1">
                      <button
                        type="button"
                        onClick={() => changeSeconds(-1)}
                        aria-label="Decrease seconds"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#A16D88] transition hover:bg-[#F2C7DB]"
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
                        className="w-full min-w-0 bg-transparent text-center font-serif text-3xl font-bold text-[#24515B] outline-none tabular-nums"
                        aria-label="Seconds"
                      />

                      <button
                        type="button"
                        onClick={() => changeSeconds(1)}
                        aria-label="Increase seconds"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#A16D88] transition hover:bg-[#F2C7DB]"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-center text-[11px] text-[#91A9AC]">
                  Selected time: <span className="font-bold text-[#52777E]">{formatTime(totalTime)}</span>
                </p>
              </div>

              {/* Start button */}
              <button
                type="button"
                onClick={handleStart}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#24515B] py-4 text-sm font-bold text-white shadow-lg shadow-[#24515B]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#34717D] hover:shadow-xl"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                  <Play size={16} fill="currentColor" />
                </span>
                Start cooking
              </button>
            </>
          )}

          {/* Footer */}
          <div className="mt-7 flex items-center justify-center gap-2 border-t border-[#E4F1F2] pt-5">
            <Bell size={14} className="text-[#6CAAB5]" />
            <p className="text-[10px] text-[#91A9AC]">
              We'll let you know when your timer is complete.
            </p>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="flex h-1.5">
          <div className="flex-1 bg-[#B8E8EE]" />
          <div className="flex-1 bg-[#7ADDF2]" />
          <div className="flex-1 bg-[#F2C7DB]" />
          <div className="flex-1 bg-[#CBB7F5]" />
          <div className="flex-1 bg-[#BFE8C8]" />
        </div>
      </div>
    </div>
  );
}

export default RecipeTimer;
