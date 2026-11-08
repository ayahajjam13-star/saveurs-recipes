import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { MessageSquare } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export default function CommentsSection({ recipeId }) {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const getText = (en, fr, ar) => {
    if (i18n.language === 'fr') return fr;
    if (i18n.language === 'ar') return ar;
    return en;
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-6 border-b border-warm-brown/10 pb-4">
        <MessageSquare size={20} className="text-guava-pink" />
        <h3 className="font-serif text-2xl font-bold text-warm-brown">
          {getText('Comments', 'Commentaires', 'التعليقات')} ({comments.length})
        </h3>
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={getText('Share your thoughts...', 'Partagez votre avis...', 'شاركي رأيك...')}
            className="w-full p-4 rounded-xl border border-gray-200 bg-white text-warm-brown focus:outline-none focus:ring-2 focus:ring-guava-pink/30 transition-all resize-none text-sm font-sans"
            rows={3}
          />
          <button type="submit" disabled={loading} className="mt-3 px-6 py-2.5 bg-guava-pink text-white rounded-full text-sm font-bold tracking-widest uppercase hover:bg-warm-brown transition-colors disabled:opacity-50">
            {loading ? '...' : getText('Post Comment', 'Publier', 'أضف تعليق')}
          </button>
        </form>
      ) : (
        <p className="mb-8 text-gray-500 font-sans text-sm">
          {getText('Please', 'Veuillez', 'خاصك')} <Link to="/login" className="text-guava-pink font-bold hover:underline">{getText('log in', 'vous connecter', 'تسجلي الدخول')}</Link> {getText('to leave a comment.', 'pour laisser un commentaire.', 'باش تزيدي تعليق.')}
        </p>
      )}

      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="bg-[#FAF7F0] p-5 rounded-xl border border-warm-brown/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-guava-peach flex items-center justify-center text-xs font-bold text-warm-brown">
                {comment.user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <Link to={`/user/${comment.user?.id}`} className="font-sans font-bold text-sm text-warm-brown hover:text-guava-pink transition-colors">
                  {comment.user?.name || 'User'}
                </Link>
                <p className="text-xs text-gray-400 font-sans">
                  {new Date(comment.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="text-warm-brown/80 font-sans text-sm leading-relaxed">{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-gray-400 font-sans italic text-sm text-center py-6">
            {getText('No comments yet. Be the first!', 'Aucun commentaire. Soyez le premier !', 'ما كاين حتى تعليق دابا. كوني أول وحدة تزيدي!')}
          </p>
        )}
      </div>
    </div>
  );
}