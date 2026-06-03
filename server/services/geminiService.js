import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});


// ── Layer 1: Basic sanity check ──────────────────────────
// Block empty or too-short prompts
function isValidLength(prompt) {
  const trimmed = prompt.trim();
  return trimmed.length >= 10 && trimmed.length <= 1000;
}

// ── Layer 2: AI-based intent classification ──────────────
// Asks Gemini itself if the prompt is safe and legitimate
async function isSafePrompt(prompt) {
  const classificationPrompt = `
You are a strict content safety classifier for a website generation tool.
 
A user has submitted this prompt:
"${prompt}"
 
AUTOMATIC REJECTION RULES — mark UNSAFE if the prompt:
 
1. MENTIONS ANY REAL BRAND, COMPANY, APP, OR WEBSITE BY NAME
   - Banks: SBI, HDFC, ICICI, Axis, PayTM, PhonePe, GPay, Razorpay, Stripe
   - Tech: Google, Facebook, Instagram, Twitter, Netflix, Amazon, Flipkart, YouTube, WhatsApp, LinkedIn, GitHub, Apple, Microsoft, Uber, Swiggy, Zomato
   - Government: Aadhaar, IRCTC, DigiLocker, any government portal
   - ANY other real brand name anywhere in the world
   - Even if the words "clone", "copy", "fake" are NOT used — just mentioning a real brand to replicate its look or features = UNSAFE
 
2. ASKS TO REPLICATE OR MIMIC SOMETHING REAL
   - "looks like", "similar to", "inspired by", "like X", "same as X"
   - Any intent to copy design, layout, or features of a real product
 
3. HARMFUL INTENT
   - Phishing, credential harvesting, fake login pages
   - Malware, hacking tools, exploits
   - Adult, violent, hateful, or illegal content
   - Scams, pyramid schemes, gambling
 
4. SUSPICIOUS PATTERNS
   - Fake OTP, fake payment, fake verification pages
   - Anything designed to deceive users
 
APPROVE ONLY IF:
- Fully generic website with no real brand mentioned
- Clear educational or portfolio project
- General e-commerce, blog, portfolio, dashboard, CRUD app
- No reference to any real existing product or company
 
EXAMPLES:
 
UNSAFE: "Create a website like Netflix"
UNSAFE: "Make a Google homepage clone"  
UNSAFE: "Build a login page similar to Facebook"
UNSAFE: "Create an app inspired by Swiggy"
UNSAFE: "Make something like Amazon"
UNSAFE: "Build a site that looks like IRCTC"
UNSAFE: "Create a PayTM style payment page"
 
SAFE: "Create a food delivery website"
SAFE: "Build an e-commerce store for shoes"
SAFE: "Make a movie streaming landing page"
SAFE: "Create a portfolio website"
SAFE: "Build a task management MERN app"
 
Respond with ONLY one word — SAFE or UNSAFE.
Nothing else. No explanation. Just one word.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: classificationPrompt }]
      }
    ],
    generationConfig: {
      temperature: 0.0,   // Zero temperature = deterministic, no creativity
      maxOutputTokens: 5  // Only needs one word
    }
  });

  const result = response.candidates[0].content.parts[0].text.trim().toUpperCase();
  return result === "SAFE";
}

export async function generateWebsite(prompt) {

  // Layer 1 — Length check
  if (!isValidLength(prompt)) {
    throw new Error("Prompt must be between 10 and 1000 characters.");
  }

  // Layer 2 — AI safety classification
  const safe = await isSafePrompt(prompt);
  if (!safe) {
    throw new Error(
      "Your prompt was flagged as potentially harmful or violating our usage policy. " +
      "Please use this tool for legitimate educational or portfolio purposes only."
    );
  }

  const systemPrompt = `
You are a senior full stack web developer.

Your job is to generate complete website projects based on the user's prompt.

PROJECT TYPES:

1. STATIC WEBSITE

If the user asks for a simple website, landing page, portfolio, or basic UI, generate a STATIC WEBSITE using:

- HTML
- CSS
- JavaScript

Typical files:

FILE: index.html
FILE: style.css
FILE: script.js


2. FULL STACK WEBSITE (MERN)

If the user asks for a complex application or includes features like:

- login
- authentication
- database
- dashboard
- admin panel
- API
- CRUD
- user accounts

Then generate a FULL STACK MERN project using:

Frontend:
- React
- Axios for API calls
- Basic CSS

IMPORTANT FRONTEND RULES:

- Use modern React syntax only.
- Use functional components with hooks.
- Use React Router DOM v7 syntax.
- NEVER use:
  - Switch
  - component=
  - useHistory
- ALWAYS use:
  - Routes
  - Route
  - element={<Component />}
  - useNavigate

- Always include ALL required dependencies inside frontend/package.json.

Frontend package.json MUST include:
- axios
- react-router-dom

Example dependencies:
"axios": "^1.0.0",
"react-router-dom": "^7.0.0"

- Use React 19 compatible syntax.
- Use createRoot from react-dom/client.
- Never use ReactDOM.render().

- Always include file extensions in imports when needed.
- Use relative imports correctly.
- Never import files that do not exist.
- Ensure all imported components are generated.

API RULES:

- Frontend API calls must use:
  const API_URL = "http://localhost:8000/api"

Example:
axios.get(\`\${API_URL}/products\`)

DEPENDENCY VALIDATION RULE:

- Every imported package MUST exist inside package.json dependencies.
- Never generate code with missing dependencies.

Backend:
- Node.js
- Express server
- MongoDB
- Mongoose models
- REST API routes

NODE RULES:

- Use Node.js compatible modern syntax.
- Ensure compatibility with Node.js v20+.

Project Structure Example:

FILE: backend/package.json
FILE: backend/server.js
FILE: backend/config/db.js
FILE: backend/models/User.js
FILE: backend/routes/userRoutes.js
FILE: backend/controllers/userController.js

FILE: frontend/package.json
FILE: frontend/src/index.js
FILE: frontend/src/App.js
FILE: frontend/src/components/Home.js
FILE: frontend/src/components/Login.js
FILE: frontend/src/App.css


OUTPUT FORMAT RULES:

1. Always return files in EXACT format:

FILE: filename
code

2. Never explain anything.

3. Never include markdown formatting such as:
\`\`\`html
\`\`\`javascript
\`\`\`

4. Only return raw code files.

5. If multiple files are needed, return them sequentially.

6. Generate a maximum of 15 files.

7. Prioritize essential files only.

DEPENDENCY RULES:

- Every generated frontend project MUST include:
  - axios
  - react-router-dom

- Every MERN project MUST include:
  - frontend/package.json
  - backend/package.json

- Never generate incomplete package.json files.

Example output:

FILE: index.html
<html>
...
</html>

FILE: style.css
body {
...
}

LIMIT RULE:

For MERN projects generate MAXIMUM 15 files only.

Backend:
- backend/server.js
- backend/package.json
- backend/config/db.js
- backend/models/Product.js
- backend/routes/productRoutes.js
- backend/controllers/productController.js

Frontend:
- frontend/src/index.js
- frontend/src/App.js
- frontend/src/components/Home.js
- frontend/src/components/ProductList.js
- frontend/src/components/Navbar.js
- frontend/src/App.css

PACKAGE.JSON RULES:

- Every package.json must contain:
  - name
  - version
  - scripts
  - dependencies

- frontend/package.json MUST include:
  - react
  - react-dom
  - react-scripts
  - axios
  - react-router-dom

- backend/package.json MUST include:
  - express
  - cors
  - dotenv
  - mongoose
  - nodemon

- backend scripts:
"start": "node server.js",
"dev": "nodemon server.js"

- frontend scripts:
"start": "react-scripts start",
"build": "react-scripts build"

- Never omit dependencies required by generated code.

BACKEND RULES:

- Always configure:
  app.use(cors())
  app.use(express.json())

- Always use:
  const PORT = process.env.PORT || 8000

- Always connect MongoDB using mongoose.connect()

- Always export routers correctly.

BACKEND CODE STYLE:

- Use modern ES6 syntax.
- Use async/await.
- Use arrow functions.
- Use import/export syntax everywhere.

Example:

import express from "express";
const router = express.Router();

export default router;

ES6 MODULE RULES:

- Use ES6 modules ONLY.
- Never use CommonJS syntax.

NEVER use:
- require()
- module.exports

ALWAYS use:
- import/export
- export default

Backend package.json MUST contain:
"type": "module"

Correct examples:

import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"

export default router

PROFESSIONAL PROJECT FILES:

For every MERN project also generate:

- .gitignore
- .env.example
- README.md

GITIGNORE RULES:

Generate a proper .gitignore file.

It must include:

node_modules
.env
dist
build
coverage
.DS_Store
Thumbs.db

README RULES:

Generate a professional README.md containing:

- Project title
- Features
- Tech stack
- Installation steps
- Environment variables setup
- Run commands
- Folder structure
- API overview
- Deployment notes

README must look production-ready and beginner-friendly.

ENV RULES:

Generate .env.example file instead of real secrets.

Example:

PORT=8000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key

SECURITY RULES:

- Never generate real API keys.
- Never hardcode secrets.
- Always use process.env variables.

FULL STACK STRUCTURE RULE:

For MERN projects use this structure:

backend/
frontend/

Never use:
client/

Always separate frontend and backend clearly.

ROOT PACKAGE RULES:

If generating a MERN project with separate frontend and backend folders:

Generate a root package.json containing:

"dev": "concurrently \\"npm run server\\" \\"npm run client\\""

Dependencies must include:
- concurrently

Scripts:
"server": "cd backend && npm run dev"
"client": "cd frontend && npm start"

QUALITY RULES:

- Never generate deprecated React syntax.
- Never generate incomplete imports.
- Never omit required npm dependencies.
- Ensure generated projects run without compilation errors.

IMAGE RULES:

Do not reference local images like hero.jpg or image.png.

Always use placeholder images from:

https://picsum.photos
https://placehold.co

Example:
<img src="https://picsum.photos/1200/500">
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: systemPrompt + "\n" + prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 8000
    }
  });


  const output = response.candidates[0].content.parts[0].text;

  return output;
}