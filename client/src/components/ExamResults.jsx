import { useState, useEffect } from 'react'

const ExamResults = ({ exam, onBack, onViewLeaderboard }) => {
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [expandedId, setExpandedId] = useState(null)

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/exams/${exam._id}/results`)
                if (!response.ok) {
                    throw new Error('Failed to fetch results')
                }
                const data = await response.json()
                setResults(data)
                setLoading(false)
            } catch (err) {
                setError(err.message)
                setLoading(false)
            }
        }

        fetchResults()
    }, [exam._id])

    const handleResetResults = async () => {
        if (window.confirm('Are you sure you want to DELETE ALL results for this exam? This cannot be undone.')) {
            try {
                const response = await fetch(`http://localhost:5000/api/exams/${exam._id}/results`, {
                    method: 'DELETE'
                })
                if (response.ok) {
                    setResults([])
                    alert('All results have been reset.')
                } else {
                    alert('Failed to reset results')
                }
            } catch (err) {
                console.error(err)
                alert('Error resetting results')
            }
        }
    }

    if (loading) return <div className="loading">Loading results...</div>
    if (error) return <div className="error-message">{error}</div>

    return (
        <div className="exam-results-container">
            <header className="results-header">
                <div className="header-actions">
                    <button className="btn-back" onClick={onBack}>← Back to Admin</button>
                    <div className="header-buttons-right">
                        <button className="btn btn-danger btn-small" onClick={handleResetResults} style={{ marginRight: '1rem', backgroundColor: '#e74c3c', color: 'white' }}>
                            Reset Results
                        </button>
                        <button className="btn btn-primary btn-small" onClick={onViewLeaderboard}>
                            View Leaderboard
                        </button>
                    </div>
                </div>
                <h2>Results for: {exam.name}</h2>
            </header>

            <div className="results-card">
                {results.length === 0 ? (
                    <div className="empty-state">
                        <p>No results found for this exam yet.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="results-table">
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Email ID</th>
                                    <th>Score</th>
                                    <th>Percentage</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((result) => (
                                    <>
                                        <tr key={result._id} onClick={() => setExpandedId(expandedId === result._id ? null : result._id)} style={{ cursor: 'pointer' }}>
                                            <td>{result.studentName}</td>
                                            <td>{result.studentEmail}</td>
                                            <td>
                                                <span className="score-badge">
                                                    {result.score}/{result.totalQuestions}
                                                </span>
                                            </td>
                                            <td>{result.percentage}%</td>
                                            <td>
                                                {new Date(result.createdAt).toLocaleString()}
                                                <span style={{ float: 'right', fontSize: '0.8em', color: '#666' }}>
                                                    {expandedId === result._id ? '▲' : '▼'}
                                                </span>
                                            </td>
                                        </tr>
                                        {expandedId === result._id && (
                                            <tr className="result-details-row">
                                                <td colSpan="5" style={{ padding: '0' }}>
                                                    <div className="result-breakdown">
                                                        <h4>Detailed Answers</h4>
                                                        <div className="breakdown-table-container">
                                                            <table className="breakdown-table">
                                                                <thead>
                                                                    <tr>
                                                                        <th>#</th>
                                                                        <th>Question</th>
                                                                        <th>Status</th>
                                                                        <th>Your Answer</th>
                                                                        <th>Correct Answer</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {result.answers.map((ans, idx) => (
                                                                        <tr key={idx} className={ans.isCorrect ? 'row-correct' : 'row-wrong'}>
                                                                            <td>{idx + 1}</td>
                                                                            <td className="question-text-cell">{ans.questionText}</td>
                                                                            <td>
                                                                                <span className={ans.isCorrect ? "correct-tag" : "wrong-tag"}>
                                                                                    {ans.isCorrect ? "Correct" : "Wrong"}
                                                                                </span>
                                                                            </td>
                                                                            <td className={ans.isCorrect ? "text-green" : "text-red"}>
                                                                                {ans.userAnswer}
                                                                            </td>
                                                                            <td>
                                                                                {!ans.isCorrect && (
                                                                                    <span className="text-green-bold">{ans.correctAnswer}</span>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ExamResults
