
const getKevin = () => {
    fetch('https://hey-mentor.herokuapp.com/mentees/5aad679470d1d772de34b425')
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        console.log(myJson);
    });
}

const MenteeService = {
    getKevin: getKevin
};

module.exports = MenteeService;