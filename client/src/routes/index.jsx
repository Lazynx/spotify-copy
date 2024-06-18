import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/home";
import { Signup } from "../pages/signup";
import { Signin } from "../pages/singin";
import { Upload } from "../pages/upload";
import { PrivateRoute } from "../components/PrivateRoute";
import { ArtistDetail } from "../pages/artist"; 

export const RouteList = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/upload" element={<PrivateRoute element={<Upload />} />} />
      <Route path="/artist/:id" element={<ArtistDetail />} /> 
    </Routes>
  );
};
