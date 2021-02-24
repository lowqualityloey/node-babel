import express from 'express';
import { connect } from './database';
import exampleRouter from './routers/exampleRouter';
import marketplacesRouter from './routers/marketplacesRouter';
//import Marketplaces from './models/marketplaceModel';

connect();
const PORT = 5001;

const server = express();

server.use(express.json());

server.use('/api', exampleRouter);
server.use('/api/marketplaces', marketplacesRouter);

server.use('*', (req, res) => {
  return res.status(404).json({ error: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`Server us listening on port ${PORT}`);
});
