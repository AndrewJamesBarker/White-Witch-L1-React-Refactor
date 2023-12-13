import { useState } from 'react'
import { useEffect } from 'react'
import './App.css'
// import ChapterOne from './components/ChapterOne'
import Game from './components/core/Game'
import StartPage from './components/pages/StartPage'
import NoPlayOverlay from './components/utilities/NoPlayOverlay'

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
