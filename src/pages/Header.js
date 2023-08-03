import Authentication from "../components/Login.js";
import {useEffect } from "react";
import "./headers.css";
import { ConnectWallet, ChainId,useNetworkMismatch,useNetwork,useAddress} from "@thirdweb-dev/react";
import {ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import logo from "../images/My project.png";
import {Link} from "react-router-dom";
export default function Header(){

    const addr = useAddress();
    const [, switchNetwork] = useNetwork(); // Switch to desired chain
    const isMismatched = useNetworkMismatch();

    useEffect(() => {
        // Check if the user is connected to the wrong network
        if (isMismatched) {
          switchNetwork(ChainId.Mumbai); 
        }
     }, [addr])

    function reloadPage() {
        window.location.reload(true);
      }
      // Checks for account changes
      
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', reloadPage);
      }

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
