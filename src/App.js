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
export default class App extends Component {
  state = {
    userPresent: false,
  }
  componentDidMount(){
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
    return (
      
      <Router>
      <div className="App">
      
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link to="/" className="navbar-brand">Planytics User console</Link>
              <div className="collpase navbar-collapse">
                <ul className="navbar-nav mr-auto">
                  <li className="navbar-item">
                    <Link to="/login" className="nav-link">Login</Link>
                  </li>
                </ul>
              </div>
            </nav>
            
            <br/>
            <ProSidebar>
          <Menu iconShape="square">
            <MenuItem ><Link to="/Users" className="navbar-brand">Users</Link></MenuItem>
            <MenuItem><Link to="/Notifications" className="navbar-brand">Notification</Link></MenuItem>
          </Menu>
        </ProSidebar>
      <Route path="/" exact component={Home} />
      <Route path="/login" component={SignIn} />
      <Route path="/Notifications" component={Notifications} />
      <Route path="/Users" component={Users} />
      </div>
      </Router>
    );
  }
  
}

