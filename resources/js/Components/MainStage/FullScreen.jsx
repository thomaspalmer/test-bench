import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faExpandArrowsAlt, faCompressArrowsAlt} from '@fortawesome/free-solid-svg-icons';
import {Event} from 'Services';

export default class Fullscreen extends React.Component {
    /**
     * @var state
     * @type {{fullscreen: boolean, fullscreenSupported: boolean}}
     */
    state = {
        fullscreenSupported: false,
        fullscreen: false
    };

    /**
     * @var videoContainerRef
     * @type {null|HTMLDivElement}
     */
    videoContainerRef = null;

    /**
     * @method componentDidMount
     */
    componentDidMount = () => {
        window.addEventListener('keydown', this.fullscreenListener);
        document.addEventListener('fullscreenchange', this.exitFullScreen);
        document.addEventListener('mozfullscreenchange', this.exitFullScreen);
        document.addEventListener('MSFullscreenChange', this.exitFullScreen);
        document.addEventListener('webkitfullscreenchange', this.exitFullScreen);

        this.canGoFullscreen();
    };

    /**
     * @method componentWillUnmount
     */
    componentWillUnmount = () => {
        window.removeEventListener('keydown', this.fullscreenListener);
        document.removeEventListener('fullscreenchange', this.exitFullScreen);
        document.removeEventListener('mozfullscreenchange', this.exitFullScreen);
        document.removeEventListener('MSFullscreenChange', this.exitFullScreen);
        document.removeEventListener('webkitfullscreenchange', this.exitFullScreen);
    };

    /**
     * @method canGoFullscreen
     * @return {boolean}
     */
    canGoFullscreen = () => {
        for (const key of [
            'exitFullscreen',
            'webkitExitFullscreen',
            'webkitCancelFullScreen',
            'mozCancelFullScreen',
            'msExitFullscreen',
        ]) {
            if (key in document) {
                this.setState({
                    fullscreenSupported: true
                });

                return true;
            }
        }

        this.setState({
            fullscreenSupported: false
        });
    };

    /**
     * @method exitFullScreen
     */
    exitFullScreen = () => {
        if (!(document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement)) {
            this.setState({
                fullscreen: false
            });
        }
    };

    /**
     * @method handleToggleFullScreen
     * @param {Event} e
     */
    fullscreenListener = (e) => {
        if (e.key === 'f') {
            this.handleToggleFullScreen();
        }
    };

    /**
     * @method handleToggleFullScreen
     */
    handleToggleFullScreen = () => {
        if (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        ) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }

            this.setState({
                fullscreen: false
            });

            Event.emit('fullscreen', false);
        } else {
            if (this.videoContainerRef.requestFullscreen) {
                this.videoContainerRef.requestFullscreen();
            } else if (this.videoContainerRef.mozRequestFullScreen) {
                this.videoContainerRef.mozRequestFullScreen();
            } else if (this.videoContainerRef.webkitRequestFullscreen) {
                this.videoContainerRef.webkitRequestFullscreen(this.videoContainerRef.ALLOW_KEYBOARD_INPUT);
            } else if (this.videoContainerRef.msRequestFullscreen) {
                this.videoContainerRef.msRequestFullscreen();
            }

            this.setState({
                fullscreen: true
            });

            Event.emit('fullscreen', true);
        }
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render () {
        const {children} = this.props;
        const {fullscreen, fullscreenSupported} = this.state;

        return (
            <div ref={ref => this.videoContainerRef = ref} className="relative flex items-center">
                {children}

                {fullscreenSupported && (
                    <div className="absolute right-0 bottom-0">
                        <div className={
                            `
                            rounded-full w-8 h-8 flex items-center justify-center bg-white transition-all duration-200
                            hover:bg-gray-200 cursor-pointer ${fullscreen ? 'mb-4 mr-4' : '-mb-4 -mr-4'}
                            `
                        } onClick={this.handleToggleFullScreen}>
                            {fullscreen && (
                                <FontAwesomeIcon icon={faCompressArrowsAlt} />
                            )}

                            {!fullscreen && (
                                <FontAwesomeIcon icon={faExpandArrowsAlt} />
                            )}
                        </div>
                    </div>
                )}
            </div>
        )
    }
}
