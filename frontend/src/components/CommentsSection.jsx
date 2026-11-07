import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export default function CommentsSection({ recipeId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  // دالة جلب التعليقات من الباك اند
  const fetchComments = () => {
    axios.get(`${API_URL}/recipes/${recipeId}/comments`)
      .then(res => setComments(res.data))
      .catch(err => console.error(err));
  };

  // ملي كتحل الصفحة، جيب التعليقات
  useEffect(() => {
    fetchComments();
  }, [recipeId]);

  // دالة إضافة تعليق جديد
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token'); // تأكدي بلي الـ token كيتخزن بهاد السمية
      await axios.post(`${API_URL}/recipes/${recipeId}/comments`, 
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment('');
      fetchComments(); // عاودي جيبي التعليقات باش يبان الجديد
    } catch (err) {
      console.error(err);
      alert('خاصك تكوني مسجل الدخول باش تزيدي تعليق!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 pt-16 border-t border-warm-brown/10 dark:border-dark-text/10 no-print">
      <h2 className="font-serif text-3xl font-bold text-warm-brown dark:text-dark-text mb-8">
        💬 التعليقات ({comments.length})
      </h2>

      {/* فورم إضافة تعليق */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="شاركي رأيك ولا نصيحة على هاد الوصفة..."
            className="w-full p-4 rounded-xl border border-warm-brown/20 dark:border-dark-text/20 bg-white dark:bg-dark-card text-warm-brown dark:text-dark-text focus:outline-none focus:border-orange-accent mb-3"
            rows={3}
          />
          <button type="submit" disabled={loading} className="px-6 py-2 bg-orange-accent text-white rounded-xl font-medium hover:bg-orange-accent/90 transition-colors disabled:opacity-50">
            {loading ? 'جاري الإرسال...' : 'أضف تعليق'}
          </button>
        </form>
      ) : (
        <p className="mb-8 text-warm-brown/60 dark:text-dark-text/60">
          خاصك <a href="/login" className="text-orange-accent hover:underline">تسجلي الدخول</a> باش تزيدي تعليق.
        </p>
      )}

      {/* لائحة التعليقات */}
      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="bg-white dark:bg-dark-card p-4 rounded-xl border border-warm-brown/5 dark:border-dark-text/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-orange-accent/20 flex items-center justify-center text-sm font-bold text-orange-accent">
                {comment.user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="font-medium text-warm-brown dark:text-dark-text">{comment.user?.name || 'مستخدم'}</p>
                <p className="text-xs text-warm-brown/50 dark:text-dark-text/50">
                  {new Date(comment.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="text-warm-brown/80 dark:text-dark-text/80 text-sm">{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-warm-brown/50 dark:text-dark-text/50 italic">ما كاين حتى تعليق دابا. كوني أول وحدة تزيدي!</p>
        )}
      </div>
    </div>
  );
}