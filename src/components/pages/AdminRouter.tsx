// src/AppRoutes.tsx
import { Route } from "react-router";
import SignIn from "../admin/pages/AuthPages/SignIn";
import SignUp from "../admin/pages/AuthPages/SignUp";
import NotFound from "../admin/pages/OtherPage/NotFound";
import UserProfiles from "../admin/pages/UserProfiles";
import Videos from "../admin/pages/UiElements/Videos";
import Images from "../admin/pages/UiElements/Images";
import Alerts from "../admin/pages/UiElements/Alerts";
import Badges from "../admin/pages/UiElements/Badges";
import Avatars from "../admin/pages/UiElements/Avatars";
import Buttons from "../admin/pages/UiElements/Buttons";
import LineChart from "../admin/pages/Charts/LineChart";
import BarChart from "../admin/pages/Charts/BarChart";
import Calendar from "../admin/pages/Calendar";
import BasicTables from "../admin/pages/Tables/BasicTables";
import FormElements from "../admin/pages/Forms/FormElements";
import Blank from "../admin/pages/Blank";
import AppLayout from "../admin/layout/AppLayout";
import Home from "../admin/pages/Dashboard/Home";
import AdminProtectedRoute from '../../components/pages/AdminProtectedRoute';

const adminRoutes = (
    <>
        {/* Dashboard Layout */}

        <Route element={<AdminProtectedRoute><AppLayout /></AdminProtectedRoute>}>
            <Route index path="/admin" element={<Home />} />
            <Route path="/admin/profile" element={<UserProfiles />} />
            <Route path="/admin/calendar" element={<Calendar />} />
            <Route path="/admin/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/admin/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/admin/basic-tables" element={<BasicTables />} />

            {/* UI Elements */}
            <Route path="/admin/alerts" element={<Alerts />} />
            <Route path="/admin/avatars" element={<Avatars />} />
            <Route path="/admin/badge" element={<Badges />} />
            <Route path="/admin/buttons" element={<Buttons />} />
            <Route path="/admin/images" element={<Images />} />
            <Route path="/admin/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
        </Route>

        {/* Auth Routes */}
        <Route path="admin/signin" element={<SignIn />} />
        <Route path="admin/signup" element={<SignUp />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
    </>
)
export default adminRoutes;
