import { useEffect, useState, useRef } from "react";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link, matchPath, useLocation } from "react-router-dom";

import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { ACCOUNT_TYPE } from "../../utils/constants";
import ProfileDropdown from "../core/Auth/ProfileDropDown";

function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false); // Toggle for mobile catalog
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false); // Profile dropdown toggle

  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        console.log("data" , res);
        setSubLinks(res.data.data);
      } catch (error) {
        console.log("Could not fetch Categories.", error);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(e.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <div
    className={`flex h-16 items-center justify-center border-b-[1px] border-b-richblack-700 ${
      location.pathname !== "/" ? "bg-richblack-800" : ""
    } transition-all duration-200`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={logo}  className="h-10 w-auto md:h-12"  alt="Logo" width={200} height={40} loading="lazy" />
        </Link>

        {/* Desktop Navbar */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index} className="relative group">
                {link.title === "Catalog" ? (
                  <>
                    <div
                      className={`flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      <p>{link.title}</p>
                      <BsChevronDown />
                    </div>
                    <div
                      className={`invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]`}
                    >
                      <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                      {loading ? (
                        <p className="text-center">Loading...</p>
                      ) : subLinks.length ? (
                        subLinks
                          ?.filter((subLink) => subLink?.courses?.length > 0)
                          ?.map((subLink, i) => (
                            <Link
                              to={`/catalog/${subLink.name
                                .split(" ")
                                .join("-")
                                .toLowerCase()}`}
                              className="rounded-lg bg-transparent py-2 pl-4 hover:bg-richblack-50"
                              key={i}
                            >
                              <p>{subLink.name}</p>
                            </Link>
                          ))
                      ) : (
                        <p className="text-center">No Courses Found</p>
                      )}
                    </div>
                  </>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Login / Signup / Dashboard */}
        <div className="hidden items-center gap-x-4 md:flex">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null ? (
            <>
              <Link to="/login">
                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                  Log in
                </button>
              </Link>
              <Link to="/signup">
                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                  Sign up
                </button>
              </Link>
            </>
          ) : (
            <div
              onClick={() =>
                setProfileDropdownOpen((prev) => !prev)
              }
              className="relative cursor-pointer"
            >
              <ProfileDropdown isOpen={profileDropdownOpen} />
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          ref={menuButtonRef}
          className="mr-4 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
        </button>
      </div>

      {/* Mobile Menu */}
     {/* Mobile Menu */}
<div
  ref={mobileMenuRef}
  className={`${
    mobileMenuOpen ? "block" : "hidden"
  } fixed top-0 right-0 w-3/4 h-full bg-richblack-800 z-50 md:hidden transition-all duration-300`}
>
  <div className="p-6">
    <ul className="flex flex-col gap-6 text-white">
      {NavbarLinks.map((link, index) => (
        <li key={index}>
          {link.title === "Catalog" ? (
            <div>
              <div
                className="flex justify-between cursor-pointer"
                onClick={() => setMobileCatalogOpen((prev) => !prev)}
              >
                <p>{link.title}</p>
                <BsChevronDown />
              </div>
              {mobileCatalogOpen && (
                <div>
                  {loading ? (
                    <p className="text-center">Loading...</p>
                  ) : (
                    subLinks.length  ? subLinks
                          ?.filter((subLink) => subLink?.courses?.length > 0)
                          ?.map((subLink, i) => (
                            <Link
                              to={`/catalog/${subLink.name
                                .split(" ")
                                .join("-")
                                .toLowerCase()}`}
                              className="rounded-lg bg-transparent py-2 pl-4 hover:bg-richblack-50"
                              key={i}
                            >
                              <p>{subLink.name}</p>
                            </Link>
                          )):"null"
                  )}
                </div>
              )}
            </div>
          ) : (
            <Link
              to={link?.path}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.title}
            </Link>
          )}
        </li>
      ))}

      {/* Mobile Dashboard Option */}
      {token && (
        <li>
          <Link
            to="/dashboard/my-profile"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-2 py-1"
          >
            Dashboard
          </Link>
        </li>
      )}

      {/* Mobile Cart Option for Non-Instructors */}
      {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
        <li>
          <Link
            to="/dashboard/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-2 py-1"
          >
            Cart
            {totalItems > 0 && (
              <span className="ml-2 bg-richblack-600 px-2 py-1 rounded text-xs text-yellow-100">
                {totalItems}
              </span>
            )}
          </Link>
        </li>
      )}

      {/* Mobile Login/Signup Options */}
      {token === null && (
        <>
          <li>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-2 py-1"
            >
              Log in
            </Link>
          </li>
          <li>
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-2 py-1"
            >
              Sign up
            </Link>
          </li>
        </>
      )}
    </ul>
  </div>
</div>

    </div>
  );
}

export default Navbar;
