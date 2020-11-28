import React, { Component } from "react";
import axios from 'axios';

class ListOfUsers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            users: null
        };
    }
  
  componentDidMount() {
    // var Bearer = 'Bearer ' + 

    var config = {
    method: 'get',
        url: 'http://localhost:5000/thegraffitispotter/us-central1/api/users',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept':'application/json',
            'Authorization': "Bearer"
        }
    };

    axios(config)
        .then(response => {
            console.log(JSON.stringify(response.data));
            this.setState({
                users: response.data,
                isLoaded : true
            });
        })
        .catch(function (error) {
            console.log(error);
        });
  }


  
  render() {
    const { isLoaded, users } = this.state;
      return (
        <React.Fragment>
        {isLoaded ? 
            
                <ul className="list-group">
                {users.map(user => (
                    <li key={user.userId}>
                    {user.username}
                    </li>
                ))}
                </ul>
            
             : "Cargando..." }
        </React.Fragment>
      );
  }
}
 
export default ListOfUsers;