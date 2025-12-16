import Logo from '../../assets/logo.svg'
import {Link} from "react-router-dom";

export default function Login() {
  return (
    <>
        <div>
            <img src={Logo} alt="Keskon Mange Logo" className='m-auto my-8'/>
            <h1>Connecter un compte</h1>

            <div className='my-2 space-y-2'>
                <input type="text" className="input max-w-fit" placeholder="Adresse e-mail" />
                <input type="password" className="input max-w-fit" placeholder="Mot de passe" />
            </div>

            <button><Link to="/home" className="link">Se connecter</Link></button>

            <p>Vous n'avez pas de compte ? <Link to="/register" className="link">Inscrivez-vous</Link></p>
        </div>
    </>
  )
}
