"use client"

import { useState } from "react"
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2,
  Send,
  Sparkles,
  Mic,
  BookOpen,
  Award,
  ChevronRight,
  MessageSquare,
  History
} from "lucide-react"

// Oral history archive data
const oralHistories = [
  {
    id: 1,
    title: "The Tramways of Old Kolkata",
    narrator: "Shubhashis Mukherjee",
    duration: "12:34",
    year: "1952",
    description: "Memories of riding the tram from Esplanade to Howrah Bridge",
  },
  {
    id: 2,
    title: "Durga Puja in North Kolkata",
    narrator: "Rina Banerjee",
    duration: "18:21",
    year: "1965",
    description: "Festival celebrations in the para neighborhoods",
  },
  {
    id: 3,
    title: "Coffee House Intellectuals",
    narrator: "Amitava Sen",
    duration: "15:47",
    year: "1970",
    description: "Literary discussions at the Indian Coffee House on College Street",
  },
  {
    id: 4,
    title: "The Victoria Memorial Gardens",
    narrator: "Kamala Roy",
    duration: "9:56",
    year: "1948",
    description: "A childhood spent playing in the gardens post-independence",
  },
]

// Quiz questions
const quizQuestions = [
  {
    question: "Which iconic bridge connects Kolkata to Howrah?",
    options: ["Vidyasagar Setu", "Howrah Bridge", "Second Hooghly Bridge", "Vivekananda Setu"],
    correct: 1,
  },
  {
    question: "What is the famous sweet dish from Kolkata?",
    options: ["Gulab Jamun", "Rasgulla", "Jalebi", "Ladoo"],
    correct: 1,
  },
  {
    question: "Which street is known as the 'Book Street' of Kolkata?",
    options: ["Park Street", "College Street", "Free School Street", "Chowringhee"],
    correct: 1,
  },
]

// AI Chat messages
const initialMessages = [
  { role: "assistant", content: "Namaskar! I am your AI guide to Kolkata's rich heritage. Ask me about the city's history, culture, festivals, architecture, or famous personalities. What would you like to explore today?" }
]

