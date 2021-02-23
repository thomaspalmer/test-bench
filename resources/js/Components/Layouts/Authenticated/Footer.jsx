import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faInstagram, faGithub} from '@fortawesome/free-brands-svg-icons';

/**
 * @function Footer
 * @return {JSX.Element}
 * @constructor
 */
const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div
                className="container mx-auto py-4 md:flex md:items-center md:justify-between">
                <div className="flex justify-center space-x-6 md:order-2">
                    <a href="https://www.instagram.com/duality_studio/" className="text-gray-400 hover:text-gray-500">
                        <FontAwesomeIcon icon={faInstagram} />
                    </a>
                    <a href="https://github.com/dualitystudio" className="text-gray-400 hover:text-gray-500">
                        <FontAwesomeIcon icon={faGithub} />
                    </a>
                </div>

                <div className="mt-8 md:mt-0 md:order-1">
                    <p className="text-center text-base leading-6 text-gray-400">
                        &copy; {(new Date()).getFullYear()} Duality Studio. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
