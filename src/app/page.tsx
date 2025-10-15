export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          {/* Logo/Title */}
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
            PromptQuest
          </h1>
          
          {/* Tagline */}
          <p className="text-2xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 font-bold mb-8">
            Maîtrise l'IA en 10 min/jour
          </p>
          
          {/* Description */}
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
            Apprends ChatGPT, le prompt engineering et l'IA générative avec des défis gamifiés. 
            Par un lycéen, pour les étudiants.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/signup"
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:scale-105 hover:shadow-xl inline-block"
            >
              Commencer gratuitement
            </a>
            <a
              href="/login"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-all inline-block"
            >
              Se connecter
            </a>
          </div>
          
          {/* Trust badges */}
          <p className="mt-8 text-sm text-gray-400">
            ✓ Gratuit · ✓ Sans CB · ✓ 5 min pour commencer
          </p>
        </div>
        
        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-32 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center border border-white/20">
            <div className="text-5xl font-bold text-white mb-2">🔥</div>
            <div className="text-4xl font-bold text-white mb-2">2,547</div>
            <p className="text-gray-300">Étudiants actifs</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center border border-white/20">
            <div className="text-5xl font-bold text-white mb-2">⚡</div>
            <div className="text-4xl font-bold text-white mb-2">89%</div>
            <p className="text-gray-300">Taux de complétion</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center border border-white/20">
            <div className="text-5xl font-bold text-white mb-2">⭐</div>
            <div className="text-4xl font-bold text-white mb-2">4.8/5</div>
            <p className="text-gray-300">Note moyenne</p>
          </div>
        </div>
        
        {/* Features Preview */}
        <div className="mt-32">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Pourquoi PromptQuest ?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 hover:border-indigo-500/50 transition-all">
              <div className="text-5xl mb-4">🎮</div>
              <h3 className="text-2xl font-bold text-white mb-3">Gamifié & Addictif</h3>
              <p className="text-gray-300">
                Streaks, badges, XP... Apprendre l'IA n'a jamais été aussi fun.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 hover:border-indigo-500/50 transition-all">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-white mb-3">10 min/jour suffisent</h3>
              <p className="text-gray-300">
                Des leçons courtes et efficaces qui s'adaptent à ton emploi du temps.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 hover:border-indigo-500/50 transition-all">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold text-white mb-3">Pratique réelle</h3>
              <p className="text-gray-300">
                Pas de théorie inutile. Tu codes, tu crées, tu expérimentes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}