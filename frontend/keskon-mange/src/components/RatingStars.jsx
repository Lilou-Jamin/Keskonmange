import StarFilled from '../assets/star_fullfilled.svg';
import StarHalf from '../assets/star_half.svg';
import StarOutlined from '../assets/star_lined.svg';

export default function RatingStars({
  avgNote = 0,
  nbComments = 0,
  showValue = false,
  size = 'h-4 w-4'
}) {
  const note = Number(avgNote);
  const comments = Number(nbComments);

  const getStars = (note) => {
    const safeNote = Math.min(Math.max(note || 0, 0), 5);

    return [...Array(5)].map((_, i) => {
      if (safeNote >= i + 1) return 'full';
      if (safeNote >= i + 0.5) return 'half';
      return 'empty';
    });
  };

  return (
    <div className="flex items-center mb-1">
      {getStars(note).map((type, i) => (
        <img
          key={i}
          src={
            type === 'full'
              ? StarFilled
              : type === 'half'
              ? StarHalf
              : StarOutlined
          }
          alt="étoile"
          className={size}
        />
      ))}

      <span className="mt-0.5 ml-1 text-xs text-gray-500">
        {comments === 0
          ? '(0 avis)'
          : showValue
            ? `${note.toFixed(1)} / 5 (${comments} avis)`
            : `(${comments} avis)`}
      </span>
    </div>
  );
}