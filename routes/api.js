var express = require('express');
var router = express.Router();
const { Portfolio, Wallet } = require('../lib/models');
const yahooStockPrices = require('yahoo-stock-prices')
const moment = require('moment'); // require

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send('This is the API router')
});

// RESTFul routes
// 1. GET /api/v1/portfolio - Fetch all the rows the Portfolio table DONE
// 2. POST /api/v1/portfolio - Create an item in the portfolio DONE
// 3. DELETE /api/v1/portfolio - Delete a portfolio item - this implies selling the item DONE

// 4. GET /api/v1/wallet - this will fetch the current wallet value  - HW
// 5. PUT /api/v1/wallet - this will update the value of the money in your wallet - HW HINT: you will need req.body just like a POST request.
// Wallet - Single row.


// 6. GET /api/v1/search/:symbol DONE
// GET http:/localhost:3000/api/v1/search/AAPL

router.get('/wallet', async function (req, res, next) {
    let wallet = await Wallet.findOne({});
    res.json(wallet);
});

router.get('/portfolio', async function (req, res, next) {
    // write a query here to fetch all the rows in the portfolio table
    let items = await Portfolio.findAll({});
    res.json(items);
});

router.get('/search/:symbol', async function (req, res, next) {
    // req.params is going to have the value of the symbol here
    console.log(req.params)
    // let items = await Portfolio.findAll({});
    try {
        const data = await yahooStockPrices.getCurrentData(req.params.symbol);
        res.json({ success: true, data: data });
    } catch (err) {
        console.log(err)
        res.json({ success: false, data: {} });
    }
});

// HW: Figure out the last 7 days stock prices and print them out

router.get('/search/:symbol/historical', async function (req, res, next) {
    // req.params is going to have the value of the symbol here
    console.log(req.params)
    // let items = await Portfolio.findAll({});

    let start = moment().subtract(8, 'weeks');
    let end = moment().subtract(7, 'weeks');

    let startMonth = parseInt(start.format('M'));
    let startDay = parseInt(start.format('D'));
    let startYear = parseInt(start.format('YYYY'));

    let endYear = parseInt(end.format('YYYY'));
    let endMonth = parseInt(end.format('M'));
    let endDay = parseInt(end.format('D'));

    console.log(startMonth, startDay, startYear)
    console.log(endMonth, endDay, endYear)

    try {
        const data = await yahooStockPrices.getHistoricalPrices(
            startMonth,
            startDay,
            startYear,
            endMonth,
            endDay,
            endYear,
            req.params.symbol,
            '1d');

        res.json({ success: true, data: data });
    } catch (err) {
        console.log(err)
        res.json({ success: false, data: {} });
    }
});


router.post('/portfolio', async function (req, res, next) {
    // this is where the information from the front end is available to us as req.body
    console.log(req.body);
    // write a query here to create an item in the portfolio table
    let wallet = await Wallet.findOne({});
    let totalRequired = parseFloat(req.body.price) * parseFloat(req.body.quantity);
    let item = {};
    if (parseFloat(wallet.value) >= totalRequired) {
        item = await Portfolio.create(req.body);
        let newWalletValue = parseFloat(wallet.value) - totalRequired;
        await wallet.update({ value: newWalletValue });
    }
    res.json(item);
});

router.delete('/portfolio/:id', async function (req, res, next) {
    // we are going to lookup the value of the id and then have the database delete the item with id = value
    // req.params gets us the values in the URL above
    // console.log(req.params);
    // req.params.id is 22
    // write a query here to delete an item from the portfolio table
    let item = await Portfolio.destroy({ where: { id: req.params.id } });
    res.json(item);
});





module.exports = router;