
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  ChefHat,
  Heart,
  Star,
  Users,
  UserPlus,
  UserCheck,
  ArrowLeft,
  LoaderCircle,
  MessageCircle,
  Sparkles,
  BookOpen,
  Utensils,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export default function PublicProfile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    let active = true;

    setLoading(true);

    axios.get(`${API_URL}/users/${id}`)
      .then((res) => {
        if (!active) return;

        setProfile(res.data);
        setFavorites(res.data.favorites || []);
        setRatings(res.data.ratings || []);
        setIsFollowing(Boolean(res.data.is_following));
      })
      .catch((err) => {
        console.error('Public profile error:', err);

        if (active) {
          setProfile(null);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleFollow = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('Please log in to follow this user.');
      return;
    }

    if (followLoading) return;

    setFollowLoading(true);

    try {
      const res = await axios.post(
        `${API_URL}/users/${id}/follow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const following = res.data.is_following;

      setIsFollowing(following);

      setProfile((prev) => ({
        ...prev,
        followers_count: Math.max(
          0,
          (prev.followers_count || 0) + (following ? 1 : -1)
        ),
      }));

      toast.success(following ? 'You are now following this user!' : 'You unfollowed this user.');
    } catch (err) {
      console.error('Follow error:', err);
      toast.error(
        err.response?.data?.message || 'Unable to update follow status.'
      );
    } finally {
      setFollowLoading(false);
    }
  };

  const displayName = profile?.user?.name || 'User';

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const getRecipeImage = (image) => {
    if (!image) return null;

    if (
      image.startsWith('http://') ||
      image.startsWith('https://') ||
      image.startsWith('/storage/') ||
      image.startsWith('/images/')
    ) {
      return image;
    }

    return `/images/${image}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#FAF7F0] dark:bg-[#1A1512]">
        <LoaderCircle size={42} className="animate-spin text-[#E88FA5]" />
        <p className="mt-4 text-sm font-medium text-[#718B68]">
          Loading profile...
        </p>
      </div>
    );
  }

  // Not found state
  if (!profile || !profile.user) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#FAF7F0] px-4 text-center dark:bg-[#1A1512]">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-[#E88FA5]/10 text-[#E88FA5]">
          <Users size={48} />
        </div>

        <h1 className="font-serif text-3xl font-bold text-[#1A1512] dark:text-[#FAF7F0]">
          User Not Found
        </h1>

        <p className="mt-3 max-w-sm text-[#1A1512]/55 dark:text-[#FAF7F0]/55">
          Sorry, we couldn't find the profile you're looking for.
        </p>

        <Link
          to="/"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#E88FA5] px-6 py-3 font-semibold text-white transition hover:bg-[#dc7e95]"
        >
          <ArrowLeft size={18} />
          Back Home
        </Link>
      </div>
    );
  }

  const isOwnProfile =
    currentUser && String(currentUser.id) === String(profile.user.id);

  return (
    <div className="min-h-screen bg-[#FAF7F0] pb-20 transition-colors dark:bg-[#1A1512]">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#1A1512] px-4 pb-32 pt-16 sm:pt-20">

        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#E88FA5]/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-[#718B68]/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">

          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#F5D8C8]/20 bg-white/5 px-4 py-2 text-sm text-[#F5D8C8]">
            <Sparkles size={15} />
            Saveurs Community
          </div>

          {/* Avatar */}
          <div className="relative mx-auto mb-6 h-36 w-36">
            {profile.user.avatar || profile.user.avatar_url ? (
              <img
                src={profile.user.avatar || profile.user.avatar_url}
                alt={displayName}
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

          <h1 className="font-serif text-3xl font-bold text-[#FAF7F0] sm:text-4xl">
            {displayName}
          </h1>

          <p className="mx-auto mt-3 max-w-lg leading-7 text-[#F5D8C8]/70">
            {profile.user.bio || 'This food lover has not added a bio yet.'}
          </p>

          {/* Follow Button */}
          {currentUser && !isOwnProfile && (
            <button
              type="button"
              onClick={handleFollow}
              disabled={followLoading}
              className={`mt-7 inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                isFollowing
                  ? 'border border-[#F5D8C8]/30 bg-white/10 text-[#F5D8C8] hover:bg-white/20'
                  : 'bg-[#E88FA5] text-white shadow-lg shadow-[#E88FA5]/20 hover:-translate-y-0.5 hover:bg-[#dc7e95]'
              }`}
            >
              {followLoading ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : isFollowing ? (
                <UserCheck size={18} />
              ) : (
                <UserPlus size={18} />
              )}

              {followLoading
                ? 'Please wait...'
                : isFollowing
                  ? 'Following'
                  : 'Follow'}
            </button>
          )}

          {isOwnProfile && (
            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-[#F5D8C8]">
              <UserCheck size={16} />
              This is your profile
            </p>
          )}
        </div>
      </section>

      <main className="relative z-10 mx-auto -mt-20 max-w-4xl px-4 sm:px-6">

        {/* Statistics */}
        <div className="mb-12 grid grid-cols-2 gap-4">

          <div className="rounded-3xl border border-[#E88FA5]/15 bg-white p-5 text-center shadow-lg dark:bg-[#28221E] sm:p-7">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E88FA5]/15 text-[#E88FA5]">
              <Users size={24} />
            </div>

            <p className="font-serif text-3xl font-bold text-[#E88FA5]">
              {profile.followers_count ?? 0}
            </p>

            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-[#1A1512]/50 dark:text-[#FAF7F0]/50">
              Followers
            </p>
          </div>

          <div className="rounded-3xl border border-[#718B68]/15 bg-white p-5 text-center shadow-lg dark:bg-[#28221E] sm:p-7">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#718B68]/15 text-[#718B68]">
              <UserPlus size={24} />
            </div>

            <p className="font-serif text-3xl font-bold text-[#718B68]">
              {profile.following_count ?? 0}
            </p>

            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-[#1A1512]/50 dark:text-[#FAF7F0]/50">
              Following
            </p>
          </div>
        </div>

        {/* Favorite Recipes */}
        <section className="mb-12">

          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E88FA5]/15 text-[#E88FA5]">
              <Heart size={23} />
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1A1512] dark:text-[#FAF7F0]">
                Favorite Recipes
              </h2>
              <p className="mt-1 text-sm text-[#1A1512]/50 dark:text-[#FAF7F0]/50">
                Recipes loved by {displayName}
              </p>
            </div>
          </div>

          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              {favorites.map((recipe) => (
                <Link
                  to={`/recipe/${recipe.id}`}
                  key={recipe.id}
                  className="group flex gap-4 overflow-hidden rounded-2xl border border-[#718B68]/10 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-[#28221E]"
                >
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F5D8C8]">
                    {getRecipeImage(recipe.image) ? (
                      <img
                        src={getRecipeImage(recipe.image)}
                        alt={recipe.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#718B68]">
                        <Utensils size={30} />
                      </div>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <h3 className="line-clamp-2 font-serif text-lg font-bold text-[#1A1512] transition-colors group-hover:text-[#E88FA5] dark:text-[#FAF7F0]">
                      {recipe.name}
                    </h3>

                    <p className="mt-2 text-sm text-[#718B68]">
                      {recipe.cuisine || 'Delicious recipe'}
                    </p>

                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#E88FA5]">
                      View Recipe
                      <ArrowLeft size={13} className="rotate-180" />
                    </span>
                  </div>
                </Link>
              ))}

            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#718B68]/25 bg-white/60 px-5 py-12 text-center dark:bg-[#28221E]/50">
              <Heart size={35} className="mx-auto mb-4 text-[#E88FA5]/60" />

              <p className="font-serif text-lg font-semibold text-[#1A1512] dark:text-[#FAF7F0]">
                No favorite recipes yet
              </p>

              <p className="mt-2 text-sm text-[#1A1512]/50 dark:text-[#FAF7F0]/50">
                Favorite recipes will appear here.
              </p>
            </div>
          )}
        </section>

        {/* Recent Reviews */}
        <section className="mb-12">

          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#718B68]/15 text-[#718B68]">
              <Star size={23} />
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1A1512] dark:text-[#FAF7F0]">
                Recent Reviews
              </h2>
              <p className="mt-1 text-sm text-[#1A1512]/50 dark:text-[#FAF7F0]/50">
                Opinions and ratings
              </p>
            </div>
          </div>

          {ratings.length > 0 ? (
            <div className="space-y-4">

              {ratings.map((rating) => (
                <article
                  key={rating.id}
                  className="rounded-2xl border border-[#718B68]/10 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-[#28221E] sm:p-6"
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">

                    {rating.recipe?.id ? (
                      <Link
                        to={`/recipe/${rating.recipe.id}`}
                        className="font-serif text-lg font-bold text-[#1A1512] transition-colors hover:text-[#E88FA5] dark:text-[#FAF7F0]"
                      >
                        {rating.recipe.name}
                      </Link>
                    ) : (
                      <span className="font-serif text-lg font-bold text-[#1A1512] dark:text-[#FAF7F0]">
                        Recipe Review
                      </span>
                    )}

                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          size={16}
                          fill={index < (Number(rating.score) || 0) ? '#E8B45C' : 'none'}
                          className={
                            index < (Number(rating.score) || 0)
                              ? 'text-[#E8B45C]'
                              : 'text-[#718B68]/25'
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl bg-[#FAF7F0] p-4 dark:bg-[#1A1512]">
                    <MessageCircle
                      size={18}
                      className="mt-0.5 shrink-0 text-[#718B68]"
                    />

                    <p className="text-sm leading-7 text-[#1A1512]/70 dark:text-[#FAF7F0]/70">
                      {rating.comment || 'No comment provided.'}
                    </p>
                  </div>
                </article>
              ))}

            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#718B68]/25 bg-white/60 px-5 py-12 text-center dark:bg-[#28221E]/50">
              <BookOpen size={35} className="mx-auto mb-4 text-[#718B68]/60" />

              <p className="font-serif text-lg font-semibold text-[#1A1512] dark:text-[#FAF7F0]">
                No reviews yet
              </p>

              <p className="mt-2 text-sm text-[#1A1512]/50 dark:text-[#FAF7F0]/50">
                Reviews will appear here when this user rates recipes.
              </p>
            </div>
          )}
        </section>

        {/* Back Home */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-[#718B68]/20 bg-white px-6 py-3 font-semibold text-[#718B68] transition-all hover:-translate-y-0.5 hover:border-[#E88FA5]/40 hover:bg-[#F5D8C8]/30 dark:bg-[#28221E] dark:text-[#F5D8C8]"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>

      </main>
    </div>
  );
}
