import { Link } from 'react-router-dom';
import TimeIcon from '../assets/time.svg';

export default function RecipePreview({ id, title, thumb }) {
  return (
    <div className="h-64 w-40 sm:w-48 shrink-0 overflow-hidden rounded-xl bg-white shadow-md">
      <Link to={`/meals/${id}`} className="block h-full">
        <div className="h-32 w-full">
          <img
            src={thumb}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex h-32 flex-col justify-between p-3">
          <p className="line-clamp-2 font-semibold text-black">{title}</p>

          <div className="flex items-center text-sm text-gray-600">
            <img
              src={TimeIcon}
              alt="Icône temps de préparation"
              className="mr-2 h-4 w-4"
            />
            <span>Temps de prep</span>
          </div>
        </div>
      </Link>
    </div>
  );
}