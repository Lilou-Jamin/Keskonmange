import Logo from '../../assets/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { backendBaseUrl } from '../../utils.js';
import axios from 'axios';
import EyeOpen from '../../assets/eye-open.svg';
import EyeClosed from '../../assets/eye-closed.svg';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);

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

      // Pour chaque requête vers le backend, on met le token dans le header
      axios.defaults.headers['authentication'] = data.token;

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
          <img src={Logo} alt="Keskon Mange Logo" className="mx-auto mb-8" />
          <h1>Connecter un compte</h1>

          <form onSubmit={handleSubmit} className="flex flex-col items-center my-2 space-y-2">
            <input
              type="email"
              name="email"
              className="input max-w-fit"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="password-input max-w-fit">
              <input
                type={visible ? "text" : "password"}
                placeholder="Mot de passe"
                className="max-w-52.25"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />

              <img
                src={visible ? EyeOpen : EyeClosed}
                alt="Afficher le mot de passe"
                onClick={() => setVisible(!visible)}
                className="cursor-pointer"
                width={20}
              />
            </div>
            <span className="text-xs text-gray-500 text-justify max-w-65">8 caractères minimum, une majuscule, une minuscule, un chiffre et un caractère spécial</span>

            {error && <p className="error-message">{error}</p>}

            <button type="submit">Se connecter</button>
          </form>

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
