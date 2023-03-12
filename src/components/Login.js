import React from "react";
import {useAddress,MediaRenderer,useSDK} from "@thirdweb-dev/react";
import {generateChallenge, authenticate} from "../graphql/auth/auth.js";
import { setAuthenticationToken} from "../graphql/auth/store.js";
import { useQuery } from "@apollo/client";
import { GET_PROFILES_BY_ADDRESS } from "../graphql/getProfiles";
import { useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { Link } from "react-router-dom";
import "./loginStyle.css";

export default function Authentication(){
    const address = useAddress();
    const sdk = useSDK();
    const [auth,setAuth] = useState(false);

  const handleLogin = async () => {
    if (!address) {
      toast.info("Please Connect Your Wallet!!",{
        position:toast.POSITION.TOP_CENTER
      })
    };
     // 1. Generate challenge which comes from the Lens API
    const challenge = await generateChallenge(address);
    if (!challenge) return;
    // 2. Sign the challenge with the user's wallet
    const signature = await sdk?.wallet.sign(challenge.data.challenge.text);
     // 3. Send the signed challenge to the Lens API
    const accessTokens = await authenticate(address, signature);
    await setAuthenticationToken({ token: accessTokens.data.authenticate });
    console.log(accessTokens.data.authenticate);
    setAuth(true);
  };


  const {loading,error,data} = useQuery(GET_PROFILES_BY_ADDRESS,{
    variables:{
      request:{ownedBy:[address]},
    },
  });
  if(auth===false){
    return(<button className="signInbtn" onClick={()=>handleLogin()}><p>Sign In With Lens</p></button>);
  }

  // Loading their profile information
  if (loading) {
    return (<div>Loading...</div>);
  }

  if(error){
    toast.info(<div>Submission error "{error.message}".</div>,{
    position:toast.POSITION.TOP_CENTER
    }) 
  }
  
  if(data.profiles.items.length===0 && loading===false){
    toast.info("You don't have any profile yet.",{
      position:toast.POSITION.TOP_CENTER
    })
    return(<button className="signInbtn"><p><Link to ='/create'>Create Your Profile</Link></p></button>);
  }
  if(data.profiles.items.length>0){
    return(
      <div className="uprofile">
        <MediaRenderer
        src={data?.profiles?.items[0].picture?.original?.url || ""}
        alt={data?.profiles?.items[0].handleLogin  ||""}
        style={{
          cursor:"pointer",
          width: 40,
          height: 40,
          borderRadius: "50%",
        }}
        />
        <Link to = '/myProfile'><p>Hello {data.profiles?.items[0].name || data.profiles?.items[0].handle} !!</p></Link>
      </div>
    );
  }
  return (
    <>
    <div>Something Went Wrong...</div>
    <ToastContainer/>
    </>
  );
};