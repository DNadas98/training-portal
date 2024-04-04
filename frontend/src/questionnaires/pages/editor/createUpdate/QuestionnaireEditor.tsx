import {useNotification} from "../../../../common/notification/context/NotificationProvider.tsx";
import {FormEvent, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import LoadingSpinner from "../../../../common/utils/components/LoadingSpinner.tsx";
import usePermissions from "../../../../authentication/hooks/usePermissions.ts";
import {PermissionType} from "../../../../authentication/dto/PermissionType.ts";
import {QuestionnaireCreateRequestDto} from "../../../dto/QuestionnaireCreateRequestDto.ts";
import {QuestionnaireResponseEditorDetailsDto} from "../../../dto/QuestionnaireResponseEditorDetailsDto.ts";
import {QuestionType} from "../../../dto/QuestionType.ts";
import {QuestionRequestDto} from "../../../dto/QuestionRequestDto.ts";
import QuestionnaireEditorForm from "./components/QuestionnaireEditorForm.tsx";
import {ApiResponseDto} from "../../../../common/api/dto/ApiResponseDto.ts";
import {useDialog} from "../../../../common/dialog/context/DialogProvider.tsx";
import {QuestionnaireStatus} from "../../../dto/QuestionnaireStatus.ts";
import {QuestionnaireUpdateRequestDto} from "../../../dto/QuestionnaireUpdateRequestDto.ts";
import {isValidId} from "../../../../common/utils/isValidId.ts";
import useAuthJsonFetch from "../../../../common/api/hooks/useAuthJsonFetch.tsx";
import {v4 as uuidv4} from 'uuid';
import {QuestionResponseEditorDto} from "../../../dto/QuestionResponseEditorDto.ts";
import {AnswerResponseEditorDto} from "../../../dto/AnswerResponseEditorDto.ts";
import {AnswerRequestDto} from "../../../dto/AnswerRequestDto.ts";

export default function QuestionnaireEditor() {
  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();
  const dialog = useDialog();

  const {loading: permissionsLoading, projectPermissions} = usePermissions();
  const groupId = useParams()?.groupId;
  const projectId = useParams()?.projectId;
  const questionnaireId = useParams()?.questionnaireId;
  const isUpdatePage = !!isValidId(questionnaireId);

  const [loading, setLoading] = useState<boolean>(isUpdatePage);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(true);
  const [name, setName] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<QuestionnaireStatus>(QuestionnaireStatus.INACTIVE);

  const [questions, setQuestions] = useState<QuestionRequestDto[]>([getNewQuestion()]);

  const handleUpdateQuestions = (updatedQuestions: QuestionRequestDto[]) => {
    setQuestions(updatedQuestions);
  }

  async function loadQuestionnaire() {
    try {
      const response = await authJsonFetch({
        path: `groups/${groupId}/projects/${projectId}/editor/questionnaires/${questionnaireId}`
      });
      if (!response?.status || response.status > 399 || !response?.data) {
        handleError(response?.error ?? response?.message ?? "Failed to load questionnaire");
        navigate(`/groups/${groupId}/projects/${projectId}/editor/questionnaires`);
        return;
      }
      const questionnaire = response.data as QuestionnaireResponseEditorDetailsDto;
      setName(questionnaire.name);
      setDescription(questionnaire.description);
      setStatus(questionnaire.status);
      setQuestions(questionnaire.questions?.length
        ? questionnaire.questions.map(question => toQuestionRequestDto(question))
        : [getNewQuestion()]);
    } catch (e) {
      handleError("Failed to load questionnaire");
      navigate(`/groups/${groupId}/projects/${projectId}/editor/questionnaires`);
    } finally {
      setLoading(false);
      setHasUnsavedChanges(false);
    }
  }

  useEffect(() => {
    if (!isValidId(groupId) || !isValidId(projectId)) {
      handleError("Invalid group or project identifier");
      navigate("/groups");
      return;
    }
    if (isUpdatePage) {
      loadQuestionnaire().then();
    }
  }, [isUpdatePage, groupId, projectId, questionnaireId]);


  const addQuestionnaire = async (requestDto: QuestionnaireCreateRequestDto) => {
    return await authJsonFetch({
      path: `groups/${groupId}/projects/${projectId}/editor/questionnaires`,
      method: "POST",
      body: requestDto
    });
  };

  const updateQuestionnaire = async (requestDto: QuestionnaireUpdateRequestDto) => {
    return await authJsonFetch({
      path: `groups/${groupId}/projects/${projectId}/editor/questionnaires/${questionnaireId}`,
      method: "PUT",
      body: requestDto
    });
  };

  const handleError = (error: string) => {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center", message: error
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setLoading(true);
      if (!name || !description || (questionnaireId && !status) || !questions?.length) {
        handleError("The received questionnaire is invalid.");
        return;
      }
      if (description.length > 3000) {
        handleError("Please provide a shorter description");
        return;
      }

      let response: ApiResponseDto | void;
      if (!isUpdatePage) {
        response = await addQuestionnaire({
          name, description, questions
        });
      } else {
        response = await updateQuestionnaire({
          name, description, status: status, questions
        });
      }

      if (!response || response.error || response?.status > 399 || !response.data) {
        handleError(response?.error ?? response?.message
          ?? "An unknown error has occurred, please try again later");
        return;
      }
      const questionnaireResponse = response.data as QuestionnaireResponseEditorDetailsDto;
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center",
        message: `Questionnaire ${questionnaireResponse.name} has been saved successfully!`
      });
      setHasUnsavedChanges(false);
      if (!isUpdatePage) {
        navigate(`/groups/${groupId}/projects/${projectId}/editor/questionnaires`);
      }
    } catch (e) {
      handleError("An unknown error has occurred, please try again later!");
    } finally {
      setLoading(false);
    }
  };

  const navigateBack = () => navigate(`/groups/${groupId}/projects/${projectId}/editor/questionnaires`);

  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      dialog.openDialog({
        text: "Are you sure, you would like to leave the questionnaire editor without saving?",
        confirmText: "Yes, go back",
        cancelText: "No, stay here",
        onConfirm: () => navigateBack()
      });
    } else {
      navigateBack();
    }
  };

  if (loading || permissionsLoading) {
    return <LoadingSpinner/>;
  } else if (!projectPermissions?.includes(PermissionType.PROJECT_EDITOR)) {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: "Access Denied: Insufficient permissions"
    });
    navigate(`/groups`, {replace: true});
    return <></>;
  }
  return (
    <QuestionnaireEditorForm isUpdatePage={isUpdatePage}
                             name={name}
                             setName={setName}
                             description={description}
                             setDescription={setDescription}
                             status={(status)}
                             setStatus={setStatus}
                             questions={questions}
                             handleSubmit={handleSubmit}
                             handleBackClick={handleBackClick}
                             onUpdateQuestions={handleUpdateQuestions}/>
  );
}


function getNewAnswer(): AnswerRequestDto {
  return {
    tempId: uuidv4(),
    text: '',
    correct: false,
    order: 1
  }
}

function getNewQuestion(): QuestionRequestDto {
  return {
    tempId: uuidv4(),
    text: '',
    type: QuestionType.RADIO,
    points: 1,
    order: 1,
    answers: [getNewAnswer()]
  }
}

function toQuestionRequestDto(responseDto: QuestionResponseEditorDto): QuestionRequestDto {
  const answerRequestDtos: AnswerRequestDto[] = responseDto.answers
    /*.sort((a, b) => a.order - b.order)*/
    .map(answer => toAnswerRequestDto(answer));
  return {
    tempId: uuidv4(),
    order: responseDto.order,
    text: responseDto.text,
    type: responseDto.type,
    points: responseDto.points,
    answers: answerRequestDtos.length ? answerRequestDtos : [getNewAnswer()]
  };
}

function toAnswerRequestDto(responseDto: AnswerResponseEditorDto): AnswerRequestDto {
  return {tempId: uuidv4(), order: responseDto.order, text: responseDto.text, correct: responseDto.correct}
}
