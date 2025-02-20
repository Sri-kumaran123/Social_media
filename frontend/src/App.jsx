import { Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Routes>
      <Route to={'/'} element={<h1>hello</h1>}/>
    </Routes>
     
    </>
  )
}

export default App
