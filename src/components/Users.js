import React, { Component } from "react";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button'
import axios from "axios";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { LinkContainer } from 'react-router-bootstrap'
import Card from 'react-bootstrap/Card'
import { FirebaseDatabaseProvider } from "@react-firebase/database";
import Firebase from 'firebase';
import firebaseConfig from '../config';
import Accordion from 'react-bootstrap/Accordion'
import Form from 'react-bootstrap/Form'

export default class Users extends Component {
  constructor(props){
    super(props);
    if (!Firebase.apps.length) {
      Firebase.initializeApp(firebaseConfig.firebase);
   }else {
    Firebase.app(); // if already initialized, use that one
   }
    

    this.state = {
      data: [],
      items:[],
      organisation:[],
      units:[],
      users:[],
      name:'',
      address:'',
      // units:[]
    }
  }

  uppercase = word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  componentDidMount(){
    const db = Firebase.firestore();
    db.collection('organisation').get().then((snapshot) => {
      let organisationArray=this.state.organisation;
      snapshot.docs.forEach(doc => {
          let organisation = doc.data();
          organisationArray.push(organisation);
          this.setState({ organisation:organisationArray }) 
      });

    });
    

    // });
    // db.collection('users').get().then((snapshot) => {
    //   let usersArray=this.state.units;
    //   snapshot.docs.forEach(doc => {
    //       let users = doc.data();
    //       usersArray.push(users);
    //       /* Make data suitable for rendering */
    //       users = JSON.stringify(users);

    //       /* Update the components state with query result */
    //       this.setState({ users:usersArray }); 
    //   });

    // });

  }

  handleChangeName=(event)=> {
    this.setState({name: event.target.value});
  }
  handleChangeAddress=(event)=> {
    this.setState({address: event.target.value});
  }
  // handleChangeUnits=(event)=> {
  //   let unitsstring = event.target.value;
  //   let unitsArray = unitsstring.split(',');
    
  //   this.setState({units: unitsArray});
  // }
  handleSubmit=()=> {
    ////push data
    const db = Firebase.firestore();
    const ref = db.collection('organisation').doc()
      console.log(ref.id)  // prints the unique id
      ref.set({
        id: ref.id,
        name:this.state.name,
        address:this.state.address
      }) 

      // for (let i=0; i<this.state.units.length; i++){
      //   let unitref = db.collection('units').doc();
      //   unitref.set({
      //     id: unitref.id,
      //     name:this.state.units[i]
      //   }) 
      // }
      
    

      alert('organisation added , Please refresh the page')
  }
  render() {
     
    return (
      <div>
        <Accordion>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
              +add organisation
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
              <form >
                <label>
                  Store name
                  <input type="text" value={this.state.value} onChange={this.handleChangeName} />
                </label>
                <label>
                Store address
                  <input type="text" value={this.state.value} onChange={this.handleChangeAddress} />
                </label>
                {/* <label>
                Enter units ...for example: unit1,unit2
                  <input type="text" value={this.state.value} onChange={this.handleChangeUnits} />
                </label> */}
              </form>
              <Button onClick={this.handleSubmit}>add</Button>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>


         <div style={{display:'flex', flexDirection:'row', marginTop:20, marginLeft:20}}>
          {this.state.organisation.map(data => (
            <LinkContainer to={{
              pathname: `/UserDetail/${data.id}`,
              data: data,
           }} >
            <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>{data.name}</Card.Title>
              <Card.Text>
                {data.address}
              </Card.Text>
            </Card.Body>
          </Card>
          </LinkContainer>
          ))}
      </div>
      </div>
    );
  }
}
