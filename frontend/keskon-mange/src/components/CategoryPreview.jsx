import { Link } from 'react-router-dom';
import TimeIcon from '../assets/time.svg';
import { useEffect } from 'react';

export default function CategoryPreview({ id, title, category, thumb }) {
  return (
    <div className="w-40 shrink-0 overflow-hidden rounded-xl bg-white shadow-md">
        <Link to={`/meals/category/${category}`} state={{ title }} className="block h-full">
        <div className="relative h-40 w-full">
            <img src={thumb} alt={title} className="h-full w-full object-cover"/>
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-center justify-center">            
                <span className="text-center font-semibold text-white text-lg px-3 py-1 rounded ">{title}</span>
            </div>
        </div>
      </Link>
    </div>
  );
}