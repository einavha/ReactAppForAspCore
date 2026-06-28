import { useEffect, useRef, useState } from 'react';

const DEFAULT_MAX_LOAD_TIME = 6000;
const DEFAULT_IDLE_DELAY = 500;

function getPageLoadTime() {
    const navigationEntry = performance.getEntriesByType?.('navigation')?.[0];

    if (!navigationEntry?.loadEventEnd) {
        return null;
    }

    return navigationEntry.loadEventEnd - navigationEntry.startTime;
}

function shouldSkipVanta(maxLoadTime) {
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const loadTime = getPageLoadTime();

    return Boolean(
        reducedMotion ||
        connection?.saveData ||
        connection?.effectiveType === 'slow-2g' ||
        connection?.effectiveType === '2g' ||
        (loadTime !== null && loadTime > maxLoadTime)
    );
}

export function useVantaClouds(options = {}, settings = {}) {
    const containerRef = useRef(null);
    const effectRef = useRef(null);
    const [isVantaDisabled, setIsVantaDisabled] = useState(false);

    useEffect(() => {
        let isCancelled = false;
        let idleId = null;
        let timeoutId = null;

        async function startVanta() {
            if (isCancelled || effectRef.current || !containerRef.current) {
                return;
            }

            const maxLoadTime = settings.maxLoadTime ?? DEFAULT_MAX_LOAD_TIME;

            if (shouldSkipVanta(maxLoadTime)) {
                setIsVantaDisabled(true);
                return;
            }

            setIsVantaDisabled(false);

            const [THREE] = await Promise.all([
                import('three'),
                import('vanta/dist/vanta.clouds.min')
            ]);

            if (isCancelled || effectRef.current || !containerRef.current || shouldSkipVanta(maxLoadTime)) {
                setIsVantaDisabled(true);
                return;
            }

            window.THREE = THREE;
            effectRef.current = window.VANTA.CLOUDS({
                el: containerRef.current,
                THREE,
                ...options
            });
        }

        function scheduleVanta() {
            const idleDelay = settings.idleDelay ?? DEFAULT_IDLE_DELAY;

            timeoutId = window.setTimeout(() => {
                if ('requestIdleCallback' in window) {
                    idleId = window.requestIdleCallback(startVanta, { timeout: 1500 });
                } else {
                    startVanta();
                }
            }, idleDelay);
        }

        if (document.readyState === 'complete') {
            scheduleVanta();
        } else {
            window.addEventListener('load', scheduleVanta, { once: true });
        }

        return () => {
            isCancelled = true;
            window.removeEventListener('load', scheduleVanta);

            if (timeoutId) {
                window.clearTimeout(timeoutId);
            }

            if (idleId && 'cancelIdleCallback' in window) {
                window.cancelIdleCallback(idleId);
            }

            if (effectRef.current) {
                effectRef.current.destroy();
                effectRef.current = null;
            }
        };
    }, [options, settings.idleDelay, settings.maxLoadTime]);

    return { vantaRef: containerRef, isVantaDisabled };
}
