import Logo from '../../assets/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { backendBaseUrl } from '../../utils.js';
import axios from 'axios';

export default function Login() {
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
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              name="password"
              className="input max-w-fit"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />

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
