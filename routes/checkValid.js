const checkValidTitle = (title) => {
    const regex = /^\s*$/;
        
    return regex.test(title);
};

const checkValidPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    return regex.test(password);
};

const checkValidID = (id) => {
    return id.length >= 8;
}

module.exports = {checkValidTitle, checkValidPassword, checkValidID};