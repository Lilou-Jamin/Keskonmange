import Logo from '../../assets/logo.svg'
import {Link} from "react-router-dom";

export default function Register() {
  return (
    <>
        <div>
            <img src={Logo} alt="Keskon Mange Logo" />
            <h1>Créer un compte</h1>

            <input type="text" className="input" placeholder="Adresse e-mail" />
            <input type="text" className="input" placeholder="Nom d'utilisateur" />
            <input type="password" className="input" placeholder="Mot de passe" />

            <button><Link to="/home" className="link-button">S'inscrire</Link></button>

            <p>Vous avez déjà un compte ? <Link to="/login" className="link">Se connecter</Link></p>
        </div>
    </>
  )
}
