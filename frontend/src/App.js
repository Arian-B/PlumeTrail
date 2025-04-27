import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Import pages (to be created)
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Write from "./pages/Write";
import Edit from "./pages/Edit";
import Single from './pages/Single';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: 'white', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/write" element={<Write />} />
        <Route path="/edit/:id" element={<Edit />} />
            <Route path="/blog/:id" element={<Single />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
export default App;
