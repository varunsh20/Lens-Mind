import { useQuery } from "@apollo/client";
import "./myProfileStyles.css";
import dp from "../../images/ls1.png";
import cp from "../../images/cv.jpg";
import moment from 'moment';
import { GET_PUBLICATIONS } from "../../graphql/getPublications";
import { GET_PROFILES_BY_ADDRESS } from "../../graphql/getProfiles";
import {useAddress,MediaRenderer} from "@thirdweb-dev/react";
import { AddReaction } from "../../components/PostInteractions/addReaction";
import { Collect } from "../../components/PostInteractions/collect";
import { Mirror } from "../../components/PostInteractions/mirror";
import { Link } from "react-router-dom";
import {TailSpin} from 'react-loader-spinner';

export default function MyProfile(){

  const address = useAddress();

    const {data:p_data,loading:p_loading,error:p_error} = useQuery(GET_PROFILES_BY_ADDRESS,{
        variables:{
          request:{ownedBy:[address]},
        },
      });

    const {data:po_data,loading:po_loading,error:po_error} = useQuery(GET_PUBLICATIONS,{
        variables:{
          request:{
            profileId: p_data?.profiles?.items[0].id,
            publicationTypes: ["POST"],
            limit: 25
          },
        },
      })
    if (p_loading){
      return(
        <div className="spinner">
          <TailSpin height={150}></TailSpin>
        </div>
      )
    }
    if (p_error){
      console.log("error");
    }
    console.log(p_data);

    if (po_loading){
      return(
        <div className="spinner">
          <TailSpin height={150}></TailSpin>
        </div>
      )
    }
    if (po_error){
      console.log("error");
    }

    return(
      <div className="myprofilePage">
        
          {
          (() => {
            if (p_data?.profiles?.items[0].coverPicture?.original?.url)
              if(p_data?.profiles?.items[0].coverPicture?.original?.url.startsWith('ipfs'))
                  return <img className="myfeedImage"
                          src={
                          `http://lens.infura-ipfs.io/ipfs/${p_data?.profiles?.items[0].coverPicture?.original?.url.substring(7,
                          p_data?.profiles?.items[0].coverPicture?.original?.url.length)}`
                          }
                          alt= {p_data.profiles?.items[0].name ||p_data.profiles?.items[0].handle}
                          />
              else
                  return  <img
                        src = {p_data.profiles?.items[0].coverPicture?.original?.url}
                        alt = {p_data.profiles?.items[0].name ||p_data.profiles?.items[0].handle}
                        className="mybanner"
                        />
            else 
              return  (
              <div className="edit">
                <img
                      src = {cp}
                      alt = {p_data?.profiles?.items[0].name ||p_data?.profiles?.items[0].handle }
                      className="mybanner"
                />
              </div>)
          })()
        }
    <div className="myprofile">
      <div className="myprofileLeft">
      {
        (() => {
          if (p_data?.profiles?.items[0].picture?.original?.url)
            if (p_data?.profiles?.items[0].picture?.original?.url.endsWith('ghostplan') || 
              p_data?.profiles?.items[0].picture?.original?.url.endsWith('test.com'))
                return  <MediaRenderer
                          src = {dp}
                          alt = {p_data.profiles?.items[0].handle}
                          className="myprofileImg"
                          />
            else 
                return  <MediaRenderer
                          src = {p_data.profiles?.items[0].picture.original.url}
                          alt = {p_data.profiles?.items[0].handle}
                                className="myprofileImg"
                        />
          else if(p_data?.profiles.items[0].picture===null)
            return  <MediaRenderer
                      src = {dp}
                      alt = {p_data.profiles?.items[0].handle}
                      className="myprofileImg"
                      />
        })()
      }

      <div className="myinfo">
          <div className="mypname">{p_data?.profiles?.items[0].name || "Anonymous User"}</div>
          <div className="myphandle">{p_data?.profiles?.items[0].handle|| ""}</div>
          <div className="mypbio">{p_data?.profiles?.items[0].bio|| "anonymous"}</div>
          <div className = "attr">
            {p_data?.profiles?.items[0].attributes?.map((itm)=>(
              <>
              <div className = "additional">
                <div>{itm.key}:</div>
                <div>{itm.value}</div>
              </div>
              </> 
            ))}
          </div>
          <div className="myfollow">
            <div>Followers:</div>
            <div>{p_data?.profiles.items[0].stats.totalFollowers}</div>
          </div>
          <div className="myfollow">
            <div>Following:</div>
            <div>{p_data?.profiles.items[0].stats.totalFollowing}</div>
          </div>
          <div className = "editBtn">
            <button> <Link to= {`/edit/${p_data?.profiles.items[0].id}`}>Edit Your Profile</Link></button>
          </div>
        </div>
      </div>
      <div className="myprofileRight">
        <div className="mypostsType">
          <div className="mytab">
            <Link to = "/myProfile" >My Posts</Link>
            <Link to={`/myProfile/nfts/${p_data?.profiles.items[0].handle}`}>My Nfts</Link>
            <Link to = {`/myProfile/mirrors/${p_data?.profiles.items[0].handle}`}>My Mirrors</Link>
            <Link to = {`/post/${p_data?.profiles.items[0].id}`}>New post</Link>
            <Link to = "/conference">Meeting Room</Link>
          </div>
        </div>
        <div className="content">
          {po_data.publications.items.length>0?
          <>
            {po_data.publications.items.map((publication) =>(
                <>
                <div className="card">
                <div className="feedPostHeader">
                    {
                    (() => {
                    if (publication.profile.picture?.original?.url)
                        if (publication.profile.picture.original.url.endsWith('ghostplan') || 
                            publication.profile.picture.original.url.endsWith('test.com'))
                            return  <MediaRenderer
                                    src = {dp}
                                    alt = {publication.profile.name || publication.profile.handle}
                                    className="feedPostProfilePicture"
                                    />
                        else 
                            return  <MediaRenderer
                                    src = {publication?.profile?.picture?.original?.url || ""}
                                    alt = {publication.profile.name || publication.profile.handle}
                                    className="feedPostProfilePicture"
                                    />
                    if(publication.profile.picture===null)
                        return  <MediaRenderer
                                src = {dp}
                                alt = {publication.profile.name || publication.profile.handle}
                                className="feedPostProfilePicture"
                                />
                    })()
                    }
                <div className="pos">posted by </div>
                <div className="name">
                    <Link to = {`/profile/${publication.profile.handle}`}>{publication.profile.handle}</Link>
                </div>
                <div className="updated">
                    <p> about {moment(publication.createdAt).fromNow()}</p>
                </div>
                </div>
                <div className="feed">
                    <h4 className="feedTitle">{publication.metadata.content}
                </h4>
                {
                    (() => {
                            if (publication?.metadata?.image ||
                                publication?.metadata?.media[0]?.original.url)
                                if (publication.metadata.media[0].original.url.startsWith('ipfs://'))
                                    if(publication.metadata.media[0].original.mimeType.startsWith('image'))
                                        return <img className="feedImage"
                                                src={
                                                    `http://lens.infura-ipfs.io/ipfs/${publication.metadata.media[0].original.url.substring(7,
                                                    publication.metadata.media[0].original.url.length)}`
                                                }
                                                alt={publication.metadata.name || ""}
                                                />
                                    else if(publication.metadata.media[0].original.mimeType.startsWith('video'))
                                        return <MediaRenderer
                                                src={
                                                publication.metadata.image ||
                                                publication.metadata?.media[0]?.original.url
                                                }
                                                alt={publication.metadata.name || ""}
                                                type="video/mp4"
                                                className="feedImage"
                                                />
                                    else 
                                            return <MediaRenderer
                                                src={
                                                publication.metadata.image ||
                                                publication.metadata?.media[0]?.original.url
                                                }
                                                alt={publication.metadata.name || ""}
                                                className="feedImage"
                                                />
                                else 
                                    if(publication.metadata.media[0].original.mimeType?.startsWith('image'))
                                        return <img className="feedImage"
                                                src={
                                                    publication.metadata.image ||
                                                    publication.metadata.media[0].original.url
                                                }
                                                alt={publication.metadata.name || ""}
                                                />
                                    else if(publication.metadata.media[0].original.mimeType?.startsWith('video'))
                                        return <MediaRenderer
                                                src={
                                                publication.metadata.image ||
                                                publication.metadata?.media[0]?.original.url
                                                }
                                                alt={publication.metadata.name || ""}
                                                type="video/mp4"
                                                className="feedImage"
                                                />
                                    else 
                                        return <MediaRenderer
                                                src={
                                                publication.metadata.image ||
                                                publication.metadata?.media[0]?.original.url
                                                }
                                                alt={publication.metadata.name || ""}
                                                className="feedImage"
                                                />
                                
                    })()
                }                
                </div>
                <div className="feedPostFooter">
                    <p><AddReaction id = {publication.id}/>{publication.stats.totalUpvotes}</p>
                    <p><Collect id = {publication.id}/>{publication.stats.totalAmountOfCollects}</p>
                    {/*<p><i className="fa-regular fa-comment"></i>  {publication.stats.totalAmountOfComments}</p>*/}
                    <p><Mirror id = {publication.id}/>{publication.stats.totalAmountOfMirrors}</p>
                </div>
            </div>
            </>
            ))}
          </>
            :
          <div className="notfound"><h2>You have no posts yet.</h2></div>
          }
        </div>
      </div>  
      </div>
      </div>
    );
}