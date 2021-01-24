import React, { Component } from "react";
import axios from 'axios';
import Cookies from 'universal-cookie';

class ListOfUsers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            users: null
        };
    }
  
  componentDidMount() {
    // Get access token from cookie NEEDS LOGIN OR REGISTER
    const cookies = new Cookies();
    var Bearer = 'Bearer ' + cookies.get('access-token');

    var config = {
    method: 'get',
        url: 'https://us-central1-thegraffitispotter.cloudfunctions.net/api/users',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept':'application/json',
            'Authorization': Bearer
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
            <h3>Se puede ver más info en la consola, esta página requiere login/registro y accesstoken mediante la cookie 'access-token'</h3>
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