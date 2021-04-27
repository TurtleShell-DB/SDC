/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import React from 'react';
import Overview from './Overview/overview.jsx';
import Related from './Related/related.jsx';
import Reviews from './Reviews/reviews.jsx';
import QA from './QA/qa.jsx';
import sampleData from './sampleData.js';
import helpers from './Reviews/helpers.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      overview: false,
      related: false,
      qa: false,
      reviews: false,
    };

    this.getRating = this.getRating.bind(this);
    this.ratingPercentage = this.ratingPercentage.bind(this);
    this.refreshOutfit = this.refreshOutfit.bind(this);
  }

  componentDidMount() {
    const URL = window.location.href;
    const productID = URL.split('products/')[1].split('/')[0];
    const outfitIDs = localStorage.getItem('outfit');
    $.ajax({
      url: `/api/overview/${productID}`,
    })
      .then((responseData) => {
        this.setState({ data: responseData, show: true, overview: true });
        $.ajax({
          url: `/api/information/${productID}`,
          success: (informationData) => {
            const currentData = this.state.data;
            currentData.related = informationData.related;
            currentData.reviews = informationData.reviews;
            currentData.qa = informationData.qa;
            this.setState({
              data: currentData,
            }, () => this.getRating());
            $.ajax({
              url: '/outfit',
              type: 'POST',
              data: { outfitIDs },
              success: (outfitData) => {
                this.setState({
                  outfitData: outfitData.outfit,
                  related: true,
                  qa: true,
                  reviews: true,
                });
              },
              error: (outfitData) => {
                const outfit = { outfitInformation: [], outfitStyles: [], outfitReviews: [] };
                this.setState({
                  outfitData: outfit,
                  related: true,
                  qa: true,
                  reviews: true,
                });
              },
            });
          },
        });
      });
  }

  getRating() {
    let avgRating;
    if (Object.values(this.state.data.reviews.reviewMeta.ratings).length) {
      avgRating = helpers.averageOfRatings(this.state.data.reviews.reviewMeta.ratings);
    } else {
      avgRating = 0;
    }
    if (avgRating.toString().length === 1) {
      avgRating = `${avgRating.toString()}.0`;
    }
    this.setState({
      avgRating,
    }, () => this.ratingPercentage());
  }

  ratingPercentage() {
    let percentage = this.state.avgRating / 5;
    percentage *= 100;
    this.setState({
      ratingPercentage: `${Math.round(percentage / 10) * 10}%`,
    });
  }

  refreshOutfit() {
    const outfitIDs = localStorage.getItem('outfit');
    $.ajax({
      url: '/outfit',
      type: 'POST',
      data: { outfitIDs },
      success: (outfitData) => {
        this.setState({
          outfitData: outfitData.outfit,
          related: true,
          qa: true,
          reviews: true,
        });
      },
      error: (outfitData) => {
        const outfit = { outfitInformation: [], outfitStyles: [], outfitReviews: [] };
        this.setState({
          outfitData: outfit,
          related: true,
          qa: true,
          reviews: true,
        });
      },
    });
  }

  render() {
    if (this.state.show === false) {
      return (
        <div>Loading ...</div>
      );
    }
    return (
      <div>
        {this.state.overview
          ? (
            <Overview
              data={this.state.data}
              key={Math.random() * 1000000}
              outfitData={this.state.outfitData}
              refreshOutfit={this.refreshOutfit}
              ratingPercentage={this.state.ratingPercentage}
            />
          )
          : <div />}
        {this.state.related
          ? (
            <Related
              data={this.state.data}
              outfitData={this.state.outfitData}
              refreshOutfit={this.refreshOutfit}
              key={Math.random() * 1000000}
            />
          )
          : <div />}
        {this.state.qa
          ? <QA data={this.state.data} key={Math.random() * 1000000} />
          : <div />}
        {this.state.reviews
          ? (
            <Reviews
              data={this.state.data}
              key={Math.random() * 1000000}
              ratingPercentage={this.state.ratingPercentage}
              avgRating={this.state.avgRating}
            />
          )
          : <div />}
      </div>
    );
  }
}

export default App;
