import { COLLECT } from "../../graphql/postInteraction/collect";
import {useSDK,useAddress} from "@thirdweb-dev/react";
import {signTypedDataWithOmmittedTypename,splitSignature} from "../../lib/helpers";
import { LENS_CONTRACT_ABI, LENS_CONTRACT_ADDRESS } from "../../const/Contracts";
import { useEffect } from "react";
import { useMutation} from "@apollo/client";
import { toast} from 'react-toastify';
import "./interactionStyles.css"

export function Collect({id}) {

    const address = useAddress();
    const sdk = useSDK();

    useEffect(()=>{
        async function collect(){
            if(data){   
            const result = data.createCollectTypedData;
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
            const tx = await lensHubContract.call("collectWithSig",{
                collector: address,
                profileId: typedData.value.profileId,
                pubId: typedData.value.pubId,
                data: typedData.value.data,
                sig: {
                v,
                r,
                s,
                deadline: typedData.value.deadline,
                },
            });
            toast.info("Post Collected Successfully.",{
                position:toast.POSITION.TOP_CENTER
               })
        }
        else{
            console.log("no data");
        }
    }
    collect();   
    })

    const [collectPost, { data, loading, error }] = useMutation(
        COLLECT,
        {
          onCompleted: () => {
            console.log("Collected");
          },

          onError: (error) => {
            console.log("collect error", error);
          },
        }
      );
      if (loading){
        console.log("Processing");
      }
        
        
    if (error) {
        toast.info(<div>"{error.message}".</div>,{
         position:toast.POSITION.TOP_CENTER
        })
    };

    async function handleCollect(){
        if (!address) {
            toast.info("You need to sign in first to interact with any post.",{
             position:toast.POSITION.TOP_CENTER
            })
        };
        await collectPost({
            variables: {
                request:{
                    publicationId: id
                }
            }})
        }

    return(
        <div className = "intBtn">
            <button onClick = {()=>{handleCollect()}}><i className="fa-solid fa-cart-arrow-down"></i></button>
        </div>
    );
}