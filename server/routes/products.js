const express = require('express');
const router = express.Router();
const multer = require('multer');
// Controllers
const productsController = require('../controllers/products');
// verify authorization
const verifyAuth = require('../middlewares/verify-auth');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        //need to refactor that, should add more unique filename
        cb(null, Date.now() + "_" + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        // store the file
        cb(null, true);
    }
    else {
        // reject the file
        cb(null, false)
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

// get all products
router.get('/', productsController.getAllProducts);

// create new product
router.post('/', upload.single('productImage'), productsController.postProduct);

// get product by id
router.get('/:productId', productsController.getProductById);

router.patch('/:productId', productsController.patchProductById)

router.delete('/:productId', productsController.removeProductById);

module.exports = router;