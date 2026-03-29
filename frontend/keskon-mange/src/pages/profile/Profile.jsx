import { Link, useNavigate } from 'react-router-dom';
import IconProfile from '../../assets/profile_icon.svg';
import IngredientsIcon from '../../assets/ingredients_icon.svg';
import HeartIcon from '../../assets/heart_icon_black.svg';
import CartIcon from '../../assets/cart_icon.svg';
import Navbar from '../../components/Navbar.jsx';
import axios from 'axios';
import Logo from '../../assets/logo.svg';

export default function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // On stocke le token et les infos utilisateur
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Pour chaque requête vers le backend, on met le token dans le header
    axios.defaults.headers['authentication'] = null;

    navigate('/');
  };

  let user;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch {
    handleLogout();
  }

  return (
    <>
      <div className="p-4 min-h-screen flex justify-center">
        <div className="text-center">
          <img src={Logo} alt="Keskon Mange Logo" className="mx-auto mb-8" />

          <div className="mb-8 flex flex-row items-center gap-4">
            <img src={IconProfile} alt="Icône de profil" className="" />
            <h2> {user.username} </h2>
          </div>

          <Link to="/profile/inventory" className="link">
            <div className="mb-4 border-2 border-(--light-grey-color) rounded-lg p-3 flex flex-row items-center gap-4">
              <img src={IngredientsIcon}></img>
              <h2> Mes ingrédients </h2>
            </div>
          </Link>

          <Link to="/profile/inventory" className="link">
            <div className="mb-4 border-2 border-(--light-grey-color) rounded-lg p-3 flex flex-row items-center gap-4">
              <img src={HeartIcon}></img>
              <h2> Mes recettes favorites </h2>
            </div>
          </Link>

          <Link to="/profile/inventory" className="link">
            <div className="mb-6 border-2 border-(--light-grey-color) rounded-lg p-3 flex flex-row items-center gap-4">
              <img src={CartIcon}></img>
              <h2> Mes ingrédients à racheter </h2>
            </div>
          </Link>

          <button onClick={handleLogout}>Déconnexion</button>
        </div>
      </div>
      <Navbar />
    </>
  );
}
