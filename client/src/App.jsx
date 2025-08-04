import {React, lazy, Suspense} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loader from "./components/ui/Loader";

const Layout = lazy(() => import('./components/Layout/Layout'));
const Home = lazy(() => import("./pages/Home"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Blogs = lazy(() => import("./pages/Blogs"));

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blogs />} />
            <Route path="/gallery" element={<Gallery />} />
          </Routes>
        </Layout>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
