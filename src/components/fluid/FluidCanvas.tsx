import { useEffect, useRef, useCallback } from 'react';
import { FluidSimulation } from './fluid-simulation';

interface FluidCanvasProps {
  className?: string;
}

interface Pointer {
  id: number;
  texcoordX: number;
  texcoordY: number;
  prevTexcoordX: number;
  prevTexcoordY: number;
  deltaX: number;
  deltaY: number;
  down: boolean;
  moved: boolean;
}

function createPointer(): Pointer {
  return {
    id: -1,
    texcoordX: 0,
    texcoordY: 0,
    prevTexcoordX: 0,
    prevTexcoordY: 0,
    deltaX: 0,
    deltaY: 0,
    down: false,
    moved: false,
  };
}


export function FluidCanvas({ className }: FluidCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simulationRef = useRef<FluidSimulation | null>(null);
  const animationRef = useRef<number>(0);
  const pointerRef = useRef<Pointer>(createPointer());

  const scaleByPixelRatio = useCallback((input: number) => {
    const pixelRatio = window.devicePixelRatio || 1;
    return Math.floor(input * pixelRatio);
  }, []);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = scaleByPixelRatio(canvas.clientWidth);
    const height = scaleByPixelRatio(canvas.clientHeight);

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      if (simulationRef.current) {
        simulationRef.current.resize();
      }
    }
  }, [scaleByPixelRatio]);

  const updatePointerMoveData = useCallback((posX: number, posY: number) => {
    const pointer = pointerRef.current;
    pointer.prevTexcoordX = pointer.texcoordX;
    pointer.prevTexcoordY = pointer.texcoordY;
    pointer.texcoordX = posX / window.innerWidth;
    pointer.texcoordY = 1.0 - posY / window.innerHeight;
    pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
    pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
    pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set initial size
    canvas.width = scaleByPixelRatio(canvas.clientWidth);
    canvas.height = scaleByPixelRatio(canvas.clientHeight);

    // Initialize simulation
    try {
      simulationRef.current = new FluidSimulation(canvas, {
        simResolution: 128,
        dyeResolution: 1440,  // Higher resolution for better detail
        densityDissipation: 0.5,  // Matching reference - colors persist longer
        velocityDissipation: 3,  // Matching reference for proper damping
        pressureDissipation: 0.05,
        pressureIterations: 20,
        curl: 5,
        splatRadius: 0.1,  // Very small splat radius for tight, subtle ripples
        splatForce: 6000,  // Matching reference (6e3)
      });
    } catch (error) {
      console.error('Failed to initialize fluid simulation:', error);
      return;
    }

    // Small initial splat to prime the simulation
    setTimeout(() => {
      if (simulationRef.current) {
        simulationRef.current.multipleSplats(2);
      }
    }, 100);

    // Animation loop
    const animate = () => {
      if (!simulationRef.current) return;

      const pointer = pointerRef.current;
      if (pointer.moved) {
        pointer.moved = false;
        // Log to verify mouse tracking is working
        console.log('Mouse moved:', {
          x: pointer.texcoordX.toFixed(3),
          y: pointer.texcoordY.toFixed(3),
          deltaX: pointer.deltaX.toFixed(5),
          deltaY: pointer.deltaY.toFixed(5)
        });
        simulationRef.current.splatPointer(
          pointer.texcoordX,
          pointer.texcoordY,
          pointer.deltaX,
          pointer.deltaY
        );
      }

      simulationRef.current.step();
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Mouse events - listen on WINDOW to capture all movements
    const onMouseMove = (e: MouseEvent) => {
      console.log('onMouseMove fired!', e.clientX, e.clientY);
      updatePointerMoveData(e.clientX, e.clientY);
    };

    const onMouseDown = (e: MouseEvent) => {
      const pointer = pointerRef.current;
      pointer.down = true;
      pointer.texcoordX = e.clientX / window.innerWidth;
      pointer.texcoordY = 1.0 - e.clientY / window.innerHeight;
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
    };

    const onMouseUp = () => {
      pointerRef.current.down = false;
    };

    // Touch events
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const pointer = pointerRef.current;
      pointer.id = touch.identifier;
      pointer.down = true;
      pointer.texcoordX = touch.clientX / window.innerWidth;
      pointer.texcoordY = 1.0 - touch.clientY / window.innerHeight;
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      updatePointerMoveData(touch.clientX, touch.clientY);
    };

    const onTouchEnd = () => {
      pointerRef.current.down = false;
    };

    // Add event listeners - attach to WINDOW to capture all mouse movements
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [handleResize, scaleByPixelRatio, updatePointerMoveData]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // Don't capture events - let content be clickable
        zIndex: 0,
      }}
    />
  );
}

function correctDeltaX(delta: number): number {
  const aspectRatio = window.innerWidth / window.innerHeight;
  if (aspectRatio < 1) delta *= aspectRatio;
  return delta;
}

function correctDeltaY(delta: number): number {
  const aspectRatio = window.innerWidth / window.innerHeight;
  if (aspectRatio > 1) delta /= aspectRatio;
  return delta;
}
