// components/StarRating.tsx
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number; // a number between 0 and 5
}

export default function StarRating({ rating }: StarRatingProps) {
  return (
    <div className="flex items-center space-x-1  text-yellow-400">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          fill={index < rating ? 'currentColor' : 'none'}
          stroke="currentColor"
          size={16}
        />
      ))}
    </div>
  );
}
