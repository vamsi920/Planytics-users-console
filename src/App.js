import React, { Component } from 'react';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import TodosList from "./components/todo.js";
import EditTodo from "./components/edit.js";
import CreateTodo from "./components/create.js";
import "bootstrap/dist/css/bootstrap.min.css";
import GoogleButton from 'react-google-button'
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
      <Link to="/" className="navbar-brand">GraphDB App</Link>
              <div className="collpase navbar-collapse">
                <ul className="navbar-nav mr-auto">
                  <li className="navbar-item">
                    <Link to="/" className="nav-link">Todos</Link>
                  </li>
                  <li className="navbar-item">
                    <Link to="/create" className="nav-link">Create Todo</Link>
                  </li>
                  <li className="navbar-item">
                  {(!this.state.userPresent)?(<a href="http://localhost:4000/google" className="nav-link">google login</a>):(<a href="http://localhost:4000/logout" onClick={()=>{localStorage.removeItem("user-cred")}} className="nav-link">logout</a>)}
                    
                  </li>
                </ul>
              </div>
            </nav>
            <br/>
      <Route path="/" exact component={TodosList} />
      <Route path="/create" component={CreateTodo} />
      <Route path="/edit/:id" component={EditTodo} />
      </div>
      </Router>
    );
  }
  
}

