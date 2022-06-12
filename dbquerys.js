const { pool } = require('./dbConfig');

const getData = async (resource) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM ${resource}`);
        const results = { 'results': (result) ? result.rows : null };
        return results;
        client.release();
    } catch (err) {
        console.error(err);
        return "Error " + err;
    }
}

const getDataById = async (resource, id) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM ${resource} WHERE user_id = $1`, [id]);
        const results = { 'results': (result) ? result.rows : null };
        return results;
        client.release();
    } catch (err) {
        console.error(err);
        return "Error " + err;
    }
}

const postData = async (resource, attributeString, insertBody) => {
    const attributeStringArray = attributeString.split(', ');
    let value = '';
    for (let i = 1; i <= attributeStringArray.length; i++) {
        value = value + '$' + i + ',';
    }
    const length = value.length;
    value = value.slice(0, length - 1);

    try {
        const client = await pool.connect();
        const result = await client.query(`INSERT INTO ${resource} (${attributeString}) VALUES (${value})`, insertBody); //insertBody [attribute1, attribute2,...]
        return 'ok';
        client.release();
    } catch (err) {
        console.error(err);
        return "Error " + err;
    }
}

const putById = async (resource, whichData, insertBody) => {
    let value = '';
    for (let i = 0; i < whichData.length; i++) {
        value = value + ', ' + whichData[i] + '=' + '$' + [i + 1];
    }
    value = value.slice(2, value.length);
    try {
        const client = await pool.connect();
        const result = await client.query(`UPDATE ${resource} SET ${value} WHERE id = $${whichData.length + 1}`, insertBody); //insertBody [attribute1, attribute2,...]
        return `Item ${insertBody[2]} edited`;
        client.release();
    } catch (err) {
        console.error(err);
        return "Error " + err;
    }
}

const deleteById = async (resource, id) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`DELETE FROM ${resource} WHERE id=$1`, [id]); //insertBody [attribute1, attribute2,...]
        return `Item ${id} deleted`;
        client.release();
    } catch (err) {
        console.error(err);
        return "Error " + err;
    }
}

module.exports = { getData, getDataById, postData, putById, deleteById };