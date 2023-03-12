import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { FEED_PROFILES } from "../../graphql/feedProfiles";
import "../Profiles/profileStyles.css"
import dp from "../../images/ls1.png";
import cp from "../../images/cv.jpg";
import moment from 'moment';
import { GET_PUBLICATIONS } from "../../graphql/getPublications";
import { MediaRenderer } from "@thirdweb-dev/react";
import { Link } from "react-router-dom";
import { AddReaction } from "../../components/PostInteractions/addReaction";
import { Collect } from "../../components/PostInteractions/collect";
import { Mirror } from "../../components/PostInteractions/mirror";
import {TailSpin} from 'react-loader-spinner';
import { toast } from "react-toastify"; 

export default function MyProfileMirrors(){
    const {myMirrors} = useParams();

    const {data:p_data,loading:p_loading,error:p_error} = useQuery(FEED_PROFILES,{
        variables:{
          request:{
            handle:  myMirrors
          },
        },
    })    

    const {data:po_data,loading:po_loading,error:po_error} = useQuery(GET_PUBLICATIONS,{
        variables:{
          request:{
            profileId: p_data?.profile?.id,
            publicationTypes: ["MIRROR"],
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
        toast.info("Some error occured.",{
        position:toast.POSITION.TOP_CENTER
        }) 
      };
      
      if (po_loading) {
        return(
          <div className="spinner">
            <TailSpin height={150}></TailSpin>
          </div>
      )
    }
      if (po_error){
        toast.info("Some error occured.",{
        position:toast.POSITION.TOP_CENTER
        }) 
      };

    return(
        <div className="profilePage">
          
            {
            (() => {
              if (p_data.profile.coverPicture?.original?.url)
                if(p_data.profile.coverPicture?.original?.url.startsWith('ipfs'))
                    return <img className="feedImage"
                            src={
                            `http://lens.infura-ipfs.io/ipfs/${p_data.profile.coverPicture.original.url.substring(7,
                            p_data.profile.coverPicture?.original?.url.length)}`
                            }
                            alt= {p_data.profile.name||p_data.profile.handle}
                            />
                else
                    return  <img
                          src = {p_data.profile.coverPicture?.original?.url}
                          alt = {p_data.profile.name||p_data.profile.handle}
                          className="banner"
                          />
              else 
                return  <img
                        src = {cp}
                        alt = {p_data.profile.name||p_data.profile.handle}
                        className="banner"
                        />
            })()
          }
      <div className="profile">
        <div className="profileLeft">
        {
          (() => {
            if (p_data.profile?.picture?.original?.url)
              if (p_data.profile.picture?.original?.url.endsWith('ghostplan') || 
                p_data.profile.picture?.original?.url.endsWith('test.com'))
                  return  <MediaRenderer
                            src = {dp}
                            alt = {p_data.profile.handle}
                            className="profileImg"
                            />
              else 
                  return  <MediaRenderer
                            src = {p_data.profile.picture.original.url}
                            alt = {p_data.profile.handle}
                                  className="profileImg"
                          />
            else if(p_data.profile.picture===null)
              return  <MediaRenderer
                        src = {dp}
                        alt = {p_data.profile.handle}
                        className="profileImg"
                        />
          })()
        }

        <div className="info">
            <div className="pname">{p_data.profile.name || "Anonymous User"}</div>
            <div className="phandle">{p_data.profile.handle|| ""}</div>
            <div className="pbio">{p_data.profile.bio || "anonymous"}</div>
            <div className = "attr">
            {p_data.profile.attributes?.map((itm)=>(
              <>
              <div className = "additional">
                <div>{itm.key}:</div>
                <div>{itm.value}</div>
              </div>
              </> 
            ))}
          </div>
            <div className="follow">
              <div>Followers:</div>
              <div>{p_data.profile.stats.totalFollowers}</div>
            </div>
            <div className="follow">
              <div>Following:</div>
              <div>{p_data.profile.stats.totalFollowing}</div>
            </div>
            <div className = "editBtn">
              <button> <Link to= {`/edit/${p_data.profile.id}`}>Edit Your Profile</Link></button>
            </div>
          </div>
        </div>
        <div className="profileRight">
          <div className="postsType">
            <div className="tab">
                <Link to = "/myProfile" >My Posts</Link>
                <Link to={`/myProfile/nfts/${myMirrors}`} >My Nfts</Link>
                <Link to = {`/myProfile/mirrors/${myMirrors}`}>My Mirrors</Link>
                <Link to = {`/post/${p_data.profile.id}`}>New post</Link>
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
                    if (publication.mirrorOf.profile.picture?.original?.url)
                        if (publication.mirrorOf.profile.picture.original.url.endsWith('ghostplan') || 
                            publication.mirrorOf.profile.picture.original.url.endsWith('test.com'))
                            return  <MediaRenderer
                                    src = {dp}
                                    alt = {publication.mirrorOf.profile.name || publication.mirrorOf.profile.handle}
                                    className="feedPostProfilePicture"
                                    />
                        else 
                            return  <MediaRenderer
                                    src = {publication?.mirrorOf?.profile?.picture?.original?.url || ""}
                                    alt = {publication.mirrorOf.profile.name || publication.mirrorOf.profile.handle}
                                    className="feedPostProfilePicture"
                                    />
                    if(publication.mirrorOf.profile.picture===null)
                        return  <MediaRenderer
                                src = {dp}
                                alt = {publication.mirrorOf.profile.name || publication.mirrorOf.profile.handle}
                                className="feedPostProfilePicture"
                                />
                    })()
                    }
                <div className="pos">posted by </div>
                <div className="name">
                    <Link to = {`/profile/${publication.mirrorOf.profile.handle}`}>{publication.mirrorOf.profile.handle}</Link>
                </div>
                <div className="updated">
                    <p> about {moment(publication.mirrorOf.createdAt).fromNow()}</p>
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
                                    if(publication.metadata.media[0].original.mimeType.startsWith('image'))
                                        return <img className="feedImage"
                                                src={
                                                    publication.metadata.image ||
                                                    publication.metadata.media[0].original.url
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
                                
                    })()
                }                
                </div>

                <div className="feedPostFooter">
                    <p><AddReaction id = {publication.id}/>{publication.stats.totalUpvotes}</p>
                    <p><Collect id = {publication.id}/>{publication.stats.totalAmountOfCollects}</p>
                    <p><Mirror id = {publication.id}/>{publication.stats.totalAmountOfMirrors}</p>
                </div>
            </div>
            </>
            ))}
          </>
            :
          <div  className="notfound"><h2>You have not mirrored anything yet.</h2></div>
          }
        </div>
        </div>
      </div>
    </div>
    );
}