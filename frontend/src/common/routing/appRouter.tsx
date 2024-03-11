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
import GroupDashboard from "../../groups/pages/dashboard/GroupDashboard.tsx";
import GroupLayout from "../../groups/layout/GroupLayout.tsx";
import UpdateGroup from "../../groups/pages/update/UpdateGroup.tsx";
import GroupJoinRequests from "../../groups/pages/requests/GroupJoinRequests.tsx";
import Projects from "../../projects/pages/projects/Projects.tsx";
import Groups from "../../groups/pages/groups/Groups.tsx";
import AddGroup from "../../groups/pages/add/AddGroup.tsx";
import AddProject from "../../projects/pages/add/AddProject.tsx";
import ProjectDashboard from "../../projects/pages/dashboard/ProjectDashboard.tsx";
import UpdateProject from "../../projects/pages/update/UpdateProject.tsx";
import ProjectJoinRequests from "../../projects/pages/requests/ProjectJoinRequests.tsx";
import Tasks from "../../tasks/pages/tasks/Tasks.tsx";
import AddTask from "../../tasks/pages/add/AddTask.tsx";
import TaskDashboard from "../../tasks/pages/dashboard/TaskDashboard.tsx";
import UpdateTask from "../../tasks/pages/update/UpdateTask.tsx";

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
  /* groups */
  {
    path: "/groups/",
    element: <RequireAuthentication allowedRoles={[GlobalRole.USER]}/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        element: <GroupLayout/>,
        children: [
          {
            path: "", element: <Groups/>
          },
          {
            path: "create", element: <AddGroup/>
          },
          {
            path: ":groupId", element: <GroupDashboard/>
          },
          {
            path: ":groupId/update", element: <UpdateGroup/>
          },
          {
            path: ":groupId/requests", element: <GroupJoinRequests/>
          },
          {
            path: ":groupId/projects", element: <Projects/>
          },
          {
            path: ":groupId/projects/create", element: <AddProject/>
          },
          {
            path: ":groupId/projects/:projectId", element: <ProjectDashboard/>
          },
          {
            path: ":groupId/projects/:projectId/update", element: <UpdateProject/>
          },
          {
            path: ":groupId/projects/:projectId/requests",
            element: <ProjectJoinRequests/>
          },
          {
            path: ":groupId/projects/:projectId/tasks", element: <Tasks/>
          },
          {
            path: ":groupId/projects/:projectId/tasks/create", element: <AddTask/>
          },
          {
            path: ":groupId/projects/:projectId/tasks/:taskId",
            element: <TaskDashboard/>
          },
          {
            path: ":groupId/projects/:projectId/tasks/:taskId/update",
            element: <UpdateTask/>
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
