import React from "react";
import './Footer.css';
import {Link} from 'react-scroll';

const Footer = () =>{
    return (
        <div className="Footer-section">
            <div className="footer-links">
                <Link className="footer-link" to="home" offset={-400} smooth="true" >Home</Link>
                <Link className="footer-link" to="/"> About</Link>
                <Link className="footer-link" to="/Logout">Logout</Link>
            </div>
            <h3 className="trademark-text">Debt-A-Way 2024 ©</h3>
            <h3 className="creators-text">Built by Vardhan Dintakurthi and Anirudh Nemmani</h3>
        </div>
    )
}

export default Footer;