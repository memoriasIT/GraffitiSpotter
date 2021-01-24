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
        // this.handleSubmit = this.handleSubmit.bind(this);
    }
  
  handleChange(event) {
    this.setState({value: event.target.value});
    console.log(event.target.value);
  }

  componentDidMount() {
    // Get access token from cookie NEEDS LOGIN OR REGISTER
    const cookies = new Cookies();
    var Bearer = 'Bearer ' + cookies.get('access-token');
    this.state.value = cookies.get('user');
    console.log(this.state.value)

    var config = {
        method: 'get',
        url: 'http://localhost:5000/thegraffitispotter/us-central1/api/userDetails',
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
  }
  
  render() {
        const { isLoaded, details } = this.state;
        let recentGraffitisMarkup = this.state.graffitis ? (
            this.state.graffitis) : <p>Loading...</p>
      return (
        <React.Fragment>
            
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
                
            
             : "Cargando..." }
        </React.Fragment> 
      );
  }
}
 
export default UserDetails;