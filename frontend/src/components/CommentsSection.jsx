import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next'; // زدنا هاد السطر

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export default function CommentsSection({ recipeId }) {
  const { user } = useAuth();
  const { t, i18n } = useTranslation(); // زدنا i18n باش نعرفو شنو هي اللغة الحالية
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  // دالة باش نترجمو النصوص حسب اللغة
  const getText = (en, fr, ar) => {
    if (i18n.language === 'fr') return fr;
    if (i18n.language === 'ar') return ar;
    return en; // Default English
  };

  const fetchComments = () => {
    axios.get(`${API_URL}/recipes/${recipeId}/comments`)
      .then(res => setComments(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchComments();
  }, [recipeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/recipes/${recipeId}/comments`, 
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error(err);
      alert(getText('You must be logged in to comment!', 'Vous devez être connecté pour commenter!', 'خاصك تكوني مسجل الدخول باش تزيدي تعليق!'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 pt-16 border-t border-warm-brown/10 dark:border-dark-text/10 no-print">
      
      <h2 className="font-serif text-3xl font-bold text-warm-brown dark:text-dark-text mb-8">
        💬 {getText('Comments', 'Commentaires', 'التعليقات')} ({comments.length})
      </h2>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={getText('Share your thoughts about this recipe...', 'Partagez votre avis sur cette recette...', 'شاركي رأيك ولا نصيحة على هاد الوصفة...')}
            className="w-full p-4 rounded-xl border border-warm-brown/20 dark:border-dark-text/20 bg-white dark:bg-dark-card text-warm-brown dark:text-dark-text focus:outline-none focus:border-orange-accent mb-3"
            rows={3}
          />
          <button type="submit" disabled={loading} className="px-6 py-2 bg-orange-accent text-white rounded-xl font-medium hover:bg-orange-accent/90 transition-colors disabled:opacity-50">
            {loading ? getText('Posting...', 'Envoi...', 'جاري الإرسال...') : getText('Post Comment', 'Publier', 'أضف تعليق')}
          </button>
        </form>
      ) : (
        <p className="mb-8 text-warm-brown/60 dark:text-dark-text/60">
          {getText('Please', 'Veuillez', 'خاصك')} <Link to="/login" className="text-orange-accent hover:underline">{getText('log in', 'vous connecter', 'تسجلي الدخول')}</Link> {getText('to leave a comment.', 'pour laisser un commentaire.', 'باش تزيدي تعليق.')}
        </p>
      )}

      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="bg-white dark:bg-dark-card p-4 rounded-xl border border-warm-brown/5 dark:border-dark-text/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-orange-accent/20 flex items-center justify-center text-sm font-bold text-orange-accent">
                {comment.user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <Link 
  to={`/user/${comment.user?.id}`} 
  className="font-medium text-warm-brown dark:text-dark-text hover:text-orange-accent hover:underline"
>
  {comment.user?.name || 'User'}
</Link>
                <p className="text-xs text-warm-brown/50 dark:text-dark-text/50">
                  {new Date(comment.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="text-warm-brown/80 dark:text-dark-text/80 text-sm">{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-warm-brown/50 dark:text-dark-text/50 italic">
            {getText('No comments yet. Be the first!', 'Aucun commentaire. Soyez le premier !', 'ما كاين حتى تعليق دابا. كوني أول وحدة تزيدي!')}
          </p>
        )}
      </div>
    </div>
  );
}