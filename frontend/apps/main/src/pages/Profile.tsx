import { Helmet } from "react-helmet";
import Orders from "@/components/Profile/Orders/Orders";
import ProfileOverview from "@/components/Profile/ProfileOverview/ProfileOverview";
import { useAccount } from "@/store/auth/hooks";

const Profile = () => {
  const user = useAccount();
  return (
    <div>
      <Helmet>
        <title>{user ? `${user?.name}'s Profile - Forever` : "Profile - Forever"}</title>
        <meta
          name="description"
          content={`Welcome, ${user?.name} Manage your Forever profile, track your orders, and update your details easily.`}
        />
      </Helmet>
      <ProfileOverview />
      <Orders />
    </div>
  );
};

export default Profile;
