import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NewDeal from "./pages/NewDeal";
import ThankYou from "./pages/ThankYou";
import AdminLogin from "./pages/AdminLogin";
import AdminDeals from "./pages/AdminDeals";
import AdminEditDeal from "./pages/AdminEditDeal";
import AdminContacts from "./pages/AdminContacts";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/deals/new" element={<NewDeal />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/deals" element={<AdminDeals />} />
      <Route path="/admin/deals/:id" element={<AdminEditDeal />} />
      <Route path="/admin/contacts" element={<AdminContacts />} />
    </Routes>
  );
}
