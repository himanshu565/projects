import { createRoot } from 'react-dom/client'

import "../frontend/components/lib/index.css"
import "prosemirror-view/style/prosemirror.css"
import App from './App.js'

createRoot(document.getElementById('root')!).render(
    <App />
)
