import React, { Component } from 'react'
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import GraffitiDetails from '../../components/graffiti/GraffitiDetails';

class graffiti extends Component {
    state = {
        graffiti: null,
        comments: null
    }
    componentDidMount(){
        const id = this.props.match.params.id;
        axios.get(`/graffitis/${id}`)
            .then(res => {
                console.log(res.data)
                this.setState({
                    graffiti: res.data
                })
                .catch(err => console.log(err));
            }).catch(err => console.log(err));
        axios.get(`/commentsByGraffiti/${id}`)
           .then(res => {
            console.log(res.data)
            this.setState({
                comments: res.data
            })
            .catch(err => console.log(err));
        }).catch(err => console.log(err));

    }
    render(){
        let GraffitiMarkup = this.state.graffiti ? (
                <GraffitiDetails graffiti={this.state.graffiti} />
            ) : <p>Loading...</p>
        let recentComments = this.state.comments ? (
            this.state.comments.map((comment) =>
                <p>{comment.comentario}</p>
            )) : <p>Loading...</p>
        return (
            <div>
            <Grid container spaceing={16}>
                <Grid item sm={8} xs={12}> 
                    {GraffitiMarkup}
                </Grid>
            </Grid>
                {recentComments}
            </div>

        )
    }

}

export default graffiti;
