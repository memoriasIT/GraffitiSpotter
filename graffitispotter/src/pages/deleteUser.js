import React, { Component } from "react";
import axios from 'axios';
import Cookies from 'universal-cookie';

class deleteUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            details: '',
            value: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
  
  handleChange(event) {
    this.setState({value: event.target.value});
    console.log(event.target.value);
  }

  handleSubmit(event) {
    // Get access token from cookie NEEDS LOGIN OR REGISTER
    const cookies = new Cookies();
    var Bearer = 'Bearer ' + cookies.get('access-token');

    var toSend = JSON.stringify({"username":this.state.value});

    var config = {
        method: 'delete',
        url: 'https://us-central1-thegraffitispotter.cloudfunctions.net/api/deleteUser',
        headers: { 
          'Authorization': Bearer, 
          'Content-Type': 'application/json',
          'Accept':'application/json',
        },
        data : toSend
      };

    
    axios(config)
        .then(response => {
            console.log(JSON.stringify(response.data));
            this.setState({
                details: response.data,
                isLoaded : true,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    event.preventDefault();
  }
  
  render() {
        const { isLoaded, details } = this.state;
      return (
        <React.Fragment>
            <form onSubmit={this.handleSubmit}>
                <label>
                Name:
                <input type="text" value={this.state.value} onChange={this.handleChange} />        </label>
                <input type="submit" value="Submit" />
            </form>
            {/* // <h3>Se puede ver más info en la consola, esta página requiere login/registro y accesstoken mediante la cookie 'access-token'</h3> */}
         {this.state.isLoaded ? 
            
            <div><pre>{JSON.stringify(details, null, 2) }</pre></div>
                
            
             : "Inserta username para borrar (ej. PedroJuan141)..." }
        </React.Fragment> 
      );
  }
}
 
export default deleteUser;