import {useNotification} from "../../../../common/notification/context/NotificationProvider.tsx";
import {FormEvent, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import LoadingSpinner from "../../../../common/utils/components/LoadingSpinner.tsx";
import usePermissions from "../../../../authentication/hooks/usePermissions.ts";
import {PermissionType} from "../../../../authentication/dto/PermissionType.ts";
import {QuestionnaireCreateRequestDto} from "../../../dto/QuestionnaireCreateRequestDto.ts";
import {QuestionnaireResponseEditorDetailsDto} from "../../../dto/QuestionnaireResponseEditorDetailsDto.ts";
import {QuestionType} from "../../../dto/QuestionType.ts";
import {QuestionCreateRequestDto} from "../../../dto/QuestionCreateRequestDto.ts";
import QuestionnaireEditorForm from "./components/QuestionnaireEditorForm.tsx";
import {ApiResponseDto} from "../../../../common/api/dto/ApiResponseDto.ts";
import {useDialog} from "../../../../common/dialog/context/DialogProvider.tsx";
import {QuestionnaireStatus} from "../../../dto/QuestionnaireStatus.ts";
import {QuestionnaireUpdateRequestDto} from "../../../dto/QuestionnaireUpdateRequestDto.ts";
import {isValidId} from "../../../../common/utils/isValidId.ts";
import useAuthJsonFetch from "../../../../common/api/hooks/useAuthJsonFetch.tsx";

export default function QuestionnaireEditor() {
  const {loading: permissionsLoading, projectPermissions} = usePermissions();
  const groupId = useParams()?.groupId;
  const projectId = useParams()?.projectId;
  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();
  const dialog = useDialog();

  const getEmptyQuestion = (): QuestionCreateRequestDto => {
    return {
      text: "",
      type: QuestionType.RADIO,
      order: 1,
      points: 1,
      answers: [{text: "", correct: false, order: 1}]
    };
  };

  const questionnaireId = useParams()?.questionnaireId;
  const isUpdatePage = !!isValidId(questionnaireId);
  const [loading, setLoading] = useState<boolean>(isUpdatePage);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(true);
  const [name, setName] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<QuestionnaireStatus>(QuestionnaireStatus.INACTIVE);
  const [questions, setQuestions] = useState<QuestionCreateRequestDto[]>([getEmptyQuestion()]);

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
      setQuestions(questionnaire.questions);
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

  const handleQuestionChange = (index: number, field: string, value: any): void => {
    const newQuestions = [...questions];
    if (field === "type" && value === QuestionType.RADIO) {
      let firstCorrectFound = false;
      const answers = newQuestions[index].answers.map((answer) => {
        if (answer.correct && !firstCorrectFound) {
          firstCorrectFound = true;
          return answer;
        } else {
          return {...answer, correct: false};
        }
      });
      newQuestions[index] = {...newQuestions[index], answers, type: value};
    } else if (field.startsWith("answers")) {
      newQuestions[index].answers = value;
    } else {
      newQuestions[index][field] = value;
    }
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, {...getEmptyQuestion(), order: questions.length + 1}]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index).map((q, i) => ({
      ...q, order: i + 1
    }));
    setQuestions(newQuestions);
  };

  const addAnswer = (questionIndex: number) => {
    const newQuestions = [...questions];
    const answers = newQuestions[questionIndex].answers;
    answers.push({text: "", correct: false, order: answers.length + 1});
    newQuestions[questionIndex].answers = answers;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (questionIndex: number, answerIndex: number, field: string, value: any) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers = newQuestions[questionIndex].answers.map((answer, i) => {
      if (field === "correct" && value === true && newQuestions[questionIndex].type === QuestionType.RADIO) {
        return i === answerIndex ? {...answer, correct: true} : {
          ...answer, correct: false
        };
      } else {
        return i === answerIndex ? {...answer, [field]: value} : answer;
      }
    });
    setQuestions(newQuestions);
  };

  const removeAnswer = (questionIndex: number, answerIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers = newQuestions[questionIndex].answers.filter((_, i) => i !== answerIndex)
      .map((a, i) => ({...a, order: i + 1}));
    setQuestions(newQuestions);
  };

  const onDragEnd = (result: any) => {
    try {
      const {source, destination, type} = result;
      if (!destination) {
        return;
      }
      if (type === "questions") {
        handleQuestionDragEnd(source, destination);
        setHasUnsavedChanges(true);
      } else if (type.startsWith("answers")) {
        handleAnswerDragEnd(source, destination);
        setHasUnsavedChanges(true);
      }
      return;
    } catch (e) {
      return;
    }
  };

  const handleQuestionDragEnd = (source: any, destination: any) => {
    const reorderedQuestions = reorder(questions, source.index, destination.index);
    setQuestions(reorderedQuestions.map((item, index) => ({
      ...item,
      order: index + 1
    })));
  };

  const handleAnswerDragEnd = (source: any, destination: any) => {
    const startQuestionIndex = parseInt(source.droppableId.split("-")[1], 10);
    const endQuestionIndex = parseInt(destination.droppableId.split("-")[1], 10);
    if (startQuestionIndex === endQuestionIndex) {
      const newQuestions = Array.from(questions);
      const reorderedAnswers = reorder(
        newQuestions[startQuestionIndex].answers,
        source.index,
        destination.index
      );
      newQuestions[startQuestionIndex].answers = reorderedAnswers.map((item, index) => ({
        ...item,
        order: index + 1
      }));
      setQuestions(newQuestions);
    }
  };

  const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const addQuestionnaire = async (requestDto: QuestionnaireCreateRequestDto) => {
    return await authJsonFetch({
      path: `groups/${groupId}/projects/${projectId}/editor/questionnaires`,
      method: "POST",
      body: requestDto
    });
  };

  const updateQuestionnaire = async (requestDto: QuestionnaireCreateRequestDto) => {
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
      if (!name || !description || !status || !questions?.length) {
        handleError("The received questionnaire is invalid.");
        return;
      }
      const questionnaire: QuestionnaireUpdateRequestDto = {
        name, description, status, questions
      };
      let response: ApiResponseDto | void;
      if (!isUpdatePage) {
        response = await addQuestionnaire(questionnaire);
      } else {
        response = await updateQuestionnaire(questionnaire);
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
                             onDragEnd={onDragEnd}
                             questions={questions}
                             addQuestion={addQuestion}
                             handleQuestionChange={handleQuestionChange}
                             removeQuestion={removeQuestion}
                             addAnswer={addAnswer}
                             handleAnswerChange={handleAnswerChange}
                             removeAnswer={removeAnswer}
                             handleSubmit={handleSubmit}
                             handleBackClick={handleBackClick}
                             setHasUnsavedChanges={setHasUnsavedChanges}
    />
  );
}
