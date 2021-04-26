/* eslint-disable react/no-unknown-property */
/* eslint-disable import/extensions */
/* eslint-disable react/prop-types */
import React from 'react';
import styles from '../../styled.js';
import ModalCompare from './ModalCompare.jsx';
import Stars from './Stars.jsx';

class CardStateful extends React.Component {
  constructor(props) {
    super(props);

    this.toggleModal = this.toggleModal.bind(this);
    this.sortModalData = this.sortModalData.bind(this);
    this.calculateReviews = this.calculateReviews.bind(this);

    this.state = {
      modalVisible: false,
      starMap: [],
    };
  }

  componentDidMount() {
    this.sortModalData();
    this.calculateReviews();
  }

  toggleModal() {
    const { modalVisible } = this.state;
    if (modalVisible === true) {
      this.setState({ modalVisible: false });
    } else {
      this.setState({ modalVisible: true });
    }
  }

  sortModalData() {
    const {
      overviewFeatures,
      cardProductFeatures,
    } = this.props;

    const dataForTable = [];

    overviewFeatures.forEach((item) => {
      dataForTable.push({ featureToCompare: item.feature, overviewValue: item.value });
    });

    for (let i = 0; i < dataForTable.length; i += 1) {
      cardProductFeatures.forEach((cardItem) => {
        if (cardItem.feature === dataForTable[i].featureToCompare) {
          dataForTable[i].cardValue = cardItem.value;
        }
      });
    }

    cardProductFeatures.forEach((cardItem) => {
      let unique = true;
      for (let i = 0; i < dataForTable.length; i += 1) {
        if (cardItem.feature === dataForTable[i].featureToCompare) {
          unique = false;
        }
      }
      if (unique === true) {
        dataForTable.push({ featureToCompare: cardItem.feature, cardValue: cardItem.value });
      }
    });

    this.setState({
      comparisonData: dataForTable,
    });
  }

  calculateReviews() {
    const { reviews } = this.props;
    const reviewCollection = reviews.results;
    let sum = 0;
    for (let i = 0; i < reviewCollection.length; i += 1) {
      sum += reviewCollection[i].rating;
    }
    const average = sum / reviewCollection.length;
    const rawDecimal = average - Math.floor(average);
    const whole = average - rawDecimal;
    // eslint-disable-next-line radix
    const decimal = parseFloat(rawDecimal.toFixed(2));
    let newStarMap = [];
    let decimalPushed = false;
    for (let i = 0; i < 5; i += 1) {
      if (i < whole) {
        newStarMap.push(1);
      } else if (i === whole && decimalPushed === false) {
        newStarMap.push(decimal);
        decimalPushed = true;
      } else if (decimalPushed === true) {
        newStarMap.push(0);
      }
    }
    // if (newStarMap.length === 0) {
    //   newStarMap = [0, 0, 0, 0, 0];
    // }
    this.setState({
      starMap: newStarMap,
      reviewCount: reviewCollection.length,
    });
  }

  render() {
    const {
      name,
      category,
      defaultPrice,
      salePrice,
      image,
      id,
    } = this.props;

    const {
      modalVisible, comparisonData, starMap, reviewCount,
    } = this.state;
    return (
      <styles.cardComponentDiv>
        <i className="fas fa-star-of-life fa-5x" onClick={() => { this.toggleModal(); }} />
        <br />
        <span>{name}</span>
        {starMap && starMap.length && (
        <Stars
          starMap={starMap}
          reviewCount={reviewCount}
        />
        )}
        <a href={`/products/${id}/`}>
          <styles.cardImg src={image} alt="" />
          <br />

          <span>{category}</span>
          <br />

          {salePrice ? (
            <div>
              <styles.salePrice>{salePrice}</styles.salePrice>
              <styles.defaultPriceStrike>{defaultPrice}</styles.defaultPriceStrike>
            </div>
          ) : <span>{defaultPrice}</span>}
        </a>
        { modalVisible ? (
          <ModalCompare
            toggleModal={this.toggleModal}
            comparisonData={comparisonData}
          />
        ) : null}
      </styles.cardComponentDiv>
    );
  }
}
export default CardStateful;
