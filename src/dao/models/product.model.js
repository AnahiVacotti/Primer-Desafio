import mongoose from "mongoose"

const productsCollection = 'products'

import mongoosePaginate from 'mongoose-paginate-v2';

const productsSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: [],
    status: {
        type: Boolean,
        default: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    stock: {
        type: Number,
        required: true

    },
    category: {
        type: String,
        required: true
    }
})

productsSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model(productsCollection, productsSchema)
