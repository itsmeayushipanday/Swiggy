import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import RestaurantCard from '../components/RestaurantCard';
import ShimmerCard from '../components/ShimmerCard';
import './Home.css';

const FILTERS = [
    { label: "Food in 10 mins", key: "fastDelivery" },
    { label: "Offers", key: "offers" },
    { label: "Ratings 4.0+", key: "rating" },
    { label: "Rs. 300–Rs. 600", key: "midPrice" },
    { label: "Less than Rs. 300", key: "lowPrice" },
];

function Cuisine() {
    const { cuisineName } = useParams();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilters, setActiveFilters] = useState([]);

    useEffect(() => {
        setLoading(true);
        fetch(`https://www.swiggy.com/dapi/restaurants/list/v5?lat=26.490642&lng=80.3093933&is-seo-homepage-enabled=true`)
            .then((response) => response.json())
            .then((data) => {
                var resList = data?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants;
                // Filter restaurants by cuisine
                const filtered = resList?.filter(res =>
                    (res.info?.cuisines || []).some(c => c.toLowerCase() === decodeURIComponent(cuisineName).toLowerCase())
                ) || [];
                setRestaurants(filtered);
                setLoading(false);
            });
    }, [cuisineName]);

    // Filter logic (same as Home)
    let filteredRestaurants = restaurants;
    activeFilters.forEach(filter => {
        if (filter === 'fastDelivery') {
            filteredRestaurants = filteredRestaurants.filter(res => res.info?.sla?.deliveryTime && res.info.sla.deliveryTime <= 10);
        }
        if (filter === 'offers') {
            filteredRestaurants = filteredRestaurants.filter(res => res.info?.aggregatedDiscountInfoV3?.header);
        }
        if (filter === 'rating') {
            filteredRestaurants = filteredRestaurants.filter(res => (parseFloat(res.info?.avgRating) || 0) >= 4.0);
        }
        if (filter === 'midPrice') {
            filteredRestaurants = filteredRestaurants.filter(res => {
                const cost = res.info?.costForTwo || '';
                const match = cost.match(/\d+/g);
                if (!match) return false;
                const value = parseInt(match[0]);
                return value >= 300 && value <= 600;
            });
        }
        if (filter === 'lowPrice') {
            filteredRestaurants = filteredRestaurants.filter(res => {
                const cost = res.info?.costForTwo || '';
                const match = cost.match(/\d+/g);
                if (!match) return false;
                const value = parseInt(match[0]);
                return value < 300;
            });
        }
    });

    const handleFilterClick = (key) => {
        setActiveFilters((prev) => prev.includes(key) ? prev : [...prev, key]);
    };
    const handleRemoveFilter = (key) => {
        setActiveFilters((prev) => prev.filter(f => f !== key));
    };

    return (
        <div className="home">
            <div className="home-header-row">
                <h2>Restaurants serving {decodeURIComponent(cuisineName)}</h2>
                <div className="filters-row">
                    {FILTERS.map(f => (
                        <button
                            key={f.key}
                            className={`filter-btn${activeFilters.includes(f.key) ? ' active' : ''}`}
                            onClick={() => activeFilters.includes(f.key) ? handleRemoveFilter(f.key) : handleFilterClick(f.key)}
                        >
                            {f.label}
                            {activeFilters.includes(f.key) && <span className="filter-cross">&times;</span>}
                        </button>
                    ))}
                </div>
            </div>
            <div className="restaurant-list">
                {loading ? (
                    Array.from({ length: 10 }).map((_, idx) => <ShimmerCard key={idx} />)
                ) : filteredRestaurants && filteredRestaurants.length > 0 ? filteredRestaurants.map((res) =>
                    <RestaurantCard data={res} key={res.id} />
                    ) : <p>Sorry! No restaurants found for {decodeURIComponent(cuisineName)}.</p>}
            </div>
        </div>
    );
}

export default Cuisine;
