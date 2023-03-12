import "./exploreStyles.css"
import {Link} from "react-router-dom";

export default function Explore() {
    return(
        <div className="exp">
            <div className="menuI">
                <Link to= {`/posts/${"LATEST"}`}> Latest</Link>
                <Link to= {`/posts/${"TOP_COLLECTED"}`}>Popular</Link>
                <Link to= {`/posts/${"TOP_COMMENTED"}`}>Trending</Link>
            </div>
        </div>
    );
}