const mysql = require('mysql2/promise');


const createConnection = async () =>{
return await mysql.createConnection({
    host: '162.240.101.28',
    user: 'wwmoun_gregoria',
    password:'Catedral1402',
    database: 'wwmoun_gregoria'
});
}

const getClient = async (telefono)=>{
    console.log(telefono);
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT nombre,apellido FROM compradores where telefono = ?',[telefono]);
    if (rows.length > 0) return rows[0];
    return false;
}

const agendar = async (cliente,telefono)=>{
    const connection = await createConnection();
    const [rows] = await connection.execute('INSERT INTO soporte (cliente,telefono) values (?,?)',[cliente,telefono]);
    if (rows.length > 0) return true;
    return false;
}

module.exports= {
    getClient,
    agendar
}
