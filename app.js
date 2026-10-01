//Libraries
const path = require('path');
const express = require('express');
const multer = require('multer');
const mysql = require('mysql2/promise');
const { body, validationResult } = require('express-validator');


//Setup defaults for script
const app = express();
app.use(express.static('public'))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    next();
});

//Stylesheet
app.use(express.static(__dirname + '/public'));
//Webpage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// list of valid types
const validTypes = [
    'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice',
    'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic',
    'Bug', 'Rock', 'Ghost', 'Fairy', 'Dragon', 'Dark', 'Steel'
];

// list of valid gimmicks
const validGimmicks = [
    'Mega', 'Mega Evolution', 'Z-Moves', 'Dynamax',
    'Gigantimax', 'Alpha', 'Terastallization',
    'Paradox (future)', 'Paradox (past)'
];

const upload = multer()
const port =  process.env.PORT || 3000;

let connection = null;

async function query(sql, params) {
    //Singleton DB connection
    if (null === connection) {
        console.log('Here');
        connection = await mysql.createConnection({
            host: "student-databases.cvode4s4cwrc.us-west-2.rds.amazonaws.com",
            user: "JENNAWALLACE",
            password: process.env.DB_PASSWORD,
            database: 'JENNAWALLACE'
        });
    }

    const [results,] = await connection.execute(sql, params);
    return results;
}

async function cleanupUnnamedPokemonRows() {
    await query(
        `DELETE FROM pokemon_characters
         WHERE (name IS NULL OR name = '')`
    );
}

//The * in app.* needs to match the method type of the request
//types
app.get(
    '/pokemon/',
    async (request, response) => {
        let result = {};
        try {
            let selectSql = `SELECT
                        name, 
                        weakness1, 
                        weakness2, 
                        weakness3, 
                        weakness4, 
                        weakness5, 
                        strength1, 
                        strength2, 
                        strength3, 
                        strength4, 
                        strength5, 
                        no_effect1, 
                        no_effect2
                    FROM pokemon_types`,
                whereStatements = [],
                orderByStatements = [],
                queryParameters = [];

            // Filter by name
            if (typeof request.query.name !== 'undefined' && request.query.name !== '') {
                whereStatements.push('name = ?');
                queryParameters.push(request.query.name);
            }

            // Filter to exclude types weak to specified type
            if (typeof request.query.weakness !== 'undefined' && request.query.weakness !== 'None' && request.query.weakness !== '') {
                whereStatements.push('weakness1 != ? AND (weakness2 IS NULL OR weakness2 != ?) AND (weakness3 IS NULL OR weakness3 != ?) AND (weakness4 IS NULL OR weakness4 != ?) AND (weakness5 IS NULL OR weakness5 != ?)');
                queryParameters.push(request.query.weakness, request.query.weakness, request.query.weakness, request.query.weakness, request.query.weakness);
            }

            // Filter by strength type
            if (typeof request.query.strength !== 'undefined' && request.query.strength !== 'None' && request.query.strength !== '') {
                whereStatements.push('(strength1 = ? OR strength2 = ? OR strength3 = ? OR strength4 = ? OR strength5 = ?)');
                queryParameters.push(request.query.strength, request.query.strength, request.query.strength, request.query.strength, request.query.strength);
            }

            // Dynamically add WHERE expressions to SELECT statements if needed
            if (whereStatements.length > 0) {
                selectSql = selectSql + ' WHERE ' + whereStatements.join(' AND ');
            }

            // Add ORDER BY clause (sort by name ascending or descending)
            const sortOrder = request.query.sort === 'Descending' ? 'DESC' : 'ASC';
            selectSql = selectSql + ' ORDER BY name ' + sortOrder;

            // Dynamically add LIMIT expressions to SELECT statements if needed
            if (typeof request.query.limit !== 'undefined') {
                const limitValue = parseInt(request.query.limit, 10);
                if (!isNaN(limitValue) && limitValue > 0 && limitValue <= 18) {
                    selectSql = selectSql + ' LIMIT ' + limitValue;
                }
            }

            result = await query(selectSql, queryParameters);
        } catch (error) {
            console.log(error);
            return response.status(500) //Error code 
                .json({ message: 'Something went wrong with the server.' });
        }
        //Default response object
        response.json({ 'data': result });
    });

