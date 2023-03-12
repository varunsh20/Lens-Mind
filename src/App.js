import './App.css';

import Header from './pages/Header';
import {Routes,Route,BrowserRouter} from "react-router-dom";
import Home from './pages/Home';
import MyProfile from './pages/MyProfile/MyProfile';
import MyProfileNfts from './pages/MyProfile/[myNfts]';
import MyProfileMirrors from './pages/MyProfile/[myMirrors]';
import FeedType from './pages/Explore/[type]';
import Profile from './pages/Profiles/[id]';
import ProfileMirrors from './pages/Profiles/[hdl]';
import ProfileNfts from './pages/Profiles/[aadr]';
import EditProfile from './pages/MyProfile/[EditProfile]';
import CreateProfile from './pages/MyProfile/CreateProfile';
import Post from './components/[CreatePost]';
import Conference from './pages/Conference';
import About from './pages/About';


export default function App() {
  
  return (
    <>
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/home" element={<Home/>} />
      <Route path="/posts/:type" element={<FeedType/>} />
      <Route path="/myProfile" element={<MyProfile/>} />
      <Route path="/myProfile/nfts/:myNfts" element={<MyProfileNfts/>} />
      <Route path="/myProfile/mirrors/:myMirrors" element={<MyProfileMirrors/>} />
      <Route path="/profile/:id" element={<Profile/>} />
      <Route path="/profile/mirrors/:hdl" element={<ProfileMirrors/>} />
      <Route path="/profile/nfts/:aadr" element={<ProfileNfts/>} />
      <Route path = "/create" element = {<CreateProfile/>}/>
      <Route path = "/edit/:id" element = {<EditProfile/>}/>
      <Route path = "/post/:id" element = {<Post/>}/>
      <Route path = "/conference" element = {<Conference/>}/>
      <Route path = "/about" element = {<About/>}/>
      
    </Routes>
    </BrowserRouter>
    </>
  )
}

