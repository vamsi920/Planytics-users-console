import React, { Component } from 'react';
import axios from 'axios';
import * as XLSX from "xlsx";

export default class CreateTodo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            todo_description: '',
            todo_responsible: '',
            todo_priority: '',
            todo_completed: false,
            file:'',
            jsonOfExcel:{}
        };
        this.onChangeTodoDescription = this.onChangeTodoDescription.bind(this);
        this.onChangeTodoResponsible = this.onChangeTodoResponsible.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.onChangeTodoPriority = this.onChangeTodoPriority.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onChangeTodoDescription(e) {
        this.setState({
            todo_description: e.target.value
        });
    }

    onChangeTodoResponsible(e) {
        this.setState({
            todo_responsible: e.target.value
        });
    }

    onChangeTodoPriority(e) {
        this.setState({
            todo_priority: e.target.value
        });
    }
    onSubmit(e) {
        e.preventDefault();
        const newTodo = {
            todo_description: this.state.todo_description,
            // todo_responsible: this.state.todo_responsible,
            // todo_priority: this.state.todo_priority,
            // todo_completed: this.state.todo_completed
        };

        // axios.post('http://localhost:4000/todos/add', newTodo)
        //     .then((res, err) => {
        //         if(err) console.log(err);
        //         else console.log(res.data)});

        this.setState({
            todo_description: '',
            todo_responsible: '',
            todo_priority: '',
            todo_completed: false
        })
    }
    handleClick(e) {
        this.refs.fileUploader.click();
      }
    
      filePathset(e) {
        e.stopPropagation();
        e.preventDefault();
        var file = e.target.files[0];
        console.log(file);
        this.setState({ file });
    
        console.log(this.state.file);
      }
    readFile() {
        let jsonOfExcel
        var f = this.state.file;
        var name = f.name;
        const reader = new FileReader();
        reader.onload = (evt) => {
          // evt = on_file_select event
          /* Parse data */
          const bstr = evt.target.result;
          const wb = XLSX.read(bstr, { type: "binary" });
          /* Get first worksheet */
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          /* Convert array of arrays */
          const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
          /* Update state */
          //console.log("Data>>>" + data);// shows that excel data is read
          jsonOfExcel= this.convertToJson(data); // shows data in json format
          jsonOfExcel = JSON.parse(jsonOfExcel)
          console.log(jsonOfExcel.length)
          this.setState({jsonOfExcel}, ()=>{
              this.state.jsonOfExcel.map((a)=>{
                if(a.Description!==' ' && a.Description!==''){axios.post('http://localhost:4000/todos/addExcel', a)}
              })
              
          })
        };
        reader.readAsBinaryString(f);
        
      }
    convertToJson(csv) {
        var lines = csv.split("\n");
    
        var result = [];
    
        var headers = lines[0].split(",");
    
        for (var i = 1; i < lines.length; i++) {
          var obj = {};
          var currentline = lines[i].split(",");
    
          for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
          }
    
          result.push(obj);
        }
    
        //return result; //JavaScript object
        return JSON.stringify(result); //JSON
      }
    render() {
        return (
            <div style={{marginTop: 10}}>
            <h3>Insert new excel file to Neo4j</h3>
            <form onSubmit={this.onSubmit}>
                    <input
                type="file"
                id="file"
                ref="fileUploader"
                onChange={this.filePathset.bind(this)}
                />
                <button
                onClick={() => {
                    this.readFile();
                }}
                >
                Submit
                </button>
                {/* <div className="form-group"> 
                    <label>Description: </label>
                    <input  type="text"
                            className="form-control"
                            value={this.state.todo_description}
                            onChange={this.onChangeTodoDescription}
                            />
                   
                </div>

                <div className="form-group">
                    <input type="submit" value="Create Todo" className="btn btn-primary" />
                    
                </div> */}
            </form>
        </div>
        )
    }
}