export default function EchoesOfKolkata() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState(oralHistories[0])
  const [progress, setProgress] = useState(35)
  const [chatMessages, setChatMessages] = useState(initialMessages)
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizComplete, setQuizComplete] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      showPopup("Now Playing", `"${selectedTrack.title}" narrated by ${selectedTrack.narrator}`)
    }
  }

  const handleTrackSelect = (track: typeof oralHistories[0]) => {
    setSelectedTrack(track)
    setIsPlaying(false)
    setProgress(0)
    showPopup("Track Selected", `Loading "${track.title}" from ${track.year}`)
  }

  const handleSendMessage = () => {
    if (!chatInput.trim()) return

    const userMessage = { role: "user", content: chatInput }
    setChatMessages(prev => [...prev, userMessage])
    setChatInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        `Fascinating question about "${chatInput}"! Kolkata's heritage is deeply intertwined with this topic. The city has been a cultural melting pot since the British colonial era, blending Bengali traditions with Western influences.`,
        `That's a wonderful area to explore! Did you know that Kolkata was once the capital of British India until 1911? The city's architecture, literature, and arts reflect this unique historical position.`,
        `Ah, you've touched upon something close to every Bengali's heart! Let me share some insights from our oral history archives that relate to your question about "${chatInput}".`,
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setChatMessages(prev => [...prev, { role: "assistant", content: randomResponse }])
      setIsTyping(false)
    }, 1500)
  }

  const handleStartQuiz = () => {
    setQuizStarted(true)
    setCurrentQuestion(0)
    setScore(0)
    setQuizComplete(false)
    setSelectedAnswer(null)
    showPopup("Quiz Started", "Test your knowledge of Kolkata's rich heritage!")
  }

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return
    
    setSelectedAnswer(index)
    const isCorrect = index === quizQuestions[currentQuestion].correct
    
    if (isCorrect) {
      setScore(prev => prev + 1)
      showPopup("Correct!", "Excellent knowledge of Kolkata's heritage!")
    } else {
      showPopup("Not Quite", `The correct answer was: ${quizQuestions[currentQuestion].options[quizQuestions[currentQuestion].correct]}`)
    }

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
        setSelectedAnswer(null)
      } else {
        setQuizComplete(true)
        showPopup("Quiz Complete!", `You scored ${score + (isCorrect ? 1 : 0)} out of ${quizQuestions.length}!`)
      }
    }, 1500)
  }

  const showPopup = (title: string, message: string) => {
    const popup = document.createElement("div")
    popup.className = "fixed top-4 right-4 bg-card border border-primary/30 rounded-lg p-4 shadow-2xl z-50 max-w-sm animate-in slide-in-from-right duration-300"
    popup.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <div>
          <h4 class="font-semibold text-foreground">${title}</h4>
          <p class="text-sm text-muted-foreground mt-1">${message}</p>
        </div>
      </div>
    `
    document.body.appendChild(popup)
    setTimeout(() => {
      popup.classList.add("animate-out", "slide-out-to-right")
      setTimeout(() => popup.remove(), 300)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <span className="font-heading text-lg font-semibold text-foreground">Echoes of Kolkata</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#archive" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Archive</a>
              <a href="#chat" className="text-sm text-muted-foreground hover:text-foreground transition-colors">AI Chat</a>
              <a href="#quiz" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Quiz</a>
            </div>
            <button 
              onClick={() => showPopup("Welcome!", "Explore Kolkata's heritage through AI")}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">AI-Powered Heritage Platform</span>
          </div>
          
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight text-balance mb-6">
            Echoes of Kolkata
          </h1>
          
          <p className="text-xl sm:text-2xl md:text-3xl text-primary font-heading italic mb-8">
            Where heritage speaks through AI
          </p>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
            Journey through the living memories of the City of Joy. Explore oral histories, 
            converse with AI about cultural heritage, and test your knowledge of Kolkata&apos;s 
            rich traditions.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => {
                document.getElementById('archive')?.scrollIntoView({ behavior: 'smooth' })
                showPopup("Exploring Archives", "Discover voices from Kolkata's past")
              }}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <History className="w-5 h-5" />
              Explore Archives
            </button>
            <button 
              onClick={() => {
                document.getElementById('chat')?.scrollIntoView({ behavior: 'smooth' })
                showPopup("Chat with Heritage", "Your AI guide to Kolkata awaits")
              }}
              className="flex items-center gap-2 px-6 py-3 bg-card border border-border text-foreground rounded-lg font-medium hover:bg-secondary transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              Chat with AI
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-border bg-card/30">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "500+", label: "Oral Histories" },
            { value: "100", label: "Years Covered" },
            { value: "50+", label: "Neighborhoods" },
            { value: "24/7", label: "AI Available" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary font-heading">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Oral History Archive Section */}
      <section id="archive" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Mic className="w-6 h-6 text-primary" />
            <span className="text-sm text-primary font-medium uppercase tracking-wider">Listen & Learn</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">Oral History Archive</h2>
          <p className="text-muted-foreground max-w-2xl mb-10">
            Immerse yourself in first-hand accounts from Kolkata&apos;s residents across generations. 
            Each recording captures authentic memories and cultural insights.
          </p>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Player */}
            <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center flex-shrink-0">
                  <Mic className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-xl font-semibold text-foreground truncate">{selectedTrack.title}</h3>
                  <p className="text-muted-foreground">{selectedTrack.narrator} • {selectedTrack.year}</p>
                  <p className="text-sm text-muted-foreground mt-2">{selectedTrack.description}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="h-2 bg-secondary rounded-full overflow-hidden cursor-pointer" onClick={() => setProgress(Math.random() * 100)}>
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>{Math.floor(progress / 100 * 12)}:{String(Math.floor((progress / 100 * 34))).padStart(2, '0')}</span>
                  <span>{selectedTrack.duration}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={() => showPopup("Rewind", "Jumping back 15 seconds")}
                  className="p-3 rounded-full hover:bg-secondary transition-colors"
                >
                  <SkipBack className="w-5 h-5 text-foreground" />
                </button>
                <button 
                  onClick={handlePlay}
                  className="p-4 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                <button 
                  onClick={() => showPopup("Forward", "Skipping ahead 15 seconds")}
                  className="p-3 rounded-full hover:bg-secondary transition-colors"
                >
                  <SkipForward className="w-5 h-5 text-foreground" />
                </button>
                <button 
                  onClick={() => showPopup("Volume", "Adjusting audio level")}
                  className="p-3 rounded-full hover:bg-secondary transition-colors ml-4"
                >
                  <Volume2 className="w-5 h-5 text-foreground" />
                </button>
              </div>
            </div>

            {/* Track List */}
            <div className="bg-card rounded-2xl border border-border p-4 max-h-96 overflow-y-auto">
              <h4 className="font-semibold text-foreground mb-4 px-2">Archive Collection</h4>
              <div className="space-y-2">
                {oralHistories.map((track) => (
                  <button
                    key={track.id}
                    onClick={() => handleTrackSelect(track)}
                    className={`w-full text-left p-3 rounded-xl transition-colors ${
                      selectedTrack.id === track.id 
                        ? 'bg-primary/10 border border-primary/30' 
                        : 'hover:bg-secondary'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        selectedTrack.id === track.id ? 'bg-primary/20' : 'bg-secondary'
                      }`}>
                        {selectedTrack.id === track.id && isPlaying ? (
                          <div className="flex gap-0.5">
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className="w-1 bg-primary rounded-full animate-pulse" style={{ height: `${12 + Math.random() * 8}px`, animationDelay: `${i * 0.15}s` }} />
                            ))}
                          </div>
                        ) : (
                          <Play className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{track.title}</p>
                        <p className="text-xs text-muted-foreground">{track.narrator} • {track.duration}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chat with Heritage Section */}
      <section id="chat" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30 border-y border-border">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <span className="text-sm text-primary font-medium uppercase tracking-wider">AI Companion</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">Chat with Heritage</h2>
          <p className="text-muted-foreground max-w-2xl mb-10">
            Engage in meaningful conversations with our AI heritage guide. Ask about Kolkata&apos;s 
            history, famous personalities, festivals, architecture, cuisine, and more.
          </p>

          {/* Chat Window */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 border-b border-border bg-secondary/30">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Kolkata Heritage AI</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Online • Trained on 500+ oral histories
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-br-md' 
                      : 'bg-secondary text-foreground rounded-bl-md'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-secondary text-foreground p-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about Kolkata's heritage..."
                  className="flex-1 px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {["Durga Puja", "Rabindranath Tagore", "Howrah Bridge", "Bengali Cuisine"].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => {
                      setChatInput(topic)
                      showPopup("Topic Selected", `Ask me about ${topic}!`)
                    }}
                    className="px-3 py-1.5 text-xs bg-secondary text-muted-foreground rounded-full hover:text-foreground hover:bg-secondary/80 transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cultural Challenge Quiz Section */}
      <section id="quiz" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-6 h-6 text-primary" />
            <span className="text-sm text-primary font-medium uppercase tracking-wider">Test Your Knowledge</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">Cultural Challenge</h2>
          <p className="text-muted-foreground max-w-2xl mb-10">
            Think you know Kolkata? Put your knowledge to the test with our AI-curated quiz 
            covering history, culture, landmarks, and traditions.
          </p>

          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {!quizStarted ? (
              /* Quiz Start Screen */
              <div className="p-8 text-center">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Award className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-3">Ready for the Challenge?</h3>
                <p className="text-muted-foreground mb-6">
                  Answer {quizQuestions.length} questions about Kolkata&apos;s heritage. Each correct answer earns you points!
                </p>
                <button
                  onClick={handleStartQuiz}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity mx-auto"
                >
                  Start Quiz
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            ) : quizComplete ? (
              /* Quiz Complete Screen */
              <div className="p-8 text-center">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Award className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-3">Quiz Complete!</h3>
                <p className="text-5xl font-bold text-primary mb-2">{score}/{quizQuestions.length}</p>
                <p className="text-muted-foreground mb-6">
                  {score === quizQuestions.length 
                    ? "Perfect score! You're a true Kolkata expert!" 
                    : score >= quizQuestions.length / 2 
                      ? "Great job! You know your Kolkata heritage well." 
                      : "Keep exploring! There's so much to learn about Kolkata."}
                </p>
                <button
                  onClick={handleStartQuiz}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity mx-auto"
                >
                  Try Again
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            ) : (
              /* Quiz Questions */
              <div className="p-6">
                {/* Progress */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {quizQuestions.length}</span>
                  <span className="text-sm font-medium text-primary">Score: {score}</span>
                </div>
                <div className="h-2 bg-secondary rounded-full mb-8">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                  />
                </div>

                {/* Question */}
                <h3 className="font-heading text-xl font-semibold text-foreground mb-6">
                  {quizQuestions[currentQuestion].question}
                </h3>

                {/* Options */}
                <div className="grid gap-3">
                  {quizQuestions[currentQuestion].options.map((option, index) => {
                    const isSelected = selectedAnswer === index
                    const isCorrect = index === quizQuestions[currentQuestion].correct
                    const showResult = selectedAnswer !== null
                    
                    let buttonClass = "w-full text-left p-4 rounded-xl border transition-all "
                    if (showResult) {
                      if (isCorrect) {
                        buttonClass += "border-green-500 bg-green-500/10 text-green-500"
                      } else if (isSelected && !isCorrect) {
                        buttonClass += "border-destructive bg-destructive/10 text-destructive"
                      } else {
                        buttonClass += "border-border bg-secondary/30 text-muted-foreground"
                      }
                    } else {
                      buttonClass += "border-border hover:border-primary hover:bg-primary/5 text-foreground"
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={selectedAnswer !== null}
                        className={buttonClass}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                            showResult && isCorrect ? 'bg-green-500/20' : showResult && isSelected ? 'bg-destructive/20' : 'bg-secondary'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span>{option}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <span className="font-heading text-lg font-semibold text-foreground">Echoes of Kolkata</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Preserving heritage through technology • Where heritage speaks through AI
            </p>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => showPopup("About", "An AI-powered cultural preservation initiative")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </button>
              <button 
                onClick={() => showPopup("Contact", "Reach out at heritage@kolkata.ai")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </button>
              <button 
                onClick={() => showPopup("Contribute", "Share your stories with us!")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contribute
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
