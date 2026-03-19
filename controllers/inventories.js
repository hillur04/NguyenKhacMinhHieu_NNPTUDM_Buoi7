let inventoryModel = require('../schemas/inventories')
let productModel = require('../schemas/products')

module.exports = {
    // Create inventory for a product
    CreateInventory: async function (productId) {
        try {
            let newInventory = new inventoryModel({
                product: productId,
                stock: 0,
                reserved: 0,
                soldCount: 0
            });
            await newInventory.save();
            return newInventory;
        } catch (error) {
            throw error;
        }
    },

    // Get all inventories with product details
    GetAllInventories: async function () {
        try {
            return await inventoryModel.find().populate({
                path: 'product',
                select: 'title slug price description category'
            });
        } catch (error) {
            throw error;
        }
    },

    // Get inventory by ID with product details
    GetInventoryById: async function (id) {
        try {
            return await inventoryModel.findById(id).populate({
                path: 'product',
                select: 'title slug price description category'
            });
        } catch (error) {
            throw error;
        }
    },

    // Add stock
    AddStock: async function (productId, quantity) {
        try {
            let inventory = await inventoryModel.findOne({ product: productId });
            if (!inventory) {
                throw new Error('Inventory not found');
            }
            if (quantity < 0) {
                throw new Error('Quantity must be positive');
            }
            inventory.stock += quantity;
            await inventory.save();
            return inventory;
        } catch (error) {
            throw error;
        }
    },

    // Remove stock
    RemoveStock: async function (productId, quantity) {
        try {
            let inventory = await inventoryModel.findOne({ product: productId });
            if (!inventory) {
                throw new Error('Inventory not found');
            }
            if (quantity < 0) {
                throw new Error('Quantity must be positive');
            }
            if (inventory.stock < quantity) {
                throw new Error('Insufficient stock');
            }
            inventory.stock -= quantity;
            await inventory.save();
            return inventory;
        } catch (error) {
            throw error;
        }
    },

    // Reservation (decrease stock, increase reserved)
    Reservation: async function (productId, quantity) {
        try {
            let inventory = await inventoryModel.findOne({ product: productId });
            if (!inventory) {
                throw new Error('Inventory not found');
            }
            if (quantity < 0) {
                throw new Error('Quantity must be positive');
            }
            if (inventory.stock < quantity) {
                throw new Error('Insufficient stock for reservation');
            }
            inventory.stock -= quantity;
            inventory.reserved += quantity;
            await inventory.save();
            return inventory;
        } catch (error) {
            throw error;
        }
    },

    // Sold (decrease reserved, increase soldCount)
    Sold: async function (productId, quantity) {
        try {
            let inventory = await inventoryModel.findOne({ product: productId });
            if (!inventory) {
                throw new Error('Inventory not found');
            }
            if (quantity < 0) {
                throw new Error('Quantity must be positive');
            }
            if (inventory.reserved < quantity) {
                throw new Error('Insufficient reserved quantity');
            }
            inventory.reserved -= quantity;
            inventory.soldCount += quantity;
            await inventory.save();
            return inventory;
        } catch (error) {
            throw error;
        }
    }
}
