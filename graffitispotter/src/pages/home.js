import React, { Component } from 'react'
import { Link } from 'react-router-dom';

class home extends Component {
    render() {
        return (
            <div>
                <h1>Home Page</h1>
                <Link to='/login'>login</Link>
                <br></br>
                <Link to='/signup'>register</Link>
                <br></br>
                <Link to='/listOfUsers'>listOfUsers</Link>

            </div>
        )
    }
}

export default home
