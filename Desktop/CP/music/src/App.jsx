import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Navbar from './Pages/Navbar';
import { MusicQuoteCarousel } from './Pages/MusicQuoteCarousel';
import   AboutUs  from './Pages/AboutUs';
import  Classes  from './Pages/Classes'
import MusicLabSection from './Pages/MusicLabSection';
import FeatureSection from './Pages/FeatureSection';
import Footer from './Pages/Footer';
import About from './Pages/About';

//import { Button } from './components/ui/button';

function App() {
  return (
    <Router>
      <div className="min-h-screen ">
        {/* Simple Navigation (customize as needed) */}
        {/* <nav className="bg-gray-800 p-4">
          <div className="container mx-auto flex justify-between">
            <span className="text-amber-400 text-xl font-bold">RYTHME</span>
            <div className="space-x-4">
              <Button variant="ghost" asChild>
                <a href="/" className="text-white">Home</a>
              </Button>
              <Button variant="ghost" asChild>
                <a href="/discover" className="text-white">Discover</a>
              </Button>
              <Button variant="ghost" asChild>
                <a href="/contact" className="text-white">Contact</a>
              </Button>
            </div>
          </div>
        </nav> */}
        <Navbar/>

        <Routes>
          <Route path="/" element={<><Home /></>} />
          <Route path='/music' element={<MusicQuoteCarousel/>}/>
          <Route path='/aboutus' element={<AboutUs/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/classes' element={<Classes/>}/>
          <Route path='/music-lab' element={<MusicLabSection/>}/>
          <Route path='/features' element={<FeatureSection/>}/>
       
    
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;