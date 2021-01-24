import React, { Component } from "react";
import axios from 'axios';
import Cookies from 'universal-cookie';
import Grid from '@material-ui/core/Grid';
import Graffiti from "../components/graffiti/Graffiti";

class UserDetails extends Component {
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

    var config = {
        method: 'get',
        url: 'https://us-central1-thegraffitispotter.cloudfunctions.net/api/user/',
        headers: { 
            'Content-Type': 'application/json',
            'Accept':'application/json',
            'Authorization': Bearer
            },
        data : this.state.value
    };
    
    axios(config)
        .then(response => {
            console.log(JSON.stringify(response.data));
            this.setState({
                details: response.data,
                isLoaded : true,
            });
        })
        .catch((error) => {
            console.log(error);
            
            this.setState({
                details: "El usuario es incorrecto o el token ha expirado.",
                isLoaded : true,
            });
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
            
            <div>
                <h1>Usuario</h1>
                {details.credentials['username']}

                <h1>Biografía</h1>
                {details.credentials['biografia']}

                <h1>Edad</h1>
                {details.credentials['edad']}

                <h1>Nombre</h1>
                {details.credentials['nombre']}

                <h1>Tus Graffitis</h1>
                <Grid container spaceing={16}>
                    <Grid item sm={8} xs={12}> 
                        {details.graffitis.map((graffiti) => 
                            <Graffiti key={graffiti.id} graffiti={graffiti}/> 
                            //<p>{graffiti.titulo}</p>
                        )}
                    </Grid>
                </Grid>
                {/* <pre>{JSON.stringify(details, null, 2) }</pre> */}
                
                
            </div>
                
            
             : "Inserta username (ej. PedroJuan141)..." }
        </React.Fragment> 
      );
  }
}
 
export default UserDetails;