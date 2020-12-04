import React, { Component } from 'react'
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import GraffitiDetails from '../components/GraffitiDetails';

class graffiti extends Component {
    state = {
        graffiti: null
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
            })
    }
    render(){
        let GraffitiMarkup = this.state.graffiti ? (
            this.state.graffiti.map((graffiti) => 
                <GraffitiDetails graffiti={graffiti} />
            )) : <p>Loading...</p>

        return (
            <Grid container spaceing={16}>
                <Grid item sm={8} xs={12}> 
                    {GraffitiMarkup}
                </Grid>
            </Grid>

        )
    }

}

export default graffiti;
