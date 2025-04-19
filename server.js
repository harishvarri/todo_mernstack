const express = require('express');
const mongoose = require('mongoose');
const TaskSchema = require('./model.js'); // Assuming model.js is in the same directory
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors({
    origin:'*'
}))
mongoose.connect('mongodb+srv://harishvarri0:_harish8008_H@cluster1.8lznp05.mongodb.net/mydatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Db connected'))
    .catch(err => {
        console.error('Connection error:', err.message);
        process.exit(1); // Exit the process if the connection fails
    });

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.post('/addtask', async (req, res) => {
    const { todo } = req.body;
    try {
        // Create a new task and save it to the database
        const newData = new TaskSchema({ todo: todo });
        await newData.save();

        // Fetch all tasks and send them as a response
        const allTasks = await TaskSchema.find();
        return res.status(201).json(allTasks);
    } catch (err) {
        console.error('Error:', err.message);

        // Send an error response to the client
        return res.status(500).json({ error: 'Failed to add task' });
    }
});

app.get('/gettask', async (req, res) => {
    try {
        // Fetch all tasks from the database
        const allTasks = await TaskSchema.find();
        return res.status(200).json(allTasks);
    } catch (err) {
        console.error('Error:', err.message);

        // Send an error response to the client
    }
});
// Start Server
app.delete('/deletetask/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Delete the task with the specified ID
        await TaskSchema.findByIdAndDelete(id);

        // Fetch all tasks and send them as a response
        const allTasks = await TaskSchema.find();
        return res.status(200).json(allTasks);
    } catch (err) {
        console.error('Error:', err.message);

        // Send an error response to the client
        return res.status(500).json({ error: 'Failed to delete task' });
    }
}); 
app.listen(5000, () => {
    console.log('Server running')
});