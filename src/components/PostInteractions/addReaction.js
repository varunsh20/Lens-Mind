import {ADD_REACTION} from "../../graphql/postInteraction/addReaction";
import { client } from "../../graphql/setDefault";
import { useAddress } from "@thirdweb-dev/react";
import { GET_PROFILES_BY_ADDRESS } from "../../graphql/getProfiles";
import { useQuery,useMutation} from "@apollo/client";
import { toast, ToastContainer } from 'react-toastify';
import "./interactionStyles.css";

export function AddReaction({id}){

  const address = useAddress();

    const [likePost, { data, loading, error }] = useMutation(
        ADD_REACTION,
        {
          onCompleted: () => {
            toast.info("You Liked This Post.",{
              position:toast.POSITION.TOP_CENTER
             })
          },

          onError: (error) => {
            console.log("Like error", error);
          },
        }
      );
      console.log(data);
      if (loading){
        console.log("Processing");
      }
      if (error) {
        toast.info(<div>"{error.message}".</div>,{
         position:toast.POSITION.TOP_CENTER
        })
    };


    async function handleLike(){
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

        await likePost({
            variables: {
                request:{
                    profileId:Pid,
                    reaction: "UPVOTE",
                    publicationId: id,
                }
            }})
    }
    return(
      <div className = "intBtn"> 
        <button onClick={()=>{handleLike()}}> <i className="fa-sharp fa-regular fa-heart"></i> </button>
      </div>
    );
}