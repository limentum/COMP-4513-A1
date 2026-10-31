const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// /api/artists - Returns all artists
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('artists')
            .select('*');

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// /api/artists/:ref - Returns specific artist by artist_id
router.get('/:ref', async (req, res) => {
    try {
        const { ref } = req.params;

        const { data, error } = await supabase
            .from('artists')
            .select('*')
            .eq('artist_id', ref)
            .single();

        if (error || !data) {
            return res.status(404).json({
                message: `Artist with ID ${ref} not found`
            });
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// /api/artists/search/:substring - Search artists by last name
router.get('/search/:substring', async (req, res) => {
    try {
        const { substring } = req.params;

        const { data, error } = await supabase
            .from('artists')
            .select('*')
            .ilike('last_name', `${substring}%`);

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: `No artists found with last name starting with '${substring}'`
            });
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// /api/artists/country/:substring - Search artists by nationality
router.get('/country/:substring', async (req, res) => {
    try {
        const { substring } = req.params;

        const { data, error } = await supabase
            .from('artists')
            .select('*')
            .ilike('nationality', `${substring}%`);

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: `No artists found with nationality starting with '${substring}'`
            });
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;