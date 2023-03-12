import { Link } from 'react-router-dom';
import { EXPLORE_POSTS } from '../graphql/explorePosts';
import { useQuery } from "@apollo/client";
import moment from 'moment';
import { MediaRenderer } from "@thirdweb-dev/react";
import dp from "../images/ls1.png";
import { AddReaction } from './PostInteractions/addReaction';
import { Mirror } from './PostInteractions/mirror';
import { Collect } from './PostInteractions/collect';
import {TailSpin} from 'react-loader-spinner';
import { toast} from 'react-toastify';

import "./postsStyles.css";

export default function GetPosts()
{
    const { data, loading, error } = useQuery(EXPLORE_POSTS, {
        variables: {
        request: {
            sortCriteria: "LATEST",
            limit: 30,
            publicationTypes: ["POST","MIRROR"]
        },
        },
    });

    if (loading) {
        return(<div className="spinner">
                <TailSpin height={150}></TailSpin>
                </div>
        )
    }
    if (error){
        toast.info("Some error occured.",{
            position:toast.POSITION.TOP_CENTER
        })
    }

    return(
        <div className="content">
            {data.explorePublications.items.map((publication) =>(
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
                    <h4 className="feedTitle">{publication.metadata.content}</h4>
                {
                    (() => {
                            if (publication?.metadata?.image ||
                                publication?.metadata?.media[0]?.original.url)
                                if (publication.metadata.media[0].original.url.startsWith('ipfs://'))
                                    if(publication.metadata.media[0].original.mimeType?.startsWith('image'))
                                        return <img className="feedImage"
                                                src={
                                                    `http://lens.infura-ipfs.io/ipfs/${publication.metadata.media[0].original.url.substring(7,
                                                    publication.metadata.media[0].original.url.length)}`
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
                    <p> <AddReaction id = {publication.id}/>{publication.stats.totalUpvotes}</p>
                    <p> <Collect id = {publication.id}/>{publication.stats.totalAmountOfCollects}</p>
                    <p> <Mirror id = {publication.id}/>{publication.stats.totalAmountOfMirrors}</p>
                </div>
            </div>
            </>
            ))}
        </div>
    );
}