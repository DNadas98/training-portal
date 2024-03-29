import {createBrowserRouter} from "react-router-dom";
import Layout from "../../public/layout/Layout.tsx";
import ErrorPage from "../../public/pages/errorPages/ErrorPage.tsx";
import NotFound from "../../public/pages/errorPages/NotFound.tsx";
import RequireAuthentication from "../../authentication/components/RequireAuthentication.tsx";
import {GlobalRole} from "../../authentication/dto/userInfo/GlobalRole.ts";
import UserLayout from "../../user/layout/UserLayout.tsx";
import RegisterVerificationRedirect from "../../authentication/pages/redirect/RegisterVerificationRedirect.tsx";
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
import Questionnaires from "../../questionnaires/pages/editor/questionnaires/Questionnaires.tsx";
import QuestionnaireEditor from "../../questionnaires/pages/editor/createUpdate/QuestionnaireEditor.tsx";
import Home from "../../public/pages/home/Home.tsx";
import Login from "../../authentication/pages/login/Login.tsx";
import Register from "../../authentication/pages/register/Register.tsx";
import Profile from "../../user/pages/profile/Profile.tsx";
import UserJoinRequests from "../../user/pages/requests/UserJoinRequests.tsx";
import Logout from "../../authentication/pages/Logout.tsx";
import UserQuestionnaires from "../../questionnaires/pages/user/questionnaires/UserQuestionnaires.tsx";
import SubmitQuestionnaire from "../../questionnaires/pages/user/submissions/SubmitQuestionnaire.tsx";
import UserQuestionnaireSubmissions from "../../questionnaires/pages/user/submissions/UserQuestionnaireSubmissions.tsx";
import EditorQuestionnaireSubmissions
  from "../../questionnaires/pages/editor/submissions/EditorQuestionnaireSubmissions.tsx";
import EmailChangeVerificationRedirect from "../../authentication/pages/redirect/EmailChangeVerificationRedirect.tsx";
import PasswordReset from "../../authentication/pages/passwordReset/PasswordReset.tsx";
import PasswordResetVerificationRedirect
  from "../../authentication/pages/redirect/PasswordResetVerificationRedirect.tsx";
import ProjectAdminDashboard from "../../projects/pages/adminDashboard/ProjectAdminDashboard.tsx";

const appRouter = createBrowserRouter([
  /* public */
  {
    path: "",
    element: <Layout/>,
    errorElement: <ErrorPage/>,
    children: [
      {path: "", element: <Home/>},
      {path: "login", element: <Login/>},
      {path: "password-reset", element: <PasswordReset/>},
      {path: "register", element: <Register/>},
      {path: "/*", element: <NotFound/>}
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
      },
      {
        path: "email-change", element: <EmailChangeVerificationRedirect/>
      },
      {
        path: "password-reset", element: <PasswordResetVerificationRedirect/>
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
          {path: "", element: <Profile/>},
          {path: "requests", element: <UserJoinRequests/>},
          {path: "logout", element: <Logout/>},
          {path: "*", element: <NotFound/>}
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
            path: ":groupId/projects/:projectId/admin", element: <ProjectAdminDashboard/>
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
            path: ":groupId/projects/:projectId/questionnaires", element: <UserQuestionnaires/>
          },
          {
            path: ":groupId/projects/:projectId/questionnaires/:questionnaireId",
            element: <SubmitQuestionnaire/>,
          },
          {
            path: ":groupId/projects/:projectId/questionnaires/:questionnaireId/submissions",
            element: <UserQuestionnaireSubmissions/>,
          },
          {
            path: ":groupId/projects/:projectId/editor/questionnaires", element: <Questionnaires/>
          },
          {
            path: ":groupId/projects/:projectId/editor/questionnaires/:questionnaireId/tests/new",
            element: <SubmitQuestionnaire/>,
          },
          {
            path: ":groupId/projects/:projectId/editor/questionnaires/:questionnaireId/tests",
            element: <EditorQuestionnaireSubmissions/>,
          },
          {
            path: ":groupId/projects/:projectId/editor/questionnaires/create", element: <QuestionnaireEditor/>,
          },
          {
            path: ":groupId/projects/:projectId/editor/questionnaires/:questionnaireId/update",
            element: <QuestionnaireEditor/>,
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
