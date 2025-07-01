import { createRoot } from 'react-dom/client'
import './index.css'
import CMS from './CMS.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <Routes>
          <Route path="/*" element={<CMS />} />
      </Routes>
    </BrowserRouter>
)
