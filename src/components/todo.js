import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from 'react-google-login';

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
                let dummy = [];    
                this.setState({ todos: response.data }, ()=>{
                    
                    this.state.todos.map((a)=>{dummy.push(a.properties.todo);})
                    
                });
                this.setState({todosList:dummy});
            })
            .catch(function (error){
                console.log(error);
            })
            
            //console.log(this.state.todosList)
    }
handleLogin = async googleData => {
const res = await fetch("/google", {
    method: "POST",
    body: JSON.stringify({
    token: googleData.tokenId
    }),
    headers: {
    "Content-Type": "application/json"
    }
})
const data = await res.json()
console.log(data)
// store returned user somehow
}
onFinish =async(taskId)=>{
    console.log(taskId)
    await axios.post('http://localhost:4000/todos/delete', {taskId})
            .then((res, err) => {
                if(err) console.log(err);
                else console.log(res)
            });
            axios.get('http://localhost:4000/todos/')
            .then(response => {
                let dummy = [];    
                this.setState({ todos: response.data }, ()=>{
                    
                    this.state.todos.map((a)=>{dummy.push(a.properties.todo);})
                    
                });
                this.setState({todosList:dummy});
            })
            .catch(function (error){
                console.log(error);
            })
}
    render() {
        return (
            <div>
            <GoogleLogin
                clientId={"925311843463-7juocmoqud3eirghrsq0bgepot7ijged.apps.googleusercontent.com"}
                buttonText="Log in with Google"
                onSuccess={this.handleLogin}
                onFailure={this.handleLogin}
                cookiePolicy={'single_host_origin'}
            />
                <h3>Todos List</h3>
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>TODOs  (click on the task when done)</th>
                        </tr>
                    </thead>
                        { (this.state.todosList!==[] && this.state.todosList!==null)?(
                            <tbody>
                            {this.state.todosList.map((a)=>{
                                return(<tr onClick={()=>this.onFinish(a)}>
                                    {a}
                                </tr>)
                            })}
                            </tbody>):("") }
                    
                </table>
            </div>
        )
    }
}