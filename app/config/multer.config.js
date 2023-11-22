const multer = require('multer');
const docLocation = 'images';

var uploadDocuments = multer({
    dest: docLocation,
    limits: {
        filesize: 1000000
    },
});

module.exports = {
    uploadDocuments
}