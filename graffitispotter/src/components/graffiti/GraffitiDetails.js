import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import Typorgraphy from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';


const styles = {
    card: {
        display: 'flex',
        marginBottom: 20
    },
    image: {
        minWidth: 200
    },
    content: {
        padding: 25,
        objectFit: 'cover'
    }
};


class GraffitiDetails extends Component {
    render(){
        dayjs.extend(relativeTime)
        const {
            classes,
            graffiti : {
                titulo,
                fecha,
                imagen,
                id,
                likeCount,
                descripcion,
                estado,
                tematica,
                localizacion,
                commentCount,
                autor
            }
        } = this.props
        return(
        <React.Fragment>

            <h1>Acciones para este graffiti...</h1>
            <Link to={`/graffitis/edit/${id}`}>Editar este graffiti</Link>
            <br></br>
            <Link to={`/graffitis/delete/${id}`}>Eliminar este graffiti</Link>
            <br></br>
            <br></br>

            <Typorgraphy variant="h2" >{titulo}</Typorgraphy>
            <img src={imagen} alt={titulo}/>
            <Typography variant="body2" color="textSecondary">Publicado {
                dayjs(fecha).fromNow()
            } por {autor}</Typography>
            <Typography variant="body1">{descripcion}</Typography>
            <br></br>
            <Typorgraphy variant="h4" >Detalles</Typorgraphy>
            <br></br>
            Estado del graffiti: {estado}
            <br></br>
            Temática: {tematica}
            <br></br>
            Localización: ({localizacion._latitude}, {localizacion._longitude})
        </React.Fragment>
        )
    }
}

export default withStyles(styles)(GraffitiDetails);
