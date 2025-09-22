import { React, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loader from "./components/ui/Loader";
import Protect from "./auth/Protect";
import { useAuth } from "@clerk/clerk-react";
import useUserStore from "./store/userStore";

const Layout = lazy(() => import("./components/Layout/Layout"));
const Home = lazy(() => import("./pages/Home"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Blogs = lazy(() => import("./pages/Blogs"));
const Team = lazy(() => import("./pages/Team"));
const Notices = lazy(() => import("./pages/Notice"));
const AdminPage = lazy(() => import("./pages/Admin"));

const App = () => {
  const { isSignedIn } = useAuth();
  const Role = useUserStore((store) => store.loggedInUser?.role);
  console.log('role for app', Role)
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
            <Route element={<Protect isLoggedIn={isSignedIn} Role={Role} />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Routes>
        </Layout>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
