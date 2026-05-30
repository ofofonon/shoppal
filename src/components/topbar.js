import { useNavigate, useLocation } from "react-router-dom";
import logo from "../logos/ShopPal logo white - Copy.PNG"; // adjust path
import { useNotifications } from "../hooks/useNotifications";

export default function TopBar(  ) {
  const navigate = useNavigate();
  const location = useLocation();

  const { notifications } = useNotifications();

  const whatsappNumber = "2347064539263";

  const hasUnread = notifications.some(n => !n.read);

  // hide on home page
  if (location.pathname === "/") return null;

  return (
    <div className="w-full flex items-center justify-between  px-4 md:px-10 py-4 ">
      
      <div className="flex">
        {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="text-white/70 hover:text-white transition flex items-center gap-2"
      >
       <i className="fa-solid fa-angle-left cursor-pointer md:text-[20px] text-sm"></i>
      </button>

      {/* LOGO */}
      <div
        onClick={() => navigate("/")}
        className="cursor-pointer"
      >
        <img
          src={logo}
          alt="logo"
          className="h-8 object-contain w-[60%]"
        />
      </div>
      </div>



      <div className="flex px-2">

        {/* WHATSAPP */}
        <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                >
            <button className="gap-1 mx-2 bg-green-500 rounded-full px-2 p-1 font-semibold flex items-center justify-center md:text-base text-xs">
              <i className="fa-brands fa-whatsapp text-xl"></i>
              Whatsapp
            </button>
            </a>

      <div className="relative cursor-pointer" onClick={() => navigate("/notifications")}>

<i className="fa-solid fa-bell text-white text-lg"></i>

{hasUnread && (
  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
)}

</div>
      </div>

      {/* spacer to balance layout */}
     
    </div>
  );
}