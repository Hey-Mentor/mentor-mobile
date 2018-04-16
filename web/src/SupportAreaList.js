import React, { Component } from 'react';
import './SupportAreaList.css';
import SupportArea from './SupportArea.js';

// TODO(ace-n): convert this into generic BubbleList?
class SupportAreaList extends Component {
	render() {
		return (
            <div className="supportAreaList">
                <SupportArea area="College applications" />
                <SupportArea area="Scholarships" supported={ false } />
                <SupportArea area="Financial aid" />
                <SupportArea area="College search" />
                <SupportArea area="Career advice" supported={ true } />
                <SupportArea area="Exam preparation" />
            </div>
        )
	}
}

export default SupportAreaList;
