import { Routes, Route } from "react-router-dom";
import CharacterList from "./pages/CharacterList";
import CharacterDetail from "./pages/CharacterDetail";

const App = () => (
  <div className="app">
    <Routes>
      <Route path="/" element={<CharacterList />} />
      <Route path="/character/:slug" element={<CharacterDetail />} />
    </Routes>
  </div>
);

export default App;
