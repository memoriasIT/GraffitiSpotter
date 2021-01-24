import React, { Component } from "react";
import { Row, Button } from 'react-bootstrap';
import Cookies from 'universal-cookie';


class Logout extends Component {
    

    constructor(props) {
        super(props)

        this.state = {
            formData: {}, // Contains login form data
            errors: {}, // Contains login field errors
            formSubmitted: false, // Indicates submit status of login form
            loading: false // Indicates in progress state of login form
        }
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        let { formData } = this.state;
        formData[name] = value;

        this.setState({
            formData: formData
        });
    }



    logout = (e) => {
        const cookies = new Cookies();
        cookies.remove("access-token");
        cookies.remove("user");
    }

    render() {
        return (
            <div className="Login">
                <Row>
                    <form onSubmit={this.logout}>
                        <h1>¿Estás seguro?</h1>
                        <Button type="submit" bsStyle="primary">Si</Button>
                    </form>
                </Row>
            </div>
        )
    }
}

export default Logout;