import React, { useState } from 'react';
import './Cart.css'; 

const Cart = ({ cart }) => {
  const [cartState, setCartState] = useState(cart || JSON.parse(localStorage.getItem('swiggy_cart') || '[]'));

  const getAddonNames = (item) => {
    if (!item.addonGroups) return null;
    return item.addonGroups.map(group => {
      const selectedId = item.selectedAddons[group.groupId];
      const selected = group.choices.find(c => c.id === selectedId);
      return selected ? (
        <div key={group.groupId} className="cart-addon-row">
          <span className="cart-addon-group-name">{group.groupName}:</span> <span className="cart-addon-choice">{selected.name}{selected.price ? ` (+₹${selected.price / 100})` : ''}</span>
        </div>
      ) : null;
    });
  };

  const getTotal = () => {
    return cartState.reduce((sum, item) => sum + (item.total * item.quantity), 0).toFixed(2);
  };

  const handleRemove = (id) => {
    const updatedCart = cartState.filter(item => item.id !== id);
    setCartState(updatedCart);
    localStorage.setItem('swiggy_cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('swiggy_cart_update'));
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {cartState.length === 0 ? (
        <div className="cart-empty">Your cart is empty.</div>
      ) : (
        <div className="cart-list">
          {cartState.map(item => (
            <div className="cart-item" key={item.id}>
              <div className="cart-item-img-info">
                {item.imageId && (
                  <img className="cart-item-img" src={`https://media-assets.swiggy.com/swiggy/image/upload/${item.imageId}`} alt={item.name} />
                )}
                <div className="cart-item-info">
                  <div className="cart-item-title">{item.name}</div>
                  <div className="cart-item-restaurant">Restaurant Name: {item.restaurantName}</div>
                  <div className="cart-item-base">Base: ₹{item.basePrice}</div>
                  {getAddonNames(item)}
                </div>
              </div>
              <div className="cart-item-qty-price">
                <div className="cart-item-qty">Qty: {item.quantity}</div>
                <div className="cart-item-total">₹{(item.total * item.quantity).toFixed(2)}</div>
                <button className="cart-remove-btn" onClick={() => handleRemove(item.id)}>Remove</button>
              </div>
            </div>
          ))}
          <div className="cart-grand-total">Grand Total: ₹{getTotal()}</div>
        </div>
      )}
    </div>
  );
};

export default Cart;
