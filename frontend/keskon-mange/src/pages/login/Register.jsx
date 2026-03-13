import Logo from '../../assets/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { backendBaseUrl } from '../../utils.js';

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Email et mot de passe requis.');
      return;
    }

    try {
      const res = await fetch(`${backendBaseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(payload?.message ?? 'Inscription impossible.');
        return;
      }

      // on stocke le token
      localStorage.setItem('token', payload.token);

      navigate('/home');
    } catch (err) {
      console.error(err);
      setError('Erreur veuillez réessayer');
    }
  }
  return (
    <>
      <div className="p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <img src={Logo} alt="Keskon Mange Logo" className="m-auto mb-8" />
          <h1>Créer un compte</h1>

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
              type="text"
              name="username"
              className="input max-w-fit"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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

            <button type="submit">S'inscrire</button>
          </form>

          <p>
            Vous avez déjà un compte ?{' '}
            <Link to="/login" className="link">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
