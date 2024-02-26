const router = require("express").Router();
const credoController = require('../controller/credoController')


router.post('/create', credoController.createAccount)

router.put('/:accountNumber', credoController.updateYourDetails);

router.put("/deposit/:uuid", credoController.accountDeposit);

router.put('/withdraw/:uuid', credoController.accountWithdraw);

router.get('/check-bal/:uuid', credoController.balanceCheck)




module.exports = router;
