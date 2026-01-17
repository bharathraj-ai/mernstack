import { useState, useEffect } from 'react'

const ExamList = ({ student, onStartExam, onLogout }) => {
    const [exams, setExams] = useState([])
    const [pastResults, setPastResults] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [expandedId, setExpandedId] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Available Exams
                const examsRes = await fetch('http://localhost:5000/api/exams')
                if (!examsRes.ok) throw new Error('Failed to fetch exams')
                const examsData = await examsRes.json()
                setExams(examsData)

                // Fetch Student History
                const historyRes = await fetch(`http://localhost:5000/api/exams/student/${student.email}/results`)
                if (historyRes.ok) {
                    const historyData = await historyRes.json()
                    setPastResults(historyData)
                }
            } catch (err) {
                console.error(err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [student.email])

    if (loading) {
        return (
            <div className="exam-list">
                <div className="loading">Loading exams...</div>
            </div>
        )
    }

    return (
        <div className="exam-list">
            <div className="exam-list-header">
                <div>
                    <h2>Available Exams</h2>
                    <p className="welcome-text">Welcome, {student.name}!</p>
                </div>
                <button onClick={onLogout} className="btn btn-secondary btn-small">
                    Logout
                </button>
            </div>

            {error && (
                <div className="error-message">
                    <span className="error-icon">⚠</span>
                    {error}
                </div>
            )}

            {exams.length === 0 ? (
                <div className="empty-state">
                    <p>No exams available at the moment.</p>
                    <p>Please check back later.</p>
                </div>
            ) : (
                <div className="exams-grid">
                    {exams.map((exam) => {
                        const isCompleted = pastResults.some(r => r.examId === exam._id);
                        return (
                            <div key={exam._id} className="exam-card-student">
                                <div className="exam-info">
                                    <h3>{exam.name}</h3>
                                    <p>{exam.questions.length} Questions</p>
                                    <span className="exam-meta">
                                        Created: {new Date(exam.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                {isCompleted ? (
                                    <button className="btn" disabled style={{ backgroundColor: '#2ecc71', color: 'white', opacity: 1, cursor: 'default' }}>
                                        Completed ✅
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => onStartExam(exam)}
                                        className="btn btn-primary"
                                    >
                                        Start Exam
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            <div className="performance-section" style={{ marginTop: '3rem', borderTop: '2px solid #eee', paddingTop: '2rem' }}>
                <h2>My Performance</h2>
                {pastResults.length === 0 ? (
                    <p style={{ color: '#666', fontStyle: 'italic' }}>You haven't taken any exams yet.</p>
                ) : (
                    <div className="table-container">
                        <table className="results-table">
                            <thead>
                                <tr>
                                    <th>Exam Name</th>
                                    <th>Score</th>
                                    <th>Percentage</th>
                                    <th>Rank</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pastResults.map((result) => (
                                    <>
                                        <tr key={result._id} onClick={() => setExpandedId(expandedId === result._id ? null : result._id)} style={{ cursor: 'pointer' }}>
                                            <td>{result.examName}</td>
                                            <td>
                                                <span className="score-badge">
                                                    {result.score}/{result.totalQuestions}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`percentage-badge ${result.percentage >= 50 ? 'pass' : 'fail'}`}>
                                                    {result.percentage}%
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{ fontWeight: 'bold', color: result.rank === 1 ? '#d4af37' : 'inherit' }}>
                                                    {result.rank === 1 ? '🥇 1st' :
                                                        result.rank === 2 ? '🥈 2nd' :
                                                            result.rank === 3 ? '🥉 3rd' :
                                                                `#${result.rank}`}
                                                </span>
                                                <span style={{ fontSize: '0.8em', color: '#888', marginLeft: '5px' }}>
                                                    / {result.totalParticipants}
                                                </span>
                                                <span style={{ float: 'right', fontSize: '0.8em', color: '#666' }}>
                                                    {expandedId === result._id ? '▲' : '▼'}
                                                </span>
                                            </td>
                                            <td>{new Date(result.createdAt).toLocaleDateString()}</td>
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
                                                                    {result.answers && result.answers.map((ans, idx) => (
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

export default ExamList
