const express = require('express');
const router = express.Router()

// import Controller
const postsController = require('../controllers/postsController')

router.get('/', postsController.index);

router.get('/:slug', postsController.show);

router.post('/', postsController.create);

router.put('/:slug', postsController.update);

router.patch('/:slug', postsController.modify);

router.delete('/:slug', postsController.destroy);

// export router
module.exports = router
