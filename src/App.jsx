import {Routes, Route} from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import About from './pages/About';
import Help from './pages/Help';
import Cart from './pages/Cart';
import Restaurant from './pages/Restaurant';
import Header from './components/Header';
import Footer from './components/Footer';
import Cuisine from './pages/Cuisine';

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <Header onSearch={setSearchTerm} />
      <Routes>
        <Route path="/" element={<Home searchTerm={searchTerm} />} />
        <Route path="/help" element={<Help />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/restaurant/:id" element={<Restaurant />} />
        <Route path="/cuisine/:cuisineName" element={<Cuisine />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
