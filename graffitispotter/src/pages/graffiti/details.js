import React, { Component } from 'react'
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import GraffitiDetails from '../../components/graffiti/GraffitiDetails';
import Cookies from 'universal-cookie';

class graffiti extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: 'hola',
            comentario: null,
            graffiti: this.props.match.params.id
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(event) {
        const cookies = new Cookies();
        var Bearer = 'Bearer ' + cookies.get('access-token');
        console.log(this.state);
        axios.post('/createComment', this.state, { headers:
            {
            'Authorization': Bearer
            }
        })
        .then(res => {
            console.log(res.data)
            this.setState({
                id: res.data.graffitiId
            });
        })
        .catch(err => console.log(err));
        event.preventDefault();

    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }
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
        let Formulario = (
                <form onSubmit={this.handleSubmit}>
                    <label><br />
                        Comentario:<br />
                        <input name="comentario" type="text"
                            checked={this.state.comentario}
                            onChange={this.handleInputChange} />
                    </label>
                    <br />
                 <input type="submit" value="Enviar" />
                </form>
            )
        return (
            <div>
            <Grid container spaceing={16}>
                <Grid item sm={8} xs={12}> 
                    {GraffitiMarkup}
                </Grid>
            </Grid>
                {recentComments}
                {Formulario}
            </div>

        )
    }

}

export default graffiti;
