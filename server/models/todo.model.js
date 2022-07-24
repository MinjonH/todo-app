const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    done: {
        type: mongoose.SchemaTypes.Boolean,
        required: true,
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
    }
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;