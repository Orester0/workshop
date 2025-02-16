const express = require('express');
const router = express.Router();
const Prikol = require('../models/prikol');

router.get('/', async (req, res) => {
  try {
    const prikoli = await Prikol.find();
    res.json(prikoli);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const prikol = await Prikol.findById(req.params.id);
    if (!prikol) return res.status(404).json({ message: 'Prikol not found' });

    res.json(prikol);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const { text, possibleReactions } = req.body;

  if (!text || !possibleReactions || !Array.isArray(possibleReactions)) {
    return res.status(400).json({ message: 'Text and possibleReactions are required' });
  }

  const reactions = possibleReactions.reduce((acc, reaction) => {
    acc[reaction] = 0;
    return acc;
  }, {});

  const prikol = new Prikol({
    text,
    possibleReactions,
    reactions
  });

  try {
    const newPrikol = await prikol.save();
    res.status(201).json(newPrikol);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { text, possibleReactions } = req.body;

  if (!text || !Array.isArray(possibleReactions)) {
    return res.status(400).json({ message: 'Text and possibleReactions are required' });
  }

  try {
    const prikol = await Prikol.findById(req.params.id);
    if (!prikol) return res.status(404).json({ message: 'Prikol not found' });

    prikol.text = text;
    prikol.possibleReactions = possibleReactions;

    const updatedReactions = {};
    possibleReactions.forEach(reaction => {
      updatedReactions[reaction] = prikol.reactions.get(reaction) || 0;
    });
    prikol.reactions = updatedReactions;

    const updatedPrikol = await prikol.save();
    res.json(updatedPrikol);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const prikol = await Prikol.findById(req.params.id);
    if (!prikol) return res.status(404).json({ message: 'Prikol not found' });

    await prikol.deleteOne();
    res.json({ message: 'Prikol deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/react/:id', async (req, res) => {
  const { reaction } = req.body;

  try {
    const prikol = await Prikol.findById(req.params.id);
    if (!prikol) return res.status(404).json({ message: 'Prikol not found' });

    if (!prikol.possibleReactions.includes(reaction)) {
      return res.status(400).json({ message: 'Invalid reaction' });
    }

    prikol.reactions.set(reaction, (prikol.reactions.get(reaction) || 0) + 1);
    const updatedPrikol = await prikol.save();
    res.json(updatedPrikol);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
