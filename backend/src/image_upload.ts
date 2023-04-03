import config from './../config.json'

const multer  = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, config.uploads_folder)
    },
    filename: function (req, file, cb) {
        let name: string = file.originalname;
        let ext = name.substring(name.lastIndexOf('.'))
        cb(null,  Date.now() + '-' + Math.round(Math.random() * 1E9) + ext)
    }
})

let image_upload = multer({
    storage: storage
})

export default image_upload;
