import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import PassageView from "./pages/PassageView"
import SkipperView from "./pages/SkipperView"
import StudyView from "./pages/StudyView"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/passage-view" element={<PassageView />} />
      <Route path="/skipper-view" element={<SkipperView />} />
      <Route path="/study-view" element={<StudyView />} />
    </Routes>
  )
}
