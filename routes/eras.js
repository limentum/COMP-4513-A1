const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient'); // Your Supabase client setup

// /api/eras - Returns all eras
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('eras')
            .select('*');

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;