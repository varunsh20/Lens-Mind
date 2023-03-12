import { useState,useEffect} from "react";
import { useParams } from "react-router-dom";
import { CREATE_POST } from "../graphql/createPost";
import { useSDK} from "@thirdweb-dev/react";
import { useMutation} from "@apollo/client";
import {signTypedDataWithOmmittedTypename,splitSignature} from "../lib/helpers";
import { LENS_CONTRACT_ABI, LENS_CONTRACT_ADDRESS } from "../const/Contracts";
import { uploadIpfs } from "../ipfs";
import { toast} from 'react-toastify';
import { v4 as uuidv4 } from "uuid";
import { TailSpin } from "react-loader-spinner";

export default function Post(){

  const {id} = useParams();
  const sdk = useSDK();

  const [formInput, setFormInput] = useState({
        title:"",
        description:"",
        content:"",
        media:null,
      });

      useEffect(()=>{
        async function post(){
          if(data){ 
          const result = data.createPostTypedData;
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
          // Destructure the stuff we need out of the typedData.value field
          const {
            collectModule,
            collectModuleInitData,
            contentURI,
            deadline,
            profileId,
            referenceModule,
            referenceModuleInitData,
            } = typedData.value;
            // Call the smart contract function called "followWithSig"
          const tx = await lensHubContract.call("postWithSig",{
            profileId: profileId,
            contentURI: contentURI,
            collectModule,
            collectModuleInitData,
            referenceModule,
            referenceModuleInitData,
            sig: {
              v,
              r,
              s,
              deadline: deadline,
            },
          });
          toast.info("Post Created Successfully.",{
            position:toast.POSITION.TOP_CENTER
           })
      }
    else{
        console.log("no data");
    }
    }
    post();
})

    const UploadMedia = async()=>{
        const fileInput = document.getElementById('media');
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
        media: url
      })
    }

    const postMetadata = (
      JSON.stringify({
      version: "2.0.0",
      mainContentFocus: "Image",
      metadata_id: uuidv4(),
      description: formInput.description,
      locale: "en-US",
      content: formInput.content,
      external_url: formInput.media,
      image: formInput.media,
      imageMimeType: null,
      name: formInput.title,
      attributes: [],
      media:[{item:formInput.media}],
      tags: [],
    })
    );

    async function uploadMetadata(){
      const pt = await uploadIpfs(postMetadata);
      const url = `https://lens.infura-ipfs.io/ipfs/${pt}`;
      return url;
    }
      
      const [createPostTypedData, {data,loading,error}] = useMutation(
        CREATE_POST,
        {
          onCompleted: () => {
            console.log("post created");
          },

          onError: (error) => {
            console.log("post error", error);
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
        toast.info(<div>Submission error "{error.message}".</div>,{
          position:toast.POSITION.TOP_CENTER
        }) 
      }


      async function HandlePost(){    
        if (formInput.title==="") {
          toast.warn("Title Field is Empty!!",{
            position:toast.POSITION.TOP_CENTER
          })
        }
        else if (formInput.description==="") {
          toast.warn("Description Field is Empty!!",{
            position:toast.POSITION.TOP_CENTER
          })
        }
        else if (formInput.content==="") {
          toast.warn("Content Field is Empty!!",{
            position:toast.POSITION.TOP_CENTER
          })
        }
        else if (!formInput.media) {
          toast.warn("Please include some media for your post.",{
            position:toast.POSITION.TOP_CENTER
          })
        }
        else{
          const postMetadataIpfsUrl = await uploadMetadata();
          console.log("postMetadataIpfsUrl", postMetadataIpfsUrl);
          await createPostTypedData({
            variables: {
              request: {
                profileId: id,
                contentURI:  postMetadataIpfsUrl,
                collectModule: {
                  freeCollectModule: {
                  followerOnly: false,
                },
                },
                referenceModule: {
                  followerOnlyReferenceModule: false,
                },
              },
            },
        });
      }
    }
    return(
        <div className="box">
             <div className="publishform">
                <div className="name-div">
                    <p>Title</p>
                <input name="title" onChange={
                    (prop) => setFormInput({
                        ...formInput,
                        title: prop.target.value
                    })
                    } placeholder="Title" required/>
                </div>
              <div className="name-div">
                <p>Description</p>
                <input name="bio" onChange={
                    (prop) => setFormInput({
                      ...formInput,
                      description: prop.target.value
                    })
                  } placeholder="Description" required/>
              </div>
              <div className="name-div">
                <p>Content</p>
                <input name="content" onChange={
                    (prop) => setFormInput({
                      ...formInput,
                      content: prop.target.value
                    })
                  } placeholder="Content" required/>
              </div>
            <div className="Upload">
            <div className="cover-div">
                <p>Media</p>
                <div className="dotted-div">
                  <div className="top">
                    <input className="uploadCover" type="file" id="media" onChange={UploadMedia} />
                  </div>
                </div>
              </div>
            </div>
            <div className="btn">
              <button className="submit" onClick={HandlePost}>Submit</button>
            </div>
        </div>
        </div>
    );
}