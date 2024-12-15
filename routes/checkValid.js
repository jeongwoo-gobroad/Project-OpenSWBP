const checkValidTitle = (title) => {
    const regex = /^\s*$/;
        
    return regex.test(title);
};

module.exports = checkValidTitle;