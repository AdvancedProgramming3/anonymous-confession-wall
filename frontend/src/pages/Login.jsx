import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    return newErrors
  }

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const result = await login(formData)
      
      if (result.success) {
        navigate('/confessions')
      } else {
        setErrors({ general: result.error })
      }
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container container">
        <div className="login-card card animate-slide-in">
          <div className="login-header">
            <h1>Welcome Back</h1>
            <p className="login-subtitle">Sign in to your account</p>
          </div>
          
          {errors.general && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span>{errors.general}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className={`form-control ${errors.username ? 'error' : ''}`}
                disabled={isSubmitting}
              />
              {errors.username && (
                <span className="field-error">{errors.username}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`form-control ${errors.password ? 'error' : ''}`}
                disabled={isSubmitting}
              />
              {errors.password && (
                <span className="field-error">{errors.password}</span>
              )}
            </div>
            
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary login-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner"></span>
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>
          
          <div className="login-divider">
            <span>or</span>
          </div>
          
          <div className="social-login">
            <button className="social-btn google-btn">
              <span className="social-icon">🔵</span>
              Continue with Google
            </button>
            <button className="social-btn github-btn">
              <span className="social-icon">⚫</span>
              Continue with GitHub
            </button>
          </div>
          
          <p className="login-footer">
            Don't have an account?{' '}
            <Link to="/register" className="signup-link">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login