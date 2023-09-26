import { createRoot } from 'react-dom/client'
import './styles.css'
import { App } from './App'
import AA from "./1.jpg"
import AB from "./2.jpg"
import AC from "./3.jpg"
import AD from "./4.jpg"
import AE from "./5.jpg"
import AF from "./6.jpg"
import AG from "./7.jpg"
import AH from "./8.jpg"
import AI from "./9.jpg"


// const pexel = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
const images = [
  // Front
  { position: [0, 0, 1.5], rotation: [0, 0, 0], url: AA, text:"Art-1" , text1:"    By Almas"},
  // Back
  { position: [-0.8, 0, -0.6], rotation: [0, 0, 0], url: AH , text:"Art-2" , text1:"    By Almas"  },
  { position: [0.8, 0, -0.6], rotation: [0, 0, 0], url: AI , text:"Art-3" , text1:"    By Almas" },
  // Left
  { position: [-1.75, 0, 0.25], rotation: [0, Math.PI / 2.5, 0], url: AF , text:"Art-4" , text1:"    By Almas" },
  { position: [-2.15, 0, 1.5], rotation: [0, Math.PI / 2.5, 0], url: AE , text:"Art-5" , text1:"    By Almas" },
  { position: [-2, 0, 2.75], rotation: [0, Math.PI / 2.5, 0], url: AB , text:"Art-6" , text1:"    By Almas" },
  // Right
  { position: [1.75, 0, 0.25], rotation: [0, -Math.PI / 2.5, 0], url: AG , text:"Art-7" , text1:"    By Almas" },
  { position: [2.15, 0, 1.5], rotation: [0, -Math.PI / 2.5, 0], url: AD , text:"Art-8" , text1:"    By Almas" },
  { position: [2, 0, 2.75], rotation: [0, -Math.PI / 2.5, 0], url: AC , text:"Art-9" , text1:"    By Almas" }
]

createRoot(document.getElementById('root')).render(<App images={images} />)
