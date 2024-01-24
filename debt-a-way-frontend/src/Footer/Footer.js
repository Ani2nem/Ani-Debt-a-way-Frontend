import React from "react";
import './Footer.css';
import { Link, animateScroll as scroll } from 'react-scroll';


const Footer = () =>{

    const scrollToTop = () => {
        scroll.scrollToTop();
      };
    
    return (
        <div className="Footer-section">
            <div className="footer-links">
                <Link className="footer-link" to="home" offset={-1000} smooth="true" onClick={scrollToTop} >^</Link>
            </div>
            <h3 className="trademark-text">Debt-A-Way 2024 ©</h3>
            <h3 className="creators-text">Built by Vardhan Dintakurthi and Anirudh Nemmani</h3>
        </div>
    )
}

export default Footer;