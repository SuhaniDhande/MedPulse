import './App.css'

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">❤️</div>
          <span>MedPulse</span>
        </div>

        <nav className="topnav">
          <a href="#about">About</a>
          <a href="#help">Help</a>
          <button className="sign-in">Sign in</button>
        </nav>
      </header>

      <main className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Hospital intelligence, unified</span>
          <h1>
            Welcome to <span>MedPulse</span>
          </h1>
          <p>
            One system for every person inside the hospital — patients, doctors, and staff.
          </p>
        </div>

        <section className="role-grid" aria-label="Choose your role">
          <p className="section-label">Choose your role</p>
          <div className="cards">
            <article className="role-card">
              <div className="role-icon">🩺</div>
              <h2>Doctor</h2>
              <p>Patient records, queue, and prescriptions</p>
              <a href="#doctor" className="card-link">
                →
              </a>
            </article>

            <article className="role-card">
              <div className="role-icon">👤</div>
              <h2>Patient</h2>
              <p>Appointments, results, and billing</p>
              <a href="#patient" className="card-link">
                →
              </a>
            </article>

            <article className="role-card">
              <div className="role-icon dark">🏥</div>
              <h2>Administrative staff</h2>
              <p>Beds, billing, and operations</p>
              <a href="#admin" className="card-link">
                →
              </a>
            </article>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        MedPulse · Designed for Indian hospitals · 2026
      </footer>
    </div>
  )
}

export default App
