
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
  LoaderCircle
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

  return (
    <section
      dir={isRTL ? 'rtl' : 'ltr'}
      className="mt-12"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between gap-4 mb-7 pb-5 border-b border-[#E88FA5]/20">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#E88FA5]/15 flex items-center justify-center">
            <MessageSquare size={21} className="text-[#E88FA5]" />
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1512]">
              {getText('Community Thoughts', 'Avis de la communauté', 'آراء المجتمع')}
            </h3>
            <p className="text-xs text-[#8B8179] mt-1">
              {getText(
                'Share your experience with this recipe',
                'Partagez votre expérience avec cette recette',
                'شاركي تجربتك مع هاد الوصفة'
              )}
            </p>
          </div>
        </div>

        <span className="px-3 py-1.5 rounded-full bg-[#718B68]/10 text-[#718B68] text-xs font-bold">
          {comments.length} {getText('Comments', 'Commentaires', 'تعليقات')}
        </span>
      </div>

      {/* Add Comment */}
      {user ? (
        <form
          onSubmit={handleSubmit}
          className="mb-9 p-5 sm:p-6 rounded-3xl bg-[#FAF7F0] border border-[#E88FA5]/15"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={17} className="text-[#E88FA5]" />
            <h4 className="font-semibold text-[#1A1512] text-sm">
              {getText('Leave a comment', 'Laisser un commentaire', 'أضيفي تعليق')}
            </h4>
          </div>

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
            className="w-full p-4 rounded-2xl bg-white border border-[#E8DED4] text-[#1A1512] placeholder:text-[#A99D93] focus:outline-none focus:border-[#E88FA5] focus:ring-4 focus:ring-[#E88FA5]/10 transition-all resize-none text-sm"
          />

          <div className="flex items-center justify-between gap-3 mt-3">
            <span className="text-[11px] text-[#A99D93]">
              {newComment.length}/1000
            </span>

            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#E88FA5] text-white text-xs font-bold hover:bg-[#d87991] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? (
                <>
                  <LoaderCircle size={15} className="animate-spin" />
                  {getText('Posting...', 'Publication...', 'جاري النشر...')}
                </>
              ) : (
                <>
                  <Send size={14} />
                  {getText('Post Comment', 'Publier', 'نشر التعليق')}
                </>
              )}
            </button>
          </div>

          {error && (
            <p className="mt-3 text-xs text-red-500">
              {error}
            </p>
          )}
        </form>
      ) : (
        <div className="mb-9 p-5 rounded-2xl bg-[#FAF7F0] border border-[#E8DED4] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-start">
            <h4 className="font-semibold text-[#1A1512] text-sm mb-1">
              {getText(
                'Join the conversation!',
                'Rejoignez la conversation !',
                'شاركي معانا رأيك!'
              )}
            </h4>
            <p className="text-xs text-[#8B8179]">
              {getText(
                'Log in to share your thoughts.',
                'Connectez-vous pour partager votre avis.',
                'دخلي لحسابك باش تزيدي تعليق.'
              )}
            </p>
          </div>

          <Link
            to="/login"
            className="shrink-0 px-5 py-2.5 rounded-full bg-[#1A1512] text-white text-xs font-bold hover:bg-[#718B68] transition-colors"
          >
            {getText('Log In', 'Se connecter', 'تسجيل الدخول')}
          </Link>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {fetching ? (
          <div className="flex justify-center py-10">
            <LoaderCircle size={27} className="animate-spin text-[#E88FA5]" />
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <article
              key={comment.id}
              className="group p-5 rounded-2xl bg-white border border-[#E8DED4]/80 hover:border-[#E88FA5]/40 hover:shadow-md hover:shadow-[#E88FA5]/5 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 shrink-0 rounded-full bg-[#F5D8C8] flex items-center justify-center text-[#1A1512] font-bold text-sm">
                  {comment.user?.name?.charAt(0)?.toUpperCase() || (
                    <UserRound size={18} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <Link
                      to={comment.user?.id ? `/user/${comment.user.id}` : '#'}
                      onClick={(e) => {
                        if (!comment.user?.id) e.preventDefault();
                      }}
                      className="font-bold text-sm text-[#1A1512] hover:text-[#E88FA5] transition-colors"
                    >
                      {comment.user?.name || 'User'}
                    </Link>

                    <span className="text-[11px] text-[#A99D93]">
                      {new Date(comment.created_at).toLocaleDateString(
                        i18n.language === 'ar' ? 'ar' :
                        i18n.language === 'fr' ? 'fr-FR' : 'en-US'
                      )}
                    </span>
                  </div>

                  <p className="text-sm text-[#655B54] leading-7 whitespace-pre-wrap break-words">
                    {comment.content}
                  </p>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="py-12 px-5 text-center rounded-3xl bg-[#FAF7F0] border border-dashed border-[#E8DED4]">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#E88FA5]/10 flex items-center justify-center">
              <MessageSquare size={24} className="text-[#E88FA5]" />
            </div>

            <h4 className="font-serif text-lg font-bold text-[#1A1512] mb-2">
              {getText('No comments yet', 'Aucun commentaire', 'مازال ما كاين حتى تعليق')}
            </h4>

            <p className="text-xs text-[#8B8179]">
              {getText(
                'Be the first to share your thoughts!',
                'Soyez le premier à partager votre avis !',
                'كوني أول وحدة تشارك رأيها!'
              )}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
