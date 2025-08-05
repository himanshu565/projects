import { useState, useEffect } from 'react'
import './App.css'
import { trpc } from './trpc/trpc.ts'

function App() {
  const [dir, setDir] = useState<string[]>([]);
  console.log(Array.isArray(dir));
  useEffect(() => {
    const getDir = async () => {
      const out = await trpc.lsroot.query();
      if (Array.isArray(out)) {
        setDir(out);
      } else {
        console.error('Not an array:', out);
      }
    };
    getDir();
  }, [])
  
  return (
    <>
      <div>
        <h1>Root Directory Contents</h1>
        <ul>
          {dir.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default App
