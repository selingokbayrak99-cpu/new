
import { useState } from 'react'
import './Login.css'

import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

function Login({ onLoginSuccess }) {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const loginMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await fetch(
        'http://localhost:8080/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Login failed')
      }

      return response.json()
    },

    onSuccess: (user) => {
      onLoginSuccess(user)
      navigate('/private')
    },
  })

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },

    onSubmit: async ({ value }) => {
      loginMutation.mutate(value)
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    form.handleSubmit()
  }

  return (
    <div>
      <nav className="public-nav">
        <button onClick={() => navigate('/public')}>
          Public
        </button>

        <button onClick={() => navigate('/login')}>
          Login
        </button>

        <button onClick={() => navigate('/signup')}>
          Sign Up
        </button>
      </nav>

      <main className="login-container">
        <section className="login-card">

          <div className="login-header">
            <h1>Welcome Back 👋</h1>
            <p>Login to continue to your account</p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-field">
              <label htmlFor="email">
                Email
              </label>

              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) {
                      return 'Email is required'
                    }

                    if (
                      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    ) {
                      return 'Please enter a valid email'
                    }

                    return undefined
                  },
                }}
              >
                {(field) => (
                  <div>
                    <input
                      id={field.name}
                      name={field.name}
                      type="email"
                      placeholder="Enter your email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(e.target.value)
                      }
                    />

                    {field.state.meta.errors.length > 0 && (
                      <div className="field-error">
                        {field.state.meta.errors.join(', ')}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            <div className="form-field">
              <label htmlFor="password">
                Password
              </label>

              <form.Field
                name="password"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) {
                      return 'Password is required'
                    }

                    if (value.length < 6) {
                      return 'Password must be at least 6 characters'
                    }

                    return undefined
                  },
                }}
              >
                {(field) => (
                  <div>
                    <div className="password-wrapper">
                      <input
                        id={field.name}
                        name={field.name}
                        type={
                          showPassword
                            ? 'text'
                            : 'password'
                        }
                        placeholder="Enter your password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(e.target.value)
                        }
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>

                    {field.state.meta.errors.length > 0 && (
                      <div className="field-error">
                        {field.state.meta.errors.join(', ')}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>

              <div className="forgot-password">
                <button
                  type="button"
                  onClick={() => {}}
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <button
              className="login-button"
              type="submit"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending
                ? 'Logging in...'
                : 'Login'}
            </button>

          </form>

          {loginMutation.isError && (
            <div className="error-message">
              {loginMutation.error.message}
            </div>
          )}

          <div className="signup-section">
            <div>
              Don't have an account?
            </div>

            <button
              type="button"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </div>

        </section>
      </main>
    </div>
  )
}

export default Login

