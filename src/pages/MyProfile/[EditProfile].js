import "./editProfileStyles.css";
import { useSDK} from "@thirdweb-dev/react";
import { useState,useEffect} from "react";
import { useParams } from "react-router-dom";
import {SET_PROFILE_METADATA} from "../../graphql/setProfileMetaData";
import {signTypedDataWithOmmittedTypename,splitSignature} from "../../lib/helpers";
import { LENS_PERIPHERY_ABI,LENS_PERIPHERY_ADDRESS} from "../../const/Lens_Periphery";
import { uploadIpfs } from "../../ipfs";
import { toast} from 'react-toastify';
import { v4 as uuidv4 } from "uuid";
import {TailSpin} from 'react-loader-spinner';
import { useMutation } from "@apollo/client";

export default function EditProfile() {

    const {id} = useParams();
    const sdk = useSDK();

    const [formInput, setFormInput] = useState({
        name:"",
        bio:"",
        location:"",
        twitter:"",
        coverImage:null,
      });

      useEffect(()=>{
        async function details(){
          if(data){ 
          const result = data.createSetProfileMetadataTypedData;
          const typedData = result.typedData;
          if (!sdk) return;
          //Sign the typed data using the SDK
          const signature = await signTypedDataWithOmmittedTypename(sdk,typedData.domain, typedData.types, typedData.value)
          const { v, r, s } = splitSignature(signature.signature);
          //Send the typed data to the smart contract to perform the
          // write operation on the blockchain
          const lensPeripheryContract = await sdk.getContractFromAbi(
            LENS_PERIPHERY_ADDRESS,
            LENS_PERIPHERY_ABI
          );
          console.log(lensPeripheryContract);
          // Call the smart contract function called "followWithSig"
          const tx = await lensPeripheryContract.call("setProfileMetadataURIWithSig",{
            profileId: typedData.value.profileId,
            metadata: typedData.value.metadata,
            sig: {
              v,
              r,
              s,
              deadline: typedData.value.deadline,
            },
          });
          toast.info("Changes Saved Successfully.",{
            position:toast.POSITION.TOP_CENTER
           })
      }
    else{
        console.log("no data");
    }
    }
    details();
})

      const UploadMedia = async()=>{
        const fileInput = document.getElementById('cover');
        const filePath = fileInput.files[0].name;
        const pt = await uploadIpfs(fileInput.files[0]);
        if(pt){
          toast.success("File Uploaded Successfully.", {
          position: toast.POSITION.TOP_CENTER
        });
      }
        const url = `https://lens.infura-ipfs.io/ipfs/${pt}`;
      setFormInput({
        ...formInput,
        coverImage: url
      })
    }

    const postMetadata = (
      JSON.stringify({
      version: "1.0.0",
      metadata_id: uuidv4(),
      name: formInput.name,
      bio: formInput.bio,
      cover_picture: formInput.coverImage,
      attributes: [{
        key:"Location",
        value:formInput.location
      },
      {
        key:"Website",
        value:formInput.twitter
      }],
    })
    );

    async function uploadMetadata(){
      const pt = await uploadIpfs(postMetadata);
      const url = `https://lens.infura-ipfs.io/ipfs/${pt}`;
      return url;
    }

    const [CreatePublicSetProfileMetadataURIRequest, {data,loading,error}] = useMutation(
        SET_PROFILE_METADATA,
        {
          onCompleted: () => {
            console.log("Successful")
          },

          onError: (error) => {
            console.log("Metadata error.", error);
          },
        }
      );
      if (loading){
        return(
          <div className="spinner">
            <TailSpin height={150}></TailSpin>
          </div>
        )
      }

      if (error){
        toast.info(<div>Submission error "{error.message}".</div>,{
          position:toast.POSITION.TOP_CENTER
        }) 
      };

      async function HandleDetails(){    
        if (formInput.name==="") {
          toast.warn("Name Field is Empty!!",{
            position:toast.POSITION.TOP_CENTER
          })
        }
        else if (formInput.bio==="") {
          toast.warn("Bio Field is Empty!!",{
            position:toast.POSITION.TOP_CENTER
          })
        }
        else if (!formInput.coverImage) {
          toast.warn("Upload Your Cover Image!!",{
            position:toast.POSITION.TOP_CENTER
          })
        }
        else{
          const postMetadataIpfsUrl = await uploadMetadata();
          console.log("postMetadataIpfsUrl", postMetadataIpfsUrl);
          await CreatePublicSetProfileMetadataURIRequest({
            variables: {
              request: {
              profileId: id,
              metadata:  postMetadataIpfsUrl,
            },
            },
          });
        }
      }

    return(
            <div className="box">
             <div className="publishform">
                <div className="name-div">
                    <p>Name</p>
                <input name="name" onChange={
                    (prop) => setFormInput({
                        ...formInput,
                        name: prop.target.value
                    })
                    } placeholder="Name" required/>
                </div>
              <div className="name-div">
                <p>Bio</p>
                <input name="bio" onChange={
                    (prop) => setFormInput({
                      ...formInput,
                      bio: prop.target.value
                    })
                  } placeholder="Bio" required/>
              </div>
              <div className="name-div">
                <p>Location</p>
                <input name="location" onChange={
                    (prop) => setFormInput({
                      ...formInput,
                      location: prop.target.value
                    })
                  } placeholder="Location" required/>
              </div>
              <div className="name-div">
                <p>Twitter/Website</p>
                <input name="twitter" onChange={
                  (prop) => setFormInput({
                      ...formInput,
                      twitter: prop.target.value
                    })
                  } placeholder="Twitter" required/>
              </div>
            <div className="Upload">
            <div className="cover-div">
                <p>Cover Image</p>
                <div className="dotted-div">
                  <div className="top">
                    <input className="uploadCover" type="file" id="cover" onChange={UploadMedia}/>
                  </div>
                </div>
              </div>
            </div>
            <div className="btn">
              <button className="submit" onClick={HandleDetails}>Submit</button>
            </div>
        </div>
        </div>
    );
}