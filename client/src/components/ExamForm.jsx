import { useState } from 'react'
import QuestionForm from './QuestionForm'

const ExamForm = ({ onExamCreated }) => {
    const [examName, setExamName] = useState('')
    const [questions, setQuestions] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                id: Date.now(),
                questionText: '',
                options: ['', '', '', ''],
                correctAnswer: 0
            }
        ])
    }

    const updateQuestion = (id, updatedQuestion) => {
        setQuestions(questions.map(q =>
            q.id === id ? { ...q, ...updatedQuestion } : q
        ))
    }

    const removeQuestion = (id) => {
        setQuestions(questions.filter(q => q.id !== id))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        // Validation
        if (!examName.trim()) {
            setError('Please enter an exam name')
            return
        }

        if (questions.length === 0) {
            setError('Please add at least one question')
            return
        }

        // Validate each question
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i]
            if (!q.questionText.trim()) {
                setError(`Question ${i + 1}: Please enter question text`)
                return
            }
            if (q.options.some(opt => !opt.trim())) {
                setError(`Question ${i + 1}: Please fill in all 4 options`)
                return
            }
        }

        setIsSubmitting(true)

        try {
            const response = await fetch('http://localhost:5000/api/exams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: examName,
                    questions: questions.map(({ questionText, options, correctAnswer }) => ({
                        questionText,
                        options,
                        correctAnswer
                    }))
                })
            })

            if (!response.ok) {
                throw new Error('Failed to create exam')
            }

            const createdExam = await response.json()

            // Reset form
            setExamName('')
            setQuestions([])

            // Notify parent
            onExamCreated(createdExam)
        } catch (err) {
            setError(err.message || 'Something went wrong')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form className="exam-form" onSubmit={handleSubmit}>
            <div className="form-section">
                <h2>Create New Exam</h2>

                {error && (
                    <div className="error-message">
                        <span className="error-icon">⚠</span>
                        {error}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="examName">Exam Name</label>
                    <input
                        type="text"
                        id="examName"
                        value={examName}
                        onChange={(e) => setExamName(e.target.value)}
                        placeholder="Enter exam name (e.g., Math Quiz Chapter 1)"
                        className="input-field"
                    />
                </div>
            </div>

            <div className="form-section">
                <div className="section-header">
                    <h3>Questions ({questions.length})</h3>
                    <button
                        type="button"
                        onClick={addQuestion}
                        className="btn btn-secondary"
                    >
                        + Add Question
                    </button>
                </div>

                {questions.length === 0 ? (
                    <div className="empty-state">
                        <p>No questions added yet.</p>
                        <p>Click "Add Question" to start building your exam.</p>
                    </div>
                ) : (
                    <div className="questions-list">
                        {questions.map((question, index) => (
                            <QuestionForm
                                key={question.id}
                                question={question}
                                questionNumber={index + 1}
                                onUpdate={(updated) => updateQuestion(question.id, updated)}
                                onRemove={() => removeQuestion(question.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="form-actions">
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Creating Exam...' : 'Create Exam'}
                </button>
            </div>
        </form>
    )
}

export default ExamForm
