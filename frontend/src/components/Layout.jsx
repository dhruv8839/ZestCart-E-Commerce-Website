import AnnouncementBar from './AnnouncementBar.jsx';
import Footer from './Footer.jsx';
import Navbar from './Navbar.jsx';
import ScrollTopFab from './ScrollTopFab.jsx';
import ScrollToTop from './ScrollToTop.jsx';
import AiChat from './AiChat.jsx';

/** Global shell wrapping every route */

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
      <ScrollToTop />
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollTopFab />
      <AiChat />
    </div>
  );
}
