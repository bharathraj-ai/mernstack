const QuestionForm = ({ question, questionNumber, onUpdate, onRemove }) => {
    const handleQuestionTextChange = (e) => {
        onUpdate({ questionText: e.target.value })
    }

    const handleOptionChange = (index, value) => {
        const newOptions = [...question.options]
        newOptions[index] = value
        onUpdate({ options: newOptions })
    }

    const handleCorrectAnswerChange = (index) => {
        onUpdate({ correctAnswer: index })
    }

    return (
        <div className="question-card">
            <div className="question-header">
                <h4>Question {questionNumber}</h4>
                <button
                    type="button"
                    onClick={onRemove}
                    className="btn btn-danger btn-small"
                >
                    Remove
                </button>
            </div>

            <div className="form-group">
                <label>Question Text</label>
                <textarea
                    value={question.questionText}
                    onChange={handleQuestionTextChange}
                    placeholder="Enter your question here..."
                    className="input-field textarea"
                    rows={3}
                />
            </div>

            <div className="options-section">
                <label>Options (Select the correct answer)</label>
                <div className="options-grid">
                    {question.options.map((option, index) => (
                        <div key={index} className="option-item">
                            <input
                                type="radio"
                                name={`correct-${question.id}`}
                                checked={question.correctAnswer === index}
                                onChange={() => handleCorrectAnswerChange(index)}
                                className="radio-input"
                                id={`option-${question.id}-${index}`}
                            />
                            <label
                                htmlFor={`option-${question.id}-${index}`}
                                className="option-label"
                            >
                                <span className="option-letter">
                                    {String.fromCharCode(65 + index)}
                                </span>
                            </label>
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                                className={`input-field option-input ${question.correctAnswer === index ? 'correct-option' : ''
                                    }`}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default QuestionForm
