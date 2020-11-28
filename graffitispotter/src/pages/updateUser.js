import React, { Component } from "react";
import axios from 'axios';
import Cookies from 'universal-cookie';

class updateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      biografia: "",
      edad: 0,
      imagen: "",
      nombre: "",
      password: "",
      username: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    // const cookies = new Cookies();
    // var Bearer = 'Bearer ' + cookies.get('access-token');

    var toSend = JSON.stringify(this.state);

    // var config = {
    //     method: 'delete',
    //     url: 'http://localhost:5000/thegraffitispotter/us-central1/api/deleteUser',
    //     headers: { 
    //       'Authorization': Bearer, 
    //       'Content-Type': 'application/json',
    //       'Accept':'application/json',
    //     },
    //     data : toSend
    //   };

    
    // axios(config)
    //     .then(response => {
    //         console.log(JSON.stringify(response.data));
    //         this.setState({
    //             details: response.data,
    //             isLoaded : true,
    //         });
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });

    console.log(toSend);
    event.preventDefault();
  }
  


  render() {

    //- biografia: "",
    //-   edad: 0,
    //-   imagen: "",
    //-   nombre: "",
    //-   password: "",
    //-   username: ""
    return (
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
    );
  }

}
 
export default updateUser;