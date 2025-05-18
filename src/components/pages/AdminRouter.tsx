// src/AppRoutes.tsx
import { Route } from "react-router";
// import SignIn from "../admin/pages/AuthPages/SignIn";
// import SignUp from "../admin/pages/AuthPages/SignUp";
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
import Home from "../admin/pages/Dashboard/Home";
import ProductCreationForm from "../admin/pages/Forms/Product/AddProduct/ProductCreationForm";
import BrandPage from "../admin/pages/Forms/Product/Brand/BrandPage";
import CategoryPage from "../admin/pages/Forms/Product/Brand/CategoryPage";
import MedicalObjectPage from "../admin/pages/Forms/Product/Brand/MedicalObjectPage";
import IndicationPage from "../admin/pages/Forms/Product/Brand/IndicationPage";
import ProductPage from "../admin/pages/Forms/Product/ProductPage";
import EditProductPage from "../admin/pages/Forms/Product/EditProduct/EditProductPage";
import { BrandProduct } from "../admin/pages/Forms/Product/Brand/BrandProduct";
import OrderTables from "../admin/pages/Tables/OrderTables";
import OrderDetail from "../admin/pages/Tables/OrderDetail";
import AdminReview from "../admin/components/chat/AdminReview";
import AdminChatInterface from "../admin/components/chat/AdminChat/AdminChatInterface";

const adminRoutes = (
  <>
    {/* Dashboard Layout */}

    <Route>
      <Route index element={<Home />} />
      <Route path="profile" element={<UserProfiles />} />
      <Route path="calendar" element={<Calendar />} />
      <Route path="blank" element={<Blank />} />

      {/* Forms */}
      <Route path="form-elements" element={<FormElements />} />
      <Route path="create-product" element={<ProductCreationForm />} />
      <Route path="brand" element={<BrandPage />} />
      <Route path="category" element={<CategoryPage />} />
      <Route path="medical-object" element={<MedicalObjectPage />} />
      <Route path="indication" element={<IndicationPage />} />
      <Route path="products" element={<ProductPage />} />
      <Route path="edit-product/:id" element={<EditProductPage />} />
      <Route path="brand/:name" element={<BrandProduct />} />
      <Route path="orders" element={<OrderTables />} />
      <Route path="orders/:id" element={<OrderDetail />} />
      <Route path="reviews" element={<AdminReview />} />
      <Route path="chat" element={<AdminChatInterface />} />

      {/* Tables */}
      <Route path="basic-tables" element={<BasicTables />} />

      {/* UI Elements */}
      <Route path="alerts" element={<Alerts />} />
      <Route path="avatars" element={<Avatars />} />
      <Route path="badge" element={<Badges />} />
      <Route path="buttons" element={<Buttons />} />
      <Route path="images" element={<Images />} />
      <Route path="videos" element={<Videos />} />

      {/* Charts */}
      <Route path="line-chart" element={<LineChart />} />
      <Route path="bar-chart" element={<BarChart />} />
    </Route>

    {/* Auth Routes */}
    {/* <Route path="admin/signin" element={<SignIn />} />
    <Route path="admin/signup" element={<SignUp />} /> */}
  </>
);
export default adminRoutes;
