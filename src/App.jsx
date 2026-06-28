import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import './App.css';
import { SiteDirection, SiteName, TextAlignment } from './config/site.jsx';

function App() {
    //const [isRounded, setIsRounded] = useState(true);
    const [isOnlineOpen, setIsOnlineOpen] = useState(false);
    const [isNewsOpen, setIsNewsOpen] = useState(false);
    const [pageTitle, setPageTitle] = useState('טעות דפוס');
    const [headerScale, setHeaderScale] = useState(1); // Dynamic scale factor
    const [isHeaderAtTop, setIsHeaderAtTop] = useState(true);
    const closeNewsTimeoutRef = useRef(null);
    const lastScrollYRef = useRef(0);

    const isRounded = true;

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsHeaderAtTop(currentScrollY === 0);
            
            // Define scroll thresholds for dynamic header scaling
            if (currentScrollY <= 50) {
                setHeaderScale(1); // Full size
            } else //if (currentScrollY <= 100) 
            {
                var scale = 1 - (currentScrollY - 50) / 100 * 0.3;  // Scale down to 80% at 150px
                console.log(scale);
                scale = Math.max(scale, 0.5);
                setHeaderScale(scale);
            }
            
            /*
            if (currentScrollY <= 150) {
                setHeaderScale(0.8); // 80% size
            } else {
                setHeaderScale(0.6); // 60% size
            }
            */
            
            lastScrollYRef.current = currentScrollY;
        };
        

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        let animationFrameId;
        let resizeTimeoutId;

        const revealApp = () => {
            animationFrameId = window.requestAnimationFrame(() => {
                resizeTimeoutId = window.setTimeout(() => {
                    window.dispatchEvent(new Event('resize'));
                }, 900);
            });
        };

        if (document.readyState === 'complete') {
            revealApp();
        } else {
            window.addEventListener('load', revealApp, { once: true });
        }

        return () => {
            window.removeEventListener('load', revealApp);

            if (animationFrameId) {
                window.cancelAnimationFrame(animationFrameId);
            }

            if (resizeTimeoutId) {
                window.clearTimeout(resizeTimeoutId);
            }
        };
    }, []);

    const handleNewsMouseEnter = () => {
        //if (closeNewsTimeoutRef.current) {
        //    clearTimeout(closeNewsTimeoutRef.current);
        //    closeNewsTimeoutRef.current = null;
        //}
        setIsNewsOpen(true);
    };

    const handleNewsMouseLeave = () => {
        if (closeNewsTimeoutRef.current) {
            clearTimeout(closeNewsTimeoutRef.current);
        }

        closeNewsTimeoutRef.current = setTimeout(() => {
            setIsNewsOpen(false);
            closeNewsTimeoutRef.current = null;
        }, 1200);
    };

    const handleSubmenuClick = () => {
        console.log("sub clicked");
        if (closeNewsTimeoutRef.current) {
            clearTimeout(closeNewsTimeoutRef.current);
            closeNewsTimeoutRef.current = null;
        }

        setIsNewsOpen(false);
        setIsOnlineOpen(false);
    };

    const handleOnlineClick = (event) => {
        event.stopPropagation();
        setIsOnlineOpen((isOpen) => !isOpen);
    };

    const navTransformOrigin = SiteDirection === 'rtl' ? 'right top' : 'left top';
    const titleTransformOrigin = SiteDirection === 'rtl' ? 'left top' : 'right top';
    const navDirection = SiteDirection === 'rtl' ? 'row-reverse' : 'row';

    const appContent = (
        <div
            className={`page ${isRounded ? 'rounded' : ''}`}
            dir={SiteDirection}
            style={{
                '--site-direction': SiteDirection,
                '--text-alignment': TextAlignment,
                '--nav-direction': navDirection
            }}
        >
            <header className={`topbar ${isHeaderAtTop ? 'topbar--transparent' : ''}`}>
                <nav 
                    className="nav"
                    style={{
                        transform: `scale(${headerScale})`,
                        transformOrigin: navTransformOrigin,
                        transition: 'transform 0.3s ease-out'
                    }}
                >
                    <NavLink to="/" end>HOME</NavLink>
                    <div className={`nav-item ${isOnlineOpen ? 'open' : ''}`}>
                        <button
                            type="button"
                            className="nav-menu-button"
                            aria-expanded={isOnlineOpen}
                            onClick={handleOnlineClick}
                        >
                            ONLINE
                        </button>
                        <div className="submenu" onClick={handleSubmenuClick}>
                            <NavLink to="/gallery">GALLERY</NavLink>
                            <NavLink to="/magazine">MAGAZINE</NavLink>
                            <NavLink to="/posts">POSTS</NavLink>
                            <NavLink to="/staticgrid">STATIC GRID</NavLink>
                        </div>
                    </div>
                    <div className={`nav-item ${isNewsOpen ? 'open' : ''}`}
                        onMouseEnter={handleNewsMouseEnter}
                        onMouseLeave={handleNewsMouseLeave}>
                        <NavLink to="/news">NEWS</NavLink>
                        <div className="submenu" onClick={handleSubmenuClick}>
                            <NavLink to="/news/whatshot">WHAT'S HOT</NavLink>
                            <NavLink to="/editorials">EDITORIALS</NavLink>
                            <NavLink to="/news/fitness">FITNESS</NavLink>
                            <NavLink to="/news/art">ART</NavLink>
                            <NavLink to="/news/music">MUSIC</NavLink>
                        </div>
                    </div>
                    <NavLink to="/about">ABOUT</NavLink>
                    <NavLink to="/contact">CONTACT US</NavLink>
                    <NavLink to="/admin">ADMIN</NavLink>
                    <NavLink to="/login">LOGIN</NavLink>
                </nav>
                <h1 
                    className="topbar-title" 
                    style={{
                        transform: `scale(${headerScale})`,
                        transformOrigin: navTransformOrigin,
                        transition: 'transform 0.3s ease-out'
                    }}
                >
                    {pageTitle}
                </h1>
            </header>

            <main>
                <Outlet context={{ setPageTitle }} />
            </main>

            <footer className="footer">
                <span>{new Date().getFullYear()} {SiteName}</span>
            </footer>
        </div>
    );``

    return (appContent
        /*
        <PixelTransition
            firstContent={<div className="app-load-blank" />}
            secondContent={appContent}
            gridSize={14}
            pixelColor="#000000"
            animationStepDuration={0.8}
            isTriggered={isAppLoaded}
            once
            aspectRatio="0"
            className="app-load-transition"
        />
        */
    );
}

export default App;
