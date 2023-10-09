const express = require('express')
const router = express.Router()
const multer = require('multer')
const homeController = require('../controllers/home_controller');
const fileController = require('../controllers/file_controller')
const upload = multer({dest: 'uploads/files'})

router.get('/', homeController.home);
router.post('/create', upload.single('file'), fileController.create);
router.get('/view/:id', fileController.view);
router.get('/delete/:id', fileController.delete)

module.exports = router;