const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// GET /api/counts/genres - Genre painting counts (fewest to most)
router.get('/genres', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('painting_genres')
            .select('genres!inner(genre_name), painting_id', { count: 'exact' });

        if (error) throw error;

        // Process data to count paintings per genre
        const genreCounts = {};
        data.forEach(item => {
            const genre_name = item.genres.genre_name;
            genreCounts[genre_name] = (genreCounts[genre_name] || 0) + 1;
        });

        // Convert to array and sort
        const result = Object.entries(genreCounts)
            .map(([genre_name, count]) => ({ genre_name, count }))
            .sort((a, b) => a.count - b.count);

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/counts/artists - Artist painting counts (most to fewest)
router.get('/artists', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('paintings')
            .select('artists!inner(first_name, last_name), painting_id', { count: 'exact' });

        if (error) throw error;

        // Process data to count paintings per artist
        const artistCounts = {};
        data.forEach(item => {
            const artist_name = `${item.artists.first_name} ${item.artists.last_name}`;
            artistCounts[artist_name] = (artistCounts[artist_name] || 0) + 1;
        });

        // Convert to array and sort (most to fewest)
        const result = Object.entries(artistCounts)
            .map(([artist_name, count]) => ({ artist_name, count }))
            .sort((a, b) => b.count - a.count);

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/counts/topgenres/:ref - Genres with more than ref paintings
router.get('/topgenres/:ref', async (req, res) => {
    try {
        const { ref } = req.params;
        const minCount = parseInt(ref);

        if (isNaN(minCount)) {
            return res.status(400).json({
                message: `Reference value must be a number`
            });
        }

        const { data, error } = await supabase
            .from('painting_genres')
            .select('genres!inner(genre_name), painting_id', { count: 'exact' });

        if (error) throw error;

        // Process data to count paintings per genre
        const genreCounts = {};
        data.forEach(item => {
            const genre_name = item.genres.genre_name;
            genreCounts[genre_name] = (genreCounts[genre_name] || 0) + 1;
        });

        // Filter and sort
        const result = Object.entries(genreCounts)
            .map(([genre_name, count]) => ({ genre_name, count }))
            .filter(item => item.count > minCount)
            .sort((a, b) => b.count - a.count);

        if (result.length === 0) {
            return res.status(404).json({
                message: `No genres found with more than ${minCount} paintings`
            });
        }

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;