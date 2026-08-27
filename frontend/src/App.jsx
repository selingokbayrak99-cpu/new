import './App.css'

import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'

import Login from './Login'
import Signup from './Signup'
import Public from './Public'
import Private from './Private'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  // -------------------------
  // CHECK SESSION
  // -------------------------

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(
          'http://localhost:8080/auth/me',
          {
            method: 'GET',
            credentials: 'include',
          }
        )

        if (response.ok) {
          const currentUser = await response.json()
          setUser(currentUser)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Session check error:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  // -------------------------
  // LOGOUT
  // -------------------------

  const handleLogout = async () => {
    try {
      await fetch(
        'http://localhost:8080/auth/logout',
        {
          method: 'POST',
          credentials: 'include',
        }
      )
    } catch (error) {
      console.error('Logout error:', error)
    }

    setUser(null)
    navigate('/public')
  }

  // -------------------------
  // LOADING
  // -------------------------

  if (loading) {
    return <div>Loading...</div>
  }

  // -------------------------
  // ROUTES
  // -------------------------

  return (
    <Routes>

      {/* PUBLIC PAGE */}

      <Route
        path="/public"
        element={
          <Public
            user={user}
            onNavigate={navigate}
            onLogout={handleLogout}
          />
        }
      />

      {/* LOGIN PAGE */}

      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/private" replace />
          ) : (
            <Login
              onLoginSuccess={(loggedInUser) => {
                setUser(loggedInUser)
                navigate('/private')
              }}
            />
          )
        }
      />

      {/* SIGNUP PAGE */}

      <Route
        path="/signup"
        element={
          <Signup />
        }
      />

      {/* PRIVATE PAGE */}

      <Route
        path="/private"
        element={
          user ? (
            <Private
              user={user}
              onLogout={handleLogout}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* DEFAULT */}

      <Route
        path="/"
        element={
          <Navigate to="/public" replace />
        }
      />

      {/* UNKNOWN URL */}

      <Route
        path="*"
        element={
          <Navigate to="/public" replace />
        }
      />

    </Routes>
  )
}

export default App
