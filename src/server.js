import express from 'express';
import { connect } from './database';
import Marketplaces from './models/marketplaceModel';

connect();
const PORT = 5001;

const server = express();

server.use(express.json());

server.get('/api/marketplaces', async (req, res) => {
  try {
    const marketplaces = await Marketplaces.find({});
    console.log(marketplaces); // should be an array of object

    return res.json(marketplaces);
  } catch (e) {
    console.error(e);
    return res.status(500).send(e);
  }
});
server.post('/api/marketplaces', async (req, res) => {
  try {
    // check the request body exists
    const { body } = req;
    console.log(body);
    // check body properties - name, description, owner
    if (
      !body.hasOwnProperty('name') ||
      !body.hasOwnProperty('description') ||
      !body.hasOwnProperty('owner')
    ) {
      return res
        .status(400)
        .json({ error: 'Marketplace name, description, owner, required' });
    }
    //check if the marketplace already exists
    const marketplaceExists = await Marketplaces.findOne({ name: body.name });
    console.log(marketplaceExists);

    if (marketplaceExists != null) {
      return res
        .status(400)
        .json({ error: 'Marketplace name, description, owner, required' });
    }
    // use the model to create a new marketplace
    const marketplace = new Marketplaces(body);
    console.log(marketplace);
    // save the marketplace
    await marketplace.save();
    // return  200 status and success message
    return res.status(201).json({
      success: true,
      data: marketplace,
    });
    // return res.end();
  } catch (e) {
    console.error(e);
    return res.status(500).send(e);
  }
});

server.put('/api/marketplaces/:id', async (req, res) => {
  try {
    const { body } = req;
    const { id } = req.params;
    //check :id is not undefined
    if (!id) {
      return res
        .status(404)
        .json({ error: 'Marketplace id parameter required' });
    }
    //check body properties - name, description, owner

    if (
      !body.hasOwnProperty('name') ||
      !body.hasOwnProperty('description') ||
      !body.hasOwnProperty('owner')
    ) {
      return res
        .status(400)
        .json({ error: 'Marketplace name, description, owner, required' });
    }
    const marketplace = await Marketplaces.findByIdAndUpdate(id, body, {
      new: true,
    }).lean();
    delete marketplace.__v;
    console.log(marketplace);
    return res.status(200).json({ success: true, data: marketplace });
  } catch (e) {
    console.error(e);

    if (e.kind == 'ObjectID' && e.path == '_id') {
      return res.status(404).json({ error: 'Invalid id parameter' });
    }
    return res.status(500).send(e);
  }
});

server.delete('/api/marketplaces/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Marketplaces.findByIdAndDelete(id);
    return res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

server.use('*', (req, res) => {
  return res.status(404).json({ error: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`Server us listening on port ${PORT}`);
});