//gimmicks
app.get(
    '/gimmicks/',
    async (request, response) => {
        let result = {};
        try {
            let selectSql = `SELECT
                        gimmick_name, 
                        gimmick_desc, 
                        gimmick_gen
                    FROM pokemon_gimmicks`,
                whereStatements = [],
                queryParameters = [];

            // Filter by generation
            if (typeof request.query.gimmick_gen !== 'undefined' && request.query.gimmick_gen !== 'None' && request.query.gimmick_gen !== '') {
                const genValue = parseInt(request.query.gimmick_gen, 10);
                if (!isNaN(genValue)) {
                    whereStatements.push('gimmick_gen = ?');
                    queryParameters.push(genValue);
                }
            }

            // Filter by keyword in gimmick name or description
            if (typeof request.query.keywords !== 'undefined' && request.query.keywords.trim() !== '') {
                const keywordFilter = `%${request.query.keywords.trim()}%`;
                whereStatements.push('(gimmick_name LIKE ? OR gimmick_desc LIKE ?)');
                queryParameters.push(keywordFilter, keywordFilter);
            }

            // Dynamically add WHERE expressions if needed
            if (whereStatements.length > 0) {
                selectSql = selectSql + ' WHERE ' + whereStatements.join(' AND ');
            }

            // Add ORDER BY clause (sort by generation ascending or descending)
            const sortOrder = request.query.sort === 'DES' ? 'DESC' : 'ASC';
            selectSql = selectSql + ' ORDER BY gimmick_gen ' + sortOrder;

            result = await query(selectSql, queryParameters);
        } catch (error) {
            console.log(error);
            return response.status(500) //Error code 
                .json({ message: 'Something went wrong with the server.' });
        }
        //Default response object
        response.json({ 'data': result });
    });

//create only the selected types and prepare the build row
app.post('/create-types',
    upload.none(),
    [
        body('first_type_choice').notEmpty().withMessage('First type is required.')
            .isIn(validTypes).withMessage('Please enter a valid Pokemon type.'),

        body('second_type_choice')
            .custom((value) => {
                if (!value || value.toLowerCase() === 'none') {
                    return true;
                }
                if (!validTypes.includes(value)) {
                    throw new Error('Please enter a valid Pokemon type or "None".');
                }
                return true;
            })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            await cleanupUnnamedPokemonRows();

            let secondType = req.body.second_type_choice;
            if (!secondType || secondType.toLowerCase() === 'none') {
                secondType = '';
            }

            const insertSql = `
                INSERT INTO pokemon_characters (first_type, second_type, gen, gimmick, name)
                VALUES (?, ?, 0, '', '')
            `;

            await query(insertSql, [req.body.first_type_choice, secondType]);

            res.json({ message: 'Successfully saved types.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error saving types.' });
        }
    });

