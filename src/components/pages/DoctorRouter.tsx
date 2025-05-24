
// src/AppRoutes.tsx
import { Route } from "react-router";
import UserProfiles from "../admin/pages/UserProfiles";
import { Calendar, Home } from "lucide-react";
import Blank from "../admin/pages/Blank";

const doctorRoutes = (
  <Route>
    <Route index element={<Home />} />
    <Route path="profile" element={<UserProfiles />} />
    <Route path="calendar" element={<Calendar />} />
    <Route path="blank" element={<Blank />} />
  </Route>
);

export default doctorRoutes;
