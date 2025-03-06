import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
app.use(express.json());

app.post('/suggest-template', async (req, res) => {
    try {
        const { industry, style } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const response = await model.generateContent(`Generate a complete website template for a ${industry} website with a ${style} style. The response should include:
        - A full HTML file with a header, hero section, services, and contact section.
        - Embedded CSS styles within a <style> tag for styling.
        - Embedded JavaScript within a <script> tag for basic interactivity.
        Do not include any additional text, explanations, or comments. The response should only contain a complete, valid HTML document.`);
        
        //default status code is 200 so we are not explicitly setting it
        res.json({ template: response.response.text() || "No template suggestions found." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/suggest-layout', async (req, res) => {
    try {
        const { industry, goal } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const response = await model.generateContent(`Suggest 3 different website layouts for a ${industry} website focused on ${goal}. Each layout should include sections like hero, services, testimonials, and CTA. Return the layouts in JSON format as an array of objects, each containing a layout name and description.`);
        
        //default status code is 200 so we are not explicitly setting it
        res.json({ layout: response.response.text() || "No layout suggestions found." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Generate AI-driven content for a website section using Gemini
app.post('/suggest-content', async (req, res) => {
    try {
        const { section, details } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const response = await model.generateContent(`Generate engaging content for the ${section} section of a website. Details: ${details}`);
        
        //default status code is 200 so we are not explicitly setting it
        res.json({ content: response.response.text() || "No content generated." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
