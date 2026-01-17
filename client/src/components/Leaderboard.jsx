import { useState, useEffect } from 'react'
import '../App.css'

const Leaderboard = ({ exam, onBack }) => {
    const [leaderboard, setLeaderboard] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/exams/${exam._id}/results`)
                if (!response.ok) {
                    throw new Error('Failed to fetch leaderboard')
                }
                const data = await response.json()
                setLeaderboard(data)
                setLoading(false)
            } catch (err) {
                setError(err.message)
                setLoading(false)
            }
        }

        fetchLeaderboard()
    }, [exam._id])

    const formatTime = (seconds) => {
        if (!seconds && seconds !== 0) return 'N/A'
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}m ${secs}s`
    }

    if (loading) return <div className="loading">Loading leaderboard...</div>
    if (error) return <div className="error-message">{error}</div>

    return (
        <div className="leaderboard-container">
            <div className="leaderboard-header">
                <h2>🏆 Leaderboard: {exam.name}</h2>
                <button onClick={onBack} className="btn-back">
                    Back
                </button>
            </div>

            <div className="leaderboard-table-container">
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Student Name</th>
                            <th>Score</th>
                            <th>Percentage</th>
                            <th>Time Taken</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((entry, index) => (
                            <tr key={entry._id} className={index < 3 ? `rank-${index + 1}` : ''}>
                                <td className="rank-cell">
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                                </td>
                                <td>{entry.studentName}</td>
                                <td>{entry.score}/{entry.totalQuestions}</td>
                                <td>
                                    <span className={`percentage-badge ${entry.percentage >= 70 ? 'pass' : 'fail'}`}>
                                        {entry.percentage}%
                                    </span>
                                </td>
                                <td>{formatTime(entry.timeTaken)}</td>
                                <td>{new Date(entry.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        {leaderboard.length === 0 && (
                            <tr>
                                <td colSpan="6" className="no-data">No results yet. Be the first to take the exam!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Leaderboard
