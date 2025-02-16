const mongoose = require('mongoose');
const Prikol = require('../models/prikol');
require('dotenv').config();

const prikoli = [
  {
    text: "Що каже програміст, коли бачить баг? - Це не баг, це фіча!",
    possibleReactions: ["🙂", "😅", "😉"],
    reactions: {
      "🙂": 0,
      "😅": 0,
      "😉": 0
    }
  },
  {
    text: "Чому Python такий популярний? Бо він не кусається!",
    possibleReactions: ["😂", "👍"],
    reactions: {
      "😂": 0,
      "👍": 0
    }
  },
  {
    text: "Як називається програміст-зомбі? - Живий труп коду!",
    possibleReactions: ["🤖", "😱"],
    reactions: {
      "🤖": 0,
      "😱": 0
    }
  },
  {
    text: "Що спільного між програмістом та пральною машиною? Обидва крутять цикли!",
    possibleReactions: ["🔥", "😂"],
    reactions: {
      "🔥": 0,
      "😂": 0
    }
  }
];

const seedDB = async () => {
  try {
    await Prikol.deleteMany({});
    await Prikol.insertMany(prikoli);
    console.log('Database seeded!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedDB;
