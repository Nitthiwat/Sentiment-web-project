// pages/api/testConnect.js

import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
    try {
        // Call the clientPromise to establish the connection
        const client = await clientPromise;
        console.log('MongoDB connected successfully');

        // Respond with a success message
        res.status(200).json({ message: 'MongoDB connected successfully' });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        res.status(500).json({ message: 'Error connecting to MongoDB' });
    }
}
