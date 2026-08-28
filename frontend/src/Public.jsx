import { useNavigate } from 'react-router-dom'

function Public({ user, onLogout }) {
  const navigate = useNavigate()

  return (
    <div className="public-page">

      {/* ================= NAVIGATION ================= */}

      <nav className="public-nav">

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


      {/* ================= PUBLIC CONTENT ================= */}

      <main className="public-container">

        <section className="public-card">

          <h1>Public Page</h1>

          <p>
            This page is available to everyone.
          </p>


          {/* ================= LOGGED IN USER ================= */}

          {user && (
            <div className="public-user-section">

              <p>
                You are logged in as{' '}
                <strong>{user.firstName}</strong>.
              </p>

              <button
                className="private-button"
                onClick={() => navigate('/private')}
              >
                Go to Private Page
              </button>

              <button
                className="logout-button"
                onClick={onLogout}
              >
                Logout
              </button>

            </div>
          )}

        </section>

      </main>

    </div>
  )
}

export default Public