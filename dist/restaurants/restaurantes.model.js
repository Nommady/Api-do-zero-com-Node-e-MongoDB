"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Restaurantes = void 0;
const mongoose = require("mongoose");
const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});
const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 80,
        minlength: 3,
        unique: true
    },
    borough: {
        type: String,
    },
    cuisine: {
        type: String,
        required: true
    },
    menu: {
        type: [MenuItem],
        required: false,
        select: false
    }
});
exports.Restaurantes = mongoose.model('Restaurantes', restaurantSchema);
