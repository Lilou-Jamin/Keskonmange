import Logo from '../../assets/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { backendBaseUrl } from '../../utils.js';
import IconProfile from '../../assets/profile_icon.svg';
import IconIngredients from '../../assets/ingredients_icon.svg';
import IconHeart from '../../assets/heart_icon_black.svg';
import IconCart from '../../assets/cart_icon.svg';

export default function Profile() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(`${backendBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.message ?? 'Connexion impossible');
        return;
      }

      // On stocke le token et les infos utilisateur
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/home');
    } catch (err) {
      console.error(err);
      setError('Erreur veuillez réessayer');
    }
  };

  return (
    <>
      <div className="p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
            <div className="mb-8 flex flex-row items-center gap-4">
                <img src={IconProfile} alt="Icône de profil" className="m-auto mb-8" />
                <h2> Nom - Prénom </h2>
            </div>

            <div className="mb-8 border-2 border-(--light-grey-color) rounded-lg p-4 flex flex-row items-center gap-4">
                <Link to="/register" className="link">
                    <img src=''></img>
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
