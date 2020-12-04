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
            <div>
            <Typorgraphy variant="h5" >{titulo}</Typorgraphy>
            <Typography variant="body2" color="textSecondary">{
                dayjs(fecha).fromNow()
            }</Typography>
            <Typography variant="body1">{descripcion}</Typography>
            </div>
        )
    }
}

export default withStyles(styles)(GraffitiDetails);
