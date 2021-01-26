import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Graffiti from '../components/graffiti/Graffiti';

class home extends Component {
    constructor(){
        super();
        this.state = {
            graffitis: [],
        };
    }
    componentDidMount(){
        axios.get('https://us-central1-thegraffitispotter.cloudfunctions.net/api/graffitis')
            .then(res => {
                console.log(res.data)
                this.setState({
                    graffitis: res.data
                })
            })
        .catch(err => console.log(err));
    }
    render() {
        console.log(this.state.graffitis);
        let recentGraffitisMarkup = this.state.graffitis.length ? (
            this.state.graffitis.map((graffiti) => 
                <Graffiti key={graffiti.id} graffiti={graffiti}/> 
            )
        ) : <p>Loading...</p>
        return (
            <div>
                <h1>Inicio</h1>
                <Link to='/listOfUsers'>Lista de Usuarios</Link>
                <br></br>
                <Link to='/user'>Buscar detalles de un usuario</Link>
                <br></br>
                <Link to='/deleteUser'>Borrar Usuario</Link>
                <br></br>
                <Link to='/create'>Subir un nuevo graffiti</Link>
                <br></br>
                <Link to='/map'>Mapa que muestra el contenedor de papel más cercano</Link>
            <Grid container spaceing={16}>
                <Grid item sm={8} xs={12}> 
                    {recentGraffitisMarkup}
                </Grid>
            </Grid>
            </div>
        );
    }
}

export default home
