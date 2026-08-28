import { useNavigate } from 'react-router-dom'

function Private({ user, onLogout }) {
  const navigate = useNavigate()

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="private-page">

      {/* ================= NAVIGATION ================= */}

      <nav className="private-nav">

        <button
          onClick={() => navigate('/public')}
        >
          Public
        </button>

        <button
          onClick={() => navigate('/login')}
        >
          Login
        </button>

        <button
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </button>

      </nav>


      {/* ================= PRIVATE CONTENT ================= */}

      <main className="private-container">

        <section className="private-card">

          <h1>Private Page 🔒</h1>

          <p className="welcome-message">
            Welcome, {user.firstName}!
          </p>

          <p>
            This page is only available after login.
          </p>


          {/* ================= BUTTONS ================= */}

          <div className="private-actions">

            <button
              className="public-button"
              onClick={() => navigate('/public')}
            >
              Public Page
            </button>

            <button
              className="logout-button"
              onClick={onLogout}
            >
              Logout
            </button>

          </div>

        </section>

      </main>

    </div>
  )
}

export default Private