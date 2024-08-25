const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        let folderDestination;
        switch (file.fieldname) {
            case 'profiles':
                folderDestination = './src/uploads/profiles'
                break;
            case 'documents':
                folderDestination = './src/uploads/documents'
                break;
            case 'products':
                folderDestination = './src/uploads/products'
                break;
        }
        callback(null,folderDestination)
    },
    filename :(req,file,callback) => {
        callback(null, file.originalname);
    }
})
const upload = multer({storage: storage});
module.exports = upload;