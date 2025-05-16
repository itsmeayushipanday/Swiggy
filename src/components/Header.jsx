import { Link } from "react-router-dom";
import './Header.css';
import Logo from '../assets/logo.png';
import { useState } from 'react';

function Header({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        onSearch(e.target.value);
    };

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
                style={{ marginLeft: 20, padding: 6, borderRadius: 4, border: '1px solid #ccc', minWidth: 220 }}
            />
            <nav className="nav-links">
                {/* Removed Search link */}
                <Link to="/help">Help</Link>
                <Link to="/about">About</Link>
                <Link to="/cart">Cart</Link>
            </nav>
        </header>
    );
}

export default Header;