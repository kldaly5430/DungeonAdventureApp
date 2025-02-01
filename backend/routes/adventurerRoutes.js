const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/db');
const fs = require('fs');
const path = require('path');

// const jsonFilePath = path.join(__dirname, './data/adventurerNames.json');

const names = JSON.parse(fs.readFileSync('../backend/data/names.json', 'utf8')).names;

function getRandomNumberInRange(min,max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

router.get('/generate', async (req, res) => {
    try {
        const roleCounts = {
            defender: parseInt(req.query.defender) || 20,
            attacker: parseInt(req.query.attacker) || 35,
            healer: parseInt(req.query.healer) || 10
          };

        const pool = await poolPromise;
        let adventurers = [];

        for (const role in roleCounts) {
           const result = await pool.request()
            .input('role', sql.VarChar, role)
            .query("SELECT * FROM roleStats WHERE role = @role"); 
            
            if (result.recordset.length === 0) continue;

            const roleStats = result.recordset[0];

            for(let i = 0; i < roleCounts[role]; i++) {
                const adventurer = {
                    id: Date.now() + Math.random(),
                    image: '/images/fighter'+(getRandomNumberInRange(1,16).toString().padStart(2, '0')+'.png'),
                    name: names[Math.floor(Math.random() * names.length)],
                    role: role,
                    hp: getRandomNumberInRange(roleStats.min_hp,roleStats.max_hp),
                    stamina: getRandomNumberInRange(roleStats.min_stamina, roleStats.max_stamina),
                    power: getRandomNumberInRange(roleStats.min_power,roleStats.max_power),
                    damage: getRandomNumberInRange(roleStats.min_damage,roleStats.max_damage)
                };

                await pool.request()
                    .input('name', sql.NVarChar, adventurer.name)
                    .input('role', sql.NVarChar, adventurer.role)
                    .input('image', sql.NVarChar, adventurer.image)
                    .input('hp', sql.Int, adventurer.hp)
                    .input('stamina', sql.Int, adventurer.stamina)
                    .input('power', sql.Int, adventurer.power)
                    .input('damage', sql.Int, adventurer.damage)
                    .query(`INSERT INTO adventurers (name, role, image, hp, stamina, power, damage)
                        VALUES (@name, @role, @image, @hp, @stamina, @power, @damage)
                    `);
                adventurers.push(adventurer);
            }
        }

        res.json(adventurers);
    } catch (err) {
        console.error("Error generating adventurer:", err);
        res.status(500).json({err: "Internal server error"});
    }
});

router.get('/getAdventurers', async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query('SELECT * FROM adventurers');

        if(result.recordset.length === 0) {
            return res.json([]);
        }

        res.json(result.recordset);
    } catch (err) {
        console.error("Error fetching adventurers:", err);
        res.status(500).json({ error: "Failed to fetch adventures" });
    }
});

module.exports = router;