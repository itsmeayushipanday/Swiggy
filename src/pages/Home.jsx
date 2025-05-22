import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import RestaurantCard from "../components/RestaurantCard";
import ShimmerCard from "../components/ShimmerCard";
import './Home.css';

const FILTERS = [
    { label: "Food in 10 mins", key: "fastDelivery" },
    { label: "Offers", key: "offers" },
    { label: "Ratings 4.0+", key: "rating" },
    { label: "Rs. 300–Rs. 600", key: "midPrice" },
    { label: "Less than Rs. 300", key: "lowPrice" },
    { label: "Pure Veg", key: "pureVeg" },
    { label: "Pure Non-Veg", key: "pureNonVeg" },
];

const CUISINE_SCROLL_STEP = 3;

function Home({ searchTerm }) {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilters, setActiveFilters] = useState([]);
    const [cuisines, setCuisines] = useState([]);
    const [cuisineScroll, setCuisineScroll] = useState(0);

    const navigate = useNavigate();


    useEffect(() => {
        fetch(`https://www.swiggy.com/dapi/restaurants/list/v5?lat=26.490642&lng=80.3093933&is-seo-homepage-enabled=true`)
            .then((response) => response.json())
            .then((data) => {
                const mindSection = data?.data?.cards?.find(card => card.card?.card?.id === "whats_on_your_mind");
                const cuisineList = mindSection?.card?.card?.imageGridCards?.info || [];
                const resList = data?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants;
                setRestaurants(resList || []);
                setLoading(false);
                setCuisines(cuisineList);
            });
        setLoading(true);
    }, []);

    // Filtering logic
    let filteredRestaurants = restaurants;

    if (searchTerm) {
        filteredRestaurants = filteredRestaurants.filter(res => {
            const name = res.info?.name?.toLowerCase() || "";
            const cuisines = (res.info?.cuisines || []).join(' ').toLowerCase();
            return name.includes(searchTerm.toLowerCase()) || cuisines.includes(searchTerm.toLowerCase());
        });
    }

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
                return match ? parseInt(match[0]) >= 300 && parseInt(match[0]) <= 600 : false;
            });
        }
        if (filter === 'lowPrice') {
            filteredRestaurants = filteredRestaurants.filter(res => {
                const cost = res.info?.costForTwo || '';
                const match = cost.match(/\d+/g);
                return match ? parseInt(match[0]) < 300 : false;
            });
        }
        if (filter === 'pureVeg') {
            filteredRestaurants = filteredRestaurants.filter(res => res.info?.veg);
        }
        if (filter === 'pureNonVeg') {
            filteredRestaurants = filteredRestaurants.filter(res => !res.info?.veg);
        }
    });

    const handleFilterClick = (key) => {
        setActiveFilters(prev => prev.includes(key) ? prev : [...prev, key]);
    };

    const handleRemoveFilter = (key) => {
        setActiveFilters(prev => prev.filter(f => f !== key));
    };

    return (
        <div className="home">
            <div className="mind-section">
                <div className="mind-header-row">
                    <h2 className="mind-title">What's your hunger mood?</h2>
                    <div className="mind-arrows">
                        <button className="mind-arrow-btn" onClick={() => setCuisineScroll(s => Math.max(0, s - CUISINE_SCROLL_STEP))}>
                            <span className="arrow-icon">&#8592;</span>
                        </button>
                        <button className="mind-arrow-btn" onClick={() => setCuisineScroll(s => Math.min(cuisines.length - CUISINE_SCROLL_STEP, s + CUISINE_SCROLL_STEP))}>
                            <span className="arrow-icon">&#8594;</span>
                        </button>
                    </div>
                </div>
                <div className="mind-cuisines-row">
                    {loading
                        ? Array.from({ length: 6 }).map((_, idx) => (
                            <div className="mind-cuisine-card shimmer" key={idx}>
                                <div className="mind-cuisine-shimmer-img shimmer-anim"></div>
                            </div>
                        ))
                        : cuisines.slice(cuisineScroll, cuisineScroll + 6).map((cuisine, idx) => (
                            <div
                                className="mind-cuisine-card"
                                key={cuisine.id || idx}
                                onClick={() => navigate(`/cuisine/${encodeURIComponent(cuisine.action?.text || '')}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <img src={cuisine.imageId ? `https://media-assets.swiggy.com/swiggy/image/upload/${cuisine.imageId}` : ''} alt={cuisine.accessibility?.altText || cuisine.action?.text || 'Cuisine'} className="mind-cuisine-img" />
                            </div>
                        ))}
                </div>
            </div>

            <div className="home-header-row">
                <h2 className="hello">Popular Restaurants Nearby</h2>
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
                ) : filteredRestaurants.length > 0 ? (
                    filteredRestaurants.map((res) => (
                        <RestaurantCard data={res} key={res.id} />
                    ))
                ) : (
                    <p>No restaurants found.</p>
                )}
            </div>
        </div>
    );
}

export default Home;
