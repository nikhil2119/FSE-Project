import "../../assets/css/Footer.css";

const Footer = () => {
    return (
        <footer>
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} E-Shop. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
