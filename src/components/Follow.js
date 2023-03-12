import { FOLLOW_QUERY} from "../graphql/follow";
import { useMutation } from "@apollo/client";
import {useSDK,useAddress} from "@thirdweb-dev/react";
import {signTypedDataWithOmmittedTypename,splitSignature} from "../lib/helpers";
import { toast} from 'react-toastify';
import { LENS_CONTRACT_ABI, LENS_CONTRACT_ADDRESS } from "../const/Contracts";
import {TailSpin} from 'react-loader-spinner';
import { useEffect } from "react";
import "./followStyles.css";

export function UseFollow({id}) {
    const sdk = useSDK();
    const address = useAddress();

    useEffect(()=>{
        async function follow(){
          if(data){
          const result = data.createFollowTypedData;
          const typedData = result.typedData;
          if (!sdk) return;
          //Sign the typed data using the SDK
          const signature = await signTypedDataWithOmmittedTypename(sdk,typedData.domain, typedData.types, typedData.value)
          const { v, r, s } = splitSignature(signature.signature);
          //Send the typed data to the smart contract to perform the
          // write operation on the blockchain
          const lensHubContract = await sdk.getContractFromAbi(
            LENS_CONTRACT_ADDRESS,
            LENS_CONTRACT_ABI
          );
          // Call the smart contract function called "followWithSig"
          const tx = await lensHubContract.call("followWithSig",{
            follower: address,
            profileIds: typedData.value.profileIds,
            datas: typedData.value.datas,
            sig: {
              v,
              r,
              s,
              deadline: typedData.value.deadline,
            },
          });
          toast.info("Following",{
            position:toast.POSITION.TOP_CENTER
          })
      }
      else{
        console.log("no data");   
      }
    }
    follow();
  })
    const [followProfile, { data, loading, error }] = useMutation(
        FOLLOW_QUERY,
        {
          onCompleted: () => {
            console.log("Following");
          },
          onError: (error) => {
            console.log("Error", error);
          },
        }
      );
      console.log(data);
      if (loading){
        return(
          <div className="spinner">
            <TailSpin height={150}></TailSpin>
          </div>
        )
      }
      if (error){
        toast.info(<div>"{error.message}".</div>,{
          position:toast.POSITION.TOP_CENTER
         })
      }
      async function handlefollow(){
        await followProfile({
            variables: {
              request: {
                follow: [
                    {
                      profile: id,
                    },
                  ],
              },
            },
          });
    }
    return(
        <div className = "followBtn">
            <button onClick={async () => await handlefollow()}>Follow</button>
        </div>
        );
}
