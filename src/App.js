import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import TodosList from "./components/todo.js";
import EditTodo from "./components/edit.js";
import CreateTodo from "./components/create.js";
import "bootstrap/dist/css/bootstrap.min.css";
function App() {
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

export default App;
