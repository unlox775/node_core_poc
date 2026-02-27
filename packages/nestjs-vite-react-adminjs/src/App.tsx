import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NewDeal from "./pages/NewDeal";
import ThankYou from "./pages/ThankYou";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/deals/new" element={<NewDeal />} />
      <Route path="/thank-you" element={<ThankYou />} />
    </Routes>
  );
}
