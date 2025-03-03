import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json()); // Enable JSON parsing

const CONNECTION_STRING = process.env.MONGO_URI; // Use .env for security
const DATABASE_NAME = "Cluster11";
let database;

// Connect to MongoDB and start the server
MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        database = client.db(DATABASE_NAME);
        console.log("MongoDB connection successful");

        app.listen(PORT, "0.0.0.0", () => {
            console.log("Server is running on port 5000");
        });
    })
    .catch(error => {
        console.error("Database connection failed:", error);
        process.exit(1); // Exit on failure
    });

app.get('/api/todoapp/getnotes', async (req,res) => {
    try {
        const notes = await database.collection("todoappcollection").find({}).toArray();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notes", error });
    }
});

// POST: Add a new note
app.post('/api/todoapp/AddNotes', multer().none(), async (req, res) => {
    try {
        const numOfDocs = await database.collection("todoappcollection").countDocuments();
        await database.collection("todoappcollection").insertOne({
            id: (numOfDocs + 1).toString(),
            description: req.body.newNotes
        });
        res.json({ message: "Added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error adding note", error });
    }
});

// DELETE: Remove a note by ID
app.delete('/api/todoapp/DeleteNotes', async (req, res) => {
    try {
        const result = await database.collection("todoappcollection").deleteOne({ id: req.query.id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting note", error });
    }
});


