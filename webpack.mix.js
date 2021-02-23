const mix = require('laravel-mix');
const tailwindcss = require('tailwindcss');
const config = require('./resources/webpack.config');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const imageminMozjpeg = require('imagemin-mozjpeg');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */
mix.webpackConfig(() => config);

mix.react('resources/js/Components/app.jsx', 'public/js')
    .sass('resources/sass/app.scss', 'public/css')
    .options({
        processCssUrls: false,
        postCss: [tailwindcss('./resources/tailwind.config.js')],
    })
    .version();

if(process.env.MIX_BROWSERSYNC && process.env.MIX_BROWSERSYNC === 'true' && !mix.inProduction()) {
    mix.browserSync(process.env.MIX_BROWSERSYNC_URL)
}

mix.webpackConfig({
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'resources/images',
                    to: 'images',
                }
            ]
        })
    ]
});

if (mix.inProduction()) {
     mix.webpackConfig({
        plugins: [
            new ImageminPlugin({
                test: /\.(jpe?g|png|gif|svg)$/i,
                plugins: [
                    imageminMozjpeg({
                        quality: 80,
                    })
                ]
            })
        ]
    }); 
} else {
    mix.sourceMaps();
}
