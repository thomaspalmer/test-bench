import Echo from 'laravel-echo';
window.io = require('socket.io-client');

class Sockets {
    /**
     * @var echo
     * @type {null}
     */
    echo = null;

    /**
     * @method getConnection
     * @return {Echo}
     */
    getConnection = () => {
        if (typeof io !== 'undefined') {
            this.echo = new Echo({
                client: io,
                key: process.env.MIX_ECHO_KEY,
                broadcaster: 'socket.io',
                host: `${process.env.MIX_ECHO_HOST ?? window.location.hostname}`,
                authEndpoint: `/broadcasting/auth`,
            });
        }

        return this.echo;
    };
}

export default new Sockets();
