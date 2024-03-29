const express = require('express')
const cors = require('cors');


const knex = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'Mn1475369',
        database: 'TMA_Warehouse',
        port: 5432
    }
});
const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // Update with your frontend origin
    credentials: true,
}));
app.use(express.json());

app.post('/', async(req, res) => {
    const { username, password } = req.body;

    try {
        const usersDetail = await knex.select().from( 'users' ).where( { username } );
        if (password == usersDetail[0].password) {
            const firstTwoChars = username.substring(0, 2);
            if ( firstTwoChars == 'co' )
            {

                res.redirect('/coordinatorpanel')
            } else if (firstTwoChars == 'em') {
                res.redirect('/employeepanel')
            } else if(firstTwoChars=='ad'){
                res.redirect('/adminpanel')
            }
        } else
        {
            console.log('false');
            res.status(500)
        }
    } catch (error) {
        res.status(500).send('not ok')
    }


})

app.get('/coordinatorpanel', async(req, res) => {
    const listOfGoods = await knex.select().from( 'item' );
    res.json({ listOfGoods })
} )

app.get('/employeepanel', (req, res) => {
    res.send('you are employee')
})
app.get('/adminpanel', (req, res) => {
    res.send('you are admin')
})

app.post('/coordinatorpanel/additem',async (req,res)=>{
    try {
        const { itemname,contactperson, itemgroup, pricewithoutvat, quantity, status, storagelocation, unitofmeasurement } = req.body;
        const insertItem = await knex.insert( {itemname, contactperson, itemgroup, pricewithoutvat, quantity, status, storagelocation, unitofmeasurement } ).into( 'item' );

        res.send('ok')
    } catch (error) {
        console.log( error );
        res.status(400).send(error)
    }
})
app.delete('/coordinatorpanel/deleteitem/:itemId', async (req, res) => {
    try {
        const itemId = req.params.itemId;
        const deletedCount = await knex('item').where('itemid', itemId).del();
        if (deletedCount === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
} );

app.put('/coordinatorpanel/updateitem/:itemId', async (req, res) => {
    try {
        const itemid = req.params.itemId;
        const { contactperson, itemgroup, pricewithoutvat, quantity, status, storagelocation, unitofmeasurement } = req.body;

        const updatedCount = await knex('item')
            .where('itemid', itemid)
            .update({ itemid,contactperson, itemgroup, pricewithoutvat, quantity, status, storagelocation, unitofmeasurement });
        if (updatedCount === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
} );

app.post('/employeepanel/addrequest', async (req, res) => {
    let reqRowId;
    const lastRequestRowId = await knex( 'tma_request_rows' ).select( 'requestrowid' ).orderBy( 'requestrowid', 'desc' ).first();
    if (lastRequestRowId==undefined) {
        reqRowId=1
    }else{
        reqRowId=lastRequestRowId.requestrowid+1
    }

    const request = req.body;
    console.log( request );
    let i = 0;
    for (item of request){
        console.log( 'in for' ,item);
        const itemId = await knex('item')
            .select('itemid','status')
            .whereRaw( "LOWER(itemname) LIKE ?", [ `%${ item.itemname.toLowerCase()}` ] );
        i += 1;
        console.log(itemId);
        await knex.insert( {
            employeename: item.employeename,
            itemid:itemId[0].itemid,
            unitofmeasurement: item.unitofmeasurement,
            quantity: item.quantity,
            pricewithoutvat: item.pricewithoutvat,
            comment: item.comment,
            status: itemId[0].status,
            requestrowid: reqRowId,
            itemname: item.itemname
        } ).into( 'tma_requests' );
        const insertedRequestId = await knex( 'tma_requests' ).select( 'requestid' ).orderBy( 'requestid', 'desc' ).first();
        console.log('reqid',insertedRequestId);
        await knex.insert( {
            itemid: itemId[0].itemid,
            unitofmeasurement: item.unitofmeasurement,
            quantity: item.quantity,
            pricewithoutvat: item.pricewithoutvat,
            comment: item.comment,
            requestrowid: reqRowId,
            itemname: item.itemname,
            requestid: insertedRequestId.requestid // Corrected property name
        } ).into( 'tma_request_rows' );

    }
    res.send('ok')
} );

app.get('/requestlist',async (req,res)=>{
    const requestsList = await knex.select().from( 'tma_requests' );
    res.json({ requestsList })
} )

app.get('/requestsrow/:requestrowid',async(req,res)=>{
    const requestRowId = req.params.requestrowid;
    const requestRowTable = await knex( 'tma_request_rows' ).select().where( { requestrowid: requestRowId } );
    res.status(200).send(requestRowTable)
} )

app.delete('/delete/request/:requestid/:requestrowid',async (req,res)=>{
    const requestid = req.params.requestid;
    const requestrowid = req.params.requestrowid;
    await knex( 'tma_requests' ).where( { requestid,requestrowid } ).del();
    await knex( 'tma_request_rows' ).where( { requestrowid, requestid } ).del();

    res.status(200).send('rejected')
} )

app.put('/confirm/request/:requestrowid/:requestid/:itemid',async (req,res)=>{
    const requestrowid = req.params.requestrowid;
    const requestid = req.params.requestid;
    const itemid = req.params.itemid;
    const reqQuantity = (req.body.quantity);
    try {
        const quantityOfItem = await knex( 'item' ).select( 'quantity' ).where( { itemid } )
        await knex( 'tma_requests' ).where( { requestid,requestrowid } ).del();
        await knex( 'tma_request_rows' ).where( { requestrowid, requestid } ).del();
        await knex( 'item' ).where( { itemid } ).update( { quantity: quantityOfItem[0].quantity - reqQuantity } );
        res.status(200).send('ok')
    } catch (error) {
        console.log(error);
    }
})


app.get( '/itemtable/search/name/:itemname', async ( req, res ) =>
{
    try
    {
        console.log(req.params);
        const itemname = req.params.itemname;
        console.log( itemname );
        const allItem=await knex('item').select()
        const result = await knex('item').select().whereRaw("LOWER(itemname) LIKE ?", [`${itemname.toLowerCase()}%`]);
        if (result.length>0) {
            res.status(200).json(result)
        } else
        {
            res.status(404).json(allItem)
        }
    } catch (error) {
        console.log(error);
    }


})



app.listen(3005, () => {
    console.log('server is listening on port 3005');
})