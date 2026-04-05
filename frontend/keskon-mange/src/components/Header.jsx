import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import ChevronOrange from '../assets/chevron_left.svg';
import Logo from '../assets/logo.svg';

export default function Header() {
  const navigate = useNavigate();

  return (
    <>
      <nav className="top-0 left-0 right-0 p-4 flex">
        <ul className="flex w-full justify-between items-center">
          <li>
            {/* si l'user a déjà un historique de nav on revient à la page précédente sinon accueil */}
            <button onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/home')} className="flex flex-col items-center p-0 transparent-button">
                <img src={ChevronOrange} alt="Revenir à la page précédente" width={32} />
            </button>
          </li>

          <li>
            <button onClick={() => navigate('/home')} className="flex flex-col items-center transparent-button">
                <img src={Logo} alt="Keskon Mange Logo" className="" />
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
