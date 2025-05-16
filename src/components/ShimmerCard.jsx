import './RestaurantCard.css';

function ShimmerCard() {
    return (
        <div className="restaurant-card shimmer">
            <div className="shimmer-img" />
            <div className="shimmer-title shimmer-line" />
            <div className="shimmer-cuisine shimmer-line" />
            <div className="shimmer-rating shimmer-line" />
        </div>
    );
}

export default ShimmerCard;
