const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true
    },
    studentEmail: {
        type: String,
        required: true
    },
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
    examName: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    timeTaken: {
        type: Number,
        required: true
    },
    answers: [{
        questionText: String,
        userAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Result', resultSchema);
