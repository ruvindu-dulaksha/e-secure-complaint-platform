
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useState } from "react";

export const Header = () => {
  const { user, logout } = useUser();
  const [isHome, setIsHome] = useState(true);
  const location = useLocation();

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1 className="text-xl font-bold"><Link to="/" >
    E-Complaint Portal
  </Link> </h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            {/* <Link to="/" className="hover:underline">Home</Link> */}
            {/* <Link
                to={isHome ? "/" : "/dashboard"}
                    className="hover:underline"
                  onClick={() => setIsHome(!isHome)}
                      >
                {isHome ? "Home" : "Dashboard"}
      </Link> */}
      {location.pathname === "/" ? (
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
      ) : (
        <Link to="/" className="hover:underline">Home</Link>
      )}
          </li>
          {user ? (
            <>
              <li>
                <Link to="/profile" className="hover:underline">Profile</Link>
              </li>
              <li>
                <button onClick={logout} className="hover:underline">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:underline">Login</Link>
              </li>
              <li>
                <Link to="/signup" className="hover:underline">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
