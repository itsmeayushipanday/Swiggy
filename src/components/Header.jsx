import { Link } from "react-router-dom";
import './Header.css';
import Logo from '../assets/logo.png';
import { useEffect, useState } from 'react';

function Header({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [cartCount, setCartCount] = useState(0);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        onSearch(e.target.value);
    };

    useEffect(() => {
        // Listen for cart changes in localStorage
        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem('swiggy_cart') || '[]');
            const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            setCartCount(count);
        };
        updateCartCount();
        window.addEventListener('storage', updateCartCount);
        // Custom event for same-tab updates
        window.addEventListener('swiggy_cart_update', updateCartCount);
        return () => {
            window.removeEventListener('storage', updateCartCount);
            window.removeEventListener('swiggy_cart_update', updateCartCount);
        };
    }, []);

    return (
        <header className="header">
            <Link to="/" className="logo-link">
                <img src={Logo} alt="Swiggy Logo" className="logo" style={{ height: 40 }} />
            </Link>
            <input
                type="text"
                className="search-box"
                placeholder="Search restaurants or dishes..."
                value={searchTerm}
                onChange={handleInputChange}
            />
            <nav className="nav-links">
                <Link to="/cart" className="header-cart-link">
                    Cart{cartCount > 0 && <span className="header-cart-count">{cartCount}</span>}
                </Link>
            </nav>
        </header>
    );
}

export default Header;