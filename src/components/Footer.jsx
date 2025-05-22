import './Footer.css';
import Logo from '../assets/Feastify.png';
import { CiLinkedin } from "react-icons/ci";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { IoLogoPinterest } from "react-icons/io";
import { FaSquareTwitter } from "react-icons/fa6";




function Footer() {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-brand">
                    <img src={Logo} alt="Swiggy Logo" className="footer-logo" />
                    <span className="footer-title">Feastify</span>
                    <span className="footer-copyright">© 2025 Feastify Limited</span>
                </div>
                <div className="footer-columns">
                    <div className="footer-col">
                        <h4>Company</h4>
                        <ul>
                            <li>About Us</li>
                            <li>Feastify Corporate</li>
                            <li>Careers</li>
                            <li>Team</li>
                            <li>Feastify One</li>
                            <li>Feastify Instamart</li>
                            <li>Feastify Dineout</li>
                            <li>Feastify Genie</li>
                            <li>Minis</li>
                            <li>Pyng</li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Contact us</h4>
                        <ul>
                            <li>Help & Support</li>
                            <li>Partner with us</li>
                            <li>Ride with us</li>
                        </ul>
                        <h4>Legal</h4>
                        <ul>
                            <li>Terms & Conditions</li>
                            <li>Cookie Policy</li>
                            <li>Privacy Policy</li>
                            <li>Investor Relations</li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Available in:</h4>
                        <ul>
                            <li>Bangalore</li>
                            <li>Gurgaon</li>
                            <li>Hyderabad</li>
                            <li>Delhi</li>
                            <li>Mumbai</li>
                            <li>Pune</li>
                            <li>+ 679 cities</li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Life at Feastify</h4>
                        <ul>
                            <li>Explore with Feastify</li>
                            <li>Feastify News</li>
                            <li>Snackables</li>
                        </ul>
                        <h4>Social Links</h4>
                        <div className="footer-socials">
                            <a href="#"><i className="fa-brands fa-linkedin"><CiLinkedin />                            </i></a>
                            <a href="#"><i className="fa-brands fa-instagram"><FaInstagram />                            </i></a>
                            <a href="#"><i className="fa-brands fa-facebook"><FaFacebook />                            </i></a>
                            <a href="#"><i className="fa-brands fa-pinterest"><IoLogoPinterest />                            </i></a>
                            <a href="#"><i className="fa-brands fa-twitter"><FaSquareTwitter />                            </i></a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
