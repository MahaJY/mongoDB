const express =require('express')
const router = express.Router()
const employeecontroller = require('../controllers/empcontroller')
router.get('/',employeecontroller.index)
router.get('/:employeeid',employeecontroller.show)
router.post('/register',employeecontroller.register)
router.put('/update',employeecontroller.update)
router.delete('/delete',employeecontroller.destroy)

module.exports = router
