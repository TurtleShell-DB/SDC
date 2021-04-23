import React from 'react';

class MoreReviews extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.addPosts(this.props.prevPosts);
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick} className="review-btn" type="button">More Reviews</button>
      </div>
    );
  }
}

<<<<<<< HEAD
export default MoreReviews;
=======
export default MoreReviews;
>>>>>>> 96e59099fdd0b78fef2438b979266a988b645edd
