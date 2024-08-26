const express = require('express');
const router = express.Router();
const UserManager = require('../controllers/UserManager.js');
const userManager = new UserManager();
const upload = require("../middleware/multer.js");
const jwtAuth = require('../middleware/jwtAuthenticate.js');
const roleCheck = require('../middleware/checkrole.js');



router.post('/register', userManager.register)
router.post('/reset-password', userManager.requestPasswordReset)
router.post('/change-password',userManager.resetPassword)
router.put("/premium/:uid", userManager.changePremiumRol)
router.post('/:uid/documents',upload.fields([{ name: "documents" }, { name: "products" }, { name: "profiles" }]), userManager.uploadFiles)
router.get('/users',jwtAuth,roleCheck('admin'), userManager.getUsers)
router.delete('/users',userManager.deleteInactivity )

module.exports = router;