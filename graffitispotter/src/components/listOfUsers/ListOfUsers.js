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
    var config = {
    method: 'get',
        url: 'http://localhost:5000/thegraffitispotter/us-central1/api/users',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept':'application/json',
            'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjlhZDBjYjdjMGY1NTkwMmY5N2RjNTI0NWE4ZTc5NzFmMThkOWM3NjYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdGhlZ3JhZmZpdGlzcG90dGVyIiwiYXVkIjoidGhlZ3JhZmZpdGlzcG90dGVyIiwiYXV0aF90aW1lIjoxNjA2NTE2NzAzLCJ1c2VyX2lkIjoiUUc4NkFpRW5wU1RDV20wQXBZelJRdmtPdUpqMSIsInN1YiI6IlFHODZBaUVucFNUQ1dtMEFwWXpSUXZrT3VKajEiLCJpYXQiOjE2MDY1MTY3MDMsImV4cCI6MTYwNjUyMDMwMywiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInRlc3RAdGVzdC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.aOR8k3g6VHEIjD9KVNQWeDWiEtD-S67T57YYqa2t_9Fdv65AZJAQep6QNAG-ai1yo9hkEpCaXIuk7WuJDz3mpEnweVTphD_0zw6wZIj_wyDkVpKKX3EEIAB8HKy5ODSoIIOeBWQeJlXTq5cXZiy4D8Y_CiX-FnLJ7gzeyY_k1ubuxxBG5-8V5OMHm1j6ENtvoRaYu8BTFOwHlUzl72eY4_d3hUks233HPG6Q_XEMQhKrNTPeeWUfNgwvbXpc1fT1G5XkyviqIDzraph0C7KaerQwb7iOJNUn66Xdu5qMvSqLGTLLnRc11B9qbF_34k13cciawQStKohl6J22lQxGVA'
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