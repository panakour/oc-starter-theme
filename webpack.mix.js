let mix = require('laravel-mix');
let fs = require('fs');
let path = require('path');
let glob = require('glob-all');
let PurifyCSSPlugin = require('purifycss-webpack');


mix.webpackConfig({

    // module: {
    //
    //     rules: [
    //         {
    //             test: /\.(scss|sass)$/,
    //             use: [
    //                 {
    //                     loader: 'string-replace-loader',
    //                     options: {
    //                         search: 'string to search',
    //                         replace: 'string to replace',
    //                     }
    //                 },
    //                 {loader: 'sass-loader'},
    //             ]
    //         }
    //     ]
    // },

    plugins: [
        new PurifyCSSPlugin({
            purifyOptions: {
                whitelist: ['*stripe-loading-indicator*', '*oc-loading*', '*flash-message*']
            },
            paths: glob.sync([
                path.join(__dirname, './content/**/*.htm'),
                path.join(__dirname, './layouts/**/*.htm'),
                path.join(__dirname, './pages/**/*.htm'),
                path.join(__dirname, './partials/**/*.htm')
            ]),
            minimize: mix.config.production
        })
    ],

    devtool: 'source-map'

});

mix.setPublicPath('./assets/dist');

mix.sourceMaps();

mix.browserSync({
    injectChanges: true,
    files: [
        '**/*.htm',
        './assets/sass/**/*.scss',
        './assets/js/*.js',
        {
            match: ['./assets/images/**'],
            fn: function (event, file) {
                this.reload()
            }
        }
    ],
    proxy: 'october.localhost'
});

mix.sass('./assets/sass/main.scss', './all.css')
    .options({
        processCssUrls: false
    });

let scripts = [
    '../../modules/backend/assets/js/vendor/jquery.min.js',
    '../../modules/system/assets/js/framework.js',
    '../../modules/system/assets/js/framework.extras.js',
    // './assets/vendor/theme/...',
    './assets/js/custom.js',
];

mix.scripts(scripts, './assets/dist/all.js');

checkTheExistenceOfScripts(scripts);

function checkTheExistenceOfScripts(scripts) {

    scripts.forEach(function (script) {
        fs.open(script, 'r', (err, fd) => {
            if (err) {
                throw err;
            }
        });

    });

}

// Full API
// mix.js(src, output);
// mix.react(src, output); <-- Identical to mix.js(), but registers React Babel compilation.
// mix.preact(src, output); <-- Identical to mix.js(), but registers Preact compilation.
// mix.coffee(src, output); <-- Identical to mix.js(), but registers CoffeeScript compilation.
// mix.ts(src, output); <-- TypeScript support. Requires tsconfig.json to exist in the same folder as webpack.mix.js
// mix.extract(vendorLibs);
// mix.sass(src, output);
// mix.standaloneSass('src', output); <-- Faster, but isolated from Webpack.
// mix.fastSass('src', output); <-- Alias for mix.standaloneSass().
// mix.less(src, output);
// mix.stylus(src, output);
// mix.postCss(src, output, [require('postcss-some-plugin')()]);
// mix.browserSync('my-site.test');
// mix.combine(files, destination);
// mix.babel(files, destination); <-- Identical to mix.combine(), but also includes Babel compilation.
// mix.copy(from, to);
// mix.copyDirectory(fromDir, toDir);
// mix.minify(file);
// mix.sourceMaps(); // Enable sourcemaps
// mix.version(); // Enable versioning.
// mix.disableNotifications();
// mix.setPublicPath('path/to/public');
// mix.setResourceRoot('prefix/for/resource/locators');
// mix.autoload({}); <-- Will be passed to Webpack's ProvidePlugin.
// mix.webpackConfig({}); <-- Override webpack.config.js, without editing the file directly.
// mix.babelConfig({}); <-- Merge extra Babel configuration (plugins, etc.) with Mix's default.
// mix.then(function () {}) <-- Will be triggered each time Webpack finishes building.
// mix.extend(name, handler) <-- Extend Mix's API with your own components.
// mix.options({
//   extractVueStyles: false, // Extract .vue component styling to file, rather than inline.
//   globalVueStyles: file, // Variables file to be imported in every component.
//   processCssUrls: true, // Process/optimize relative stylesheet url()'s. Set to false, if you don't want them touched.
//   purifyCss: false, // Remove unused CSS selectors.
//   uglify: {}, // Uglify-specific options. https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
//   postCss: [] // Post-CSS options: https://github.com/postcss/postcss/blob/master/docs/plugins.md
// });
