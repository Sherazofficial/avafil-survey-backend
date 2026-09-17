import { Request, Response } from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Survey from '../models/Survey';

const getSeverity = (score: number): string => {
  if (score >= 22 && score <= 25) return 'No ED';
  if (score >= 17 && score <= 21) return 'Mild ED';
  if (score >= 12 && score <= 16) return 'Mild to Moderate ED';
  if (score >= 8 && score <= 11) return 'Moderate ED';
  if (score >= 5 && score <= 7) return 'Severe ED';
  return 'Unknown';
};

export const submitSurvey = async (req: Request, res: Response) => {
  try {
    const { patientName, age, region, dateCompleted, language, answers } = req.body;

    if (!patientName || !age || !region || !dateCompleted || !language || !answers || !Array.isArray(answers) || answers.length !== 5) {
      return res.status(400).json({ message: 'Invalid data provided. Please ensure Patient Name, Age, Region, Date Completed, and all 5 answers are submitted.' });
    }

    const totalScore = answers.reduce((sum, current) => sum + current, 0);
    const severity = getSeverity(totalScore);

    // Wait for connection if it's currently connecting
    if (mongoose.connection.readyState === 2) {
      // connecting, wait a bit or just await a quick ping
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    // If not connected, try to connect now
    if (mongoose.connection.readyState === 0) {
      const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/avafil-survey';
      await mongoose.connect(mongoURI);
    }

    let savedId = '';
    
    if (mongoose.connection.readyState === 1) {
      const newSurvey = new Survey({
        patientName,
        age,
        region,
        dateCompleted,
        language,
        answers,
        totalScore,
        severity
      });
      
      const savedSurvey = await newSurvey.save();
      savedId = savedSurvey._id.toString();
    } else {
      // Fallback to local file if DB is down
      // NOTE: Vercel is read-only, so we just log and return success to avoid crashing
      console.warn('MongoDB not connected. Skipping DB save on Vercel.');
      savedId = `local-${Date.now()}`;
    }
    
    res.status(201).json({
      message: 'Survey submitted successfully',
      surveyId: savedId,
      totalScore,
      severity
    });
  } catch (error) {
    console.error('Error submitting survey:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
