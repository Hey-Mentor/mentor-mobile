
const getKevin = () => {
  fetch('https://hey-mentor.herokuapp.com/mentees/5aad679470d1d772de34b425')
    .then(response => response.json())
    .then((myJson) => {
      console.log(myJson);
    });
};

const MenteeService = {
  getKevin
};

module.exports = MenteeService;
