import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Restaurant.css';
import addBtn from '../assets/btn.png';

const Restaurant = () => {
  const { id } = useParams();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [showAddonModal, setShowAddonModal] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState({});
  const [addonGroups, setAddonGroups] = useState([]);
  const [currentDish, setCurrentDish] = useState(null);
  const [addonStep, setAddonStep] = useState(0);
  const [cart, setCart] = useState([]);
  const [addedDishIds, setAddedDishIds] = useState([]);
  // Filter state for restaurant page
  const [dishFilters, setDishFilters] = useState([]);

  // Get restaurant name from API response
  const [restaurantName, setRestaurantName] = useState('');

  useEffect(() => {
    const fetchapi = async () => {
      try {
        const response = await fetch(
          `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=26.490642&lng=80.3093933&restaurantId=${id}`
        );
        const newdata = await response.json();
        // Get restaurant name
        const restName = newdata?.data?.cards?.[2]?.card?.card?.info?.name || '';
        setRestaurantName(restName);
        // All sections with itemCards object
        const cards = newdata?.data?.cards?.[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards || [];
        const menuSections = cards
          .filter(c => c.card?.card?.itemCards && c.card?.card?.title)
          .map(c => ({
            title: c.card.card.title,
            items: c.card.card.itemCards.map(i => i.card.info),
            count: c.card.card.itemCards.length,
          }));
        setSections(menuSections);
        // By default, expand only the first section
        setExpanded(menuSections.reduce((acc, sec, idx) => ({ ...acc, [sec.title]: idx === 0 }), {}));
      } catch (e) {
        setSections([]);
      } finally {
        setLoading(false);
      }
    };
    fetchapi();
  }, [id]);

  // Open Addon Modal
  const handleAddClick = (item) => {
    setCurrentDish(item);
    setShowAddonModal(true);
    setAddonGroups(item.addons || []);
    setSelectedAddons({});
  };

  // Select Addon
  const handleAddonSelect = (groupId, choiceId) => {
    setSelectedAddons(prev => ({ ...prev, [groupId]: choiceId }));
  };

  // Close Modal
  const handleCloseModal = () => {
    setShowAddonModal(false);
    setCurrentDish(null);
    setAddonGroups([]);
    setSelectedAddons({});
  };

  const handleToggle = (title) => {
    setExpanded(prev => ({ ...prev, [title]: !prev[title] }));
  };

  // Calculate total price for modal
  const getTotalPrice = () => {
    let base = (currentDish?.price || currentDish?.defaultPrice || 0) / 100;
    let addonTotal = 0;
    if (addonGroups.length > 0) {
      addonGroups.forEach(group => {
        const selected = selectedAddons[group.groupId];
        if (selected) {
          const found = group.choices.find(c => c.id === selected);
          if (found && found.price) addonTotal += found.price / 100;
        }
      });
    }
    return (base + addonTotal).toFixed(2);
  };

  // Add to cart and update UI after modal
  const handleNextAddonStep = () => {
    if (addonStep < addonGroups.length - 1) {
      setAddonStep(addonStep + 1);
    } else {
      // Final step: add to cart
      const total = getTotalPrice();
      const cartItem = {
        id: currentDish.id,
        name: currentDish.name,
        imageId: currentDish.imageId,
        basePrice: (currentDish.price || currentDish.defaultPrice) / 100,
        selectedAddons: { ...selectedAddons },
        addonGroups: JSON.parse(JSON.stringify(addonGroups)),
        total: parseFloat(total),
        quantity: 1,
      };
      setCart(prev => [...prev, cartItem]);
      setAddedDishIds(prev => [...prev, currentDish.id]);
      setShowAddonModal(false);
      setCurrentDish(null);
      setAddonGroups([]);
      setSelectedAddons({});
    }
  };

  // Reset step on open/close
  useEffect(() => {
    if (showAddonModal) setAddonStep(0);
  }, [showAddonModal]);

  // Quantity change handler
  const handleQtyChange = (id, delta) => {
    setCart(prev => prev.map(ci => ci.id === id ? { ...ci, quantity: Math.max(1, ci.quantity + delta) } : ci));
  };

  // Save cart to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('swiggy_cart', JSON.stringify(cart));
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('swiggy_cart_update'));
  }, [cart]);

  // Dish filter logic
  const filterDishes = (items) => {
    let filtered = items;
    if (dishFilters.includes('veg')) {
      filtered = filtered.filter(item => item.isVeg);
    }
    if (dishFilters.includes('nonveg')) {
      filtered = filtered.filter(item => item.isVeg === false);
    }
    if (dishFilters.includes('bestseller')) {
      filtered = filtered.filter(item => item.ribbon?.text?.toLowerCase() === 'bestseller');
    }
    return filtered;
  };

  return (
    <div className="restaurant-menu-page">
      {/* Restaurant name and dish filters */}
      <div className="restaurant-header-row">
        <div className="restaurant-title"><b>{restaurantName}</b></div>
        <div className="restaurant-dish-filters">
          <button className={`dish-filter-btn${dishFilters.includes('veg') ? ' active' : ''}`} onClick={() => setDishFilters(f => f.includes('veg') ? f.filter(x => x !== 'veg') : [...f, 'veg'])}>Veg</button>
          <button className={`dish-filter-btn${dishFilters.includes('nonveg') ? ' active' : ''}`} onClick={() => setDishFilters(f => f.includes('nonveg') ? f.filter(x => x !== 'nonveg') : [...f, 'nonveg'])}>Non-Veg</button>
          <button className={`dish-filter-btn${dishFilters.includes('bestseller') ? ' active' : ''}`} onClick={() => setDishFilters(f => f.includes('bestseller') ? f.filter(x => x !== 'bestseller') : [...f, 'bestseller'])}>Bestseller</button>
        </div>
      </div>
      {loading ? (
        <div className="menu-section"><p>Loading menu...</p></div>
      ) : sections.length > 0 ? (
        sections.map(section => (
          <div className="menu-section" key={section.title}>
            <div className="menu-section-header" onClick={() => handleToggle(section.title)}>
              <h2 className="menu-section-title">{section.title} <span className="menu-section-count">({section.count})</span></h2>
              <span className="menu-section-arrow">{expanded[section.title] ? '\u25B2' : '\u25BC'}</span>
            </div>
            {expanded[section.title] && (
              <div className="menu-items-list">
                {filterDishes(section.items).map((item) => (
                  <div className="menu-item-card" key={item.id}>
                    <div className="menu-item-info">
                      <div className="menu-item-header-row">
                        {item.isVeg !== undefined && (
                          <span className={`menu-item-veg ${item.isVeg ? 'veg' : 'nonveg'}`}></span>
                        )}
                        {item.ribbon?.text && <span className="menu-item-badge">{item.ribbon.text}</span>}
                      </div>
                      <div className="menu-item-title">{item.name}</div>
                      <div className="menu-item-price">₹{(item.price || item.defaultPrice) / 100}</div>
                      {item.ratings?.aggregatedRating?.rating && (
                        <div className="menu-item-rating">
                          <span className="menu-item-rating-star">★</span>
                          <span className="menu-item-rating-value">{item.ratings.aggregatedRating.rating}</span>
                          <span className="menu-item-rating-count">({item.ratings.aggregatedRating.ratingCount})</span>
                        </div>
                      )}
                      <div className="menu-item-desc">{item.description}</div>
                    </div>
                    <div className="menu-item-img-btn-col">
                      {item.imageId && (
                        <img className="menu-item-img" src={`https://media-assets.swiggy.com/swiggy/image/upload/${item.imageId}`} alt={item.name} />
                      )}
                      {addedDishIds.includes(item.id) ? (
                        <div className="menu-item-qty-box">
                          <button className="qty-btn" onClick={() => handleQtyChange(item.id, -1)}>-</button>
                          <span className="qty-value">{cart.find(ci => ci.id === item.id)?.quantity || 1}</span>
                          <button className="qty-btn" onClick={() => handleQtyChange(item.id, 1)}>+</button>
                        </div>
                      ) : (
                        <button className="swiggy-add-btn" onClick={() => handleAddClick(item)}>
                          ADD
                        </button>
                      )}

                      {item.addons && item.addons.length > 0 && (
                        <div className="menu-item-customisable">Customisable</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="menu-section"><p>No menu items found.</p></div>
      )}
      {/* Addon Modal */}
      {showAddonModal && currentDish && (
        <div className="addon-modal-overlay">
          <div className="addon-modal-box cart-modal-style">
            <button className="addon-modal-close" onClick={handleCloseModal}>×</button>
            <div className="addon-modal-header-row">
              <div className="addon-modal-dish-name">{currentDish.name}</div>
              <div className="addon-modal-dish-price">₹{(currentDish.price || currentDish.defaultPrice) / 100}</div>
            </div>
            <div className="addon-modal-title">Customise as per your taste</div>
            <hr className="addon-modal-divider" />
            {addonGroups.length > 0 && (
              <div className="addon-modal-stepper">Step {addonStep + 1}/{addonGroups.length}</div>
            )}
            {addonGroups.length > 0 && (
              <div className="addon-group cart-addon-group addon-group-scrollable">
                <div className="addon-group-title">{addonGroups[addonStep].groupName}</div>
                <div className="addon-group-choices">
                  {addonGroups[addonStep].choices.map(choice => (
                    <label key={choice.id} className={`addon-choice-label cart-addon-choice-label${selectedAddons[addonGroups[addonStep].groupId] === choice.id ? ' selected' : ''}`}> 
                      <input
                        type="radio"
                        name={`addon-group-${addonGroups[addonStep].groupId}`}
                        checked={selectedAddons[addonGroups[addonStep].groupId] === choice.id}
                        onChange={() => handleAddonSelect(addonGroups[addonStep].groupId, choice.id)}
                      />
                      <span className="addon-choice-name">{choice.name}</span>
                      {choice.price ? (
                        <span className="addon-choice-price">+ ₹{choice.price / 100}</span>
                      ) : null}
                    </label>
                  ))}
                </div>
              </div>
            )}
            <div className="addon-modal-footer-row">
              <div className="addon-modal-step-label">₹{getTotalPrice()}</div>
              <button className="addon-modal-continue cart-modal-continue" onClick={handleNextAddonStep}>
                {addonStep === addonGroups.length - 1 ? 'Add Item to cart' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Restaurant;
