import React, { useState } from 'react';
import './Cart.css'; // Assuming you have a CSS file for styling

const Cart = ({ cart }) => {
  // If cart is not passed as prop, try to get from localStorage (for demo)
  const [cartState] = useState(cart || JSON.parse(localStorage.getItem('swiggy_cart') || '[]'));

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
                  <div className="cart-item-base">Base: ₹{item.basePrice}</div>
                  {getAddonNames(item)}
                </div>
              </div>
              <div className="cart-item-qty-price">
                <div className="cart-item-qty">Qty: {item.quantity}</div>
                <div className="cart-item-total">₹{(item.total * item.quantity).toFixed(2)}</div>
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
