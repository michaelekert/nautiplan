import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import SkipperView from "./pages/SkipperView"
import StudyView from "./pages/StudyView"
import PassagePlan from "./components/PassagePlan/index"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/passage-view" element={<PassagePlan />} />
      <Route path="/skipper-view" element={<SkipperView />} />
      <Route path="/study-view" element={<StudyView />} />
    </Routes>
  )
}
