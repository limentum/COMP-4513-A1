const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// /api/genres - Returns all genres with era data
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('genres')
            .select('*, eras(*)');

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// /api/genres/:ref - Returns specific genre by genre_id
router.get('/:ref', async (req, res) => {
    try {
        const { ref } = req.params;

        const { data, error } = await supabase
            .from('genres')
            .select('*, eras(*)')
            .eq('genre_id', ref)
            .single();

        if (error || !data) {
            return res.status(404).json({
                message: `Genre with ID ${ref} not found`
            });
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// /api/genres/painting/:ref - Returns genres for a specific painting
router.get('/painting/:ref', async (req, res) => {
    try {
        const { ref } = req.params;

        const { data, error } = await supabase
            .from('painting_genres')
            .select('genres!inner(*)')
            .eq('painting_id', ref)
            .order('genre_name', { referencedTable: 'genres', ascending: true });

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: `No genres found for painting ID ${ref}`
            });
        }

        // Flatten the response to just return genre objects
        const genres = data.map(item => item.genres);
        res.json(genres);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;