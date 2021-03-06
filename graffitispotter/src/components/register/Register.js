import React, { Component } from "react";
import axios from 'axios';
import { Row, FormGroup, FormControl, ControlLabel, Button, HelpBlock } from 'react-bootstrap';
import {  isEmpty} from '../shared/validator';
import Cookies from 'universal-cookie';


class Register extends Component {
    

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

    validateRegisterForm = (e) => {
        //TODO validate form
        let errors = {};
        // const { formData } = this.state;

        // if (isEmpty(formData.email)) {
        //     errors.email = "Email can't be blank";
        // } else if (!isEmail(formData.email)) {
        //     errors.email = "Please enter a valid email";
        // }

        // if (isEmpty(formData.password)) {
        //     errors.password = "Password can't be blank";
        // }  else if (isContainWhiteSpace(formData.password)) {
        //     errors.password = "Password should not contain white spaces";
        // } else if (!isLength(formData.password, { gte: 6, lte: 16, trim: true })) {
        //     errors.password = "Password's length must between 6 to 16";
        // }

        if (isEmpty(errors)) {
            return true;
        } else {
            return errors;
        }
    }

    register = (e) => {
        const { formData } = this.state;


        var registerConfig = {
            method: 'post',
            url: 'https://us-central1-thegraffitispotter.cloudfunctions.net/api/signup',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : formData
          };

        e.preventDefault();

        let errors = this.validateRegisterForm();

        if(errors === true){
            // No errors found, register
            axios(registerConfig)
                .then(function (response) {
                    console.log(JSON.stringify(response.data));
                    const cookies = new Cookies();
                    cookies.set('access-token', response.data.token, {'path' : '/'});
                    cookies.set('user', formData.email, {'path' : '/', sameSite : true});

                    window.location.href = `${window.location.origin.toString()}`;
                })
                .catch(function (error) {
                console.log(error);
                });

        } else {
            this.setState({
                errors: errors,
                formSubmitted: true
            });
        }
    }

    render() {

        const { errors, formSubmitted } = this.state;

        return (
            <div className="Register">
                <Row>
                    <form onSubmit={this.register}>
                        <FormGroup controlId="email" validationState={ formSubmitted ? (errors.email ? 'error' : 'success') : null }>
                            <ControlLabel>Email</ControlLabel>
                            <FormControl type="text" name="email" placeholder="Enter your email" onChange={this.handleInputChange} />
                        { errors.email &&
                            <HelpBlock>{errors.email}</HelpBlock>
                        }
                        </FormGroup>
                        <FormGroup controlId="username" validationState={ formSubmitted ? (errors.username ? 'error' : 'success') : null }>
                            <ControlLabel>Username</ControlLabel>
                            <FormControl type="text" name="username" placeholder="Enter your username" onChange={this.handleInputChange} />
                        { errors.username &&
                            <HelpBlock>{errors.username}</HelpBlock>
                        }
                        </FormGroup>
                        <FormGroup controlId="password" validationState={ formSubmitted ? (errors.password ? 'error' : 'success') : null }>
                            <ControlLabel>Password</ControlLabel>
                            <FormControl type="password" name="password" placeholder="Enter your password" onChange={this.handleInputChange} />
                        { errors.password &&
                            <HelpBlock>{errors.password}</HelpBlock>
                        }
                        </FormGroup>
                        <FormGroup controlId="confirmPassword" validationState={ formSubmitted ? (errors.confirmPassword ? 'error' : 'success') : null }>
                            <ControlLabel>Confirm Password</ControlLabel>
                            <FormControl type="password" name="confirmPassword" placeholder="Re-enter your password" onChange={this.handleInputChange} />
                        { errors.confirmPassword &&
                            <HelpBlock>{errors.confirmPassword}</HelpBlock>
                        }
                        </FormGroup>
                        <Button type="submit" bsStyle="primary">Register</Button>
                    </form>
                </Row>
            </div>
        )
    }
}

export default Register;