import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { PageId } from "./menuItems";
import { ProfilePage } from "./infoPage/ProfilePage";
import { OrderPage } from "./infoPage/OrderPage";
import { AddressPage } from "./infoPage/AddressPage";
import { MedicinePage } from "./infoPage/MedicinePage";
import { HealthCheckPage } from "./infoPage/HealthCheck";
import UserChatInterface from "../admin/components/chat/UserChat/UserChatInterface";

const MainContent: React.FC = () => {
  const activePage = useSelector(
    (state: RootState) => state.navigation.activePage
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const contentMap: Record<PageId, React.ReactNode> = {
    "personal-info": (
      <ProfilePage name={user?.name} phone={user.phone} gender={user.gender} />
    ),
    orders: <OrderPage />,
    addresses: <AddressPage />,
    "health-check": <HealthCheckPage />,
    chat: <UserChatInterface />,
    logout: null,
    prescriptions: <MedicinePage />,
  };

  return <div className="w-full h-full">{contentMap[activePage]}</div>;
};

export default MainContent;
