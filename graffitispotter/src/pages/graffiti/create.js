import React, { Component } from 'react'
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
var FormData = require('form-data');

class graffiti extends Component {
    constructor(props){
        super(props);
        const [selectedFile, setSelectedFile] = useState(null);
        this.state = {
            id: null,
            commentCount: 0,
            descripcion: null,
            estado: null,
            imagen: null,
            likeCount: 0,
            latitud: 0,
            longitud: 0,
            tematica: null,
            titulo: null,
            redirect: null
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleSubmit(event) {

        var data = new FormData();
        data.append('image', selectedFile);

        var config = {
            method: 'post',
            url: 'https://api.imgbb.com/1/upload?key=4c66bdf18a92b0a41b4e261195b1b1a2',
            headers: { 
              ...data.getHeaders()
            },
            data : data
          };
          
          axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
          })
          .catch(function (error) {
            console.log(error);
          });

        const cookies = new Cookies();
        var Bearer = 'Bearer ' + cookies.get('access-token');
        console.log(this.state);
        axios.post('/createGraffiti', this.state, { headers: 
            { 
            'Authorization': Bearer
            }
        })
        .then(res => {
            console.log(res.data)
            this.setState({
                id: res.data.graffitiId,
                redirect: true    
            });
        })
        .catch(err => console.log(err));
        event.preventDefault();

    }
    renderRedirect = () => {
        if(this.state.redirect){
            return <Redirect to={`/graffitis/${this.state.id}`} />
        }
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value    
        });
    }

    render(){
        let Formulario = (
                <form onSubmit={this.handleSubmit}>
                    <label><br />
                        Título:<br />
                        <input name="titulo" type="text"
                            checked={this.state.titulo}
                            onChange={this.handleInputChange} />
                    </label>
                    <label><br />
                        Estado:<br />
                        <input name="estado" type="text"
                            checked={this.state.estado}
                            onChange={this.handleInputChange} />
                    </label>
                    <label><br />
                        Descripción:<br />
                        <input name="descripcion" type="text"
                            checked={this.state.descripcion}
                            onChange={this.handleInputChange} />
                    </label>
                    <label><br />
                        Imagen:<br />
                        <input name="imagen" type="text"
                            checked={this.state.imagen}
                            onChange={this.handleInputChange} />
                        <input
                            type="file"
                            value={selectedFile}
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                            />
                    </label>
                    <label><br />
                        Localización (Latitud):<br />
                        <input name="latitud" type="text"
                            checked={this.state.latitud}
                            onChange={this.handleInputChange} />
                    </label>
                    <label><br />
                        Localización (Longitud):<br />
                        <input name="longitud" type="text"
                            checked={this.state.longitud}
                            onChange={this.handleInputChange} />
                    </label>
                    <label><br />
                        Temática:<br />
                        <input name="tematica" type="text"
                            checked={this.state.tematica}
                            onChange={this.handleInputChange} />
                    </label>
                    <br />
                 <input type="submit" value="Enviar" />
                </form>
            )
        return (
        <React.Fragment>
            <div>
            {Formulario}
            {this.renderRedirect()}
            </div>
        </React.Fragment>
        )
    }

}

export default graffiti;
