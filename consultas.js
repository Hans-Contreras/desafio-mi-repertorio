//Paso 1: Importar paquete pg
const { Pool } = require("pg");

//Crear instancia Pool
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "postgresql",
    port: 5432,
    database: "repertorio"
});

// Función asíncrona que recibe el parámetro datos
const insertar = async (datos) => {
    // consulta parametrizada con un JSON como argumento definiendo como values el parámetro datos
    const consulta = {
        text: "INSERT INTO repertorio values(DEFAULT, $1, $2, $3, $4) RETURNING *",
        values: datos,
        rowMode: "array"
    };
    try {
        const result = await pool.query(consulta);
        console.log(result.rows[0]); //ultimo registro insertado
        return result; //devuelve el objeto result de la consulta
    } catch (error) {
        console.log(error.code); //Error de consulta
        return error; //devuelve el objeto error de la consulta
    }
};

//Función asíncrona para consulta
const consultar = async () => {
    try {
        const result = await pool.query("SELECT * FROM repertorio");
        return result;
    } catch (error) {
        console.log(error.code);
        return error;
    }
}

//Funcion asíncrona para edición
const editar = async (id, datos) => {
    const consulta = {
        text: `UPDATE repertorio SET cancion=$1, artista=$2, tono=$3, link=$4 WHERE id=${id} RETURNING *`,
        values: datos,
        rowMode: "array"
    };
    try {
        const result = await pool.query(consulta);
        return result;
    } catch (error) {
        console.log(error.code);
        return error;
    }
}

//Funcion asíncrona para eliminar
const eliminar = async (id) => {
    try {
        const result = await pool.query(`DELETE FROM repertorio WHERE id = '${id}'`);
        return result;
    } catch (error) {
        console.log(error.code);
        return error;
    }
}

//Función asíncrona para consultar video
const consultaVideo = async (id) => {
    try {
        const result = await pool.query(`SELECT * FROM repertorio WHERE id = '${id}'`);
        const link = result.rows[0].link
        const urlId = link.split("=")[1]
        const urlVideo = `https://www.youtube.com/embed/${urlId}`
        return urlVideo;
    } catch (error) {
        console.log(error.code);
        return error;
    }
}

//Exportar un módulos
module.exports = { insertar, consultar, editar, eliminar, consultaVideo};

//Paso 2: Crear una función asíncrona que devuelva el objeto result de una consulta
//SQL con la instrucción “SELECT NOW()”.

const getDate = async () => {
    const result = await pool.query("SELECT NOW()");
    return result;
};
