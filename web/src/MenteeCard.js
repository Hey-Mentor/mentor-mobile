import React, { Component } from 'react';
import card from './MenteeCard.css';

class MenteeCard extends Component {
    render() {
        const menteeName = this.props.mentee.name;
        const gradDate = this.props.mentee.GradDate;

        return (
            <div id="card" className="menteeCard">
                <img src="https://www.w3schools.com/howto/img_avatar.png" className="profilePic" />
                <div className="menteeName headText">
                    <h1>{menteeName}</h1>
                </div>
                <div className="details smallText">
                    <span> Wakanda High School </span>
                    <br />
                    <span>{gradDate}</span>
                </div>
                <button id="profileButton" className="cardButton">
                    <h3> View Profile </h3>
                </button>
                <button id="messageButton" className="cardButton">
                    <h3> Messages </h3>
                </button>
            </div>
        );
    }
}

export default MenteeCard;
