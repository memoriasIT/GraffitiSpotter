import React, { Component } from 'react'
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';

class graffiti extends Component {
    constructor(props){
        super(props);
        this.state = {
            id: null,
            redirect: null,
            deleted: null
        }
        this.handleDelete = this.handleDelete.bind(this);
        this.handleRedirectGraffiti = this.handleRedirectGraffiti.bind(this);
    }
    
    componentDidMount(){
        this.setState({
            id: this.props.match.params.id 
        });
    }
    handleDelete() {
        const cookies = new Cookies();
        var Bearer = 'Bearer ' + cookies.get('access-token');
        let graffitiId = this.state.id;
        console.log(this.state.id);
        axios.delete('/deleteGraffiti', {
            headers: {
                'Authorization': Bearer
            },
            data: {
                id: graffitiId
            } 
        })
        .then(res => {
            console.log(res.data)
        })
        .catch(err => console.log(err));
        this.setState({
            deleted: true    
        });

    }
    renderRedirect = () => {
        if(this.state.redirect){
            return <Redirect to={`/graffitis/${this.state.id}`} />
        } else if (this.state.deleted) {
            return <Redirect to={`/`} />
        }
    }

    handleRedirectGraffiti() {
        this.setState({
            redirect: true    
        });
    }

    render(){
        return (
        <React.Fragment>
            <p>¿Estás seguro de que deseas borrar este graffiti?</p>
            <form onSubmit={this.handleRedirectGraffiti}>
                <input type="submit" value="No, este graffiti mola" />
            </form>
            <form onSubmit={this.handleDelete}>
                <input type="submit" value="Eliminar definitivamente" />
            </form>
            {this.renderRedirect()}
        </React.Fragment>
        )
    }

}

export default graffiti;
