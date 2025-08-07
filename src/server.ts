import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import cors from 'cors'
// Load environment variables from .env file
dotenv.config();


const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'];

const corsOptions = {
  origin: function (origin:any, callback:any) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
};

// Initialize express application
const app = express();
const port = process.env.PORT;
app.use(cors(corsOptions));
// Middleware for parsing JSON bodies
app.use(express.json());

// Mount routes
app.use('/task', routes);

// Basic route for root
app.get('/', (req, res) => {
    res.status(200).send('Welcome to the API Agent');
});


// Start the server
app.listen(port, async () => {
    try {
        console.log(`Server is running on port ${port}`);
    } catch (error) {
        console.error('Failed to initialize database connections', error);
        process.exit(1); // Exit the process with failure
    }
});

// Export the app for testing
export { app };
