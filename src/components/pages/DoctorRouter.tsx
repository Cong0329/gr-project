// src/AppRoutes.tsx
import { Route } from "react-router";
import UserProfiles from "../admin/pages/UserProfiles";
import { DoctorScheduleComponent } from "../admin/pages/FormsDoctor/ScheduleDoctor";
import { ExaminationRequest } from "../admin/pages/FormsDoctor/ExaminationRequest";
import DoctorChatInterface from "../admin/components/chat/DoctorChat/DoctorChatInterface";

const doctorRoutes = (
  <Route>
    <Route index element={<UserProfiles />} />
    <Route path="schedule" element={<DoctorScheduleComponent />} />
    <Route path="examination-requests" element={<ExaminationRequest />} />
    <Route path="chat" element={<DoctorChatInterface />} />
  </Route>
);

export default doctorRoutes;
