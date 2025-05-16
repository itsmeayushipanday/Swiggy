import { useNavigate } from 'react-router-dom'
import './RestaurantCard.css'
import ratingStar from '../assets/rating.png';

function RestaurantCard({ data }) {
    const navigate = useNavigate();
    if (!data) return null;

    const id = data.info?.id || data._id;
    const { name, cuisines, avgRating, weighted_rating_value, cloudinaryImageId, sla, areaName, aggregatedDiscountInfoV3 } = data.info || data;
    const imageUrl = cloudinaryImageId
        ? `https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/${cloudinaryImageId}`
        : undefined;
    const rating = avgRating || (weighted_rating_value ? weighted_rating_value.toFixed(1) : 'N/A');
    const time = sla?.slaString;
    const offer = aggregatedDiscountInfoV3
        //? `${aggregatedDiscountInfoV3.header || ''} ${aggregatedDiscountInfoV3.subHeader || ''}`.trim()
        ? aggregatedDiscountInfoV3.header + " " + aggregatedDiscountInfoV3.subHeader
        : 'No Offer';

    return (
        <div className="restaurant-card" onClick={() => navigate(`/restaurant/${id}`)}>
            {offer && <div className="offer">{offer}</div>}
            {imageUrl && (
                <img src={imageUrl} alt={name} className="restaurant-img" />
            )}
            <h3>{name}</h3>
            <div className="rating-row">
                <img src={ratingStar} alt="rating" className="rating-star" />
                <span className="rating-value">{rating}</span>
                {time && <span className="time">• {time}</span>}
            </div>
            <div className="cuisines">{cuisines ? cuisines.join(", ") : ''}</div>
            <div className="area">{areaName}</div>
        </div>
    );
}

export default RestaurantCard