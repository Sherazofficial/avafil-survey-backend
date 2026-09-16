import mongoose, { Document } from 'mongoose';
export interface ISurvey extends Document {
    patientName?: string;
    dateOfBirth?: string;
    language: 'en' | 'ur';
    answers: number[];
    totalScore: number;
    severity: string;
    createdAt: Date;
}
declare const _default: mongoose.Model<ISurvey, {}, {}, {}, Document<unknown, {}, ISurvey, {}, mongoose.DefaultSchemaOptions> & ISurvey & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ISurvey>;
export default _default;
//# sourceMappingURL=Survey.d.ts.map