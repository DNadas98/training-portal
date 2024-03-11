import {createBrowserRouter} from "react-router-dom";
import Layout from "../../public/layout/Layout.tsx";
import ErrorPage from "../../public/pages/errorPages/ErrorPage.tsx";
import {publicMenuRoutes} from "../config/menu/publicMenuRoutes.tsx";
import NotFound from "../../public/pages/errorPages/NotFound.tsx";
import RequireAuthentication from "../../authentication/components/RequireAuthentication.tsx";
import {GlobalRole} from "../../authentication/dto/userInfo/GlobalRole.ts";
import UserLayout from "../../user/layout/UserLayout.tsx";
import {userMenuProfileRoutes} from "../config/menu/userMenuProfileRoutes.tsx";
import RegisterVerificationRedirect
  from "../../authentication/pages/redirect/RegisterVerificationRedirect.tsx";
import CompanyDashboard from "../../companies/pages/dashboard/CompanyDashboard.tsx";
import CompanyLayout from "../../companies/layout/CompanyLayout.tsx";
import UpdateCompany from "../../companies/pages/update/UpdateCompany.tsx";
import CompanyJoinRequests from "../../companies/pages/requests/CompanyJoinRequests.tsx";
import Projects from "../../projects/pages/projects/Projects.tsx";
import Companies from "../../companies/pages/companies/Companies.tsx";
import AddCompany from "../../companies/pages/add/AddCompany.tsx";
import AddProject from "../../projects/pages/add/AddProject.tsx";
import ProjectDashboard from "../../projects/pages/dashboard/ProjectDashboard.tsx";
import UpdateProject from "../../projects/pages/update/UpdateProject.tsx";
import ProjectJoinRequests from "../../projects/pages/requests/ProjectJoinRequests.tsx";
import Tasks from "../../tasks/pages/tasks/Tasks.tsx";
import AddTask from "../../tasks/pages/add/AddTask.tsx";
import TaskDashboard from "../../tasks/pages/dashboard/TaskDashboard.tsx";
import UpdateTask from "../../tasks/pages/update/UpdateTask.tsx";
import Expenses from "../../expenses/pages/expenses/Expenses.tsx";

const appRouter = createBrowserRouter([
  /* public */
  {
    path: "",
    element: <Layout/>,
    errorElement: <ErrorPage/>,
    children: [
      ...publicMenuRoutes.elements,
      {
        path: "/*", element: <NotFound/>
      }
    ]
  },
  /* redirect */
  {
    path: "/redirect",
    element: <Layout/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: "registration", element: <RegisterVerificationRedirect/>
      }
    ]
  },
  /* user */
  {
    path: "/user/",
    element: <RequireAuthentication allowedRoles={[GlobalRole.USER]}/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        element: <UserLayout/>,
        children: [
          ...userMenuProfileRoutes.elements,
          {
            path: "*", element: <NotFound/>
          }
        ]
      }
    ]
  },
  /* companies */
  {
    path: "/companies/",
    element: <RequireAuthentication allowedRoles={[GlobalRole.USER]}/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        element: <CompanyLayout/>,
        children: [
          {
            path: "", element: <Companies/>
          },
          {
            path: "create", element: <AddCompany/>
          },
          {
            path: ":companyId", element: <CompanyDashboard/>
          },
          {
            path: ":companyId/update", element: <UpdateCompany/>
          },
          {
            path: ":companyId/requests", element: <CompanyJoinRequests/>
          },
          {
            path: ":companyId/projects", element: <Projects/>
          },
          {
            path: ":companyId/projects/create", element: <AddProject/>
          },
          {
            path: ":companyId/projects/:projectId", element: <ProjectDashboard/>
          },
          {
            path: ":companyId/projects/:projectId/update", element: <UpdateProject/>
          },
          {
            path: ":companyId/projects/:projectId/requests",
            element: <ProjectJoinRequests/>
          },
          {
            path: ":companyId/projects/:projectId/tasks", element: <Tasks/>
          },
          {
            path: ":companyId/projects/:projectId/tasks/create", element: <AddTask/>
          },
          {
            path: ":companyId/projects/:projectId/tasks/:taskId",
            element: <TaskDashboard/>
          },
          {
            path: ":companyId/projects/:projectId/tasks/:taskId/update",
            element: <UpdateTask/>
          },
          {
            path: ":companyId/projects/:projectId/tasks/:taskId/expenses",
            element: <Expenses/>
          },
          {
            path: "*", element: <NotFound/>
          }
        ]
      }
    ]
  }
]);

export default appRouter;
