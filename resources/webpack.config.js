const Path = require('path');

module.exports = {
    resolve: {
        alias: {
            'Components': Path.resolve('resources/js/Components'),
            'Config': Path.resolve('resources/js/Config'),
            'Pages': Path.resolve('resources/js/Pages'),
            'Services': Path.resolve('resources/js/Services'),
            'Root': Path.resolve('resources/js/'),
        },
    },
};
