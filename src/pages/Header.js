import Authentication from "../components/Login.js";
import "./headers.css";
import { ConnectWallet } from "@thirdweb-dev/react";
import {ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import logo from "../images/My project.png";
import {Link} from "react-router-dom";
export default function Header(){

    return(
        <div className="container">
                <div className="logo">
                    <img src={logo} alt="logo"/>
                </div>
                <div className="cnt">
                    <ConnectWallet/>
                </div>
                <div className="menu">
                <div className="im">
                    <Link to='/home'>Home</Link>
                </div>
                <div className="im">
                    <Link to={`/posts/${"LATEST"}`}>Explore</Link>
                </div>
             
                <div className="im">
                    <Link to='/about'>About Us</Link>
                </div>

                </div>
                <div className="signIn">
                    <Authentication/>
                </div>
                <ToastContainer/>
        </div>
    )
}
