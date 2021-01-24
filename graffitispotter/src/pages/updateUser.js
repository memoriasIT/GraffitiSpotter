import React, { Component } from "react";
import axios from 'axios';
import Cookies from 'universal-cookie';

class updateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: null,
      biografia: "a",
      edad: 0,
      imagen: "b",
      nombre: "c",
      password: 'd',
      username: 'e'
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // componentDidMount() {
  //   // Get access token from cookie NEEDS LOGIN OR REGISTER
  //   const cookies = new Cookies();
  //   var Bearer = 'Bearer ' + cookies.get('access-token');

  //   var config = {
  //       method: 'get',
  //       url: 'http://localhost:5000/thegraffitispotter/us-central1/api/user/',
  //       headers: { 
  //           'Content-Type': 'application/json',
  //           'Accept':'application/json',
  //           'Authorization': Bearer
  //           },
  //       data : this.state.value
  //   };
    
  //       axios(config)
  //       .then(response => {
  //           console.log("ComponentDidMount");
  //           var credentials = response.data.credentials;
  //           console.log(JSON.stringify(credentials));
  //           this.setState({
  //               biografia: credentials.biografia,
  //               edad: credentials.edad,
  //               imagen: credentials.imagen,
  //               nombre: credentials.nombre,
  //               password: credentials.password,
  //               username: credentials.username,

  //           });
  //       })
  //       .then( () => {
  //         this.setState({
  //           isLoaded : true
  //         });
  //       })
  //       .catch(function (error) {
  //           console.log(error);
  //       });


  // }


  componentDidMount() {

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

    this._asyncRequest = axios(config)
          .then(response => {
              console.log("ComponentDidMount");
              var credentials = response.data.credentials;
              console.log(JSON.stringify(credentials));
              this.setState({
                  biografia: credentials.biografia,
                  edad: credentials.edad,
                  imagen: credentials.imagen,
                  nombre: credentials.nombre,
                  password: credentials.password,
                  username: credentials.username,
  
              });
          })
          .then( () => {
            this.setState({
              isLoaded : true
            });
            this._asyncRequest = null;
          })
          .catch(function (error) {
              console.log(error);
          });
  

  }




  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value    });
  }

  handleSubmit(event) {
    // Get access token from cookie NEEDS LOGIN OR REGISTER
    const cookies = new Cookies();
    var Bearer = 'Bearer ' + cookies.get('access-token');

    var toSend = JSON.stringify(this.state);

    var config = {
      method: 'put',
      url: 'https://us-central1-thegraffitispotter.cloudfunctions.net/api/updateUser',
        headers: { 
          'Authorization': Bearer, 
          'Content-Type': 'application/json',
          'Accept':'application/json',
        },
        data : toSend
      };

      axios(config)
          .then(response => {
              console.log("Updated");
              
          })
          .catch(function (error) {
              console.log(error);
          });
    
    event.preventDefault();
  }
  


  render() {
    //- biografia: "",
    //-   edad: 0,
    //-   imagen: "",
    //-   nombre: "",
    //-   password: "",
    //-   username: ""

    if (this.state.isLoaded === null) {
      // Render loading state ...
      return(<h3>Cargando...</h3>);
    } else {
      // Render real UI ...
      return(
        <React.Fragment>
      <form onSubmit={this.handleSubmit}>
            

        <label>
          Username:
          <input
            name="username"            type="text"
            checked={this.state.username}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Nombre:
          <input
            name="nombre"            type="text"
            checked={this.state.nombre}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Biografia:
          <textarea 
            name="biografia"            type="text"
            checked={this.state.biografia}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Imagen:
          <input
            name="imagen"            type="text"
            checked={this.state.imagen}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Contraseña:
          <input
            name="password"            type="password"
            checked={this.state.password}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Edad:
          <input
            name="edad"            type="number"
            value={this.state.edad}
            onChange={this.handleInputChange} />
        </label>

        <input type="submit" value="Submit" />
      </form>
    

    </React.Fragment>
      
      
        );
    }

    
  }
  

}
 
export default updateUser;