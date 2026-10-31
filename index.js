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

// Register routes with the app
app.use('/api/eras', erasRouter);
app.use('/api/galleries', galleriesRouter);
app.use('/api/artists', artistsRouter);
app.use('/api/genres', genresRouter);
app.use('/api/paintings', paintingsRouter);
app.use('/api/counts', countsRouter);

/* Root route
* Returns ReadME link with API access info
*/
app.get('/', (req, res) => {
  res.json({ message: 'Art API - see README: https://github.com/limentum/COMP-4513-A1/blob/main/README.md' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});