import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './index.css';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import Gallery from './pages/Gallery.jsx';
import Editorials from './pages/Editorials.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Editorial from './pages/Editorial.jsx';
import Magazine from './pages/Magazine.jsx';
import Article from './pages/Article.jsx';
import ImageCarousel from './pages/ImageCarousel.jsx';
import GalleryWithCarousel from './pages/GalleryWithCarousel.jsx';
import GalleryPost from './pages/GalleryPost.jsx';
import News from './pages/News.jsx';
import NewsArt from './pages/NewsArt.jsx';
import Authenticate from './pages/Authenticate.jsx';
import Posts from './pages/Posts.jsx';
import Post from './pages/Post.jsx';
import StaticGrid from './pages/StaticGrid.jsx'
import AdminPosts from './pages/Admin/AdminPosts.jsx';

const originalFetch = window.fetch;
window.fetch = async (input, init) => {
    const method = init?.method ?? 'GET';
    const url = typeof input === 'string' ? input : input.url;

    console.info(`[Client] Request: ${method} ${url}`);

    const response = await originalFetch(input, init);

    console.info(`[Client] Response: ${response.status} ${method} ${url}`);

    return response;
};

window.addEventListener('error', (event) => {
    const target = event.target;
    const isImage = target instanceof HTMLImageElement;

    if (isImage) {
        console.error(`[Client] Image load failed: ${target.currentSrc || target.src}`);
    } else if (target && 'src' in target) {
        console.error(`[Client] Resource load failed: ${target.src}`);
    }
}, true);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter
            future={{
                v7_startTransition: true,
            }}>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<Home />} />
                    <Route path="gallery" element={<GalleryWithCarousel />} />
                    <Route path="gallerypost/:id" element={<GalleryPost />} />
                    <Route path="editorials" element={<Editorials />} />
                    <Route path="news">
                        <Route index element={<News />} />
                        <Route path="art" element={<NewsArt />} />
                    </Route>
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="editorial">
                        <Route index element={<Editorial />} />
                        <Route path="*" element={<Editorial />} />
                    </Route>
                    <Route path="magazine">
                        <Route index element={<Magazine />} />
                        <Route path="*" element={<Article />} />
                    </Route>
                    <Route path="login" element={<Authenticate />} />
                    <Route path="admin" element={<AdminPosts />} />
                    <Route path="posts">
                        <Route index element={<Posts />} />
                        <Route path=":id" element={<Post />} />
                    </Route>
                    <Route path="staticgrid" element={<StaticGrid />} />
                    <Route path="AdminPosts" element={<AdminPosts />}/>
                    <Route path="*" element={<h2>Page Not Found</h2>} />
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);
