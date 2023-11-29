import { useState } from 'react'
import { useEffect } from 'react'
import './App.css'
// import ChapterOne from './components/ChapterOne'
import Game from './components/Game'
import StartPage from './components/StartPage'

function App() {
  const [startGame, setStartGame] = useState(false);

  return (
    <>
      <div className="App">
        {
          !startGame ? 
          <StartPage onStartGame={setStartGame} /> : 
          <Game />
        }
      </div>  

    </>
  )
}

export default App
