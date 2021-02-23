const colors = require('tailwindcss/colors');

module.exports = {
    future: {
        // removeDeprecatedGapUtilities: true,
        // purgeLayersByDefault: true,
    },
    purge: [
        'resources/views/**/*.blade.php',
        'resources/js/**/*.jsx',
        'resources/js/**/*.js',
    ],
    theme: {
        extend: {
            colors: {
                'light-blue': colors.lightBlue,
                teal: colors.teal,
            }
        },
    },
    variants: {},
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio'),
    ],
};
