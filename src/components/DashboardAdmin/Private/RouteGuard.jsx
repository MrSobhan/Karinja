import React, { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContext from "@/context/authContext";

// Define route permissions for each role
const routePermissions = {
  full_admin: [
    "/dashboard",
    "/dashboard/admins",
    "/dashboard/users",
    "/dashboard/resumes",
    "/dashboard/job-seeker-personal-informations",
    "/dashboard/job-seeker-education",
    "/dashboard/job-seeker-skills",
    "/dashboard/job-seeker-work-experiences",
    "/dashboard/employer-company",
    "/dashboard/activity-log",
    "/dashboard/job-postings",
    "/dashboard/job-application",
    "/dashboard/notifications",
    "/dashboard/search",
  ],
  admin: [
    "/dashboard",
    "/dashboard/users",
    "/dashboard/resumes",
    "/dashboard/job-seeker-personal-informations",
    "/dashboard/job-seeker-education",
    "/dashboard/job-seeker-skills",
    "/dashboard/job-seeker-work-experiences",
    "/dashboard/employer-company",
    "/dashboard/job-postings",
    "/dashboard/job-application",
    "/dashboard/notifications",
    "/dashboard/search",
  ],
  employer: [
    "/dashboard",
    "/dashboard/companies",
    "/dashboard/job-postings",
    "/dashboard/job-application",
    "/dashboard/notifications",
  ],
  job_seeker: [
    "/dashboard",
    "/dashboard/my-personal-informations",
    "/dashboard/myresumes",
    "/dashboard/my-job-applications",
    "/dashboard/saved-jobs",
    "/dashboard/images",
    "/dashboard/notifications",
    "/dashboard/search",
  ],
};

export default function RouteGuard({ children, allowedRoles = null }) {
  const { user, isLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in
    if (!isLogin() || !user || !user.user_role) {
      navigate("/login");
      return;
    }

    // Check if user status is active
    if (user.user_status !== "فعال") {
      navigate("/login");
      return;
    }

    // If allowedRoles is specified, check against it first
    if (allowedRoles && !allowedRoles.includes(user.user_role)) {
      navigate("/dashboard");
      return;
    }

    // If allowedRoles is specified and user role matches, allow access
    if (allowedRoles && allowedRoles.includes(user.user_role)) {
      return;
    }

    // Otherwise, check route permissions based on user role
    const allowedRoutes = routePermissions[user.user_role] || [];

    // Normalize the current path (remove trailing slash if present)
    const currentPath = location.pathname.replace(/\/$/, "");

    // Special case: dashboard root is always allowed if user is logged in
    if (currentPath === "/dashboard" || currentPath === "/dashboard/") {
      return;
    }

    // Check if current route is allowed
    const isRouteAllowed = allowedRoutes.some((route) => {
      const normalizedRoute = route.replace(/\/$/, "");
      return currentPath === normalizedRoute || currentPath.startsWith(normalizedRoute + "/");
    });

    // If route is not allowed, redirect to dashboard
    if (!isRouteAllowed) {
      navigate("/dashboard");
    }
  }, [user, location.pathname, navigate, isLogin, allowedRoles]);

  // Show loading or nothing while checking
  if (!user || !user.user_role) {
    return null;
  }

  return <>{children}</>;
}

