import { useState } from 'react'
import { useEffect } from 'react'
import './App.css'
import Game from './components/core/Game'
import StartPage from './components/pages/StartPage'
import NoPlayPage from './components/utilities/NoPlayPage'

function App() {
  const [startGame, setStartGame] = useState(null);
  const handleStartGame = (start) => {
    setStartGame(start);
  }
  return (
    <>
      <div className="App">
        {
          startGame === null ? <StartPage onStartGame={handleStartGame} /> : (
          startGame ? <Game /> : <NoPlayPage />
          )
        }
      </div>  

    </>
  )
}

export default App
