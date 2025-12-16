import Logo from '../../assets/logo.svg'
import {Link} from "react-router-dom";

export default function Login() {
  return (
    <>
        <div>
            <img src={Logo} alt="Keskon Mange Logo" />
            <h1>Connecter un compte</h1>

            <input type="text" className="input" placeholder="Adresse e-mail" />
            <input type="password" className="input" placeholder="Mot de passe" />

            <button><Link to="/home" className="link-button">Se connecter</Link></button>

            <p>Vous n'avez pas de compte ? <Link to="/register" className="link">Inscrivez-vous</Link></p>
        </div>
    </>
  )
}
