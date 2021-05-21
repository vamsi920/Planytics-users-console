import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import Firebase from 'firebase';
import firebaseConfig from '../config';
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
export default class UserDetail extends Component {
  constructor(props){
    super(props);
    if (!Firebase.apps.length) {
      Firebase.initializeApp(firebaseConfig.firebase);
   }else {
    Firebase.app(); // if already initialized, use that one
   }
    

    this.state = {
      data: [],
      dataU:[],
      units:[],
      rData:[],
      url:'',
      name:'',
      username:'',
      uData:{}
    }
  }
componentDidMount(){
    let url  = window.location.href.split('UserDetail/')[1];
    this.setState({url},()=>{
      const db = Firebase.firestore();
    db.collection('units').get().then((snapshot) => {
      let unitsArray = this.state.data;
      snapshot.docs.forEach(doc => {
          let organisation = doc.data();
          unitsArray.push(organisation);
          this.setState({ data:unitsArray },()=>{
            let rData=[];
              for(let i=0; i<this.state.data.length; i++){
                if(this.state.data[i].orgid===this.state.url){
                
                  rData.push(this.state.data[i])
                }
              }
              this.setState({rData})
          } ) 
      });

    });
    db.collection('users').get().then((snapshot) => {
      let unitsArray = this.state.dataU;
      snapshot.docs.forEach(doc => {
          let organisation = doc.data();
          unitsArray.push(organisation);
          this.setState({ dataU:unitsArray },()=>{
            let rData={};
            
              for(let i=0; i<this.state.dataU.length; i++){
                rData[this.state.dataU[i].unitId]=[]
                rData[this.state.dataU[i].unitId].push(this.state.dataU[i]);
                
              }
              this.setState({uData:rData})
          } ) 
      });

    });
    
    })
}
handleChangeName=(event)=> {
  this.setState({name: event.target.value});
}
handleChangeUserName=(event)=> {
  this.setState({username: event.target.value});
}
handleSubmit=()=> {
  ////push data
  const db = Firebase.firestore();
  const ref = db.collection('units').doc()
    console.log(ref.id)  // prints the unique id
    ref.set({
      id: ref.id,
      name:this.state.name,
      orgid:this.state.url
    })     
  
    alert('unit added , please refresh the page ')
}
handleSubmitUserName=(i)=>{
  const db = Firebase.firestore();
  const ref = db.collection('users').doc()
    console.log(ref.id)  // prints the unique id
    ref.set({
      id: ref.id,
      name:this.state.username,
      unitId:i
    })     
  
    alert('user added, please refresh the page')
}
  render() {
    return (
      <div>
        
        <h3>Org details</h3>
        <Accordion>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
              +add units
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
              <form >
                <label>
                  unit name
                  <input type="text" value={this.state.name} onChange={this.handleChangeName} />
                </label>
              </form>
              <Button onClick={this.handleSubmit}>add</Button>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
        <div style={{display: 'flex', flexDirection:'row'}}>
        {(this.state.rData!=[] )?(this.state.rData.map(data=>(
          <div>
            <Accordion>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="1">
                    unit id: {data.id}
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>
                    <p >unit name: {data.name}</p>
                    <p>users:</p>

                    {(this.state.uData[data.id]!==undefined)?(this.state.uData[data.id].map((u, index)=>(
                      <p>{index+1 + ". "+ u.name}</p>
                    ))):('')}
                    <Accordion>
                      <Card>
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="0">
                          +add users
                          </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                          <Card.Body>
                          <form >
                            <label>
                              user name
                              <input type="text" value={this.state.username} onChange={this.handleChangeUserName} />
                            </label>
                          </form>
                          <Button onClick={()=>{this.handleSubmitUserName(data.id)}}>add</Button>
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    </Accordion>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </div>
        ))):('')}
        </div>
      </div>
    );
  }
}
