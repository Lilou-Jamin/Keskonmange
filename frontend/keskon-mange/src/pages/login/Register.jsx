import Logo from '../../assets/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { backendBaseUrl } from '../../utils.js';
import EyeOpen from '../../assets/eye-open.svg';
import EyeClosed from '../../assets/eye-closed.svg';

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);

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

      // Une fois l'inscription complète, il faut encore que l'utilisateur se login
      navigate('/login');
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
              placeholder="E-mail"
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
