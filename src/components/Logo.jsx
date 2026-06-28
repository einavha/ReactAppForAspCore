import { useWindowScroll } from 'react-use';
import './Logo.css';
import { SiteDirection } from '../config/site.jsx';

const Logo = () => {
    const { y } = useWindowScroll();
    const scale = Math.max(0.5, (200 - y) / 200);

    return (
        <div className="magazine-logo-wrap" dir={SiteDirection} style={{ height: `${120*scale}px` }} >
        <img src='logo.png' alt='טעות דפוס' className='magazine-logo' style={{ transform: `scale(${scale})` }} />
        </div>
    );
};

export default Logo;
