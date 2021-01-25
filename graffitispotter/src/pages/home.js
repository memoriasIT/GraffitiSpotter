import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Graffiti from '../components/graffiti/Graffiti';

class home extends Component {
    state = {
        graffitis: null,
        comments: null
    }
    componentDidMount(){
        axios.get('/graffitis')
            .then(res => {
                console.log(res.data)
                this.setState({
                    graffitis: res.data
                })
            })
        .catch(err => console.log(err));
        axios.get('/comments')
            .then(res => {
                console.log(res.data)
                this.setState({
                    comments: res.data
                })
            })
        .catch(err => console.log(err));
    }
    render() {
        let recentGraffitisMarkup = this.state.graffitis ? (
            this.state.graffitis.map((graffiti) => 
                <Graffiti key={graffiti.id} graffiti={graffiti}/> 
                //<p>{graffiti.titulo}</p>
            )) : <p>Loading...</p>
        return (
            <div>
                <h1>Inicio</h1>
                {/* <Link to='/login'>login</Link>
                <br></br>
                <Link to='/signup'>register</Link>
                <br></br> */}
                <Link to='/listOfUsers'>Lista de Usuarios</Link>
                <br></br>
                <Link to='/user'>Buscar detalles de un usuario</Link>
                <br></br>
                <Link to='/deleteUser'>Borrar Usuario</Link>
                <br></br>
                <Link to='/create'>Subir un nuevo graffiti</Link>
                <br></br>
                <Link to='/map'>Mapa que muestra el contenedor de papel más cercano</Link>
                {/* // TODO UPDATE USER PAGE */}
            <Grid container spaceing={16}>
                <Grid item sm={8} xs={12}> 
                    {recentGraffitisMarkup}
                </Grid>
            </Grid>
            </div>
        );
    }
}


                //<Grid item sm={4} xs={12}>
                //    Profile...
                //</Grid>

export default home
