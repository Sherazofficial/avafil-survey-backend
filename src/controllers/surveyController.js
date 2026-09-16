"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitSurvey = void 0;
const express_1 = require("express");
const Survey_1 = __importDefault(require("../models/Survey"));
const getSeverity = (score) => {
    if (score >= 22 && score <= 25)
        return 'No ED';
    if (score >= 17 && score <= 21)
        return 'Mild ED';
    if (score >= 12 && score <= 16)
        return 'Mild to Moderate ED';
    if (score >= 8 && score <= 11)
        return 'Moderate ED';
    if (score >= 5 && score <= 7)
        return 'Severe ED';
    return 'Unknown';
};
const submitSurvey = async (req, res) => {
    try {
        const { patientName, dateOfBirth, language, answers } = req.body;
        if (!language || !answers || !Array.isArray(answers) || answers.length !== 5) {
            return res.status(400).json({ message: 'Invalid data provided. Please ensure all 5 answers are submitted.' });
        }
        const totalScore = answers.reduce((sum, current) => sum + current, 0);
        const severity = getSeverity(totalScore);
        const newSurvey = new Survey_1.default({
            patientName,
            dateOfBirth,
            language,
            answers,
            totalScore,
            severity
        });
        const savedSurvey = await newSurvey.save();
        res.status(201).json({
            message: 'Survey submitted successfully',
            surveyId: savedSurvey._id,
            totalScore,
            severity
        });
    }
    catch (error) {
        console.error('Error submitting survey:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.submitSurvey = submitSurvey;
//# sourceMappingURL=surveyController.js.map