//create only the selected gimmick and attach it to the current build row
app.post('/create-gimmick',
    upload.none(),
    [
        body('gimmick_choice').notEmpty().withMessage('Gimmick is required.')
            .custom((value) => {
                if (value.toLowerCase() === 'paradox') {
                    throw new Error('Please specify Paradox (past) or Paradox (future).');
                }
                if (!validGimmicks.includes(value)) {
                    throw new Error('Invalid gimmick. Check the gimmick list for options.');
                }
                return true;
            })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const gimmickRows = await query(
                'SELECT gimmick_gen FROM pokemon_gimmicks WHERE gimmick_name = ? LIMIT 1',
                [req.body.gimmick_choice]
            );

            if (!gimmickRows || gimmickRows.length === 0) {
                return res.status(400).json({ message: 'Selected gimmick not found.' });
            }

            const updateSql = `
                UPDATE pokemon_characters
                SET gimmick = ?, gen = ?
                WHERE id = (
                    SELECT t.id FROM (
                        SELECT id FROM pokemon_characters
                        WHERE name = ''
                          AND gimmick = ''
                        ORDER BY id DESC
                        LIMIT 1
                    ) AS t
                )
            `;

            const result = await query(updateSql, [
                req.body.gimmick_choice,
                gimmickRows[0].gimmick_gen
            ]);

            res.json({ message: `Successfully saved gimmick ${req.body.gimmick_choice}` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error saving gimmick.' });
        }
    });

app.post('/pokemon-characters',
    upload.none(),
    [
        body('pokemon_name').notEmpty().withMessage('Your Pokemon needs a name!')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const pokemonName = req.body.pokemon_name.trim();
            const updateSql = `
                UPDATE pokemon_characters
                SET name = ?
                WHERE id = (
                    SELECT t.id FROM (
                        SELECT id FROM pokemon_characters
                        WHERE gimmick != ''
                          AND name = ''
                        ORDER BY id DESC
                        LIMIT 1
                    ) AS t
                )
            `;

            const result = await query(updateSql, [pokemonName]);
            if (!result || (result.affectedRows !== undefined && result.affectedRows === 0)) {
                return res.status(400).json({ message: 'No in-progress Pokemon found to name. Complete types and gimmick first.' });
            }

            await cleanupUnnamedPokemonRows();

            const selectSql = `
                SELECT
                    c.id,
                    c.name,
                    c.first_type,
                    c.second_type,
                    c.gimmick,
                    c.gen
                FROM pokemon_characters AS c
                ORDER BY c.id DESC
            `;

            const allData = await query(selectSql);
            res.json({
                message: `Successfully created ${pokemonName}!`,
                allData: allData
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error saving Pokemon.' });
        }
    });

app.get('/pokemon-characters',
    async (req, res) => {
        try {
            const rows = await query(
                `SELECT id, name, first_type, second_type, gimmick, gen
                 FROM pokemon_characters
                 ORDER BY id DESC`
            );
            res.json({ data: rows });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error loading pokemon characters.' });
        }
    });

app.get('/pokemon-characters/latest',
    async (req, res) => {
        try {
            const rows = await query(
                `SELECT id, name, first_type, second_type, gimmick, gen
                 FROM pokemon_characters
                 WHERE name != ''
                 ORDER BY id DESC
                 LIMIT 1`
            );
            res.json({ data: rows.length > 0 ? rows[0] : null });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error loading latest pokemon.' });
        }
    });

app.get('/pokemon-characters/:id',
    async (req, res) => {
        const pokemonId = parseInt(req.params.id, 10);
        if (isNaN(pokemonId)) {
            return res.status(400).json({ message: 'Invalid Pokemon ID.' });
        }

        try {
            const rows = await query(
                `SELECT id, name, first_type, second_type, gimmick, gen
                 FROM pokemon_characters
                 WHERE id = ?
                 LIMIT 1`,
                [pokemonId]
            );

            if (!rows || rows.length === 0) {
                return res.status(404).json({ message: 'Pokemon not found.' });
            }

            res.json({ data: rows[0] });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error loading Pokemon.' });
        }
    });

app.put('/pokemon-characters/:id',
    upload.none(),
    [
        body('source_id').notEmpty().withMessage('Source Pokemon ID is required.')
            .isInt().withMessage('Source Pokemon ID must be a valid number.')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const targetId = parseInt(req.params.id, 10);
        const sourceId = parseInt(req.body.source_id, 10);
        if (isNaN(targetId) || isNaN(sourceId)) {
            return res.status(400).json({ message: 'Invalid Pokemon ID.' });
        }

        if (targetId === sourceId) {
            return res.status(400).json({ message: 'Cannot replace the same Pokemon with itself.' });
        }

        try {
            const sourceRows = await query(
                `SELECT first_type, second_type, gimmick, gen, name
                 FROM pokemon_characters
                 WHERE id = ?
                 LIMIT 1`,
                [sourceId]
            );

            if (!sourceRows || sourceRows.length === 0) {
                return res.status(404).json({ message: 'Source Pokemon not found.' });
            }

            const source = sourceRows[0];
            const result = await query(
                `UPDATE pokemon_characters
                 SET first_type = ?, second_type = ?, gimmick = ?, gen = ?, name = ?
                 WHERE id = ?`,
                [source.first_type, source.second_type, source.gimmick, source.gen, source.name, targetId]
            );

            if (!result || (result.affectedRows !== undefined && result.affectedRows === 0)) {
                return res.status(404).json({ message: 'Target Pokemon not found.' });
            }

            await query(
                `DELETE FROM pokemon_characters
                 WHERE id = ?`,
                [sourceId]
            );

            res.json({ message: `Successfully replaced Pokemon #${targetId} with ${source.name}.` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error replacing Pokemon.' });
        }
    });

app.listen(port, () => {
    console.log(`Application listening on port ${port}`);
});