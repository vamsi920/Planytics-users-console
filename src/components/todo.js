import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Todo = props => (
    <tr>
        <td>{props.todo}</td>
        
    </tr>
)

export default class TodosList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            todos: [], 
            todosList:[]
        };
    }

    componentDidMount() {
        axios.get('http://localhost:4000/todos/')
            .then(response => {
                
                this.setState({ todos: response.data }, ()=>{
                    this.state.todos.map((a)=>{console.log(a.properties.todo);})
                    
                });
            })
            .catch(function (error){
                console.log(error);
            })
            console.log(this.state.todosList)
    }

    todoList() {
        return this.state.todosList.map(function(currentTodo, i){
            return <Todo todo={currentTodo.properties.todo} key={i} />;
        })
    }

    render() {
        return (
            <div>
                <h3>Todos List</h3>
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.todoList() }
                    </tbody>
                </table>
            </div>
        )
    }
}