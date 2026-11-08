
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
  ImagePlus,
  ChefHat,
  Eye,
  EyeOff,
  Sparkles,
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
    'w-full rounded-2xl border border-[#718B68]/20 bg-[#FAF7F0] dark:bg-[#1A1512] px-4 py-3.5 text-[#1A1512] dark:text-[#FAF7F0] outline-none transition-all placeholder:text-[#1A1512]/35 dark:placeholder:text-[#FAF7F0]/30 focus:border-[#E88FA5] focus:ring-2 focus:ring-[#E88FA5]/15';

  const labelClass =
    'mb-2 block text-sm font-semibold text-[#1A1512] dark:text-[#FAF7F0]';

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
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#718B68] hover:text-[#E88FA5] transition-colors"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOff size={19} /> : <Eye size={19} />}
      </button>
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FAF7F0] dark:bg-[#1A1512] text-[#1A1512] dark:text-[#FAF7F0] transition-colors">

      {/* Profile Hero */}
      <section className="relative overflow-hidden bg-[#1A1512] px-4 pb-32 pt-16 sm:pt-20">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#E88FA5]/20 blur-3xl" />
        <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#718B68]/25 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#F5D8C8]/20 bg-white/5 px-4 py-2 text-sm text-[#F5D8C8]">
            <Sparkles size={15} />
            Your personal space
          </div>

          {/* Avatar */}
          <div className="relative mx-auto mb-5 h-36 w-36">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user.name}
                className="h-36 w-36 rounded-full border-4 border-[#F5D8C8] object-cover shadow-2xl"
              />
            ) : (
              <div className="flex h-36 w-36 items-center justify-center rounded-full border-4 border-[#F5D8C8] bg-[#E88FA5] text-5xl font-bold text-white shadow-2xl">
                {initials}
              </div>
            )}

            <div className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-[#1A1512] bg-[#718B68] text-white">
              <ChefHat size={19} />
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />

          <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-[#F5D8C8] px-5 py-3 font-semibold text-[#1A1512] shadow-lg transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {avatarLoading ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <Camera size={18} />
              )}
              {avatarLoading
                ? 'Uploading...'
                : avatarUrl
                  ? 'Change Photo'
                  : 'Upload Photo'}
            </button>

            {avatarUrl && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                disabled={avatarLoading}
                className="inline-flex items-center gap-2 rounded-xl border border-red-300/30 bg-red-500/10 px-5 py-3 font-semibold text-red-200 transition-all hover:bg-red-500/20 disabled:opacity-50"
              >
                <Trash2 size={17} />
                Remove
              </button>
            )}
          </div>

          <h1 className="font-serif text-3xl font-bold text-[#FAF7F0] sm:text-4xl">
            {user.name}
          </h1>

          <p className="mt-2 text-sm text-[#F5D8C8]/70 sm:text-base">
            {user.email}
          </p>

          <p className="mt-4 text-sm text-[#FAF7F0]/50">
            Welcome to your Saveurs profile
          </p>
        </div>
      </section>

      <main className="relative z-10 mx-auto -mt-20 max-w-4xl px-4 pb-20 sm:px-6">

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-2 gap-4">
          <div className="rounded-3xl border border-[#E88FA5]/15 bg-white p-5 text-center shadow-lg dark:bg-[#28221E] sm:p-7">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E88FA5]/15 text-[#E88FA5]">
              <Heart size={24} />
            </div>
            <p className="font-serif text-3xl font-bold text-[#E88FA5]">
              {stats.favorites}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-[#1A1512]/55 dark:text-[#FAF7F0]/55">
              Favorites
            </p>
          </div>

          <div className="rounded-3xl border border-[#718B68]/15 bg-white p-5 text-center shadow-lg dark:bg-[#28221E] sm:p-7">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#718B68]/15 text-[#718B68]">
              <Star size={24} />
            </div>
            <p className="font-serif text-3xl font-bold text-[#718B68]">
              {stats.ratings}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-[#1A1512]/55 dark:text-[#FAF7F0]/55">
              Ratings
            </p>
          </div>
        </div>

        {/* Profile Information */}
        <section className="mb-6 rounded-3xl border border-[#718B68]/15 bg-white p-6 shadow-sm dark:bg-[#28221E] sm:p-8">
          <div className="mb-7 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E88FA5]/15 text-[#E88FA5]">
              <UserRound size={23} />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold sm:text-2xl">
                Profile Information
              </h2>
              <p className="mt-1 text-sm text-[#1A1512]/50 dark:text-[#FAF7F0]/50">
                Manage your personal details
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                placeholder="Enter your name"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                value={user.email || ''}
                disabled
                className={`${inputClass} cursor-not-allowed opacity-60`}
              />
              <p className="mt-2 text-xs text-[#1A1512]/45 dark:text-[#FAF7F0]/45">
                Your email address cannot be changed here.
              </p>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className={labelClass}>About Me</label>
                <span className="text-xs text-[#718B68]">
                  {bio.length}/500
                </span>
              </div>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                maxLength={500}
                placeholder="Tell us a little about yourself..."
                className={`${inputClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E88FA5] px-6 py-3.5 font-semibold text-white shadow-md shadow-[#E88FA5]/20 transition-all hover:-translate-y-0.5 hover:bg-[#dc7e95] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </section>

        {/* Change Password */}
        <section className="mb-6 rounded-3xl border border-[#718B68]/15 bg-white p-6 shadow-sm dark:bg-[#28221E] sm:p-8">
          <div className="mb-7 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#718B68]/15 text-[#718B68]">
              <LockKeyhole size={23} />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold sm:text-2xl">
                Change Password
              </h2>
              <p className="mt-1 text-sm text-[#1A1512]/50 dark:text-[#FAF7F0]/50">
                Keep your account secure
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-5">
            <div>
              <label className={labelClass}>Current Password</label>
              {passwordInput(
                currentPassword,
                setCurrentPassword,
                showCurrentPassword,
                setShowCurrentPassword,
                'Enter current password'
              )}
            </div>

            <div>
              <label className={labelClass}>New Password</label>
              {passwordInput(
                newPassword,
                setNewPassword,
                showNewPassword,
                setShowNewPassword,
                'Enter new password'
              )}
            </div>

            <div>
              <label className={labelClass}>Confirm New Password</label>
              {passwordInput(
                confirmPassword,
                setConfirmPassword,
                showConfirmPassword,
                setShowConfirmPassword,
                'Confirm your new password'
              )}
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-[#718B68]/10 p-4 text-sm text-[#718B68]">
              <ShieldCheck size={20} className="mt-0.5 shrink-0" />
              <p>
                Choose a strong password and never share it with anyone.
              </p>
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#718B68] px-6 py-3.5 font-semibold text-white shadow-md shadow-[#718B68]/20 transition-all hover:-translate-y-0.5 hover:bg-[#607b58] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {passwordLoading ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <LockKeyhole size={18} />
              )}
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </section>

        {/* Logout */}
        <div className="rounded-3xl border border-red-200/50 bg-white p-6 text-center shadow-sm dark:border-red-900/30 dark:bg-[#28221E]">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
            <LogOut size={23} />
          </div>

          <h3 className="font-serif text-lg font-bold">
            Ready to leave?
          </h3>
          <p className="mb-5 mt-1 text-sm text-[#1A1512]/50 dark:text-[#FAF7F0]/50">
            You can always come back to your favorite recipes.
          </p>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-6 py-3 font-semibold text-red-500 transition-all hover:bg-red-500 hover:text-white"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Footer note */}
        <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-[#718B68]/70">
          <ImagePlus size={14} />
          Made with love by Saveurs
        </p>
      </main>
    </div>
  );
}

export default Profile;
