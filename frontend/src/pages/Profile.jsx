import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [stats, setStats] = useState({ favorites: 0, ratings: 0 });
  const [loading, setLoading] = useState(false);
  
  // Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user) {
      navigate('/login');
      return;
    }
    setName(user.name || '');
    setBio(user.bio || '');

    // Fetch stats
    if (token) {
      axios.get(`${API_URL}/favorites`)
        .then(res => setStats(prev => ({ ...prev, favorites: res.data.length })))
        .catch(err => console.error(err));
    }
  }, [user, token, navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${API_URL}/profile`, { name, bio });
      toast.success('Profile updated!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
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

  if (!user) return null;

  const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className="bg-cream dark:bg-dark-bg min-h-screen transition-colors">
      
      {/* Header */}
      <section className="bg-gradient-to-br from-warm-brown via-warm-brown to-orange-accent/30 dark:from-dark-card dark:via-dark-card dark:to-orange-accent/20 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-24 h-24 bg-orange-accent rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4 shadow-xl">
            {initials}
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-cream mb-2">
            {user.name}
          </h1>
          <p className="text-cream/70">{user.email}</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-12 -mt-24 relative z-10">
          <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg border border-warm-brown/5 dark:border-dark-text/5 text-center transition-colors">
            <p className="text-3xl mb-2">❤️</p>
            <p className="font-serif text-3xl font-bold text-orange-accent">{stats.favorites}</p>
            <p className="text-sm text-warm-brown/60 dark:text-dark-text/60 uppercase tracking-widest">Favorites</p>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg border border-warm-brown/5 dark:border-dark-text/5 text-center transition-colors">
            <p className="text-3xl mb-2">⭐</p>
            <p className="font-serif text-3xl font-bold text-orange-accent">{stats.ratings}</p>
            <p className="text-sm text-warm-brown/60 dark:text-dark-text/60 uppercase tracking-widest">Ratings</p>
          </div>
        </div>

        {/* Update Profile */}
        <div className="bg-white dark:bg-dark-card rounded-3xl p-8 shadow-sm border border-warm-brown/5 dark:border-dark-text/5 mb-6 transition-colors">
          <h2 className="font-serif text-2xl font-bold text-warm-brown dark:text-dark-text mb-6">
            👤 Profile Information
          </h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-warm-brown dark:text-dark-text mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-warm-brown/10 dark:border-dark-text/10 bg-cream/50 dark:bg-dark-bg/50 text-warm-brown dark:text-dark-text focus:outline-none focus:border-orange-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-brown dark:text-dark-text mb-2">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Tell us about yourself..."
                className="w-full px-4 py-3 rounded-xl border border-warm-brown/10 dark:border-dark-text/10 bg-cream/50 dark:bg-dark-bg/50 text-warm-brown dark:text-dark-text focus:outline-none focus:border-orange-accent transition-colors resize-none"
              />
              <p className="text-xs text-warm-brown/50 dark:text-dark-text/50 mt-1">{bio.length}/500</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-orange-accent text-white rounded-xl font-medium hover:bg-orange-accent/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Update Password */}
        <div className="bg-white dark:bg-dark-card rounded-3xl p-8 shadow-sm border border-warm-brown/5 dark:border-dark-text/5 mb-6 transition-colors">
          <h2 className="font-serif text-2xl font-bold text-warm-brown dark:text-dark-text mb-6">
            🔒 Change Password
          </h2>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-warm-brown dark:text-dark-text mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-warm-brown/10 dark:border-dark-text/10 bg-cream/50 dark:bg-dark-bg/50 text-warm-brown dark:text-dark-text focus:outline-none focus:border-orange-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-brown dark:text-dark-text mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-warm-brown/10 dark:border-dark-text/10 bg-cream/50 dark:bg-dark-bg/50 text-warm-brown dark:text-dark-text focus:outline-none focus:border-orange-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-brown dark:text-dark-text mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-warm-brown/10 dark:border-dark-text/10 bg-cream/50 dark:bg-dark-bg/50 text-warm-brown dark:text-dark-text focus:outline-none focus:border-orange-accent transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={passwordLoading}
              className="px-6 py-3 bg-warm-brown dark:bg-dark-bg text-cream rounded-xl font-medium hover:bg-warm-brown/90 transition-colors disabled:opacity-50"
            >
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Logout */}
        <div className="text-center">
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="px-6 py-3 bg-red-500/10 text-red-500 rounded-xl font-medium hover:bg-red-500/20 transition-colors"
          >
            🚪 Logout
          </button>
        </div>

      </div>
    </div>
  );
}

export default Profile;