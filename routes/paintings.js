const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// /api/paintings/single/:ref - Returns specific painting
router.get('/single/:ref', async (req, res) => {
    try {
        const { ref } = req.params;

        const { data, error } = await supabase
            .from('paintings')
            .select('*, artists!inner(*), galleries!inner(*)')
            .eq('painting_id', ref)
            .single();

        if (error || !data) {
            return res.status(404).json({
                message: `Painting with ID ${ref} not found`
            });
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// /api/paintings/sort/:field/limit/:limit
router.get('/sort/:field/limit/:limit', async (req, res) => {
    try {
        const { field, limit } = req.params;

        // Validate sort field
        const validFields = ['title', 'year'];
        if (!validFields.includes(field)) {
            return res.status(400).json({
                message: `Invalid sort field '${field}'. Use 'title' or 'year'.`
            });
        }

        // Validate limit is a number
        const limitNum = parseInt(limit);
        if (isNaN(limitNum)) {
            return res.status(400).json({
                message: `Limit must be a number`
            });
        }

        let query = supabase
            .from('paintings')
            .select('*, artists!inner(*), galleries!inner(*)');

        // Apply sorting
        const sortField = field === 'title' ? 'title' : 'year_of_work';
        query = query.order(sortField, { ascending: true });

        // Apply limit (0 means all)
        if (limitNum > 0) {
            query = query.limit(limitNum);
        }

        const { data, error } = await query;

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// /api/paintings/sort/:field/limit/:limit/skip/:skip
router.get('/sort/:field/limit/:limit/skip/:skip', async (req, res) => {
    try {
        const { field, limit, skip } = req.params;

        // Validate sort field
        const validFields = ['title', 'year'];
        if (!validFields.includes(field)) {
            return res.status(400).json({
                message: `Invalid sort field '${field}'. Use 'title' or 'year'.`
            });
        }

        // Validate limit and skip are numbers
        const limitNum = parseInt(limit);
        const skipNum = parseInt(skip);

        if (isNaN(limitNum) || isNaN(skipNum)) {
            return res.status(400).json({
                message: `Limit and skip must be numbers`
            });
        }

        const sortField = field === 'title' ? 'title' : 'year_of_work';
        const endRange = skipNum + limitNum - 1;

        const { data, error } = await supabase
            .from('paintings')
            .select('*, artists!inner(*), galleries!inner(*)')
            .order(sortField, { ascending: true })
            .range(skipNum, endRange);

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: `No paintings found for the specified range`
            });
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// /api/paintings/search/:substring - Search paintings by title
router.get('/search/:substring', async (req, res) => {
    try {
        const { substring } = req.params;

        const { data, error } = await supabase
            .from('paintings')
            .select('*, artists!inner(*), galleries!inner(*)')
            .ilike('title', `%${substring}%`)
            .order('year_of_work', { ascending: true });

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: `No paintings found with title containing '${substring}'`
            });
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// /api/paintings/years/:start/:end - Paintings between years
router.get('/years/:start/:end', async (req, res) => {
    try {
        const { start, end } = req.params;
        const startYear = parseInt(start);
        const endYear = parseInt(end);

        if (isNaN(startYear) || isNaN(endYear)) {
            return res.status(400).json({
                message: `Start and end years must be numbers`
            });
        }

        // Check if end year is before start year
        if (endYear < startYear) {
            return res.status(400).json({
                message: `End year (${endYear}) cannot be earlier than start year (${startYear})`
            });
        }

        const { data, error } = await supabase
            .from('paintings')
            .select('*, artists!inner(*), galleries!inner(*)')
            .gte('year_of_work', startYear)
            .lte('year_of_work', endYear)
            .order('year_of_work', { ascending: true });

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: `No paintings found between years ${startYear} and ${endYear}`
            });
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// /api/paintings/galleries/:ref - Paintings in a gallery
router.get('/galleries/:ref', async (req, res) => {
    try {
        const { ref } = req.params;

        const { data, error } = await supabase
            .from('paintings')
            .select('*, artists!inner(*), galleries!inner(*)')
            .eq('gallery_id', ref)
            .order('year_of_work', { ascending: true });

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: `No paintings found for gallery ID ${ref}`
            });
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// /api/paintings/artist/:ref - Paintings by an artist
router.get('/artist/:ref', async (req, res) => {
    try {
        const { ref } = req.params;

        const { data, error } = await supabase
            .from('paintings')
            .select('*, artists!inner(*), galleries!inner(*)')
            .eq('artist_id', ref)
            .order('year_of_work', { ascending: true });

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: `No paintings found for artist ID ${ref}`
            });
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// /api/paintings/genre/:ref - Paintings for a genre (limited fields)
router.get('/genre/:ref', async (req, res) => {
    try {
        const { ref } = req.params;

        const { data, error } = await supabase
            .from('painting_genres')
            .select('paintings!inner(painting_id, title, year_of_work)')
            .eq('genre_id', ref)
            .order('year_of_work', { referencedTable: 'paintings', ascending: true });

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: `No paintings found for genre ID ${ref}`
            });
        }

        // Flatten response
        const paintings = data.map(item => item.paintings);
        res.json(paintings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// /api/paintings/era/:ref - Paintings for an era (limited fields)
router.get('/era/:ref', async (req, res) => {
    try {
        const { ref } = req.params;

        // Join paintings -> painting_genres -> genres -> eras
        const { data, error } = await supabase
            .from('paintings')
            .select('painting_id, title, year_of_work, painting_genres!inner(genres!inner(era_id))')
            .eq('painting_genres.genres.era_id', ref)
            .order('year_of_work', { ascending: true });

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: `No paintings found for era ID ${ref}`
            });
        }

        // Return only the requested fields
        const result = data.map(p => ({
            painting_id: p.painting_id,
            title: p.title,
            year_of_work: p.year_of_work
        }));

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;