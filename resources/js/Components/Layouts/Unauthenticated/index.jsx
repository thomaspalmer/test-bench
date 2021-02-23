import React from 'react';

export default class Unauthenticated extends React.Component {
    /**
     * @method render
     * @return {JSX.Element}
     */
    render () {
        const {children} = this.props;

        return (
            <div className="w-screen h-screen flex justify-center items-center bg-light-blue-700">
                <div
                    className="absolute flex justify-center inset-x-0 left-1/2 transform -translate-x-1/2 w-full overflow-hidden inset-y-0"
                >
                    <div className="flex-grow bg-light-blue-900 bg-opacity-75" />
                    <svg className="flex-shrink-0" width="1750" height="308" viewBox="0 0 1750 308" xmlns="http://www.w3.org/2000/svg">
                        <path opacity=".75" d="M1465.84 308L16.816 0H1750v308h-284.16z" fill="#075985"/>
                        <path opacity=".75" d="M1733.19 0L284.161 308H0V0h1733.19z" fill="#0c4a6e"/>
                    </svg>
                    <div className="flex-grow bg-light-blue-800 bg-opacity-75" />
                </div>

                <div className="z-10 w-full lg:w-1/3 px-6 lg:px-0">
                    {children}
                </div>
            </div>
        );
    }
}
