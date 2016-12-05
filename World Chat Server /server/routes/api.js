var Customer = require('../models/customer');
module.exports = function(router) {
    router.get('/customer', function(req, res){
        var customer = new Customer();
        /*customer.username = req.body.username;
        customer.password = req.body.password;*/
        customer.username = "test";
        customer.save(function(err, data){
            if(err)
                throw err;
            res.json(data);
        });
    });
}