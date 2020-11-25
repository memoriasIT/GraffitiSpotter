// Email must follow email pattern - Just believe the regex lol
const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) return true; // It is a valid email
    else return false;
};

// Email cannot be empty
const isEmpty = (string) => {
    // If only spaces it is deleted aswell
    if (string.trim() === '') return true;
    else return false;
};

exports.validateSignupData = (data) => {
    // Push errors if any
    let errors = {};

    // Check mail
    if (isEmpty(data.email)) {
    errors.email = 'Must not be empty';
    } else if (!isEmail(data.email)) {
    errors.email = 'Must be a valid email address';
    }

    // Check password
    if (isEmpty(data.password)) errors.password = 'Must not be empty';
    if (data.password !== data.confirmPassword)
    errors.confirmPassword = 'Passwords must match';

    // Check username
    if (isEmpty(data.username)) errors.username = 'Must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }

}



exports.validateLoginData = (data) => {
    // Store errors for response
    let errors = {};
    
    // Validate input email and password
    if (isEmpty(data.email)) errors.email = 'Must not be empty';
    if (isEmpty(data.password)) errors.password = 'Must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}