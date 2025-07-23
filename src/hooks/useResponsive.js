import { useState, useEffect } from 'react';

// Définition des breakpoints
export const BREAKPOINTS = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
};

export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [breakpoint, setBreakpoint] = useState({
    isMobile: false,     // < 576px
    isTablet: false,     // >= 576px && < 992px
    isDesktop: false,    // >= 992px
    isLargeScreen: false // >= 1200px
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setScreenSize({ width, height });
      setBreakpoint({
        isMobile: width < BREAKPOINTS.sm,
        isTablet: width >= BREAKPOINTS.sm && width < BREAKPOINTS.lg,
        isDesktop: width >= BREAKPOINTS.lg,
        isLargeScreen: width >= BREAKPOINTS.xl
      });
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    ...screenSize,
    ...breakpoint,
    breakpoints: BREAKPOINTS
  };
};

export default useResponsive; 