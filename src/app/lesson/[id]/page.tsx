'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Exercise {
  id: string
  type: string
  content: any
  correct_answer: any
  xp_reward: number
  order_index: number
}

interface Lesson {
  id: string
  title: string
  content: any
  duration_minutes: number
  xp_reward: number
}

export default function LessonPage({ params }: { params: { id: string } }) {
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [totalXP, setTotalXP] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadLesson()
  }, [params.id])

  const loadLesson = async () => {
    try {
      // Load lesson
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', params.id)
        .single()

      if (lessonError) throw lessonError

      // Load exercises
      const { data: exercisesData, error: exercisesError } = await supabase
        .from('exercises')
        .select('*')
        .eq('lesson_id', params.id)
        .order('order_index')

      if (exercisesError) throw exercisesError

      setLesson(lessonData)
      setExercises(exercisesData || [])
      setLoading(false)
    } catch (error) {
      console.error('Error loading lesson:', error)
      alert('Erreur de chargement')
      router.push('/dashboard')
    }
  }

  const handleAnswerSelect = (index: number) => {
    if (showFeedback) return
    setSelectedAnswer(index)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return

    const currentExercise = exercises[currentStep - 1]
    const correct = selectedAnswer === currentExercise.correct_answer.correctIndex

    setIsCorrect(correct)
    setShowFeedback(true)

    if (correct) {
      setTotalXP(prev => prev + currentExercise.xp_reward)
      setCorrectCount(prev => prev + 1)
    }
  }

  const handleNext = () => {
    setShowFeedback(false)
    setSelectedAnswer(null)
    
    if (currentStep < exercises.length) {
      setCurrentStep(prev => prev + 1)
    } else {
      completeLesson()
    }
  }

  const completeLesson = async () => {
    setCompleting(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const score = Math.round((correctCount / exercises.length) * 100)
      const finalXP = totalXP + (lesson?.xp_reward || 0)

      // Save progress
      await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          lesson_id: params.id,
          status: 'completed',
          score: score,
          completed_at: new Date().toISOString()
        })

      // Update user XP
      const { data: profile } = await supabase
        .from('profiles')
        .select('xp, level')
        .eq('id', user.id)
        .single()

      const newXP = (profile?.xp || 0) + finalXP
      const newLevel = Math.floor(newXP / 500) + 1

      await supabase
        .from('profiles')
        .update({
          xp: newXP,
          level: newLevel,
          last_activity_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', user.id)

      // Success!
      setCurrentStep(prev => prev + 1)
    } catch (error) {
      console.error('Error completing lesson:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setCompleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Leçon introuvable</div>
      </div>
    )
  }

  const totalSteps = exercises.length + 1
  const progressPercent = (currentStep / totalSteps) * 100

  // Completion screen
  if (currentStep > exercises.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/20 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-white mb-4">Leçon terminée !</h1>
          
          <div className="space-y-4 mb-8">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-gray-300 text-sm mb-1">Score</div>
              <div className="text-3xl font-bold text-white">
                {Math.round((correctCount / exercises.length) * 100)}%
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-gray-300 text-sm mb-1">XP gagnés</div>
              <div className="text-3xl font-bold text-yellow-400">
                +{totalXP + (lesson.xp_reward || 0)} XP
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-gray-300 text-sm mb-1">Réponses correctes</div>
              <div className="text-3xl font-bold text-green-400">
                {correctCount}/{exercises.length}
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg font-semibold transition-all"
          >
            Retour au Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Content screen (before exercises)
  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Retour
            </button>
            <div className="text-sm text-gray-400">
              ⏱️ {lesson.duration_minutes} min · ⚡ {lesson.xp_reward} XP
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-gray-800 px-4 py-2">
          <div className="container mx-auto">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-indigo-500 rounded-full h-2 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-sm text-gray-400">
                {currentStep}/{totalSteps}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <h1 className="text-3xl font-bold text-white mb-8">{lesson.title}</h1>

          {/* Intro */}
          {lesson.content.intro && (
            <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-6 mb-6">
              <p className="text-lg text-gray-300">{lesson.content.intro.content}</p>
            </div>
          )}

          {/* Sections */}
          {lesson.content.sections?.map((section: any, index: number) => (
            <div key={index} className="bg-white/5 backdrop-blur-lg rounded-xl p-6 mb-6 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-3">{section.title}</h2>
              <div className="text-gray-300 whitespace-pre-line">{section.content}</div>
            </div>
          ))}

          <button
            onClick={() => setCurrentStep(1)}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-4 rounded-lg text-lg font-semibold transition-all"
          >
            Commencer les exercices →
          </button>
        </div>
      </div>
    )
  }

  // Exercise screen
  const currentExercise = exercises[currentStep - 1]

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Retour
          </button>
          <div className="text-sm text-gray-400">
            Question {currentStep}/{exercises.length}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-gray-800 px-4 py-2">
        <div className="container mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-700 rounded-full h-2">
              <div
                className="bg-indigo-500 rounded-full h-2 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-sm text-gray-400">
              {currentStep}/{totalSteps}
            </span>
          </div>
        </div>
      </div>

      {/* Exercise content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10">
          {/* Question */}
          <h2 className="text-2xl font-bold text-white mb-8">
            {currentExercise.content.question}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentExercise.content.options.map((option: string, index: number) => {
              const isSelected = selectedAnswer === index
              const isCorrectAnswer = index === currentExercise.correct_answer.correctIndex
              
              let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all "
              
              if (showFeedback) {
                if (isCorrectAnswer) {
                  buttonClass += "border-green-500 bg-green-500/20 text-white"
                } else if (isSelected && !isCorrect) {
                  buttonClass += "border-red-500 bg-red-500/20 text-white"
                } else {
                  buttonClass += "border-gray-600 bg-gray-800 text-gray-400"
                }
              } else if (isSelected) {
                buttonClass += "border-indigo-500 bg-indigo-500/20 text-white"
              } else {
                buttonClass += "border-gray-600 bg-gray-800 text-white hover:border-gray-500"
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showFeedback}
                  className={buttonClass}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0">
                      {showFeedback && isCorrectAnswer && "✓"}
                      {showFeedback && isSelected && !isCorrect && "✗"}
                      {!showFeedback && isSelected && "•"}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className={`p-4 rounded-lg mb-6 ${isCorrect ? 'bg-green-500/20 border border-green-500' : 'bg-red-500/20 border border-red-500'}`}>
              <div className="flex items-start gap-3">
                <div className="text-2xl">{isCorrect ? '✓' : '✗'}</div>
                <div>
                  <div className="font-semibold text-white mb-2">
                    {isCorrect ? 'Correct !' : 'Pas tout à fait...'}
                  </div>
                  <p className="text-sm text-gray-300">
                    {currentExercise.content.explanation}
                  </p>
                  {isCorrect && (
                    <div className="mt-2 text-yellow-400 font-semibold">
                      +{currentExercise.xp_reward} XP
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action button */}
          {!showFeedback ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-all"
            >
              Valider
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg font-semibold transition-all"
            >
              {currentStep === exercises.length ? 'Terminer la leçon' : 'Question suivante →'}
            </button>
          )}
        </div>

        {/* XP Counter */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full px-4 py-2">
            <span className="text-yellow-400">⚡</span>
            <span className="text-white font-semibold">{totalXP} XP</span>
          </div>
        </div>
      </div>
    </div>
  )
}
