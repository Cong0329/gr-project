// src/AppRoutes.tsx
import { Route } from "react-router";
import UserProfiles from "../admin/pages/UserProfiles";
import { DoctorScheduleComponent } from "../admin/pages/FormsDoctor/ScheduleDoctor";
import { ExaminationRequest } from "../admin/pages/FormsDoctor/ExaminationRequest";

const doctorRoutes = (
  <Route>
    <Route index element={<UserProfiles />} />
    <Route path="schedule" element={<DoctorScheduleComponent />} />
    <Route path="examination-requests" element={<ExaminationRequest />} />
  </Route>
);

export default doctorRoutes;
