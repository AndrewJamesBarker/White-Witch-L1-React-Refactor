import { useState } from 'react'
import { useEffect } from 'react'
import './App.css'
// import ChapterOne from './components/ChapterOne'
import Game from './components/Game'
import StartPage from './components/StartPage'
import NoPlayOverlay from './components/NoPlayOverlay'

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
          startGame ? <Game /> : <NoPlayOverlay />
          )
        }
      </div>  

    </>
  )
}

export default App
