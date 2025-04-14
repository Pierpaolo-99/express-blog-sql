const express = require('express');
const app = express();
const port = 3006;
const cors = require('cors')

// import routes
const postRoutes = require('./routers/posts')

// import middlewares error
const serverError = require('./middlewares/serverError')
const error_404 = require('./middlewares/error_404')

// Server Listening
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Home Route
app.get('/', (req, res) => {

    //throw new Error('Server Error')

    res.send('Welcome to Home Server')
})

// cors Middleware
app.use(cors({
    origin: 'http://localhost:5173'
}))

// JSON Middleware
app.use(express.json())

// Static Assets Middleware
app.use(express.static('public'));

// Middleware
app.use('/api/v1/posts', postRoutes);

// Middlewares Error
app.use(serverError);
app.use(error_404);