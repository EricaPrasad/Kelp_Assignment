const { Client } = require('pg');
const dotenv = require('dotenv');
const { csvToJson } = require('./utils/csv-parser');
const path = require('path');

dotenv.config();

const dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10),
};

const csvFilePath = process.env.CSV_FILE_PATH;

const mapToDbSchema = (rawUser) => {
    
    const { name, age, address, ...rest } = rawUser;

    const fullName = `${name.firstName || ''} ${name.lastName || ''}`.trim();

    const userAge = parseInt(age, 10);

    const addressJsonb = address || null;

    const additionalInfoJsonb = rest || null;

    return {
        fullName,
        userAge,
        addressJsonb,
        additionalInfoJsonb,
    };
};


const calculateAndPrintReport = (users) => {
    let countUnder20 = 0;
    let count20to40 = 0;
    let count40to60 = 0;
    let countOver60 = 0;
    const totalUsers = users.length;

    users.forEach(user => {
        const age = parseInt(user.age, 10);

        if (isNaN(age)) {
            return; 
        }

       
        if (age < 20) {
            countUnder20++;
        } else if (age >= 20 && age <= 40) { 
            count20to40++;
        } else if (age > 40 && age <= 60) {
            count40to60++;
        } else if (age > 60) {
            countOver60++;
        }
    });
    const calculatePercentage = (count) => {
        return totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0; 
    };

    const distUnder20 = calculatePercentage(countUnder20);
    const dist20to40 = calculatePercentage(count20to40);
    const dist40to60 = calculatePercentage(count40to60);
    const distOver60 = calculatePercentage(countOver60);
    
    
    console.log('AGE DISTRIBUTION REPORT');
    console.log('======================================================');
    console.log(`Total Records Processed: ${totalUsers}`);
    console.log('------------------------------------------------------');
    console.log('Age-Group  | % Distribution');
    console.log('------------------------------------------------------');
    console.log(` < 20      | ${distUnder20}%`);
    console.log(` 20 to 40  | ${dist20to40}%`);
    console.log(` 40 to 60  | ${dist40to60}%`);
    console.log(` > 60      | ${distOver60}%`);
    
};


const runChallenge = async () => {
    let client;
    try {
        console.log(`1. Reading and Parsing CSV file from: ${path.resolve(csvFilePath)}`);
        
        
        const usersData = csvToJson(csvFilePath);
        console.log(`   -> Successfully parsed ${usersData.length} records.`);
        if (usersData.length === 0) {
            console.error('   -> No records found after parsing. Exiting.');
            return;
        }
        console.log('\n2. Connecting to PostgreSQL database...');
        client = new Client(dbConfig);
        await client.connect();
        console.log('Connection successful.');
       
        console.log('\n3. Starting bulk insertion...');
        
        const insertPromises = usersData.map(async (rawUser) => {
            const mappedData = mapToDbSchema(rawUser);

            const query = `
                INSERT INTO public.users ("name", age, address, additional_info) 
                VALUES ($1, $2, $3::jsonb, $4::jsonb)
            `;
            const values = [
                mappedData.fullName,
                mappedData.userAge,
                mappedData.addressJsonb,
                mappedData.additionalInfoJsonb,
            ];
            
            await client.query(query, values);
        });

        await Promise.all(insertPromises);
        console.log(`Successfully inserted ${usersData.length} records into the 'users' table.`);

        console.log('\n4. Calculating Age Distribution Report...');
        calculateAndPrintReport(usersData);


    } catch (error) {
       
        console.error('\nAn error occurred during the challenge execution:', error.message);
        console.error('   Please check your .env file credentials and the database/table setup.');
    } finally {
        
        if (client) {
            await client.end();
            console.log('5. Database connection closed.');
        }
    }
};

runChallenge();