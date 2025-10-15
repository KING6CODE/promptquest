'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }
    
    setUser(user)
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Navbar */}
      <nav className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">PromptQuest</h1>
          <button
            onClick={handleLogout}
            className="text-gray-300 hover:text-white transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Salut {user?.user_metadata?.username || 'champion'} ! 👋
          </h2>
          <p className="text-gray-400">Prêt à apprendre aujourd'hui ?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Streak */}
          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-lg rounded-xl p-6 border border-orange-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-4xl">🔥</div>
              <div>
                <div className="text-3xl font-bold text-white">0</div>
                <div className="text-sm text-gray-300">jours de streak</div>
              </div>
            </div>
            <p className="text-xs text-gray-400">Continue ta série !</p>
          </div>

          {/* XP */}
          <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-4xl">⚡</div>
              <div>
                <div className="text-3xl font-bold text-white">0</div>
                <div className="text-sm text-gray-300">XP total</div>
              </div>
            </div>
            <p className="text-xs text-gray-400">Niveau 1 - Novice</p>
          </div>

          {/* Leçons */}
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-xl p-6 border border-green-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-4xl">📚</div>
              <div>
                <div className="text-3xl font-bold text-white">0/20</div>
                <div className="text-sm text-gray-300">leçons complétées</div>
              </div>
            </div>
            <p className="text-xs text-gray-400">Commence ton parcours !</p>
          </div>
        </div>

        {/* Continue Learning */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">Continue ton apprentissage</h3>
          
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-indigo-200 mb-1">Fondamentaux IA</div>
                <h4 className="text-xl font-bold text-white mb-2">
                  Leçon 1 : C'est quoi l'IA vraiment ?
                </h4>
                <p className="text-indigo-100 text-sm mb-4">
                  Découvre les bases de l'intelligence artificielle
                </p>
                <div className="flex items-center gap-4 text-sm text-indigo-100">
                  <span>⏱️ 10 min</span>
                  <span>⚡ +50 XP</span>
                </div>
              </div>
              <button
                onClick={async () => {
                  // Get first lesson ID
                  const { data } = await supabase
                    .from('lessons')
                    .select('id')
                    .order('order_index')
                    .limit(1)
                    .single()
                  
                  if (data) {
                    router.push(`/lesson/${data.id}`)
                  }
                }}
                className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-all"
              >
                Commencer →
              </button>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-indigo-100 mb-2">
                <span>Progression du parcours</span>
                <span>0%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2 w-0"></div>
              </div>
            </div>
          </div>
        </div>

        {/* All Courses */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">Parcours disponibles</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Course 1 - Free */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-indigo-500/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-green-500/20 text-green-400 text-xs font-semibold px-3 py-1 rounded-full">
                  GRATUIT
                </div>
                <div className="text-gray-400">🎓</div>
              </div>
              
              <h4 className="text-xl font-bold text-white mb-2">
                Fondamentaux IA
              </h4>
              <p className="text-gray-400 text-sm mb-4">
                Maîtrise les bases de l'intelligence artificielle et du prompt engineering
              </p>
              
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <span>📚 20 leçons</span>
                <span>⏱️ ~3h</span>
                <span>⚡ 1000 XP</span>
              </div>
              
              <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg font-semibold transition-all">
                Commencer
              </button>
            </div>

            {/* Course 2 - Premium */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/30 hover:border-yellow-500/50 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-xs font-semibold px-4 py-1 rounded-bl-xl">
                PREMIUM
              </div>
              
              <div className="mt-6 mb-4">
                <div className="text-gray-400">🚀</div>
              </div>
              
              <h4 className="text-xl font-bold text-white mb-2">
                Prompt Engineering Avancé
              </h4>
              <p className="text-gray-400 text-sm mb-4">
                Techniques pro pour créer des prompts ultra-efficaces
              </p>
              
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <span>📚 15 leçons</span>
                <span>⏱️ ~2h</span>
                <span>⚡ 800 XP</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center text-white">
                  🔒
                </div>
                <div className="text-sm text-gray-400">
                  Passe à Premium pour débloquer
                </div>
              </div>
            </div>

            {/* Course 3 - Premium */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/30 hover:border-yellow-500/50 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-xs font-semibold px-4 py-1 rounded-bl-xl">
                PREMIUM
              </div>
              
              <div className="mt-6 mb-4">
                <div className="text-gray-400">🎨</div>
              </div>
              
              <h4 className="text-xl font-bold text-white mb-2">
                Créer avec IA Générative
              </h4>
              <p className="text-gray-400 text-sm mb-4">
                Midjourney, DALL-E, Runway : maîtrise la création visuelle
              </p>
              
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <span>📚 12 leçons</span>
                <span>⏱️ ~2h</span>
                <span>⚡ 700 XP</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center text-white">
                  🔒
                </div>
                <div className="text-sm text-gray-400">
                  Passe à Premium pour débloquer
                </div>
              </div>
            </div>

            {/* Course 4 - Premium */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/30 hover:border-yellow-500/50 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-xs font-semibold px-4 py-1 rounded-bl-xl">
                PREMIUM
              </div>
              
              <div className="mt-6 mb-4">
                <div className="text-gray-400">⚙️</div>
              </div>
              
              <h4 className="text-xl font-bold text-white mb-2">
                Automatisation No-Code
              </h4>
              <p className="text-gray-400 text-sm mb-4">
                Crée des workflows automatisés avec Make, Zapier et IA
              </p>
              
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <span>📚 10 leçons</span>
                <span>⏱️ ~1.5h</span>
                <span>⚡ 600 XP</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center text-white">
                  🔒
                </div>
                <div className="text-sm text-gray-400">
                  Passe à Premium pour débloquer
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
