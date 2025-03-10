import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import "../../assets/css/Navbar.css";

const Navbar = () => {
    const cartItems = useSelector((state) => state.cart?.items?.length || 0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const isLoggedIn = useSelector((state) => state.auth?.isLoggedIn);

    return (
        <nav className="navbar">
            {/* Logo */}
            <div className="logo">
                <h1>E-Shop</h1>
            </div>

            {/* Navigation Links */}
            <div className={`nav-links ${menuOpen ? "open" : ""}`}>
                <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>
                <Link to="/cart" className="cart-icon" onClick={() => setMenuOpen(false)}>
                    <FaShoppingCart />
                    {cartItems > 0 && <span className="cart-count">{cartItems}</span>}
                </Link>

                {/* Profile Dropdown */}
                <div className="profile-menu">
                    <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                        <FaUser />
                    </button>
                    {dropdownOpen && (
                        <div className="dropdown">
                            <Link to="/profile">Profile</Link>
                            <Link to="/orders">My Orders</Link>
                            {isLoggedIn ? (
                                <>
                                    <Link to="/login">Login</Link>
                                    <Link to="/logout">Logout</Link>
                                </>
                            ) : (
                                <Link to="/login">Login</Link>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu Button */}
            <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
        </nav>
    );
};

export default Navbar;
