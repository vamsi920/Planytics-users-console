import React, { Component } from 'react';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from "./components/Home.js";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import GoogleButton from 'react-google-button';
import SignIn from './components/login.js';
import Notifications from './components/Notifications';
import Users from './components/Users'
import UserDetail from "./components/UserDetail"
import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './config';
const firebaseApp = firebase.initializeApp(firebaseConfig);

class App extends Component {
  state = {
    userPresent: false,
  }
  componentDidMount(){  
    // const messaging = firebase.messaging()
    // messaging.requestPermission().then((token)=>{
    //   return messaging.getToken()

    // }).then(token=>{
    //   console.log(token , 'token')
    // }).catch((e)=>{
    //   console.log(e)
    // })
    let userpresence = localStorage.getItem("user-cred")
    if(userpresence){
      this.setState({userPresent: true})
    }
    else{
      let url = window.location.href
    let urlArray = url.split('/')
    let userId = urlArray[urlArray.length - 1]
    if(userId!== ''){
      this.setState({userPresent:true},()=>{
        localStorage.setItem("user-cred", userId)
      })
    }
    else{
      this.setState({userPresent:false}, ()=>{
        localStorage.removeItem("user-cred")
      })
    }
      
    }
    
    
  }
  handleLogin = async() => {
    await axios.get('http://localhost:4000/google')
            .then(response => {
    console.log("called")})
    }
   
  render(){
    const {
      user,
      signOut,
      signInWithGoogle,
    } = this.props;
    return (
      
      <Router>
      <div className="App">
      
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link to="/" className="navbar-brand">Planytics User console</Link>
              <div className="collpase navbar-collapse">
                <ul className="navbar-nav mr-auto">
                  <li className="navbar-item">
                    {/* <Link to="/login" className="nav-link">Login</Link> */}
                    {
            user
              ? <p>Hello, {user.displayName}</p>
              : <p>Please sign in.</p>
          }

          {
            user
              ? <button onClick={signOut}>Sign out</button>
              : <button onClick={signInWithGoogle}>Sign in with Google</button>
          }
                  </li>
                </ul>
              </div>
            </nav>
            
            <br/>
            <ProSidebar>
          <Menu iconShape="square">
            <MenuItem ><Link to="/Users" className="navbar-brand">Organisation</Link></MenuItem>
            <MenuItem><Link to="/Notifications" className="navbar-brand">Notification</Link></MenuItem>
          </Menu>
        </ProSidebar>
      <Route path="/" exact component={Home} />
      <Route path="/login" component={SignIn} />
      <Route path="/Notifications" component={Notifications} />
      <Route path="/Users" component={Users} />
      <Route path="/UserDetail/:id" component={UserDetail} />
      </div>
      </Router>
    );
  }
  
}
const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};
export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App);

