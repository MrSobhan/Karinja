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
import JobsSearch from "./pages/JobsSearch";
import JobDetail from "./pages/JobDetail";
import CompanyDetail from "./pages/CompanyDetail";
import CompaniesList from "./pages/CompaniesList";
import BlogsList from "./pages/BlogsList";
import BlogDetail from "./pages/BlogDetail";

import DevAuth from "@/components/DevAuth";


// ? DashboardAdmin

import PAdminPrivate from "@/components/DashboardAdmin/Private/PAdminPrivate";
import RouteGuard from "@/components/DashboardAdmin/Private/RouteGuard";
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

import JobSeekerPersonalInformations from "./components/DashboardAdmin/job_seeker_personal_informations";
import JobSeekerEducation from "./components/DashboardAdmin/job_seeker_education";
import JobSeekerSkills from "./components/DashboardAdmin/job_seeker_skills";
import JobSeekerWorkExperiences from "./components/DashboardAdmin/job_seeker_work_experiences";

import MyPersonalInformations from "./components/DashboardAdmin/my_personal_informations";
import Search from "./components/DashboardAdmin/search";
import Blogs from "./components/DashboardAdmin/blogs";
import Tickets from "./components/DashboardAdmin/tickets";
import Settings from "./components/DashboardAdmin/Settings";


export default function App() {

  // ? Routes Project


  const routes = [
    { path: "/", element: <HomePage /> },
    { path: "/login", element: <Login /> },
    { path: "/singup", element: <Singup /> },
    { path: "/about", element: <About /> },
    { path: "/terms", element: <Terms /> },
    { path: "/company-info", element: <CompanyInfo /> },
    { path: "/jobs/search", element: <JobsSearch /> },
    { path: "/job/:id", element: <JobDetail /> },
    { path: "/company/:id", element: <CompanyDetail /> },
    { path: "/companies", element: <CompaniesList /> },
    { path: "/blogs", element: <BlogsList /> },
    { path: "/blog/:id", element: <BlogDetail /> },
    {
      path: "/dashboard/*",
      element: (
        <PAdminPrivate>
          <MainDashboard />
        </PAdminPrivate>
      ),
      children: [
        { 
          path: "", 
          element: (
            <RouteGuard>
              <Dashboard />
            </RouteGuard>
          ) 
        },
        { 
          path: "admins", 
          element: (
            <RouteGuard allowedRoles={["full_admin"]}>
              <Admin />
            </RouteGuard>
          ) 
        },
        { 
          path: "users", 
          element: (
            <RouteGuard allowedRoles={["full_admin", "admin"]}>
              <Users />
            </RouteGuard>
          ) 
        },
        { 
          path: "resumes", 
          element: (
            <RouteGuard allowedRoles={["full_admin", "admin"]}>
              <Resumes />
            </RouteGuard>
          ) 
        },
        { 
          path: "employer-company", 
          element: (
            <RouteGuard allowedRoles={["full_admin", "admin"]}>
              <EmployerCompany />
            </RouteGuard>
          ) 
        },
        { 
          path: "activity-log", 
          element: (
            <RouteGuard allowedRoles={["full_admin"]}>
              <ActivityLog />
            </RouteGuard>
          ) 
        },
        { 
          path: "job-postings", 
          element: (
            <RouteGuard allowedRoles={["full_admin", "admin", "employer"]}>
              <JobPostings />
            </RouteGuard>
          ) 
        },
        { 
          path: "job-application", 
          element: (
            <RouteGuard allowedRoles={["full_admin", "admin", "employer"]}>
              <JobApplications />
            </RouteGuard>
          ) 
        },
        { 
          path: "notifications", 
          element: (
            <RouteGuard>
              <Notifications />
            </RouteGuard>
          ) 
        },
        { 
          path: "companies", 
          element: (
            <RouteGuard allowedRoles={["employer"]}>
              <CompanyDetails />
            </RouteGuard>
          ) 
        },
        { 
          path: "myresumes", 
          element: (
            <RouteGuard allowedRoles={["job_seeker"]}>
              <MyResumes />
            </RouteGuard>
          ) 
        },
        { 
          path: "my-job-applications", 
          element: (
            <RouteGuard allowedRoles={["job_seeker"]}>
              <MyJobApplications />
            </RouteGuard>
          ) 
        },
        { 
          path: "saved-jobs", 
          element: (
            <RouteGuard allowedRoles={["job_seeker"]}>
              <SavedJobs />
            </RouteGuard>
          ) 
        },
        { 
          path: "job-seeker-personal-informations", 
          element: (
            <RouteGuard allowedRoles={["full_admin", "admin"]}>
              <JobSeekerPersonalInformations />
            </RouteGuard>
          ) 
        },
        { 
          path: "job-seeker-education", 
          element: (
            <RouteGuard allowedRoles={["full_admin", "admin"]}>
              <JobSeekerEducation />
            </RouteGuard>
          ) 
        },
        { 
          path: "job-seeker-skills", 
          element: (
            <RouteGuard allowedRoles={["full_admin", "admin"]}>
              <JobSeekerSkills />
            </RouteGuard>
          ) 
        },
        { 
          path: "job-seeker-work-experiences", 
          element: (
            <RouteGuard allowedRoles={["full_admin", "admin"]}>
              <JobSeekerWorkExperiences />
            </RouteGuard>
          ) 
        },
        { 
          path: "my-personal-informations", 
          element: (
            <RouteGuard allowedRoles={["job_seeker"]}>
              <MyPersonalInformations />
            </RouteGuard>
          ) 
        },
        { 
          path: "search", 
          element: (
            <RouteGuard allowedRoles={["full_admin", "admin", "job_seeker"]}>
              <Search />
            </RouteGuard>
          ) 
        },
        { 
          path: "blogs", 
          element: (
            <RouteGuard allowedRoles={["full_admin", "admin"]}>
              <Blogs />
            </RouteGuard>
          ) 
        },
        { 
          path: "tickets", 
          element: (
            <RouteGuard allowedRoles={["full_admin", "admin" ,"employer"  ,"job_seeker"]}>
              <Tickets />
            </RouteGuard>
          ) 
        },
        { 
          path: "settings", 
          element: (
            <RouteGuard>
              <Settings />
            </RouteGuard>
          ) 
        },
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