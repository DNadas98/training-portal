import {ChangeEvent, useEffect, useState} from "react";
import {QuestionnaireResponseEditorDto} from "../../../questionnaires/dto/QuestionnaireResponseEditorDto.ts";
import {GroupResponsePublicDto} from "../../../groups/dto/GroupResponsePublicDto.ts";
import {ProjectResponsePublicDto} from "../../../projects/dto/ProjectResponsePublicDto.ts";
import {useNotification} from "../../../common/notification/context/NotificationProvider.tsx";
import {useDialog} from "../../../common/dialog/context/DialogProvider.tsx";
import {useNavigate} from "react-router-dom";
import UserPreRegistrationForm from "./components/UserPreRegistrationForm.tsx";
import useAuthJsonFetch from "../../../common/api/hooks/useAuthJsonFetch.tsx";
import {useAuthentication} from "../../../authentication/hooks/useAuthentication.ts";

//TODO: add backend search filtering, pagination if necessary

export default function UserPreRegistrationPage() {
  const [groupsLoading, setGroupsLoading] = useState<boolean>(true);
  const [groups, setGroups] = useState<GroupResponsePublicDto[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GroupResponsePublicDto | null | undefined>(null);
  const [groupFilterValue, setGroupFilterValue] = useState<string>("");

  const [projectsLoading, setProjectsLoading] = useState<boolean>(false);
  const [projects, setProjects] = useState<ProjectResponsePublicDto[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectResponsePublicDto | null | undefined>(null);
  const [projectFilterValue, setProjectFilterValue] = useState<string>("");

  const [questionnairesLoading, setQuestionnairesLoading] = useState<boolean>(false);
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireResponseEditorDto[]>([]);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<QuestionnaireResponseEditorDto | null | undefined>(null);
  const [questionnaireFilterValue, setQuestionnaireFilterValue] = useState<string>("");

  const [selectedFile, setSelectedFile] = useState<File | undefined | null>(null);
  const MAX_FILE_SIZE = 400000; // 400 KB

  const notification = useNotification();
  const dialog = useDialog();
  const navigate = useNavigate();
  const authJsonFetch = useAuthJsonFetch();
  const authentication = useAuthentication();

  const openErrorNotification = (message: string) => notification.openNotification({
    type: "error", vertical: "top", horizontal: "center", message: message
  });

  const trimAndLowercase = (input: any) => {
    if (!input || !input.toString()) {
      return "";
    }
    return input.toString().trim().toLowerCase();
  }

  const loadAllGroups = async () => {
    const defaultError = "Failed to load groups";
    try {
      setGroupsLoading(true);
      setGroupFilterValue("");
      setSelectedGroup(null);
      const response = await authJsonFetch({
        path: "admin/groups"
      });
      if (!response || !response.data || response.status > 399) {
        openErrorNotification(response?.error ?? defaultError);
        setGroups([]);
        return;
      }
      setGroups(response.data);
    } catch (e) {
      openErrorNotification(defaultError);
      setGroups([]);
    } finally {
      setGroupsLoading(false);
    }
  }

  const handleGroupSearchInputChange = (e: any) => {
    setGroupFilterValue(trimAndLowercase(e.target.value));
  }

  const handleGroupSelect = (_event: ChangeEvent<NonNullable<unknown>>, newValue: GroupResponsePublicDto | null) => {
    setSelectedGroup(newValue);
  };

  useEffect(() => {
    loadAllGroups().then();
  }, []);

  const loadProjects = async () => {
    const defaultError = "Failed to load projects";
    try {
      setProjectsLoading(true);
      setSelectedProject(null);
      setProjectFilterValue("");
      if (!selectedGroup) {
        return;
      }
      const response = await authJsonFetch({
        path: `admin/groups/${selectedGroup.groupId}/projects`
      });
      if (!response || !response.data || response.status > 399) {
        openErrorNotification(response?.error ?? defaultError);
        setProjects([]);
        return;
      }
      setProjects(response.data);
    } catch (e) {
      openErrorNotification(defaultError);
      setProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  }

  const handleProjectSearchInputChange = (e: any) => {
    setProjectFilterValue(trimAndLowercase(e.target.value));
  }

  const handleProjectSelect = (_event: ChangeEvent<NonNullable<unknown>>, newValue: ProjectResponsePublicDto | null) => {
    setSelectedProject(newValue);
  };

  useEffect(() => {
    loadProjects().then();
  }, [selectedGroup]);

  const loadQuestionnaires = async () => {
    const defaultError = "Failed to load questionnaires";
    try {
      setQuestionnairesLoading(true);
      setSelectedQuestionnaire(null);
      setQuestionnaireFilterValue("");
      if (!selectedGroup || !selectedProject) {
        return;
      }
      const response = await authJsonFetch({
        path: `admin/groups/${selectedGroup.groupId}/projects/${selectedProject.projectId}/questionnaires`
      });
      if (!response || !response.data || response.status > 399) {
        openErrorNotification(response?.error ?? defaultError);
        setQuestionnaires([]);
        return;
      }
      setQuestionnaires(response.data);
    } catch (e) {
      openErrorNotification(defaultError);
      setQuestionnaires([]);
    } finally {
      setQuestionnairesLoading(false);
    }
  }

  const handleQuestionnaireSearchInputChange = (e: any) => {
    setQuestionnaireFilterValue(trimAndLowercase(e.target.value));
  }

  const handleQuestionnaireSelect = (_event: ChangeEvent<NonNullable<unknown>>, newValue: QuestionnaireResponseEditorDto | null) => {
    setSelectedQuestionnaire(newValue);
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
        openErrorNotification("The selected file must have .csv extension");
        setSelectedFile(null);
        return;
      }
      if (selectedFile.size > MAX_FILE_SIZE) {
        openErrorNotification("The selected file is too large. Maximum allowed size is 400 KB");
        setSelectedFile(null);
        return;
      }
      setSelectedFile(selectedFile);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const defaultError = "Failed to upload user data";
    if (!selectedFile || !selectedGroup || !selectedProject || !selectedQuestionnaire) {
      openErrorNotification("All fields are required");
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('groupId', selectedGroup.groupId.toString());
    formData.append('projectId', selectedProject.projectId.toString());
    formData.append('questionnaireId', selectedQuestionnaire.id.toString());
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/pre-register/users`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${authentication.getAccessToken()}`,
        },
      }).then(res => res.json());
      if (!response || response.status > 399 || response.message) {
        openErrorNotification(response?.error ?? defaultError);
        return;
      }
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center", message: response.message
      });
      window.location.href = window.location.href;
    } catch (error) {
      openErrorNotification(defaultError);
    }
  }

  const handleBackClick = () => {
    navigate(-1);
  }
  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch("/api/v1/admin/pre-register/users/csv-template", {
        headers: {
          Authorization: `Bearer ${authentication.getAccessToken()}`,
        }
      });
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", "user_pre_registration_template.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (e) {
      openErrorNotification("Failed to download template");
    }
  };

  useEffect(() => {
    loadQuestionnaires().then();
  }, [selectedGroup, selectedProject]);

  if (!authentication.getRoles()?.length) {
    openErrorNotification("Unauthorized");
    navigate(-1);
    return <></>;
  }

  return <UserPreRegistrationForm
    groups={groups}
    groupsLoading={groupsLoading}
    selectedGroup={selectedGroup}
    onGroupSelect={handleGroupSelect}
    onGroupSearchInputChange={handleGroupSearchInputChange}
    projects={projects}
    projectsLoading={projectsLoading}
    selectedProject={selectedProject}
    onProjectSelect={handleProjectSelect}
    onProjectSearchInputChange={handleProjectSearchInputChange}
    questionnaires={questionnaires}
    questionnairesLoading={questionnairesLoading}
    selectedQuestionnaire={selectedQuestionnaire}
    onQuestionnaireSelect={handleQuestionnaireSelect}
    onQuestionnaireSearchInputChange={handleQuestionnaireSearchInputChange}
    selectedFile={selectedFile}
    onFileSelect={handleFileSelect}
    onSubmit={handleSubmit}
    onBackClick={handleBackClick}
    onDownloadTemplate={handleDownloadTemplate}/>;
}
