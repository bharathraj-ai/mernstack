const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: [true, 'Question text is required']
    },
    options: {
        type: [String],
        required: [true, 'Options are required'],
        validate: {
            validator: function (v) {
                return v.length === 4;
            },
            message: 'Exactly 4 options are required'
        }
    },
    correctAnswer: {
        type: Number,
        required: [true, 'Correct answer is required'],
        min: 0,
        max: 3
    }
});

const examSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Exam name is required'],
        trim: true
    },
    questions: [questionSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Exam', examSchema);
