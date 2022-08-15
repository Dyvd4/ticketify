import express from 'express';
import Todo, { TodoSchema } from '../schemas/Todo';

const Router = express.Router();

Router.get('/todos', async (req, res, next) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    }
    catch (e) {
        next(e)
    }
});

Router.get('/todo/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const todo = await Todo.findOne({ _id: id });
        res.json(todo);
    }
    catch (e) {
        next(e)
    }
});

Router.post('/todo', async (req, res, next) => {
    let todo = req.body;
    try {
        const validation = TodoSchema.validate(todo);
        if (validation.error) return res.status(400).json({ validation });
        todo = validation.value;

        const newTodo = await Todo.create(todo);
        res.json(newTodo);
    }
    catch (e) {
        next(e)
    }
});

Router.put('/todo/:id', async (req, res, next) => {
    const { id } = req.params;
    let todo = req.body;
    try {
        const validation = TodoSchema.validate(todo);
        if (validation.error) return res.status(400).json({ validation });
        todo = validation.value;

        const updatedTodo = await Todo.findOneAndUpdate({ _id: id }, todo, { new: true });
        res.json(updatedTodo);
    }
    catch (e) {
        next(e)
    }
});

Router.delete('/todo/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedTodo = await Todo.findOneAndDelete({ _id: id }, { new: true });
        res.json(deletedTodo);
    }
    catch (e) {
        next(e)
    }
});

export default Router;