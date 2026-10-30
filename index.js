const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const erasRouter = require('./routes/eras');
const galleriesRouter = require('./routes/galleries');
const artistsRouter = require('./routes/artists');
const genresRouter = require('./routes/genres');
const paintingsRouter = require('./routes/paintings');
const countsRouter = require('./routes/counts');

// Use routes
app.use('/api/eras', erasRouter);
app.use('/api/galleries', galleriesRouter);
app.use('/api/artists', artistsRouter);
app.use('/api/genres', genresRouter);
app.use('/api/paintings', paintingsRouter);
app.use('/api/counts', countsRouter);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Art API - see readme.md for endpoints' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});