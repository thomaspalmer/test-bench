import React from 'react';

/**
 * @constructor
 * @param {string} src
 * @return {JSX.Element}
 */
export default ({src}) => {
    return (
        <div className="bg-video mx-auto">
            <div style={{padding: '52.81% 0 0 0', position: 'relative'}}>
                <iframe
                    src={src}
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    className="w-full h-full top-0 left-0 absolute"
                />
            </div>
        </div>
    );
}
