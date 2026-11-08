import RatingStars from './RatingStars';
import { User } from 'lucide-react';

function RatingList({ ratings }) {
  if (!ratings || ratings.length === 0) {
    return (
      <p className="text-gray-400 text-center py-4 font-sans text-sm">
        No ratings yet. Be the first to rate!
      </p>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      {ratings.map((rating) => (
        <div key={rating.id} className="p-4 bg-[#FAF7F0] rounded-xl border border-warm-brown/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-guava-peach flex items-center justify-center">
              <User size={14} className="text-warm-brown" />
            </div>
            <div>
              <p className="font-sans font-bold text-sm text-warm-brown">
                {rating.user?.name || 'Anonymous'}
              </p>
              <p className="text-xs text-gray-400 font-sans">
                {new Date(rating.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <RatingStars rating={rating.score} size="sm" />
             {rating.comment && (
               <p className="text-sm text-gray-600 font-sans">{rating.comment}</p>
             )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default RatingList;