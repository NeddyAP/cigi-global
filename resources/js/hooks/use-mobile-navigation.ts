import { useEffect, useState } from 'react';

export function useMobileNavigation() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            // Prevent body scroll when mobile menu is open
            document.body.style.overflow = 'hidden';
            // Add safe area handling for mobile devices
            document.body.classList.add('mobile-safe-area');
        } else {
            document.body.style.overflow = 'unset';
            document.body.classList.remove('mobile-safe-area');
        }

        return () => {
            document.body.style.overflow = 'unset';
            document.body.classList.remove('mobile-safe-area');
        };
    }, [isMobileMenuOpen]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    // Close mobile menu when switching to desktop
    useEffect(() => {
        if (!isMobile && isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
    }, [isMobile, isMobileMenuOpen]);

    return {
        isMobileMenuOpen,
        isMobile,
        toggleMobileMenu,
        closeMobileMenu,
    };
}
