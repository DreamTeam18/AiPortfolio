import { FluidCanvas } from './components/fluid';
import { Header } from './sections/Header';
import { Hero } from './sections/Hero';
import { Watermark } from './sections/Watermark';

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* White background base */}
      <div className="fixed inset-0 bg-white z-0" />
      
      {/* Fluid Gradient Background */}
      <FluidCanvas />
      
      {/* Content Overlay */}
      <div className="relative z-10">
        <Header />
        <Hero />
        <Watermark />
      </div>
    </div>
  );
}

export default App;
