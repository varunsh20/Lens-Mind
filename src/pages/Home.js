import GetPosts from "../components/GetPosts";
import "./homeStyle.css"
import p from "../images/ko.jpg";
export default function Home() {

    return(
        <div className="home">
        <div class="row">
            <div class="column1">
                <h1>Lens Mind</h1>
                <h2>Discover the power of blockchain technology and experience a new level of 
                  transparency and trust on our decentralized social media app powered by Lens Protocol.</h2>
            </div>
            <div class="column2">
                <img src={p} alt="img" ></img>
            </div>
        </div>
        <GetPosts/>
        </div>
    );
}