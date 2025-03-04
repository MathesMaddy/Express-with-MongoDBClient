const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const mongodb = require('mongodb');

const uri = 'mongodb://localhost:27017';

const client = new mongodb.MongoClient(uri);

app.post('/create-new-employee', async (req,res) => {
    try {
        const { name, role, salary, company, email } = req.body        
        if( name && role && Number(salary) && company && email) {
            await client.connect();
            console.log('Connected to Database from Create Employee');
            let dbName = 'ProjectDB'
            const db = client.db(dbName);
            let collectionName = 'employee' 
            const collection = db.collection(collectionName)
            let empId = 'emp' + Date.now();
            const result = await collection.insertOne({
                empId : empId,
                name : name,
                role : role,
                salary : Number(salary),
                company : company,
                email : email
            })
            if(result.acknowledged) {
                await client.close();
                return res.status(200).json('Successfully create.');
            }
            else {
                await client.close()
                return res.status(400).json('Error No Data.');
            }
        }
        else {
            await client.close()
            return res.status(400).json('No data.')
        }
    }
    catch(e) {
        await client.close();
        res.status(400).json('Error');
    }
    
})

app.post('/update-employee/:id', async(req, res) => {
    
    try {        
        const { id } = req.params
        const { salary } = req.body
        if(Number(salary)) {
            await client.connect();
            console.log('Connected to Database from Update Employee');
            let dbName = 'ProjectDB'
            const db = client.db(dbName);
            let collectionName = 'employee';
            const collection = db.collection(collectionName)
            const result = await collection.updateOne({ empId : id }, { $set : { salary : Number(salary) }})            
            if(result.acknowledged) {
                await client.close();
                return res.status(200).json('Successfully update.');
            }
            else {
                await client.close()
                return res.status(400).json('Error No Data.');
            }
        } 
        else {
            await client.close();
            return res.status(400).json('No data.')
        }
    }
    catch(e) {
        await client.close();
        res.status(400).json('Error');
    }
})

app.post('/delete-employee/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await client.connect();
        console.log('Connected to Database from Delete Employee');
        let dbName = 'ProjectDB'
            const db = client.db(dbName);
            let collectionName = 'employee';
            const collection = db.collection(collectionName)
            const result = await collection.deleteOne({ empId : id });
            if(result.acknowledged) {
                await client.close();
                return res.status(200).json('Successfully deleted.');
            }
            else {
                await client.close()
                return res.status(400).json('Error No Data.');
            }
    }
    catch(e) {
        await client.close();
        res.status(400).json('Error');
    }
})


app.get('/get-all-employees', async (req, res) => {
    try {
        await client.connect();
        console.log('Connected to Database from Get All Employee');
        let dbName = 'ProjectDB'
        const db = client.db(dbName);
        let collectionName = 'employee';
        const collection = db.collection(collectionName)
        const result = await collection.find({}).toArray();
        if(result) {
            await client.close();
            return res.status(200).json(result);
        }
        else {
            await client.close()
            return res.status(400).json('Error No Data.');
        }
    }
    catch(e) {
        await client.close();
        res.status(400).json('Error');
    }
})

app.listen(PORT, console.log(`Server is listening Port : ${PORT}`));