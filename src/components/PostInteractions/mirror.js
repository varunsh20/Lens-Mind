import { MIRROR } from "../../graphql/postInteraction/mirror";
import { client } from "../../graphql/setDefault";
import {useSDK,useAddress} from "@thirdweb-dev/react";
import {signTypedDataWithOmmittedTypename,splitSignature} from "../../lib/helpers";
import { LENS_CONTRACT_ABI, LENS_CONTRACT_ADDRESS } from "../../const/Contracts";
import { useEffect } from "react";
import { GET_PROFILES_BY_ADDRESS } from "../../graphql/getProfiles";
import {useMutation} from "@apollo/client";
import { toast} from 'react-toastify';
import "./interactionStyles.css"

export function Mirror({id}) {

    const address = useAddress();
    const sdk = useSDK();

    useEffect(()=>{
        async function mirror(){
            if(data){
            console.log(id);
      
            const result = data.createMirrorTypedData;
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
            const tx = await lensHubContract.call("mirrorWithSig",{
                profileId: typedData.value.profileId,
                profileIdPointed: typedData.value.profileIdPointed,
                pubIdPointed: typedData.value.pubIdPointed,
                referenceModuleData: typedData.value.referenceModuleData,
                referenceModule: typedData.value.referenceModule,
                referenceModuleInitData: typedData.value.referenceModuleInitData,
                sig: {
                v,
                r,
                s,
                deadline: typedData.value.deadline,
                },
            });
            toast.info("Post Mirrored Successfully.",{
                position:toast.POSITION.TOP_CENTER
               })
        }
        else{
            console.log("no data");
        }
    }
    mirror();   
    })

    const [mirrorPost, { data, loading, error }] = useMutation(
        MIRROR,
        {
          onCompleted: () => {
            console.log("Mirrored");
          },

          onError: (error) => {
            console.log("mirror error", error);
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

    async function handleMirror(){
        if (!address) {
            toast.info("You need to sign in first to interact with any post.",{
             position:toast.POSITION.TOP_CENTER
            })
        };

        const response = await client.query({query:GET_PROFILES_BY_ADDRESS,
            variables:{
                request:{ownedBy:[address]},
            }})
        const Pid = response.data.profiles?.items[0].id;

        await mirrorPost({
            variables: {
                request:{
                    profileId:Pid,
                    publicationId: id,
                    referenceModule: {
                        followerOnlyReferenceModule: false,
                    },
                }
            }})
        }

    return(
        <div className = "intBtn">
            <button onClick = {()=>{handleMirror()}}><i className="fa-solid fa-retweet"></i></button>
        </div>
    );
}