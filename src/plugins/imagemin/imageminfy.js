//$ npm install imagemin-optipng

const imagemin = require('imagemin');
const imageminOptipng = require('imagemin-optipng');
 
(async () => {
    await imagemin(['images/*.png'], 'build/images', {
        use: [
            imageminOptipng()
        ]
    });
 
    console.log('Images optimized!');
})();