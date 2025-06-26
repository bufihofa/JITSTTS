import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
function App() {
  const [message, setMessage] = useState('')
  const pingServer = async () => {
    try {
      setMessage('Pinging server...')
      const response = await axios.get('http://localhost:1337/api/ping')
      console.log(response.data)
      setMessage(response.data.message)
    } catch (error) {
      console.error('Error pinging server:', error)
      setMessage('Error pinging server')
    }
  }
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => pingServer()}>
          Ping Server
        </button>
        <p>
          {message ? message : 'Click the button to ping the server'}
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
