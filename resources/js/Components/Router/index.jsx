import React from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';

import * as Routes from './Config';

import * as Guards from 'Components/Guards/Config';

export default class Router extends React.Component {
    /**
     * @type {number}
     */
    key = 0;

    /**
     * @method render
     * @return {*}
     */
    render () {
        const {redirect} = this.props;

        return (
            <BrowserRouter>
                <Switch>
                    {Object.entries(Routes).map((routes2, i) => {
                        const routes = routes2[1].filter(route => {
                            return !route.feature || window.base.features[route.feature]
                        });

                        return routes.map(this.renderRoute);
                    })}
                </Switch>

                {redirect && <Redirect to={redirect} />}
            </BrowserRouter>
        );
    }

    /**
     * @method renderRoute
     * @param {object} routeProps
     * @return {*}
     */
    renderRoute = (routeProps) => {
        return (
            <Route
                path={routeProps.path}
                exact={routeProps.exact === undefined || routeProps.exact}
                key={this.key++}
                render={(props) => (
                    routeProps.guards ? this.renderRouteThroughGuard(props, routeProps) : <routeProps.component {...props} />
                )}
            />
        );
    };

    /**
     * @method renderRouteThroughGuard
     * @param {object} props
     * @param {object} routeProps
     * @param {boolean|string} previousGuard
     * @return {JSX.Element}
     */
    renderRouteThroughGuard = (props, routeProps, previousGuard = false) => {
        let guard = null;

        if (previousGuard !== false) {
            const lastGuardIndex = routeProps.guards.indexOf(previousGuard);
            guard = routeProps.guards[lastGuardIndex + 1];
        } else {
            guard = routeProps.guards[0];
        }

        const guardParts = guard.split(':'); // 0 is the guard, 1 is comma separated parameters
        const guardToCall = guardParts[0];
        const guardParameters = guardParts[1] ? guardParts[1].split(',') : [];

        const Component = this.getGuardComponent(guardToCall);
        const hasMoreGuards = routeProps.guards.length > (routeProps.guards.indexOf(guardToCall) + 1);

        return (
            <Component key={this.key++} parameters={guardParameters} component={
                hasMoreGuards ? this.renderRouteThroughGuard(props, routeProps, guardToCall) : <routeProps.component {...props} />
            } />
        );
    };

    /**
     * @method getGuardComponent
     * @param {string} guard
     * @return {*}
     */
    getGuardComponent = (guard) => {
        let guardComponent = null;

        Object.entries(Guards).map((guards2, i) => {
            if (guards2[1][guard]) {
                guardComponent = guards2[1][guard];
            }
        });

        return guardComponent;
    }
}
