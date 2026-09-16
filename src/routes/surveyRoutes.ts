import express from 'express';
import { submitSurvey } from '../controllers/surveyController';

const router = express.Router();

router.post('/', submitSurvey);

export default router;
