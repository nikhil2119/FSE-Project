import { Link } from "react-router-dom";
import { FaShippingFast, FaLock, FaHeadset } from "react-icons/fa";
import "../assets/css/Home.css";

const Home = () => {
    return (
        <div className="home">
            {/* Modern Hero Section */}
            <section className="hero">
                <div className="hero-content animate-fade-in">
                    <h1>Discover Amazing Products</h1>
                    <p>Experience shopping reimagined with curated collections and exclusive deals.</p>
                    <div className="hero-buttons">
                        <Link to="/products" className="btn btn-primary">Shop Now</Link>
                        <Link to="/categories" className="btn btn-secondary">Browse Categories</Link>
                    </div>
                </div>
            </section>

            {/* 🌟 Features Section */}
            <section className="features">
                <div className="feature-title">
                    <h2>Why Choose Us?</h2>
                </div>

                <div className="features-container">
                    <div className="feature animate-hover">
                        <div className="feature-icon">
                            <FaShippingFast />
                        </div>
                        <h3>Free Shipping</h3>
                        <p>Get free delivery on orders above $50.</p>
                    </div>

                    <div className="feature animate-hover">
                        <div className="feature-icon">
                            <FaLock />
                        </div>
                        <h3>Secure Payments</h3>
                        <p>100% secure payment methods available.</p>
                    </div>

                    <div className="feature animate-hover">
                        <div className="feature-icon">
                            <FaHeadset />
                        </div>
                        <h3>24/7 Support</h3>
                        <p>Our team is available anytime to assist you.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
