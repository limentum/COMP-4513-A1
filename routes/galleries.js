const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// GET /api/galleries - Returns all galleries
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('galleries')
            .select('*');

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/galleries/:ref - Returns specific gallery by gallery_id
router.get('/:ref', async (req, res) => {
    try {
        const { ref } = req.params;

        const { data, error } = await supabase
            .from('galleries')
            .select('*')
            .eq('gallery_id', ref)
            .single();

        if (error || !data) {
            return res.status(404).json({
                message: `Gallery with ID ${ref} not found`
            });
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/galleries/country/:substring - Search galleries by country
router.get('/country/:substring', async (req, res) => {
    try {
        const { substring } = req.params;

        const { data, error } = await supabase
            .from('galleries')
            .select('*')
            .ilike('gallery_country', `${substring}%`);

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: `No galleries found in countries starting with '${substring}'`
            });
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;