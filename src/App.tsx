import { Routes, Route, useLocation } from "react-router-dom"
import Home from "./pages/Home"
import SkipperView from "./pages/SkipperView"
import StudyView from "./pages/StudyView"
import PassagePlan from "./components/PassagePlan/index"
import { Toaster } from "@/components/ui/sonner"

export default function App() {
  const location = useLocation();
  const isPassageView = location.pathname === "/passage-view";

  return (
    <>
      <Toaster position="top-center" />

      <div style={{ display: isPassageView ? 'block' : 'none' }}>
        <PassagePlan />
      </div>

      {!isPassageView && (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/skipper-view" element={<SkipperView />} />
          <Route path="/study-view" element={<StudyView />} />
        </Routes>
      )}
    </>
  )
}
