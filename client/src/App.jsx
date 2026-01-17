import { useState, useEffect } from 'react'
import './App.css'
import ExamForm from './components/ExamForm'
import StudentLogin from './components/StudentLogin'
import ExamList from './components/ExamList'
import TakeExam from './components/TakeExam'
import ExamResults from './components/ExamResults'
import Leaderboard from './components/Leaderboard'

// Admin email that is allowed
const ADMIN_EMAIL = "bharathraj95317@gmail.com"

function App() {
  const [view, setView] = useState('home') // home, login, admin, student-exams, take-exam, admin-results, leaderboard
  const [student, setStudent] = useState(null)
  const [admin, setAdmin] = useState(null)
  const [selectedExam, setSelectedExam] = useState(null)
  const [exams, setExams] = useState([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [authError, setAuthError] = useState('')

  // Check for existing sessions
  useEffect(() => {
    const savedAdmin = localStorage.getItem('admin')
    const savedStudent = localStorage.getItem('student')

    if (savedAdmin) {
      setAdmin(JSON.parse(savedAdmin))
      setView('admin')
    } else if (savedStudent) {
      setStudent(JSON.parse(savedStudent))
      setView('student-exams')
    }
  }, [])

  // Fetch exams for admin
  useEffect(() => {
    if (view === 'admin') {
      fetch('http://localhost:5000/api/exams')
        .then(res => res.json())
        .then(data => setExams(data))
        .catch(err => console.error('Error fetching exams:', err))
    }
  }, [view])

  const handleExamCreated = (exam) => {
    setExams([exam, ...exams])
    setSuccessMessage(`Exam "${exam.name}" created successfully with ${exam.questions.length} questions!`)
    setShowSuccess(true)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 5000)
    // Refresh list
    fetch('http://localhost:5000/api/exams')
      .then(res => res.json())
      .then(data => setExams(data))
  }

  /* Combined Login Handler */
  const handleUnifiedLogin = (formData) => {
    const { name, email } = formData

    // Check for Admin Credentials
    // Check for Admin Credentials
    if (email.trim().toLowerCase() === 'bharathraj95317@gmail.com') {

      const adminData = { email, name }
      setAdmin(adminData)
      localStorage.setItem('admin', JSON.stringify(adminData))
      setView('admin')

    } else {
      // Default to Student Login
      setStudent(formData)
      localStorage.setItem('student', JSON.stringify(formData))
      setView('student-exams')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('student')
    localStorage.removeItem('admin')
    setStudent(null)
    setAdmin(null)
    setView('login')
  }

  const handleStartExam = (exam) => {
    setSelectedExam(exam)
    setView('take-exam')
  }

  const handleExamComplete = (showLeaderboard = false) => {
    if (showLeaderboard) {
      setView('leaderboard')
    } else {
      setSelectedExam(null)
      setView('student-exams')
    }
  }
  // Home/Landing Page
  if (view === 'home') {
    return (
      <div className="app minimalist-home">
        <header className="home-header" style={{ position: 'absolute', top: '1rem', right: '2rem', width: 'auto' }}>
          <button
            className="btn btn-primary"
            onClick={() => setView('login')}
          >
            Login
          </button>
        </header>

        <div className="minimalist-container">
          <h1 className="minimalist-title">Exam Portal</h1>
          <p className="minimalist-tagline">Simple. Fast. Reliable.</p>

          <div style={{ marginBottom: '3rem' }}>
            <button
              className="btn btn-primary"
              style={{ fontSize: '1.2rem', padding: '1rem 2.5rem', borderRadius: '50px' }}
              onClick={() => setView('login')}
            >
              Get Started ➜
            </button>
          </div>

        </div>
      </div>
    )
  }
  // Unified Login View
  if (view === 'login') {
    return (
      <div className="app">
        <header className="app-header">
          <button className="btn-back" onClick={() => setView('home')}>← Back</button>
          <h1>Exam Portal</h1>
          <p>Welcome back! Please login to continue.</p>
        </header>

        <StudentLogin onLogin={handleUnifiedLogin} />
      </div>
    )
  }

  // Admin View
  if (view === 'admin') {
    return (
      <div className="app">
        <header className="app-header admin-header">
          <div className="admin-nav-top">
            <button className="btn-back" onClick={handleLogout}>← Logout</button>
            <button className="btn-secondary btn-small" onClick={() => {
              setStudent({ name: admin.name, email: admin.email })
              setView('student-exams')
            }}>
              Student View ➜
            </button>
          </div>
          <div className="admin-info">
            <span className="admin-badge">👨‍💼 Admin</span>
            <span className="admin-name">{admin?.email}</span>
          </div>
          <h1> Exam Admin Portal</h1>
          <p>Create and manage your MCQ exams</p>
        </header>

        {showSuccess && (
          <div className="success-banner">
            <span className="success-icon">✓</span>
            {successMessage}
          </div>
        )}

        <main className="app-main">
          <ExamForm onExamCreated={handleExamCreated} />

          <section className="exams-list">
            <h2>Created Exams</h2>
            {exams.length === 0 ? (
              <p className="empty-state">No exams created yet.</p>
            ) : (
              <div className="exams-grid">
                {exams.map(exam => (
                  <div key={exam._id} className="exam-card">
                    <h3>{exam.name}</h3>
                    <p>{exam.questions.length} Questions</p>
                    <div className="exam-card-actions" style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                      <button
                        className="btn btn-primary btn-small"
                        onClick={() => {
                          setSelectedExam(exam)
                          setView('admin-results')
                        }}
                        style={{ flex: 1 }}
                      >
                        View Results
                      </button>
                      <button
                        className="btn btn-danger btn-small"
                        onClick={async (e) => {
                          e.stopPropagation()
                          if (window.confirm(`Are you sure you want to delete "${exam.name}"? This will allow delete all results associated with it.`)) {
                            try {
                              const res = await fetch(`http://localhost:5000/api/exams/${exam._id}`, { method: 'DELETE' })
                              if (res.ok) {
                                setExams(exams.filter(e => e._id !== exam._id))
                                setSuccessMessage('Exam deleted successfully')
                                setShowSuccess(true)
                                setTimeout(() => setShowSuccess(false), 3000)
                              } else {
                                alert('Failed to delete exam')
                              }
                            } catch (err) {
                              console.error(err)
                              alert('Error deleting exam')
                            }
                          }
                        }}
                        style={{ backgroundColor: '#e74c3c', color: 'white', flex: 1 }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    )
  }

  // Admin Results View
  if (view === 'admin-results' && selectedExam) {
    return (
      <div className="app">
        <header className="app-header">
          <h1> Admin Dashboard</h1>
        </header>
        <ExamResults
          exam={selectedExam}
          onBack={() => setView('admin')}
          onViewLeaderboard={() => setView('leaderboard')}
        />
      </div>
    )
  }



  // Student Exam List
  if (view === 'student-exams') {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Student Portal</h1>
          <p>Browse and take exams</p>
        </header>

        <ExamList
          student={student}
          onStartExam={handleStartExam}
          onLogout={handleLogout}
        />
      </div>
    )
  }

  // Take Exam
  if (view === 'take-exam' && selectedExam) {
    return (
      <div className="app app-exam">
        <TakeExam
          exam={selectedExam}
          student={student}
          onComplete={handleExamComplete}
          onBack={() => setView('student-exams')}
        />
      </div>
    )
  }

  // Leaderboard View
  if (view === 'leaderboard' && selectedExam) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Leaderboard</h1>
        </header>
        <Leaderboard
          exam={selectedExam}
          onBack={() => {
            if (admin && view !== 'take-exam') setView('admin-results')
            else if (admin) setView('admin') // Fallback if came deeply nested
            else setView('student-exams') // Default for students
            // Be careful not to clear selectedExam if going back to results
            if (!admin) setSelectedExam(null)
          }}
        />
      </div>
    )
  }

  return null
}

export default App
