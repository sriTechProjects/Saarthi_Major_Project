import { Link } from "react-router-dom";
import { formAvatar } from "../../../utils/validator/helper";
import { IoLogOutOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6";
import { FiPackage } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import PropTypes from "prop-types";

const ProfileDropDown = ({
  toggleDropdown,
  user,
  handleLogout,
  isDropdownOpen,
}) => {
  const menuItems = [
    {
      label: "My Profile",
      icon: <FaRegUser />,
      to: "/myprofile",
      isButton: false,
      color: "text-[#464646]",
    },
    {
      label: "My Orders",
      icon: <FiPackage />,
      to: "/myorders",
      isButton: false,
      color: "text-[#464646]",
    },
    {
      label: "Wishlist (0)",
      icon: <FaRegHeart />,
      to: "/mywishlist",
      isButton: false,
      color: "text-[#464646]",
    },
    {
      label: "Logout",
      icon: <IoLogOutOutline />,
      onClick: handleLogout,
      isButton: true,
      color: "text-[#ff0000]",
    },
  ];
  return (
    <>
      <div className="relative">
        <button onClick={toggleDropdown} className="flex items-center gap-2">
          <span className="w-8 h-8 bg-gray-200 rounded-full border flex items-center justify-center font-normal">
            {formAvatar(user.email)}
          </span>
          <span className="text-sm text-gray-700">
            {user.fullName.firstName}
          </span>
          <span className="text-sm text-gray-700">
            {user.fullName.lastName}
          </span>
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border">
            {menuItems.map((item, index) =>
              item.isButton ? (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={`flex items-center gap-x-3 w-full ${item.color} text-md text-left px-4 py-2 hover:bg-[#f9f9f9]`}
                >
                  {item.icon}
                  <p>{item.label}</p>
                </button>
              ) : (
                <Link
                  key={index}
                  to={item.to}
                  className={`flex items-center gap-x-3 w-full ${item.color} text-md text-left px-4 py-2 hover:bg-[#f9f9f9]`}
                >
                  {item.icon}
                  <p>{item.label}</p>
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </>
  );
};

ProfileDropDown.propTypes = {
  toggleDropdown: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  handleLogout: PropTypes.func.isRequired,
  isDropdownOpen: PropTypes.bool.isRequired,
};

export default ProfileDropDown;
