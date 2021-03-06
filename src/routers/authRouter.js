import { Router } from 'express';
import User from '..models/userModel';

const Router = Router();

router.post('/register', async (req, res) => {
  try {
    const { body } = req;
    console.log(body);

    return res.end();
  } catch (e) {
    next(e);
  }
});

export default router;
