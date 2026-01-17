import { useState } from 'react'
import { signInWithGoogle } from '../firebase'

const StudentLogin = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    })
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')

        if (!formData.name.trim()) {
            setError('Please enter your name')
            return
        }
        if (!formData.email.trim()) {
            setError('Please enter your email')
            return
        }

        // Store in localStorage for session persistence
        localStorage.setItem('student', JSON.stringify(formData))
        onLogin(formData)
    }

    const handleGoogleLogin = async () => {
        setError('')
        try {
            const user = await signInWithGoogle()
            const userData = {
                name: user.name,
                email: user.email
            }
            onLogin(userData)
        } catch (err) {
            setError(err.message || 'Google Sign-In failed. Please check console.')
            console.error(err)
        }
    }

    return (
        <div className="student-login">
            <div className="login-card">
                <h2>Exam Portal Login</h2>
                <p className="login-subtitle">Login with Google or enter details</p>

                {error && (
                    <div className="error-message">
                        <span className="error-icon">⚠</span>
                        {error}
                    </div>
                )}

                <button
                    onClick={handleGoogleLogin}
                    className="btn btn-google btn-full"
                    style={{ marginBottom: '1.5rem', background: '#333', color: 'white', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
                    Sign in with Google
                </button>

                <div className="divider">
                    <span>OR</span>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className="input-field"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="input-field"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-full">
                        Continue as Guest
                    </button>
                </form>
            </div>
        </div>
    )
}

export default StudentLogin
