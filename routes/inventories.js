var express = require('express');
var router = express.Router();
let inventoryController = require('../controllers/inventories');

// Add stock
router.post('/add-stock', async function (req, res) {
    try {
        const { product, quantity } = req.body;
        
        if (!product) {
            return res.status(400).send({ message: 'Product ID is required' });
        }
        if (quantity === undefined || quantity === null) {
            return res.status(400).send({ message: 'Quantity is required' });
        }
        
        let result = await inventoryController.AddStock(product, quantity);
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// Remove stock
router.post('/remove-stock', async function (req, res) {
    try {
        const { product, quantity } = req.body;
        
        if (!product) {
            return res.status(400).send({ message: 'Product ID is required' });
        }
        if (quantity === undefined || quantity === null) {
            return res.status(400).send({ message: 'Quantity is required' });
        }
        
        let result = await inventoryController.RemoveStock(product, quantity);
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// Reservation (decrease stock, increase reserved)
router.post('/reservation', async function (req, res) {
    try {
        const { product, quantity } = req.body;
        
        if (!product) {
            return res.status(400).send({ message: 'Product ID is required' });
        }
        if (quantity === undefined || quantity === null) {
            return res.status(400).send({ message: 'Quantity is required' });
        }
        
        let result = await inventoryController.Reservation(product, quantity);
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// Sold (decrease reserved, increase soldCount)
router.post('/sold', async function (req, res) {
    try {
        const { product, quantity } = req.body;
        
        if (!product) {
            return res.status(400).send({ message: 'Product ID is required' });
        }
        if (quantity === undefined || quantity === null) {
            return res.status(400).send({ message: 'Quantity is required' });
        }
        
        let result = await inventoryController.Sold(product, quantity);
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// Get all inventories with product join
router.get('/', async function (req, res) {
    try {
        let inventories = await inventoryController.GetAllInventories();
        res.send(inventories);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Get inventory by ID with product join
router.get('/:id', async function (req, res) {
    try {
        let inventory = await inventoryController.GetInventoryById(req.params.id);
        if (!inventory) {
            return res.status(404).send({ message: 'Inventory not found' });
        }
        res.send(inventory);
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

module.exports = router;
