import React, { Component } from 'react'
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';

class graffiti extends Component {
    constructor(props){
        super(props);
        this.state = {
            id: null,
            autor: null,
            commentCount: null,
            descripcion: null,
            estado: null,
            imagen: null,
            likeCount: null,
            latitud: null,
            longitud: null,
            tematica: null,
            titulo: null,
            redirect: null
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    componentDidMount(){
        const id = this.props.match.params.id;
        axios.get(`/graffitis/${id}`)
            .then(res => {
                console.log(res.data)
                this.setState({
                    titulo: res.data.titulo,
                    imagen: res.data.imagen,
                    id: res.data.id,
                    likeCount: res.data.likeCount,
                    descripcion: res.data.descripcion,
                    estado: res.data.estado,
                    tematica: res.data.tematica,
                    latitud: res.data.latitud,
                    longitud: res.data.longitud,
                    commentCount: res.data.commentCount,
                    autor: res.data.autor
                })
                .catch(err => console.log(err));
            }).catch(err => console.log(err));

    }
    handleSubmit(event) {
        const cookies = new Cookies();
        var Bearer = 'Bearer ' + cookies.get('access-token');
        console.log(this.state);
        axios.put('/updateGraffiti', this.state, { headers:
            {
            'Authorization': Bearer
            }
        })
        .then(res => {
            console.log(res.data)
        })
        .catch(err => console.log(err));
        event.preventDefault();
        this.setState({
            redirect: true    
        });

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
        let Formulario = this.state.titulo ? (
                <form onSubmit={this.handleSubmit}>
                    <label><br />
                        Título:<br />
                        <input name="titulo" type="text"
                            value={this.state.titulo}
                            checked={this.state.titulo}
                            onChange={this.handleInputChange} />
                    </label>
                    <label><br />
                        Estado:<br />
                        <input name="estado" type="text"
                            value={this.state.estado}
                            checked={this.state.estado}
                            onChange={this.handleInputChange} />
                    </label>
                    <label><br />
                        Descripción:<br />
                        <input name="descripcion" type="text"
                            value={this.state.descripcion}
                            checked={this.state.descripcion}
                            onChange={this.handleInputChange} />
                    </label>
                    <label><br />
                        Imagen:<br />
                        <input name="imagen" type="text"
                            value={this.state.imagen}
                            checked={this.state.imagen}
                            onChange={this.handleInputChange} />
                    </label>
                    <label><br />
                        Localización (Latitud):<br />
                        <input name="latitud" type="text"
                            value={this.state.latitud}
                            checked={this.state.latitud}
                            onChange={this.handleInputChange} />
                    </label>
                    <label><br />
                        Localización (Longitud):<br />
                        <input name="longitud" type="text"
                            value={this.state.longitud}
                            checked={this.state.longitud}
                            onChange={this.handleInputChange} />
                    </label>
                    <label><br />
                        Temática:<br />
                        <input name="tematica" type="text"
                            value={this.state.tematica}
                            checked={this.state.tematica}
                            onChange={this.handleInputChange} />
                    </label>
                    <br />
                 <input type="submit" value="Enviar" />
                </form>
            ) : <p>Loading...</p>
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
