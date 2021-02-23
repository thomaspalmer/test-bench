import React from 'react';

import Header from './Header';
import Footer from './Footer';

import {Container} from 'Components/Utilities';

export default class Main extends React.Component {
    /**
     * @method render
     * @returns {JSX.Element}
     */
    render () {
        const {children, pageTitle} = this.props;

        return (
            <React.Fragment>
                <Header pageTitle={pageTitle} />

                <Container>
                    {children}
                </Container>

                <Footer />
            </React.Fragment>
        )
    };
}
