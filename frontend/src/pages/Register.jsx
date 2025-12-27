import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Register.css'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions'
    }
    
    return newErrors
  }

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }))
    
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }))
    }
  }

  const calculatePasswordStrength = (password) => {
    if (!password) return { score: 0, label: '' }
    
    let score = 0
    if (password.length >= 6) score += 1
    if (password.length >= 8) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1
    
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
    return { score, label: labels[score] }
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
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      })
      
      if (result.success) {
        navigate('/confessions')
      } else {
        setErrors({ general: result.error })
      }
    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const passwordStrength = calculatePasswordStrength(formData.password)

  return (
    <div className="register-page">
      <div className="register-container container">
        <div className="register-card card animate-slide-in">
          <div className="register-header">
            <h1>Join Our Community</h1>
            <p className="register-subtitle">Create your account to start sharing</p>
          </div>
          
          {errors.general && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span>{errors.general}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                className={`form-control ${errors.username ? 'error' : ''}`}
                disabled={isSubmitting}
              />
              {errors.username && (
                <span className="field-error">{errors.username}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`form-control ${errors.email ? 'error' : ''}`}
                disabled={isSubmitting}
              />
              {errors.email && (
                <span className="field-error">{errors.email}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className={`form-control ${errors.password ? 'error' : ''}`}
                disabled={isSubmitting}
              />
              {errors.password && (
                <span className="field-error">{errors.password}</span>
              )}
              
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-meter">
                    <div 
                      className={`strength-bar strength-${passwordStrength.score}`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                  <div className="strength-label">
                    <span>Strength: </span>
                    <span className={`strength-text strength-${passwordStrength.score}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                disabled={isSubmitting}
              />
              {errors.confirmPassword && (
                <span className="field-error">{errors.confirmPassword}</span>
              )}
            </div>
            
            <div className="form-group">
              <label className="terms-checkbox">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <span>
                  I agree to the{' '}
                  <Link to="/terms" className="terms-link">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="terms-link">Privacy Policy</Link>
                </span>
              </label>
              {errors.agreeToTerms && (
                <span className="field-error">{errors.agreeToTerms}</span>
              )}
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary register-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner"></span>
                  Creating Account...
                </>
              ) : 'Create Account'}
            </button>
          </form>
          
          <div className="register-divider">
            <span>or</span>
          </div>
          
          <div className="social-register">
            <button className="social-btn google-btn">
              <span className="social-icon">🔵</span>
              Sign up with Google
            </button>
            <button className="social-btn github-btn">
              <span className="social-icon">⚫</span>
              Sign up with GitHub
            </button>
          </div>
          
          <p className="register-footer">
            Already have an account?{' '}
            <Link to="/login" className="login-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register