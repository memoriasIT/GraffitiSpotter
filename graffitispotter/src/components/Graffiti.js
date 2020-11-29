import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import axios from 'axios';
//MUI
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typorgraphy from '@material-ui/core/Typography';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';

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



class Graffiti extends Component {
    handleLike() {
        const id = this.props.graffiti.id;
        const usuario= {
            username : "nuevo"
        }
        axios.post(`/graffiti/${id}/likeGraffiti`, usuario)
        .then(res => {
            console.log(res.data);
        })
        .catch(err => {
            console.log(err.data);
        })
    };
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
            <Card className={classes.card}>
                <CardMedia
                image={imagen}
                title={titulo} 
                className={classes.image}/>
                <CardContent className={classes.content}>
                    <Typorgraphy 
                        variant="h5" 
                        component={Link} 
                        to={`/graffitis/${id}`}
                    >
                    {titulo}
                    </Typorgraphy>
                    <Typography variant="body2" color="textSecondary">{
                        dayjs(fecha).fromNow()
                    }</Typography>
                    <Typography variant="body1">{descripcion}</Typography>
                    <Typography variant="body1" color="textSecondary">Likes: {likeCount}</Typography>
                    <IconButton type="button" onClick={() => this.handleLike() } type="submit" color="secondary" aria-label="like">
                        <FavoriteIcon />
                    </IconButton>
                </CardContent>
            </Card>
        )
    }
}

export default withStyles(styles)(Graffiti);
