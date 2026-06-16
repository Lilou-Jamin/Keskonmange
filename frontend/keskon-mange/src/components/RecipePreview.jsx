import { Link } from 'react-router-dom';
import TimeIcon from '../assets/time.svg';
import StarFilled from '../assets/star_fullfilled.svg';
import StarHalf from '../assets/star_half.svg';
import StarOutlined from '../assets/star_lined.svg';
import RatingStars from '../components/RatingStars';

export default function RecipePreview({ id, title, thumb, time, avg_note = 0, nb_comments = 0 }) {
  return (
    <div className="h-60 w-40 sm:w-48 shrink-0 overflow-hidden rounded-xl bg-white shadow-md">
      <Link to={`/meals/${id}`} className="block h-full">
        <div className="h-32 w-full">
          <img
            src={thumb}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex h-32 flex-col p-3">
          <p className="line-clamp-2 font-semibold text-black">
            {title}
          </p>

          <RatingStars
            avgNote={avg_note}
            nbComments={nb_comments}
          />

          <div className="flex items-center text-sm text-gray-600">
            <img
              src={TimeIcon}
              alt="Icône temps de préparation"
              className="mr-2 h-4 w-4"
            />
            <span>{time} min</span>
          </div>
        </div>
      </Link>
    </div>
  );
}