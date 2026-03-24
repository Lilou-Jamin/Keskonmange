import { Link } from 'react-router-dom';
import IconProfile from '../../assets/profile_icon.svg';

export default function Profile() {
  return (
    <>
      <div className="p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8 flex flex-row items-center gap-4">
            <img src={IconProfile} alt="Icône de profil" className="m-auto mb-8" />
            <h2> Nom - Prénom </h2>
          </div>

          <div className="mb-8 border-2 border-(--light-grey-color) rounded-lg p-4 flex flex-row items-center gap-4">
            <Link to="/profile/inventory" className="link">
              <img src=""></img>
              <h2> Mes ingrédients </h2>
            </Link>
          </div>

          <p>
            Vous n'avez pas de compte ?{' '}
            <Link to="/register" className="link">
              Inscrivez-vous
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
