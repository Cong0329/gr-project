// src/AppRoutes.tsx
import { Route } from "react-router";
import SignIn from "../admin/pages/AuthPages/SignIn";
import SignUp from "../admin/pages/AuthPages/SignUp";
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
import { VerifyCodePage } from "../admin/pages/AuthPages/VerifyCodePage";
import VerifyProtectedRoute from "./VerifyProtected";
import ProductCreationForm from "../admin/pages/Forms/Product/AddProduct/ProductCreationForm";
import BrandPage from "../admin/pages/Forms/Product/Brand/BrandPage";
import CategoryPage from "../admin/pages/Forms/Product/Brand/CategoryPage";
import MedicalObjectPage from "../admin/pages/Forms/Product/Brand/MedicalObjectPage";
import IndicationPage from "../admin/pages/Forms/Product/Brand/IndicationPage";
import ProductPage from "../admin/pages/Forms/Product/ProductPage";
import EditProductPage from "../admin/pages/Forms/Product/EditProduct/EditProductPage";
import {BrandProduct} from "../admin/pages/Forms/Product/Brand/BrandProduct";
import OrderTables from "../admin/pages/Tables/OrderTables";
import OrderDetail from "../admin/pages/Tables/OrderDetail";

const adminRoutes = (
    <>
        {/* Dashboard Layout */}

        <Route element={<AdminProtectedRoute><AppLayout /></AdminProtectedRoute>}>
            <Route path="/admin" element={<Home />} />
            <Route path="/admin/profile" element={<UserProfiles />} />
            <Route path="/admin/calendar" element={<Calendar />} />
            <Route path="/admin/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/admin/form-elements" element={<FormElements />} />
            <Route path="/admin/create-product" element= {< ProductCreationForm/>} />
            <Route path="/admin/brand" element= {< BrandPage/>} />
            <Route path="/admin/category" element= {< CategoryPage/>} />
            <Route path="/admin/medical-object" element= {< MedicalObjectPage/>} />
            <Route path="/admin/indication" element= {< IndicationPage/>} />
            <Route path="/admin/products" element= {< ProductPage/>} />
            <Route path="/admin/edit-product/:id" element= {< EditProductPage/>} />
            <Route path="/admin/brand/:name" element= {< BrandProduct/>} />
            {/* Tables */}
            <Route path="/admin/basic-tables" element={<BasicTables />} />
            <Route path="/admin/orders" element={<OrderTables />} />
            <Route path="/admin/orders/:id" element={<OrderDetail />} />

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

        <Route element={<VerifyProtectedRoute />}>
            <Route path="admin/verify" element={<VerifyCodePage />} />

        </Route>

    </>
)
export default adminRoutes;
