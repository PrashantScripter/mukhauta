import {React, lazy, Suspense} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loader from "./components/ui/Loader";

const Layout = lazy(() => import('./components/Layout/Layout'));
const Home = lazy(() => import("./pages/Home"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Blogs = lazy(() => import("./pages/Blogs"));
const Team = lazy(() => import("./pages/Team"));
const Notices = lazy(() => import("./pages/Notice"));

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blogs />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/team" element={<Team />} />
            <Route path="/notices" element={<Notices />} />
          </Routes>
        </Layout>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
