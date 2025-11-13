import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { AuthProvider }  from "@/context/authContext";

import HomePage from "./pages/Home";
import Login from "./pages/Login";
import Singup from "./pages/Singup";
import About from "./pages/About";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import CompanyInfo from "./pages/CompanyInfo";

import DevAuth from "@/components/DevAuth";


// ? DashboardAdmin

import PAdminPrivate from "@/components/DashboardAdmin/Private/PAdminPrivate";
import MainDashboard from "./pages/DashboardAdmin/MainDashboard";

import Dashboard from "@/components/DashboardAdmin/Dashboard";
import Users from "@/components/DashboardAdmin/Users";

import "./App.css";
import Resumes from "./components/DashboardAdmin/Resumes";
import Admin from "./components/DashboardAdmin/Admin";
import EmployerCompany from "./components/DashboardAdmin/employer_company";
import ActivityLog from "./components/DashboardAdmin/activity_log";
import JobPostings from "./components/DashboardAdmin/job_postings";
import JobApplications from "./components/DashboardAdmin/job_applications";
import Notifications from "./components/DashboardAdmin/notifications";
import CompanyDetails from "./components/DashboardAdmin/companies_details";
import MyResumes from "./components/DashboardAdmin/myResumes";
import MyJobApplications from "./components/DashboardAdmin/my_job_applications";
import SavedJobs from "./components/DashboardAdmin/saved_jobs";


export default function App() {

  // ? Routes Project


  const routes = [
    { path: "/", element: <HomePage /> },
    { path: "/login", element: <Login /> },
    { path: "/singup", element: <Singup /> },
    { path: "/about", element: <About /> },
    { path: "/terms", element: <Terms /> },
    { path: "/company-info", element: <CompanyInfo /> },
    {
      path: "/dashboard/*",
      element: (
        <PAdminPrivate>
          <MainDashboard />
        </PAdminPrivate>
      ),
      children: [
        { path: "", element: <Dashboard /> },
        { path: "admins", element: <Admin /> },
        { path: "users", element: <Users /> },
        { path: "resumes", element: <Resumes /> },
        { path: "employer-company", element: <EmployerCompany /> },
        { path: "activity-log", element: <ActivityLog /> },
        { path: "job-postings", element: <JobPostings /> },
        { path: "job-application", element: <JobApplications /> },
        { path: "notifications", element: <Notifications /> },
        { path: "companies", element: <CompanyDetails /> },
        { path: "myresumes", element: <MyResumes /> },
        { path: "my-job-applications", element: <MyJobApplications /> },
        { path: "saved-jobs", element: <SavedJobs /> },
      ],
    },
    { path: "/*", element: <NotFound /> },
  ]

  const router = createBrowserRouter(routes)


  return (
    <AuthProvider>
      <DevAuth>
        <RouterProvider router={router} />
      </DevAuth>
    </AuthProvider>
  );
}