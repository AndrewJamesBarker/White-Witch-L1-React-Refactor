import { useState } from 'react'
import './App.css'
import ItemsAndLives from './components/Items&Lives'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <div className="App">
        White Witch
        <ItemsAndLives />
      </div>  
    </>
  )
}

export default App
