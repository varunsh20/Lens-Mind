import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { FEED_PROFILES } from "../../graphql/feedProfiles";
import "./profileStyles.css"
import dp from "../../images/ls1.png";
import cp from "../../images/cv.jpg";
import { MediaRenderer } from "@thirdweb-dev/react";
import { Link } from "react-router-dom";
import { GET_NFTS } from "../../graphql/getNfts";
import { UseFollow } from "../../components/Follow";
import "./nftStyles.css";
import {TailSpin} from 'react-loader-spinner';
import { toast } from "react-toastify";

export default function ProfileNfts(){
    const {aadr} = useParams();

    const {data:p_data,loading:p_loading,error:p_error} = useQuery(FEED_PROFILES,{
        variables:{
          request:{
            handle:  aadr
          },
        },
    })    

    const {data:po_data,loading:po_loading,error:po_error} = useQuery(GET_NFTS,{
        variables:{
            request:{
            ownerAddress:p_data?.profile?.ownedBy,
            chainIds: [80001],
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
    
    if (po_loading){
      return(
        <div className="spinner">
          <TailSpin height={150}></TailSpin>
        </div>
    )
  }
    if (po_error) {
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
            <UseFollow id={(p_data.profile.id)}/>
          </div>
        </div>
        <div className="profileRight">
          <div className="postsType">
            <div className="tab">
              <Link to = {`/profile/${aadr}`}>Posts</Link>
              <Link to={`/profile/nfts/${aadr}`} > Nfts</Link>
              <Link to = {`/profile/mirrors/${aadr}`}>Mirrors</Link>
            </div>
          </div>
          <div className="content">
          {po_data.nfts.items.length>0?
          <div className="ycards">
            {po_data.nfts.items.map((nft) =>(
            <>
            <div className="cont">
            {
              (() => {   
                if(nft?.originalContent?.uri.startsWith('https://ipfs.io'))
                  return <div className="bgImage">
                          <MediaRenderer className="feedImage"
                            src={
                                `http://lens.infura-ipfs.io/ipfs/${nft.originalContent.uri.substring(21,
                                  nft.originalContent.uri.length)}`
                                }
                            alt={nft.name}
                          />
                          </div>
                else if(nft?.originalContent?.uri.startsWith('ipfs://'))
                  return <div className="bgImage">
                          <img className="feedImage"
                          src={
                          `http://lens.infura-ipfs.io/ipfs/${nft.originalContent.uri.substring(7,
                          nft.originalContent.uri.length)}`
                        }
                        alt={nft.name}
                        />
                      </div>
                else
                  return <div className="bgImage">
                          <img className="coverImg" src={nft?.originalContent?.uri} alt={nft.name}/>
                          </div>
        })()

          }
          <div className="detail">
            <div className="title-div">
            <p>#{nft.tokenId } { nft.name.substring(0,30)}..</p>
            </div>
            <div  className="middle">
              {nft.description?
                <p> {nft.description?.substring(0,90)}..</p>
              :<></>}
            </div>
              <div className="bottom">
              <div className="left">
                <div className="price-text">
                  <p>ErcType</p>
                  <p>{nft.ercType}</p>
                </div>
              </div>
              <div className="right">
                <div className="remaining-text">
                  <p>Symbol</p>
                  <p>{nft.symbol}</p>
                </div>
              </div>
            </div>
            </div>
            </div>
            </>
            ))}
          </div>
            :
          <div  className="notfound"><h2>{p_data.profile.handle} has no Nft's yet.</h2></div>
          }
        </div>
        
        </div>
    </div>
    </div>
    );
}