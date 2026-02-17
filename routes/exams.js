const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const Result = require('../models/Result');

// @desc    Get all exams
// @route   GET /api/exams
router.get('/', async (req, res) => {
    try {
        const exams = await Exam.find().sort({ createdAt: -1 });
        res.json(exams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get single exam
// @route   GET /api/exams/:id
router.get('/:id', async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        res.json(exam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create new exam
// @route   POST /api/exams
router.post('/', async (req, res) => {
    try {
        const { name, questions } = req.body;

        const exam = new Exam({
            name,
            questions
        });

        const savedExam = await exam.save();
        res.status(201).json(savedExam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update exam
// @route   PUT /api/exams/:id
router.put('/:id', async (req, res) => {
    try {
        const { name, questions } = req.body;

        const exam = await Exam.findByIdAndUpdate(
            req.params.id,
            { name, questions },
            { new: true, runValidators: true }
        );

        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        res.json(exam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete exam
// @route   DELETE /api/exams/:id
router.delete('/:id', async (req, res) => {
    try {
        // Delete all results associated with this exam first
        await Result.deleteMany({ examId: req.params.id });

        const exam = await Exam.findByIdAndDelete(req.params.id);

        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        res.json({ message: 'Exam and associated results deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Submit exam result
// @route   POST /api/exams/:id/results
router.post('/:id/results', async (req, res) => {
    try {
        const { studentName, studentEmail, score, totalQuestions, answers, percentage, timeTaken } = req.body;
        const exam = await Exam.findById(req.params.id);

        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        const result = new Result({
            studentName,
            studentEmail,
            examId: req.params.id,
            examName: exam.name,
            score,
            totalQuestions,
            percentage,
            percentage,
            timeTaken,
            answers
        });

        const savedResult = await result.save();
        res.status(201).json(savedResult);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get results for an exam
// @route   GET /api/exams/:id/results
router.get('/:id/results', async (req, res) => {
    try {
        const results = await Result.find({ examId: req.params.id })
            .sort({ score: -1, timeTaken: 1 });
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete all results for an exam
// @route   DELETE /api/exams/:id/results
router.delete('/:id/results', async (req, res) => {
    try {
        const result = await Result.deleteMany({ examId: req.params.id });
        res.json({ message: 'All results deleted successfully', count: result.deletedCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all results for a specific student with Rank calculation
// @route   GET /api/student/:email/results
router.get('/student/:email/results', async (req, res) => {
    try {
        const studentEmail = req.params.email;
        const myResults = await Result.find({ studentEmail }).sort({ createdAt: -1 });

        // Calculate rank for each result
        const resultsWithRank = await Promise.all(myResults.map(async (myResult) => {
            // Get all results for this exam to calculate rank
            const allExamResults = await Result.find({ examId: myResult.examId })
                .sort({ score: -1, timeTaken: 1 });

            // Find index of myResult in the sorted list
            const rank = allExamResults.findIndex(r => r._id.toString() === myResult._id.toString()) + 1;

            return {
                ...myResult.toObject(),
                rank,
                totalParticipants: allExamResults.length
            };
        }));

        res.json(resultsWithRank);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
