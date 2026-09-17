import mongoose, { Schema, Document } from 'mongoose';

export interface ISurvey extends Document {
  patientName?: string;
  age?: number;
  region?: string;
  language: 'en' | 'ur';
  answers: number[];
  totalScore: number;
  severity: string;
  createdAt: Date;
}

const SurveySchema: Schema = new Schema({
  patientName: { type: String, required: true },
  age: { type: Number, required: true },
  region: { type: String, required: true },
  language: { type: String, enum: ['en', 'ur'], required: true },
  answers: {
    type: [Number],
    required: true,
    validate: [
      (arr: number[]) => arr.length === 5,
      'Answers array must have exactly 5 elements'
    ]
  },
  totalScore: { type: Number, required: true },
  severity: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ISurvey>('Survey', SurveySchema);
