import Logo from '../../assets/logo.svg'
import {Link} from "react-router-dom";

export default function Register() {
  return (
    <>
        <div>
            <img src={Logo} alt="Keskon Mange Logo" className='m-auto my-8' />
            <h1>Créer un compte</h1>

            <div className='my-2 space-y-2'>
                <input type="text" className="input max-w-fit" placeholder="Adresse e-mail" />
                <input type="text" className="input max-w-fit" placeholder="Nom d'utilisateur" />
                <input type="password" className="input max-w-fit" placeholder="Mot de passe" />
            </div>

            <button><Link to="/home" className="link">S'inscrire</Link></button>

            <p>Vous avez déjà un compte ? <Link to="/login" className="link">Se connecter</Link></p>
        </div>
    </>
  )
}
