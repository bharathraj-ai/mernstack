import { useState, useEffect } from 'react'

const TakeExam = ({ exam, student, onComplete, onBack }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState({})
    const [timeLeft, setTimeLeft] = useState(exam.questions.length * 60) // 1 min per question
    const [submitted, setSubmitted] = useState(false)
    const [score, setScore] = useState(null)

    // Timer effect
    useEffect(() => {
        if (submitted) return

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    handleSubmit()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [submitted])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleAnswer = (questionIndex, answerIndex) => {
        setAnswers({
            ...answers,
            [questionIndex]: answerIndex
        })
    }

    const handleNext = () => {
        if (currentQuestion < exam.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
        }
    }

    const handlePrev = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1)
        }
    }

    const handleSubmit = async () => {
        // Calculate score
        let correct = 0
        const detailedAnswers = []

        exam.questions.forEach((q, index) => {
            const isCorrect = answers[index] === q.correctAnswer
            if (isCorrect) {
                correct++
            }
            detailedAnswers.push({
                questionText: q.questionText,
                userAnswer: q.options[answers[index]],
                correctAnswer: q.options[q.correctAnswer],
                isCorrect
            })
        })

        const totalTime = exam.questions.length * 60
        const timeTaken = totalTime - timeLeft

        const finalScore = {
            correct,
            total: exam.questions.length,
            percentage: Math.round((correct / exam.questions.length) * 100)
        }

        setScore(finalScore)
        setSubmitted(true)

        // Submit result to backend
        try {
            await fetch(`http://localhost:5000/api/exams/${exam._id}/results`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentName: student.name,
                    studentEmail: student.email,
                    score: correct,
                    totalQuestions: exam.questions.length,
                    percentage: finalScore.percentage,
                    timeTaken,
                    answers: detailedAnswers
                }),
            })
        } catch (error) {
            console.error('Error submitting result:', error)
        }
    }

    const question = exam.questions[currentQuestion]

    if (submitted && score) {
        return (
            <div className="exam-result">
                <div className="result-card">
                    <h2>🎉 Exam Completed!</h2>
                    <div className="score-display">
                        <div className="score-circle">
                            <span className="score-percentage">{score.percentage}%</span>
                        </div>
                        <p className="score-text">
                            You got <strong>{score.correct}</strong> out of <strong>{score.total}</strong> questions correct
                        </p>
                    </div>
                    <div className="result-details">
                        <p><strong>Exam:</strong> {exam.name}</p>
                        <p><strong>Student:</strong> {student.name}</p>
                    </div>
                    <div className="result-actions">
                        <button onClick={onComplete} className="btn btn-secondary">
                            Back to Exam List
                        </button>
                        <button onClick={() => onComplete(true)} className="btn btn-primary">
                            View Leaderboard 🏆
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="take-exam">
            <div className="exam-header">
                <div className="exam-title">
                    <button onClick={onBack} className="btn-back">← Back</button>
                    <h2>{exam.name}</h2>
                </div>
                <div className={`timer ${timeLeft < 60 ? 'timer-warning' : ''}`}>
                    ⏱️ {formatTime(timeLeft)}
                </div>
            </div>

            <div className="question-progress">
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${((currentQuestion + 1) / exam.questions.length) * 100}%` }}
                    />
                </div>
                <span>Question {currentQuestion + 1} of {exam.questions.length}</span>
            </div>

            <div className="question-card-take">
                <h3 className="question-text">{question.questionText}</h3>

                <div className="options-list">
                    {question.options.map((option, index) => (
                        <button
                            key={index}
                            className={`option-btn ${answers[currentQuestion] === index ? 'selected' : ''}`}
                            onClick={() => handleAnswer(currentQuestion, index)}
                        >
                            <span className="option-letter-btn">{String.fromCharCode(65 + index)}</span>
                            <span className="option-text">{option}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="question-navigation">
                <button
                    onClick={handlePrev}
                    disabled={currentQuestion === 0}
                    className="btn btn-secondary"
                >
                    ← Previous
                </button>

                {currentQuestion === exam.questions.length - 1 ? (
                    <button onClick={handleSubmit} className="btn btn-primary">
                        Submit Exam
                    </button>
                ) : (
                    <button onClick={handleNext} className="btn btn-primary">
                        Next →
                    </button>
                )}
            </div>

            <div className="question-dots">
                {exam.questions.map((_, index) => (
                    <button
                        key={index}
                        className={`dot ${currentQuestion === index ? 'active' : ''} ${answers[index] !== undefined ? 'answered' : ''}`}
                        onClick={() => setCurrentQuestion(index)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default TakeExam
