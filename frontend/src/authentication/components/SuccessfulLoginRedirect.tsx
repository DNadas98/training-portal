import LoadingSpinner from "../../common/utils/components/LoadingSpinner.tsx";
import {useNavigate} from "react-router-dom";
import useAuthJsonFetch from "../../common/api/hooks/useAuthJsonFetch.tsx";
import {useEffect} from "react";
import {PermissionType} from "../dto/PermissionType.ts";
import {useAuthentication} from "../hooks/useAuthentication.ts";
import {GlobalRole} from "../dto/userInfo/GlobalRole.ts";

interface SuccessfulLoginRedirectProps {
  groupId: number | null;
  projectId: number | null;
  questionnaireId: number | null;
}

export default function SuccessfulLoginRedirect(props: SuccessfulLoginRedirectProps) {
  const navigate = useNavigate();
  const authentication = useAuthentication();
  const authJsonFetch = useAuthJsonFetch();

  useEffect(() => {
    async function loadProjectPermissions() {
      try {
        const response = await authJsonFetch({path: `user/permissions/groups/${props.groupId}/projects/${props.projectId}`});
        if (!response || !response?.data || response?.error || response?.status > 399) {
          return [];
        }
        return response.data as PermissionType[];
      } catch (e) {
        return [];
      }
    }

    if (authentication.getRoles()?.includes(GlobalRole.ADMIN)) {
      navigate("/admin");
      return;
    }
    if (!props.groupId || !props.projectId || !props.questionnaireId) {
      navigate("/groups");
      return;
    }
    loadProjectPermissions().then(permissions => {
      if (permissions.includes(PermissionType.PROJECT_ADMIN)) {
        navigate(`/groups/${props.groupId}/projects/${props.projectId}`);
      } else if (permissions.includes(PermissionType.PROJECT_COORDINATOR)) {
        navigate(`/groups/${props.groupId}/projects/${props.projectId}/coordinator/questionnaires`);
      } else if (permissions.includes(PermissionType.PROJECT_EDITOR)) {
        navigate(`/groups/${props.groupId}/projects/${props.projectId}/editor/questionnaires`);
      } else if (permissions.includes(PermissionType.PROJECT_ASSIGNED_MEMBER)) {
        navigate(`/groups/${props.groupId}/projects/${props.projectId}`);
      } else navigate("/groups");
    })
  }, [authentication, props]);

  return <LoadingSpinner/>;
}
