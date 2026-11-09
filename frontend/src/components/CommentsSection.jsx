
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  MessageSquare,
  Send,
  UserRound,
  Sparkles,
  LoaderCircle,
  MessageCircle,
  Heart,
  ArrowRight
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export default function CommentsSection({ recipeId }) {
  const { user } = useAuth();
  const { i18n } = useTranslation();

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  const isArabic = i18n.language === 'ar';
  const isRTL = isArabic;

  const getText = (en, fr, ar) => {
    if (i18n.language === 'fr') return fr;
    if (isArabic) return ar;
    return en;
  };

  const fetchComments = async () => {
    try {
      setFetching(true);

      const res = await axios.get(
        `${API_URL}/recipes/${recipeId}/comments`
      );

      setComments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [recipeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.trim() || loading) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      await axios.post(
        `${API_URL}/recipes/${recipeId}/comments`,
        { content: newComment.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setNewComment('');
      await fetchComments();
    } catch (err) {
      console.error('Error posting comment:', err);

      setError(
        err.response?.data?.message ||
        getText(
          'Unable to post your comment. Please try again.',
          'Impossible de publier votre commentaire. Réessayez.',
          'ما قدرناش ننشرو التعليق ديالك. عاودي حاولي.'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const getInitial = (name) => {
    return name?.charAt(0)?.toUpperCase() || null;
  };

  return (
    <section
      dir={isRTL ? 'rtl' : 'ltr'}
      className="mt-14 sm:mt-16"
    >
      {/* Section Header */}
      <div className="relative mb-8 overflow-hidden rounded-[28px] border border-[#B8E8EE]/70 dark:border-[#24515B] bg-gradient-to-r from-[#B8E8EE]/45 via-white to-[#F2C7DB]/30 dark:from-[#173B43] dark:via-[#173B43] dark:to-[#3B2C45] p-5 sm:p-7">

        <div className="absolute -top-12 -right-10 w-36 h-36 rounded-full bg-[#7ADDF2]/20 blur-2xl pointer-events-none" />

        <div className="absolute -bottom-12 -left-10 w-36 h-36 rounded-full bg-[#CBB7F5]/20 blur-2xl pointer-events-none" />

        <div className="relative flex flex-wrap items-center justify-between gap-5">

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-[#7ADDF2]/30 border border-[#7ADDF2]/40 flex items-center justify-center shadow-sm">
              <MessageSquare
                size={24}
                className="text-[#24515B] dark:text-[#B8E8EE]"
              />
            </div>

            <div>
              <span className="text-[10px] sm:text-xs font-bold tracking-[2px] uppercase text-[#438C9B] dark:text-[#B8E8EE]">
                {getText('SAVEURS COMMUNITY', 'COMMUNAUTÉ SAVEURS', 'مجتمع سافور')}
              </span>

              <h3 className="text-xl sm:text-2xl font-bold text-[#24515B] dark:text-white mt-1">
                {getText(
                  'Community Thoughts',
                  'Avis de la communauté',
                  'آراء المجتمع'
                )}
              </h3>

              <p className="text-xs sm:text-sm text-[#557780] dark:text-[#B8CDD1] mt-1">
                {getText(
                  'Share your experience with this recipe',
                  'Partagez votre expérience avec cette recette',
                  'شاركي تجربتك مع هاد الوصفة'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/80 dark:bg-[#24515B]/60 border border-[#B8E8EE] dark:border-[#416C75] shadow-sm">
            <MessageCircle
              size={16}
              className="text-[#438C9B] dark:text-[#B8E8EE]"
            />

            <span className="text-sm font-bold text-[#24515B] dark:text-white">
              {comments.length}
            </span>

            <span className="text-xs text-[#557780] dark:text-[#B8CDD1]">
              {getText('Comments', 'Commentaires', 'تعليقات')}
            </span>
          </div>

        </div>
      </div>

      {/* Add Comment */}
      {user ? (
        <form
          onSubmit={handleSubmit}
          className="relative mb-9 overflow-hidden rounded-[28px] border border-[#B8E8EE]/70 dark:border-[#24515B] bg-white dark:bg-[#173B43] p-5 sm:p-7 shadow-sm"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#7ADDF2] via-[#CBB7F5] to-[#BFE8C8]" />

          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-[#F2C7DB]/35 flex items-center justify-center">
              <Sparkles size={19} className="text-[#B8759A]" />
            </div>

            <div>
              <h4 className="font-bold text-[#24515B] dark:text-white text-sm sm:text-base">
                {getText(
                  'Leave a comment',
                  'Laisser un commentaire',
                  'أضيفي تعليق'
                )}
              </h4>

              <p className="text-[11px] text-[#71949B] dark:text-[#A9C6CC] mt-0.5">
                {getText(
                  'Your opinion matters to our community',
                  'Votre avis compte pour notre communauté',
                  'رأيك مهم بالنسبة للمجتمع ديالنا'
                )}
              </p>
            </div>
          </div>

          <div className="relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={getText(
                'What did you think about this recipe?',
                'Qu’avez-vous pensé de cette recette ?',
                'شنو رأيك فهاد الوصفة؟'
              )}
              maxLength={1000}
              rows={4}
              className="w-full p-4 rounded-2xl bg-[#F4FBFC] dark:bg-[#204951] border border-[#B8E8EE] dark:border-[#416C75] text-[#24515B] dark:text-white placeholder:text-[#8CAEB5] dark:placeholder:text-[#9AB8BE] focus:outline-none focus:border-[#7ADDF2] focus:ring-4 focus:ring-[#7ADDF2]/15 transition-all resize-none text-sm leading-7"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
            <span className="text-[11px] font-medium text-[#86AAB1] dark:text-[#A9C6CC]">
              {newComment.length}/1000
            </span>

            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#24515B] text-white text-xs sm:text-sm font-bold hover:bg-[#347382] hover:shadow-lg hover:shadow-[#24515B]/15 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {loading ? (
                <>
                  <LoaderCircle size={16} className="animate-spin" />
                  {getText(
                    'Posting...',
                    'Publication...',
                    'جاري النشر...'
                  )}
                </>
              ) : (
                <>
                  <Send size={15} />
                  {getText(
                    'Post Comment',
                    'Publier',
                    'نشر التعليق'
                  )}
                </>
              )}
            </button>
          </div>

          {error && (
            <p className="mt-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 text-xs text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </form>
      ) : (
        /* Login Prompt */
        <div className="relative mb-9 overflow-hidden rounded-[28px] border border-[#B8E8EE] dark:border-[#24515B] bg-gradient-to-r from-[#B8E8EE]/35 to-[#CBB7F5]/20 dark:from-[#173B43] dark:to-[#302C47] p-5 sm:p-7">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/80 dark:bg-[#24515B] flex items-center justify-center">
                <UserRound
                  size={22}
                  className="text-[#438C9B] dark:text-[#B8E8EE]"
                />
              </div>

              <div className="text-center sm:text-start">
                <h4 className="font-bold text-[#24515B] dark:text-white text-sm sm:text-base mb-1">
                  {getText(
                    'Join the conversation!',
                    'Rejoignez la conversation !',
                    'شاركي معانا رأيك!'
                  )}
                </h4>

                <p className="text-xs text-[#668C94] dark:text-[#B8CDD1]">
                  {getText(
                    'Log in to share your thoughts.',
                    'Connectez-vous pour partager votre avis.',
                    'دخلي لحسابك باش تزيدي تعليق.'
                  )}
                </p>
              </div>
            </div>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 shrink-0 px-6 py-3 rounded-full bg-[#24515B] text-white text-xs font-bold hover:bg-[#347382] transition-all shadow-sm"
            >
              {getText(
                'Log In',
                'Se connecter',
                'تسجيل الدخول'
              )}

              <ArrowRight size={15} className={isRTL ? 'rotate-180' : ''} />
            </Link>

          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">

        {fetching ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-12 h-12 rounded-full bg-[#B8E8EE]/40 dark:bg-[#24515B] flex items-center justify-center">
              <LoaderCircle
                size={25}
                className="animate-spin text-[#438C9B] dark:text-[#B8E8EE]"
              />
            </div>

            <p className="text-xs text-[#71949B] dark:text-[#A9C6CC]">
              {getText('Loading comments...', 'Chargement...', 'جاري تحميل التعليقات...')}
            </p>
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment, index) => (
            <article
              key={comment.id}
              className="group relative overflow-hidden rounded-[24px] border border-[#B8E8EE]/60 dark:border-[#24515B] bg-white dark:bg-[#173B43] p-5 sm:p-6 hover:border-[#7ADDF2] dark:hover:border-[#438C9B] hover:shadow-lg hover:shadow-[#24515B]/5 transition-all duration-300"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#7ADDF2] via-[#CBB7F5] to-[#BFE8C8] opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-start gap-3 sm:gap-4">

                <div className="w-11 h-11 shrink-0 rounded-2xl bg-gradient-to-br from-[#B8E8EE] to-[#7ADDF2] flex items-center justify-center text-[#24515B] font-bold text-base shadow-sm">
                  {getInitial(comment.user?.name) || (
                    <UserRound size={19} />
                  )}
                </div>

                <div className="flex-1 min-w-0">

                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">

                    <Link
                      to={comment.user?.id ? `/user/${comment.user.id}` : '#'}
                      onClick={(e) => {
                        if (!comment.user?.id) e.preventDefault();
                      }}
                      className="font-bold text-sm text-[#24515B] dark:text-white hover:text-[#438C9B] dark:hover:text-[#7ADDF2] transition-colors"
                    >
                      {comment.user?.name || 'User'}
                    </Link>

                    <span className="text-[10px] sm:text-[11px] px-3 py-1 rounded-full bg-[#B8E8EE]/30 dark:bg-[#24515B] text-[#668C94] dark:text-[#B8CDD1] font-medium">
                      {new Date(comment.created_at).toLocaleDateString(
                        i18n.language === 'ar' ? 'ar' :
                        i18n.language === 'fr' ? 'fr-FR' : 'en-US'
                      )}
                    </span>

                  </div>

                  <p className="text-sm text-[#557780] dark:text-[#C1D7DB] leading-7 whitespace-pre-wrap break-words">
                    {comment.content}
                  </p>

                  <div className="flex items-center gap-1.5 mt-4">
                    <Heart size={12} className="text-[#D99BB9]" />
                    <span className="text-[10px] text-[#91ADB3] dark:text-[#91B4BB]">
                      {getText('Community member', 'Membre de la communauté', 'عضو في المجتمع')}
                    </span>
                  </div>

                </div>
              </div>
            </article>
          ))
        ) : (
          /* Empty State */
          <div className="relative overflow-hidden py-12 px-5 text-center rounded-[28px] bg-gradient-to-br from-[#B8E8EE]/25 via-white to-[#CBB7F5]/15 dark:from-[#173B43] dark:via-[#173B43] dark:to-[#302C47] border border-dashed border-[#7ADDF2]/70 dark:border-[#416C75]">

            <div className="w-16 h-16 mx-auto mb-5 rounded-[22px] bg-[#B8E8EE]/50 dark:bg-[#24515B] flex items-center justify-center">
              <MessageSquare
                size={27}
                className="text-[#438C9B] dark:text-[#B8E8EE]"
              />
            </div>

            <h4 className="text-lg font-bold text-[#24515B] dark:text-white mb-2">
              {getText(
                'No comments yet',
                'Aucun commentaire',
                'مازال ما كاين حتى تعليق'
              )}
            </h4>

            <p className="text-xs text-[#71949B] dark:text-[#A9C6CC] max-w-xs mx-auto leading-6">
              {getText(
                'Be the first to share your thoughts!',
                'Soyez le premier à partager votre avis !',
                'كوني أول وحدة تشارك رأيها!'
              )}
            </p>

            <div className="flex justify-center gap-2 mt-5">
              <span className="w-2 h-2 rounded-full bg-[#7ADDF2]" />
              <span className="w-2 h-2 rounded-full bg-[#CBB7F5]" />
              <span className="w-2 h-2 rounded-full bg-[#BFE8C8]" />
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
