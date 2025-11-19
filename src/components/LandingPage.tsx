import { useNavigate } from 'react-router'
// import { ThemeToggle } from './theme-toggle'

function LandingPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[#050505] text-white font-[\'Inter\',sans-serif]">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-12">
        <header className="flex items-center justify-between text-xs uppercase tracking-[0.5em] text-white/40">
          <span>Gamyam</span>
          {/* <ThemeToggle /> */}
          <span>edition 09</span>
        </header>

        <main className="flex flex-1 flex-col items-start justify-center space-y-8">
          <p className="text-xs uppercase tracking-[0.5em] text-white/30">
            curated commerce
          </p>
          <h1 className="text-4xl font-[350] leading-tight text-white md:text-5xl">
            Slow luxury, delivered on your terms. Minimal drops, deliberate service,
            calm technology.
          </h1>
          <button
            className="rounded-full border border-white/20 px-8 py-3 text-sm uppercase tracking-[0.4em] text-white/80 transition hover:border-white/60 cursor-pointer"
            onClick={() => navigate('/products')}
          >
            View Products
          </button>
        </main>

        <footer className="text-xs uppercase tracking-[0.4em] text-white/30">
          © {new Date().getFullYear()} Noire Studio
        </footer>
      </div>
    </div>
  )
}

export default LandingPage