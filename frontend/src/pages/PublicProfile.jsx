
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
  ArrowRight,
  LoaderCircle,
  MessageCircle,
  Sparkles,
  BookOpen,
  Utensils,
  Bookmark,
  CalendarDays,
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

      toast.success(
        following
          ? 'You are now following this user!'
          : 'You unfollowed this user.'
      );
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

  if (loading) {
    return (
      <div className="flex min-h-[75vh] flex-col items-center justify-center bg-[#FAF4F2] dark:bg-[#301911]">
        <div className="flex h-20 w-20 items-center justify-center rounded-[18px] bg-[#EDC7B9]/50 dark:bg-[#5A3325]">
          <LoaderCircle
            size={34}
            className="animate-spin text-[#5A3325] dark:text-[#EDC7B9]"
          />
        </div>
        <p className="mt-5 text-sm font-semibold tracking-wide text-[#826053] dark:text-[#EDC7B9]">
          Preparing profile...
        </p>
      </div>
    );
  }

  if (!profile || !profile.user) {
    return (
      <div className="flex min-h-[75vh] flex-col items-center justify-center bg-[#FAF4F2] px-4 text-center dark:bg-[#301911]">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[18px] bg-[#EDC7B9]/50 text-[#5A3325] dark:bg-[#5A3325] dark:text-[#EDC7B9]">
          <Users size={42} />
        </div>

        <span className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#C38067]">
          Saveurs Community
        </span>

        <h1 className="text-3xl font-black text-[#5A3325] dark:text-white">
          User Not Found
        </h1>

        <p className="mt-3 max-w-sm text-sm leading-7 text-[#897067] dark:text-[#EDC7B9]/70">
          Sorry, we couldn't find the profile you're looking for.
        </p>

        <Link
          to="/"
          className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-[#5A3325] px-7 py-3.5 font-bold text-white transition hover:bg-[#754534] dark:bg-[#EB9D81] dark:text-[#422318]"
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
    <div className="min-h-screen overflow-hidden bg-[#FAF4F2] pb-20 text-[#5A3325] transition-colors dark:bg-[#301911] dark:text-[#FBEEE9]">

      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 top-40 h-96 w-96 rounded-full bg-[#EB9D81]/10 blur-[100px]" />
        <div className="absolute -left-40 top-[55%] h-96 w-96 rounded-full bg-[#E6D6C6]/10 blur-[100px]" />
      </div>

      <main className="relative mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#9A8178] dark:text-[#EDC7B9]/60">
            <Link to="/" className="transition hover:text-[#5A3325] dark:hover:text-[#EB9D81]">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#5A3325] dark:text-[#EDC7B9]">
              Community Profile
            </span>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-[#EDC7B9] bg-white/70 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#814E3B] dark:border-[#754534] dark:bg-[#422318] dark:text-[#EDC7B9]">
            <Sparkles size={14} />
            Saveurs Community
          </span>
        </div>

        {/* Profile Header */}
        <section className="relative mb-10 overflow-hidden rounded-[18px] border border-[#EDC7B9]/70 bg-white shadow-[0_15px_50px_rgba(90,51,37,0.06)] dark:border-[#754534]/50 dark:bg-[#422318]">

          {/* Top decorative area */}
          <div className="relative h-36 overflow-hidden bg-gradient-to-r from-[#EDC7B9] via-[#EB9D81] to-[#E6D6C6] sm:h-48">
            <div className="absolute -right-8 -top-20 h-64 w-64 rounded-full border-[35px] border-white/20" />
            <div className="absolute -bottom-24 left-[20%] h-56 w-56 rounded-full bg-white/20 blur-2xl" />
            <div className="absolute right-[25%] top-8 h-20 w-20 rounded-full bg-[#ECE0CD]/50 blur-xl" />

            <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-white/40 bg-white/30 px-4 py-2 text-xs font-bold text-[#5A3325] backdrop-blur-md">
              <ChefHat size={15} />
              Food lover
            </div>
          </div>

          {/* Profile information */}
          <div className="px-5 pb-7 sm:px-9">

            <div className="-mt-16 flex flex-col items-center gap-5 sm:-mt-20 sm:flex-row sm:items-end sm:justify-between">

              {/* Avatar */}
              <div className="relative shrink-0">
                {profile.user.avatar || profile.user.avatar_url ? (
                  <img
                    src={profile.user.avatar || profile.user.avatar_url}
                    alt={displayName}
                    className="h-32 w-32 rounded-[18px] border-[6px] border-white object-cover shadow-xl dark:border-[#422318] sm:h-40 sm:w-40 sm:rounded-[18px]"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-[18px] border-[6px] border-white bg-gradient-to-br from-[#EB9D81] to-[#E6D6C6] text-4xl font-black text-[#5A3325] shadow-xl dark:border-[#422318] sm:h-40 sm:w-40 sm:rounded-[18px] sm:text-5xl">
                    {initials}
                  </div>
                )}

                <div className="absolute -bottom-2 -right-2 flex h-11 w-11 items-center justify-center rounded-2xl border-4 border-white bg-[#EADFC8] text-[#5A3325] dark:border-[#422318]">
                  <ChefHat size={20} />
                </div>
              </div>

              {/* Follow actions */}
              <div className="flex w-full flex-wrap justify-center gap-3 sm:w-auto sm:justify-end">
                {currentUser && !isOwnProfile && (
                  <button
                    type="button"
                    onClick={handleFollow}
                    disabled={followLoading}
                    className={`inline-flex min-w-36 items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                      isFollowing
                        ? 'border border-[#EDC7B9] bg-[#F9EDE8] text-[#5A3325] hover:bg-[#F3E0D9] dark:border-[#754534] dark:bg-[#5A3325] dark:text-[#EDC7B9]'
                        : 'bg-[#5A3325] text-white shadow-lg shadow-[#5A3325]/15 hover:-translate-y-0.5 hover:bg-[#754534] dark:bg-[#EB9D81] dark:text-[#422318] dark:hover:bg-[#EDC7B9]'
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
                  <span className="inline-flex items-center gap-2 rounded-2xl bg-[#EADFC8]/50 px-5 py-3.5 text-sm font-bold text-[#73493A] dark:bg-[#5A3325] dark:text-[#EADFC8]">
                    <UserCheck size={18} />
                    Your profile
                  </span>
                )}
              </div>
            </div>

            {/* Name and bio */}
            <div className="mt-7 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <h1 className="text-3xl font-black tracking-tight text-[#5A3325] dark:text-white sm:text-4xl">
                  {displayName}
                </h1>

                <span className="rounded-full bg-[#ECE0CD]/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#93846E] dark:bg-[#6B6152]/40 dark:text-[#ECE0CD]">
                  Member
                </span>
              </div>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#937B72] dark:text-[#EDC7B9]/70 sm:text-base">
                {profile.user.bio || 'This food lover has not added a bio yet.'}
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start">
                <span className="inline-flex items-center gap-2 rounded-xl bg-[#F9EEEA] px-3.5 py-2 text-xs font-semibold text-[#814E3B] dark:bg-[#5A3325] dark:text-[#EDC7B9]">
                  <Heart size={14} />
                  Recipe enthusiast
                </span>

                <span className="inline-flex items-center gap-2 rounded-xl bg-[#F8F4F1] px-3.5 py-2 text-xs font-semibold text-[#9F8D7B] dark:bg-[#5B5046]/40 dark:text-[#E6D6C6]">
                  <Sparkles size={14} />
                  Saveurs member
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4">

          <div className="group rounded-[18px] border border-[#EDC7B9]/60 bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#EB9D81]/10 dark:border-[#754534]/50 dark:bg-[#422318] sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EDC7B9]/50 text-[#814E3B] dark:bg-[#5A3325] dark:text-[#EB9D81]">
                <Users size={21} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#AB948C]">
                Community
              </span>
            </div>
            <p className="text-3xl font-black tabular-nums text-[#5A3325] dark:text-white">
              {profile.followers_count ?? 0}
            </p>
            <p className="mt-1 text-xs font-semibold text-[#A08A82] dark:text-[#EDC7B9]/60">
              Followers
            </p>
          </div>

          <div className="group rounded-[18px] border border-[#E6D6C6]/50 bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#E6D6C6]/10 dark:border-[#5B5046]/50 dark:bg-[#422318] sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E6D6C6]/30 text-[#9F8D7B] dark:bg-[#5B5046]/50 dark:text-[#E6D6C6]">
                <UserPlus size={21} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#AB948C]">
                Connections
              </span>
            </div>
            <p className="text-3xl font-black tabular-nums text-[#5A3325] dark:text-white">
              {profile.following_count ?? 0}
            </p>
            <p className="mt-1 text-xs font-semibold text-[#A08A82] dark:text-[#EDC7B9]/60">
              Following
            </p>
          </div>

          <div className="group rounded-[18px] border border-[#ECE0CD]/60 bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#ECE0CD]/10 dark:border-[#6B6152]/50 dark:bg-[#422318] sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ECE0CD]/40 text-[#AB9779] dark:bg-[#6B6152]/40 dark:text-[#ECE0CD]">
                <Heart size={21} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#AB948C]">
                Collection
              </span>
            </div>
            <p className="text-3xl font-black tabular-nums text-[#5A3325] dark:text-white">
              {favorites.length}
            </p>
            <p className="mt-1 text-xs font-semibold text-[#A08A82] dark:text-[#EDC7B9]/60">
              Favorite recipes
            </p>
          </div>

          <div className="group rounded-[18px] border border-[#EADFC8]/70 bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#EADFC8]/10 dark:border-[#6D4E42]/50 dark:bg-[#422318] sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EADFC8]/50 text-[#73493A] dark:bg-[#5A3325] dark:text-[#EADFC8]">
                <Star size={21} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#AB948C]">
                Feedback
              </span>
            </div>
            <p className="text-3xl font-black tabular-nums text-[#5A3325] dark:text-white">
              {ratings.length}
            </p>
            <p className="mt-1 text-xs font-semibold text-[#A08A82] dark:text-[#EDC7B9]/60">
              Reviews
            </p>
          </div>
        </section>

        {/* Favorite Recipes */}
        <section className="mb-14">

          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#C38067]">
                <Bookmark size={15} />
                Personal collection
              </div>

              <h2 className="text-2xl font-black tracking-tight text-[#5A3325] dark:text-white sm:text-3xl">
                Favorite Recipes
              </h2>

              <p className="mt-2 text-sm text-[#A08A82] dark:text-[#EDC7B9]/60">
                A little collection of recipes loved by {displayName}
              </p>
            </div>

            <span className="rounded-xl bg-[#EDC7B9]/40 px-4 py-2 text-xs font-bold text-[#814E3B] dark:bg-[#5A3325] dark:text-[#EDC7B9]">
              {favorites.length} recipes
            </span>
          </div>

          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {favorites.map((recipe, index) => (
                <Link
                  to={`/recipe/${recipe.id}`}
                  key={recipe.id}
                  className="group overflow-hidden rounded-[18px] border border-[#EDC7B9]/50 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#EB9D81]/10 dark:border-[#754534]/50 dark:bg-[#422318]"
                >
                  <div className="relative h-52 overflow-hidden bg-[#F9EEEA] dark:bg-[#5A3325]">
                    {getRecipeImage(recipe.image) ? (
                      <img
                        src={getRecipeImage(recipe.image)}
                        alt={recipe.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#C38067]">
                        <Utensils size={42} />
                      </div>
                    )}

                    <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl border border-white/40 bg-white/85 text-[#AB9779] shadow-sm backdrop-blur-md">
                      <Heart size={17} fill="currentColor" />
                    </div>

                    <div className="absolute bottom-3 right-3 rounded-lg bg-[#5A3325]/80 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur-md">
                      RECIPE #{index + 1}
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#C38067]">
                      {recipe.cuisine || 'Delicious recipe'}
                    </p>

                    <h3 className="line-clamp-2 min-h-[52px] text-lg font-extrabold leading-6 text-[#5A3325] transition-colors group-hover:text-[#C57558] dark:text-white">
                      {recipe.name}
                    </h3>

                    <div className="mt-5 flex items-center justify-between border-t border-[#EDC7B9]/40 pt-4 dark:border-[#754534]/50">
                      <span className="text-xs font-semibold text-[#A08A82] dark:text-[#EDC7B9]/60">
                        Discover this recipe
                      </span>

                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EDC7B9]/40 text-[#814E3B] transition-all group-hover:bg-[#5A3325] group-hover:text-white dark:bg-[#5A3325] dark:text-[#EDC7B9]">
                        <ArrowRight size={17} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}

            </div>
          ) : (
            <div className="rounded-[18px] border border-dashed border-[#D6A08D] bg-white/70 px-5 py-14 text-center dark:border-[#754534] dark:bg-[#422318]/60">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#ECE0CD]/40 text-[#AB9779]">
                <Heart size={29} />
              </div>

              <h3 className="text-lg font-extrabold text-[#5A3325] dark:text-white">
                No favorite recipes yet
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#A08A82] dark:text-[#EDC7B9]/60">
                Favorite recipes will appear here when this user saves them.
              </p>
            </div>
          )}
        </section>

        {/* Reviews */}
        <section className="mb-14">

          <div className="mb-7">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#C5B2A0]">
              <MessageCircle size={15} />
              Community feedback
            </div>

            <h2 className="text-2xl font-black tracking-tight text-[#5A3325] dark:text-white sm:text-3xl">
              Recent Reviews
            </h2>

            <p className="mt-2 text-sm text-[#A08A82] dark:text-[#EDC7B9]/60">
              Thoughts and ratings shared by {displayName}
            </p>
          </div>

          {ratings.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

              {ratings.map((rating) => (
                <article
                  key={rating.id}
                  className="rounded-[18px] border border-[#E6D6C6]/40 bg-white p-5 transition-all hover:shadow-lg hover:shadow-[#E6D6C6]/10 dark:border-[#5B5046]/50 dark:bg-[#422318] sm:p-6"
                >
                  <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E6D6C6]/30 text-[#9F8D7B] dark:bg-[#5B5046]/50 dark:text-[#E6D6C6]">
                        <BookOpen size={20} />
                      </div>

                      <div className="min-w-0">
                        {rating.recipe?.id ? (
                          <Link
                            to={`/recipe/${rating.recipe.id}`}
                            className="block truncate font-bold text-[#5A3325] transition-colors hover:text-[#C38067] dark:text-white"
                          >
                            {rating.recipe.name}
                          </Link>
                        ) : (
                          <span className="font-bold text-[#5A3325] dark:text-white">
                            Recipe Review
                          </span>
                        )}

                        <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[#AFA09B]">
                          Recipe rating
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 rounded-xl bg-[#F2F7E9] px-3 py-2 dark:bg-[#344C3C]">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          size={14}
                          fill={
                            index < (Number(rating.score) || 0)
                              ? '#E8B45C'
                              : 'none'
                          }
                          className={
                            index < (Number(rating.score) || 0)
                              ? 'text-[#E8B45C]'
                              : 'text-[#C8BDB9]'
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#FAF4F2] p-4 dark:bg-[#301911]">
                    <div className="mb-2 flex items-center gap-2 text-[#C38067]">
                      <MessageCircle size={15} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Comment
                      </span>
                    </div>

                    <p className="text-sm leading-7 text-[#896F65] dark:text-[#EDC7B9]/75">
                      {rating.comment || 'No comment provided.'}
                    </p>
                  </div>
                </article>
              ))}

            </div>
          ) : (
            <div className="rounded-[18px] border border-dashed border-[#E6D6C6] bg-white/70 px-5 py-14 text-center dark:border-[#5B5046] dark:bg-[#422318]/60">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#E6D6C6]/30 text-[#9F8D7B]">
                <Star size={29} />
              </div>

              <h3 className="text-lg font-extrabold text-[#5A3325] dark:text-white">
                No reviews yet
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#A08A82] dark:text-[#EDC7B9]/60">
                Reviews will appear here when this user rates recipes.
              </p>
            </div>
          )}
        </section>

        {/* Bottom navigation */}
        <div className="flex flex-col items-center justify-between gap-5 rounded-[18px] border border-[#EDC7B9]/60 bg-gradient-to-r from-[#F9ECE7] via-white to-[#F8F4F1] p-6 dark:border-[#754534]/50 dark:from-[#422318] dark:via-[#422318] dark:to-[#3D3731] sm:flex-row sm:px-8">
          <div className="text-center sm:text-left">
            <p className="text-lg font-black text-[#5A3325] dark:text-white">
              Keep exploring!
            </p>
            <p className="mt-1 text-sm text-[#A08A82] dark:text-[#EDC7B9]/60">
              Discover more delicious ideas with Saveurs.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-[#5A3325] px-6 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#754534] dark:bg-[#EB9D81] dark:text-[#422318]"
          >
            <ArrowLeft size={17} />
            Back to Home
          </Link>
        </div>

      </main>
    </div>
  );
}
