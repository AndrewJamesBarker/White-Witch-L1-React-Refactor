// import { useState } from 'react'
import './App.css'
import ItemsAndLives from './components/Items&Lives'
import ChapterBox from './components/ChapterBox'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <div className="App">
        <ChapterBox />
        <ItemsAndLives />
      </div>  
    </>
  )
}

export default App
