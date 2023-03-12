import { CREATE_PROFILE } from "../../graphql/createProfile";
import { useMutation } from "@apollo/client";
import "./createProfileStyles.css";
import { toast} from 'react-toastify';
import { useState} from "react";
import { uploadIpfs } from "../../ipfs";
import {TailSpin} from 'react-loader-spinner';

export default function CreateProfile() {

    var flag=0;
    const [formInput, setFormInput] = useState({
        handle:"",
        profileImageURI:null,
      });

    //Uploading data to IPFS.
    const pImg = async()=>{
      const fileInput = document.getElementById('profileImage');
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
        profileImageURI: url
      })
  }
      const [createProfile, { data, loading, error }] = useMutation(
        CREATE_PROFILE,
        {
          onCompleted: () => {

            if(flag===1){
                toast.info("Handle Already Taken",{
                  position:toast.POSITION.TOP_CENTER
                }) 
            }
            else if(flag===0){
              toast.info("Profile Created Successfully!",{
                position:toast.POSITION.TOP_CENTER
              })
            }            
          },
          onError: (error) =>{
            toast.info(<div>Submission error "{error.message}".</div>,{
            position:toast.POSITION.TOP_CENTER
            }) 
          }
        }
      );
      const handleCreateProfile = async () => {
        if (formInput.handle==="") {
          toast.info("Enter Your Handle!!",{
            position:toast.POSITION.TOP_CENTER
          })
        }
        else if (!formInput.profileImageURI) {
          toast.info("Upload Your Avatar!!",{
            position:toast.POSITION.TOP_CENTER
          })
        }
        else{
          await createProfile({
            variables: {
              request: {
                handle: formInput.handle , 
                profilePictureUri:formInput.profileImageURI
              },
            },
          });
          if(loading){
            return(
              <div className="spinner">
                <TailSpin height={150}></TailSpin>
              </div>
          )
        }
      };
    }

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

    if(data?.createProfile?.reason==="HANDLE_TAKEN"){
      flag=1;
    }
    if(data?.createProfile?.txHash){
      flag=0;
    }

    return(
      <>
        <div className="box">
             <div className="publishform">
                <div className="name-div">
                    <p>Handle</p>
                <input name="handle" onChange={
                    (prop) => setFormInput({
                        ...formInput,
                        handle: prop.target.value
                    })
                    } placeholder="Handle" required/>
                </div>

                <div className="Upload">
                    <div className="cover-div">
                        <p>Profile Image</p>
                    <div className="dotted-div">
                    <div className="top">
                        <input className="uploadCover" type="file" id="profileImage" onChange={pImg}/>
                    </div>
                    </div>
              </div>
            </div>
            <div className="btn">
              <button className="submit"  onClick={handleCreateProfile}>Submit</button>
            </div>
        </div>
        </div>

        </>
    );
}
