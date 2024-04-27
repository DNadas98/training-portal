import GroupBrowser from "./components/GroupBrowser.tsx";
import {useEffect, useMemo, useState} from "react";
import {GroupResponsePublicDto} from "../../dto/GroupResponsePublicDto.ts";
import {useNotification} from "../../../common/notification/context/NotificationProvider.tsx";
import {useNavigate} from "react-router-dom";
import useAuthJsonFetch from "../../../common/api/hooks/useAuthJsonFetch.tsx";
import {useAuthentication} from "../../../authentication/hooks/useAuthentication.ts";
import {GlobalRole} from "../../../authentication/dto/userInfo/GlobalRole.ts";
import useLocalized from "../../../common/localization/hooks/useLocalized.tsx";

export default function Groups() {
  const [groupsWithUserLoading, setGroupsWithUserLoading] = useState<boolean>(true);
  const [groupsWithUser, setGroupsWithUser] = useState<GroupResponsePublicDto[]>([]);
  const [groupsWithoutUserLoading, setGroupsWithoutUserLoading] = useState<boolean>(true);
  const [groupsWithoutUser, setGroupsWithoutUser] = useState<GroupResponsePublicDto[]>([]);

  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();
  const authentication = useAuthentication();
  const localized = useLocalized();

  async function loadGroupsWithUser() {
    const defaultError = localized("pages.groups.browser.error.load_your_groups_default");
    try {
      const response = await authJsonFetch({
        path: `groups?withUser=true`
      });
      if (!response?.status || response.status > 399 || !response?.data) {
        notification.openNotification({
          type: "error", vertical: "top", horizontal: "center",
          message: `${response?.error ?? defaultError}`
        })
        return;
      }
      setGroupsWithUser(response.data as GroupResponsePublicDto[]);
    } catch (e) {
      setGroupsWithUser([]);
      notification.openNotification({
        type: "error", vertical: "top", horizontal: "center",
        message: `${defaultError}`
      })
    } finally {
      setGroupsWithUserLoading(false);
    }
  }

  async function loadGroupsWithoutUser() {
    const defaultError = localized("pages.groups.browser.error.load_groups_to_join_default");
    try {
      const response = await authJsonFetch({
        path: `groups?withUser=false`
      });
      if (!response?.status || response.status > 399 || !response?.data) {
        notification.openNotification({
          type: "error", vertical: "top", horizontal: "center",
          message: `${response?.error ?? defaultError}`
        })
        return;
      }
      setGroupsWithoutUser(response.data as GroupResponsePublicDto[]);
    } catch (e) {
      setGroupsWithoutUser([]);
      notification.openNotification({
        type: "error", vertical: "top", horizontal: "center",
        message: defaultError
      })
    } finally {
      setGroupsWithoutUserLoading(false);
    }
  }

  useEffect(() => {
    loadGroupsWithUser().then();
    loadGroupsWithoutUser().then();
  }, []);

  const [groupsWithUserFilterValue, setGroupsWithUserFilterValue] = useState<string>("");
  const [groupsWithoutUserFilterValue, setGroupsWithoutUserFilterValue] = useState<string>("");

  const groupsWithUserFiltered = useMemo(() => {
    return groupsWithUser.filter(group => {
        return group.name.toLowerCase().includes(groupsWithUserFilterValue)
      }
    );
  }, [groupsWithUser, groupsWithUserFilterValue]);

  const groupsWithoutUserFiltered = useMemo(() => {
    return groupsWithoutUser.filter(group => {
        return group.name.toLowerCase().includes(groupsWithoutUserFilterValue)
      }
    );
  }, [groupsWithoutUser, groupsWithoutUserFilterValue]);

  const handleGroupsWithUserSearch = (event: any) => {
    setGroupsWithUserFilterValue(event.target.value.toLowerCase().trim());
  };

  const handleGroupsWithoutUserSearch = (event: any) => {
    setGroupsWithoutUserFilterValue(event.target.value.toLowerCase().trim());
  };

  const [actionButtonDisabled, setActionButtonDisabled] = useState(false);

  async function sendGroupJoinRequest(groupId: number) {
    const defaultError=localized("pages.groups.browser.error.send_join_request_default");
    try {
      setActionButtonDisabled(true)
      const response = await authJsonFetch({
        path: `groups/${groupId}/requests`, method: "POST"
      });
      if (!response?.status || response.status > 399 || !response?.data) {
        notification.openNotification({
          type: "error", vertical: "top", horizontal: "center",
          message: `${response?.error ?? defaultError}`
        })
        return;
      }
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center",
        message: localized("pages.groups.browser.send_join_request_success")
      });
      await loadGroupsWithoutUser();
    } catch (e) {
      notification.openNotification({
        type: "error", vertical: "top", horizontal: "center",
        message: defaultError
      })
    } finally {
      setActionButtonDisabled(false);
    }
  }

  const loadGroupDashboard = (groupId: number) => {
    setActionButtonDisabled(true);
    navigate(`/groups/${groupId}`);
    setActionButtonDisabled(false);
  }

  return (
    <GroupBrowser groupsWithUser={groupsWithUserFiltered}
                  groupsWithUserLoading={groupsWithUserLoading}
                  groupsWithoutUser={groupsWithoutUserFiltered}
                  groupsWithoutUserLoading={groupsWithoutUserLoading}
                  handleGroupsWithUserSearch={handleGroupsWithUserSearch}
                  handleGroupsWithoutUserSearch={handleGroupsWithoutUserSearch}
                  handleViewDashboardClick={loadGroupDashboard}
                  handleJoinRequestClick={sendGroupJoinRequest}
                  actionButtonDisabled={actionButtonDisabled}
                  isGlobalAdmin={authentication.getRoles()?.includes(GlobalRole.ADMIN)}/>
  )
}
