
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Camera,
  Trash2,
  UserRound,
  LockKeyhole,
  Heart,
  Star,
  LogOut,
  Save,
  LoaderCircle,
  ShieldCheck,
  ChefHat,
  Eye,
  EyeOff,
  Sparkles,
  Mail,
  ArrowUpRight,
  CircleUserRound,
  Settings2,
  CheckCircle2,
  KeyRound,
  ImagePlus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

function Profile() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const fileInputRef = useRef(null);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [stats, setStats] = useState({ favorites: 0, ratings: 0 });

  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    setName(user.name || '');
    setBio(user.bio || '');
    setAvatarUrl(user.avatar_url || '');

    if (token) {
      axios.get(`${API_URL}/favorites`)
        .then((res) => {
          setStats((prev) => ({
            ...prev,
            favorites: Array.isArray(res.data) ? res.data.length : 0,
          }));
        })
        .catch((err) => console.error('Favorites error:', err));
    }
  }, [user, token, navigate]);

  const initials =
    user?.name
      ?.split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    setAvatarLoading(true);

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await axios.post(`${API_URL}/profile/avatar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setAvatarUrl(res.data.avatar_url);
      toast.success('Avatar updated!');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setAvatarLoading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAvatar = async () => {
    setAvatarLoading(true);

    try {
      await axios.delete(`${API_URL}/profile/avatar`);
      setAvatarUrl('');
      toast.success('Avatar removed');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to remove avatar');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`${API_URL}/profile`, { name, bio });
      toast.success('Profile updated!');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setPasswordLoading(true);

    try {
      await axios.put(`${API_URL}/profile/password`, {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      toast.success('Password updated!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const inputClass =
    'w-full rounded-xl border border-[#B8E8EE] bg-[#F5FCFD] px-4 py-3.5 text-[#24515B] placeholder:text-[#78999F] outline-none transition-all focus:border-[#7ADDF2] focus:bg-white focus:ring-4 focus:ring-[#7ADDF2]/15 dark:border-[#39636B] dark:bg-[#193940] dark:text-white dark:placeholder:text-[#A4C5CA] dark:focus:bg-[#20454D]';

  const labelClass =
    'mb-2.5 block text-sm font-semibold text-[#24515B] dark:text-[#E4F7F8]';

  const passwordInput = (
    value,
    onChange,
    visible,
    setVisible,
    placeholder
  ) => (
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        placeholder={placeholder}
        autoComplete="new-password"
        className={`${inputClass} pr-12`}
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#63939D] transition-colors hover:text-[#24515B] dark:hover:text-[#B8E8EE]"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOff size={19} /> : <Eye size={19} />}
      </button>
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F1FAFB] text-[#24515B] transition-colors dark:bg-[#102D34] dark:text-[#E8F8F9]">

      {/* Page heading */}
      <div className="border-b border-[#B8E8EE]/70 bg-white dark:border-[#39636B] dark:bg-[#173941]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#4D9EAA]">
              <Settings2 size={15} />
              Account settings
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              My Profile
            </h1>
          </div>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 rounded-full border border-[#B8E8EE] px-4 py-2.5 text-sm font-semibold text-[#397C88] transition hover:bg-[#E8F8FA] dark:border-[#39636B] dark:text-[#B8E8EE] dark:hover:bg-[#24515B]"
          >
            <ChefHat size={17} />
            <span className="hidden sm:inline">Back to Saveurs</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">

        {/* Profile identity card */}
        <section className="relative mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#B8E8EE] via-[#DDF5F6] to-[#C7F0F0] p-6 shadow-[0_15px_45px_rgba(65,151,163,0.12)] sm:p-9 dark:from-[#24515B] dark:via-[#1B4650] dark:to-[#193940]">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border-[35px] border-white/20" />
          <div className="pointer-events-none absolute -bottom-32 right-1/3 h-64 w-64 rounded-full bg-[#7ADDF2]/30 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-[#CBB7F5]/30 blur-3xl" />

          <div className="relative flex flex-col items-center gap-7 sm:flex-row sm:items-center">

            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="h-32 w-32 overflow-hidden rounded-[2rem] border-[5px] border-white bg-white shadow-xl sm:h-36 sm:w-36">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#7ADDF2] text-4xl font-extrabold text-[#24515B]">
                    {initials}
                  </div>
                )}
              </div>

              <div className="absolute -bottom-3 -right-3 flex h-11 w-11 items-center justify-center rounded-2xl border-4 border-[#DDF5F6] bg-[#24515B] text-white shadow-lg dark:border-[#24515B]">
                <ChefHat size={20} />
              </div>
            </div>

            {/* User details */}
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/40 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#397C88] dark:border-white/20 dark:bg-white/10 dark:text-[#DDF5F6]">
                <Sparkles size={14} />
                Your Saveurs account
              </div>

              <h2 className="break-words text-3xl font-extrabold tracking-tight text-[#24515B] sm:text-4xl dark:text-white">
                {user.name}
              </h2>

              <p className="mt-2 flex items-center justify-center gap-2 text-sm text-[#397C88] sm:justify-start dark:text-[#DDF5F6]/80">
                <Mail size={16} />
                <span className="break-all">{user.email}</span>
              </p>

              <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#397C88] dark:text-[#DDF5F6]/75">
                Your kitchen, your recipes, your personal space. Keep your account up to date!
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />

              <div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#24515B] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#326B76] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#B8E8EE] dark:text-[#24515B] dark:hover:bg-white"
                >
                  {avatarLoading ? (
                    <LoaderCircle size={17} className="animate-spin" />
                  ) : (
                    <Camera size={17} />
                  )}
                  {avatarLoading
                    ? 'Uploading...'
                    : avatarUrl
                      ? 'Change photo'
                      : 'Add photo'}
                </button>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    disabled={avatarLoading}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-400/40 bg-white/40 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:bg-white/10 dark:text-red-200 dark:hover:bg-red-900/30"
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                )}
              </div>

              <p className="mt-3 text-xs text-[#397C88] dark:text-[#DDF5F6]/60">
                JPG, PNG or other image formats · Maximum 2MB
              </p>
            </div>

            {/* Account status */}
            <div className="hidden shrink-0 self-start rounded-2xl border border-white/50 bg-white/35 p-4 sm:block dark:border-white/10 dark:bg-white/10">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#397C88] dark:text-[#DDF5F6]">
                <CheckCircle2 size={16} />
                Account
              </div>
              <p className="text-lg font-extrabold text-[#24515B] dark:text-white">
                Active
              </p>
              <p className="mt-1 text-xs text-[#397C88] dark:text-[#DDF5F6]/70">
                Welcome back!
              </p>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="group relative overflow-hidden rounded-3xl border border-[#B8E8EE] bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#7ADDF2]/15 dark:border-[#39636B] dark:bg-[#173941]">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#B8E8EE]/40 transition-transform group-hover:scale-125 dark:bg-[#7ADDF2]/10" />

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#63939D] dark:text-[#A4C5CA]">
                  Saved recipes
                </p>
                <p className="mt-2 text-4xl font-extrabold text-[#24515B] dark:text-white">
                  {stats.favorites}
                </p>
                <p className="mt-2 text-xs text-[#63939D] dark:text-[#A4C5CA]">
                  Your favorite dishes
                </p>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#B8E8EE]/60 text-[#398B99] transition-transform group-hover:rotate-6 dark:bg-[#24515B] dark:text-[#B8E8EE]">
                <Heart size={29} />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-[#D9D0F5] bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#CBB7F5]/15 dark:border-[#594D79] dark:bg-[#173941]">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#CBB7F5]/30 transition-transform group-hover:scale-125 dark:bg-[#CBB7F5]/10" />

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#8C79B6] dark:text-[#CBB7F5]">
                  Recipe ratings
                </p>
                <p className="mt-2 text-4xl font-extrabold text-[#24515B] dark:text-white">
                  {stats.ratings}
                </p>
                <p className="mt-2 text-xs text-[#8C79B6] dark:text-[#CBB7F5]">
                  Your recipe reviews
                </p>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#CBB7F5]/35 text-[#8C79B6] transition-transform group-hover:rotate-6 dark:bg-[#594D79]/50 dark:text-[#CBB7F5]">
                <Star size={29} />
              </div>
            </div>
          </div>
        </section>

        {/* Main settings layout */}
        <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[1.1fr_0.9fr]">

          {/* Personal information */}
          <section className="overflow-hidden rounded-3xl border border-[#B8E8EE] bg-white shadow-sm dark:border-[#39636B] dark:bg-[#173941]">
            <div className="border-b border-[#DDF2F4] bg-[#F5FCFD] px-6 py-6 dark:border-[#39636B] dark:bg-[#1C424A] sm:px-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B8E8EE] text-[#24515B]">
                  <CircleUserRound size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-[#24515B] dark:text-white">
                    Personal information
                  </h3>
                  <p className="mt-1 text-sm text-[#63939D] dark:text-[#A4C5CA]">
                    Edit your account details
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6 p-6 sm:p-8">
              <div>
                <label className={labelClass}>
                  Full name
                </label>
                <div className="relative">
                  <UserRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#63939D]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                    placeholder="Enter your name"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Email address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#63939D]" />
                  <input
                    type="email"
                    value={user.email || ''}
                    disabled
                    className={`${inputClass} cursor-not-allowed pl-11 opacity-70`}
                  />
                </div>
                <p className="mt-2 text-xs text-[#78999F] dark:text-[#A4C5CA]">
                  Your email address cannot be changed here.
                </p>
              </div>

              <div>
                <div className="mb-2.5 flex items-center justify-between gap-3">
                  <label className="text-sm font-semibold text-[#24515B] dark:text-[#E4F7F8]">
                    About me
                  </label>
                  <span className="rounded-full bg-[#E5F7F8] px-3 py-1 text-xs font-bold text-[#4D9EAA] dark:bg-[#24515B] dark:text-[#B8E8EE]">
                    {bio.length}/500
                  </span>
                </div>

                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={5}
                  maxLength={500}
                  placeholder="Tell us a little about yourself..."
                  className={`${inputClass} resize-none leading-relaxed`}
                />
              </div>

              <div className="flex flex-col gap-3 border-t border-[#E1F2F3] pt-5 dark:border-[#39636B] sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-[#78999F] dark:text-[#A4C5CA]">
                  Make sure your information is correct.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#24515B] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#24515B]/15 transition hover:-translate-y-0.5 hover:bg-[#326B76] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#7ADDF2] dark:text-[#173941] dark:hover:bg-[#B8E8EE]"
                >
                  {loading ? (
                    <LoaderCircle size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {loading ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          </section>

          {/* Password settings */}
          <section className="overflow-hidden rounded-3xl border border-[#B8E8EE] bg-white shadow-sm dark:border-[#39636B] dark:bg-[#173941]">
            <div className="border-b border-[#DDF2F4] bg-[#F5FCFD] px-6 py-6 dark:border-[#39636B] dark:bg-[#1C424A] sm:px-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#CBB7F5]/40 text-[#8067AE] dark:bg-[#594D79]/60 dark:text-[#D9C9FF]">
                  <KeyRound size={23} />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-[#24515B] dark:text-white">
                    Security
                  </h3>
                  <p className="mt-1 text-sm text-[#63939D] dark:text-[#A4C5CA]">
                    Keep your account protected
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-5 p-6 sm:p-8">
              <div>
                <label className={labelClass}>
                  Current password
                </label>
                {passwordInput(
                  currentPassword,
                  setCurrentPassword,
                  showCurrentPassword,
                  setShowCurrentPassword,
                  'Enter current password'
                )}
              </div>

              <div>
                <label className={labelClass}>
                  New password
                </label>
                {passwordInput(
                  newPassword,
                  setNewPassword,
                  showNewPassword,
                  setShowNewPassword,
                  'Enter new password'
                )}
              </div>

              <div>
                <label className={labelClass}>
                  Confirm new password
                </label>
                {passwordInput(
                  confirmPassword,
                  setConfirmPassword,
                  showConfirmPassword,
                  setShowConfirmPassword,
                  'Confirm your new password'
                )}
              </div>

              <div className="rounded-2xl border border-[#CBB7F5]/40 bg-[#F6F2FF] p-4 dark:border-[#594D79] dark:bg-[#302A43]">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={21} className="mt-0.5 shrink-0 text-[#8067AE] dark:text-[#D9C9FF]" />
                  <div>
                    <p className="text-sm font-bold text-[#65518B] dark:text-[#E4D9FF]">
                      Password safety
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-[#8067AE] dark:text-[#CBB7F5]">
                      Choose a strong password and never share it with anyone.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4D8290] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#4D8290]/15 transition hover:-translate-y-0.5 hover:bg-[#326B76] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#7ADDF2] dark:text-[#173941] dark:hover:bg-[#B8E8EE]"
              >
                {passwordLoading ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <LockKeyhole size={18} />
                )}
                {passwordLoading ? 'Updating...' : 'Update password'}
              </button>
            </form>
          </section>
        </div>

        {/* Logout section */}
        <section className="mt-8 overflow-hidden rounded-3xl border border-red-200 bg-white dark:border-red-900/40 dark:bg-[#173941]">
          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-950/40">
                <LogOut size={23} />
              </div>
              <div>
                <h3 className="font-extrabold text-[#24515B] dark:text-white">
                  Sign out of your account
                </h3>
                <p className="mt-1 text-sm text-[#78999F] dark:text-[#A4C5CA]">
                  You can always come back to your favorite recipes.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-6 py-3 text-sm font-bold text-red-600 transition hover:border-red-500 hover:bg-red-500 hover:text-white dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-600 dark:hover:text-white"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </section>

        {/* Bottom note */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 text-center text-xs font-medium text-[#63939D] dark:text-[#A4C5CA]">
          <ImagePlus size={15} />
          <span>Made with love</span>
          <span className="text-[#7ADDF2]">♥</span>
          <span>by Saveurs</span>
        </div>
      </main>
    </div>
  );
}

export default Profile;
