
import mysql from 'mysql2/promise';

 const db=async ()=>{
    const connection = await mysql.createConnection(process.env.DATABASE_URL);

    connection.connect((err) => {
        if (err) {
            console.log('Error connecting to Db');
            return;
        }
        });
    console.log('Connection established');
    return connection;
};


// const db = await mysql.createConnection(process.env.DATABASE_URL);

//     db.on('error', (err) => {
//         console.log('Error connecting to Db');
//         return;
//     });
//     console.log('Connection established');

    
export {db};