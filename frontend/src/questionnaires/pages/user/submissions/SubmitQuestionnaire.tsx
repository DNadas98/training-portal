import usePermissions from "../../../../authentication/hooks/usePermissions.ts";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useNotification} from "../../../../common/notification/context/NotificationProvider.tsx";
import {isValidId} from "../../../../common/utils/isValidId.ts";
import {QuestionnaireResponseDetailsDto} from "../../../dto/QuestionnaireResponseDetailsDto.ts";
import LoadingSpinner from "../../../../common/utils/components/LoadingSpinner.tsx";
import {Box, Button, Card, CardActions, CardContent, Checkbox, Grid, Radio, Stack, Typography} from "@mui/material";
import {useDialog} from "../../../../common/dialog/context/DialogProvider.tsx";
import {QuestionType} from "../../../dto/QuestionType.ts";
import {QuestionnaireSubmissionRequestDto} from "../../../dto/QuestionnaireSubmissionRequestDto.ts";
import {PermissionType} from "../../../../authentication/dto/PermissionType.ts";
import useAuthJsonFetch from "../../../../common/api/hooks/useAuthJsonFetch.tsx";
import RichTextDisplay from "../../../../common/richTextEditor/RichTextDisplay.tsx";
import useLocalizedDateTime from "../../../../common/localization/hooks/useLocalizedDateTime.tsx";

export default function SubmitQuestionnaire() {
  const {loading: permissionsLoading, projectPermissions} = usePermissions();
  const [loading, setLoading] = useState<boolean>(true);
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireResponseDetailsDto | undefined>(undefined);
  const [questionnaireError, setQuestionnaireError] = useState<string | undefined>(undefined);
  const authJsonFetch = useAuthJsonFetch();
  const navigate = useNavigate();
  const notification = useNotification();
  const dialog = useDialog();

  const groupId = useParams()?.groupId;
  const projectId = useParams()?.projectId;
  const questionnaireId = useParams()?.questionnaireId;

  const getLocalizedDateTime = useLocalizedDateTime();

  const [formData, setFormData] = useState<QuestionnaireSubmissionRequestDto>({
    questionnaireId: questionnaireId as string,
    questions: []
  });

  const LOCAL_STORAGE_KEY = `questionnaireSubmission`;

  const parseLocalStorageData = (key) => {
    const savedData = localStorage.getItem(key);
    if (savedData?.length) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        return undefined;
      }
    }
    return undefined;
  };

  const loadQuestionnaire = async () => {
    try {
      if (!isValidId(groupId) || !isValidId(projectId) || !isValidId(questionnaireId)) {
        setQuestionnaire(undefined);
        setQuestionnaireError("Questionnaire with the provided details was not found");
        return;
      }
      const path = projectPermissions.includes(PermissionType.PROJECT_EDITOR)
        ? `groups/${groupId}/projects/${projectId}/editor/questionnaires/${questionnaireId}`
        : `groups/${groupId}/projects/${projectId}/questionnaires/${questionnaireId}`;

      const response = await authJsonFetch({path});
      if (!response?.status || response.status > 399 || !response?.data) {
        setQuestionnaire(undefined);
        setQuestionnaireError(response?.error ?? "Failed to load questionnaire");
        return;
      }
      const fetchedQuestionnaire = response.data as QuestionnaireResponseDetailsDto;
      setQuestionnaire(fetchedQuestionnaire);

      const parsedData: (QuestionnaireSubmissionRequestDto & {
        updatedAt: string
      }) | undefined = parseLocalStorageData(LOCAL_STORAGE_KEY);
      const serverUpdateTime = new Date(fetchedQuestionnaire.updatedAt);
      if (parsedData && parsedData?.questionnaireId.toString() === fetchedQuestionnaire.id.toString() && parsedData.updatedAt
        && new Date(parsedData.updatedAt) > serverUpdateTime) {
        setFormData(parsedData);
        const storeUpdateTimeString = getLocalizedDateTime(new Date(parsedData.updatedAt));
        if (parsedData.questions.some(question => question.checkedAnswers.length > 0)) {
          notification.openNotification({
            type: "info", vertical: "top", horizontal: "center",
            message: `Questionnaire submission restored: ${storeUpdateTimeString}`
          });
        }
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setFormData({
          questionnaireId: response.data.id,
          questions: response.data.questions.map(question => ({
            questionId: question.id,
            checkedAnswers: []
          }))
        });
      }
      setQuestionnaireError(undefined);
    } catch (e) {
      setQuestionnaire(undefined);
      setQuestionnaireError("Failed to load questionnaire");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData && formData.questions.length) {
      const dataToSave = JSON.stringify({
        ...formData, updatedAt: new Date().toISOString()
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, dataToSave);
    }
  }, [formData, questionnaireId]);

  useEffect(() => {
    if (!permissionsLoading) {
      loadQuestionnaire().then();
    }
  }, [groupId, projectId, questionnaireId, permissionsLoading]);

  const handleCheckboxChange = (questionIndex, answerId, isChecked) => {
    const updatedFormData = {...formData};
    updatedFormData.questions[questionIndex].checkedAnswers = isChecked
      ? [...updatedFormData.questions[questionIndex].checkedAnswers, {answerId}]
      : updatedFormData.questions[questionIndex].checkedAnswers.filter(a => a.answerId !== answerId);
    setFormData(updatedFormData);
  };

  const handleRadioChange = (questionIndex, answerId) => {
    const updatedFormData = {...formData};
    updatedFormData.questions[questionIndex].checkedAnswers = [{answerId}];
    setFormData(updatedFormData);
  };

  async function submitQuestionnaire(event) {
    event.preventDefault();
    const defaultError = "Failed to submit questionnaire, please try again later! If the issue still persist, please contact the administrators!";
    try {
      setLoading(true);
      if (formData.questions.some((question) => {
        return questionnaire?.questions.filter(q => q.id === question.questionId)[0]?.type === QuestionType.RADIO
          && !question.checkedAnswers.length;
      })) {
        notification.openNotification({
          type: "error", vertical: "top", horizontal: "center",
          message: "Please ensure all questions with radio options are answered before proceeding."
        });
        return;
      }

      const response = await authJsonFetch({
        path: `groups/${groupId}/projects/${projectId}/questionnaires/${questionnaireId}/submissions`,
        method: "POST", body: formData
      });
      if (!response?.status || response.status > 399 || !response?.message) {
        setQuestionnaire(undefined);
        notification.openNotification({
          type: "error", vertical: "top", horizontal: "center", message: response?.error ?? defaultError
        });
        return;
      }

      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center", message: response.message
      });
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      navigateBack();
    } catch (e) {
      notification.openNotification({
        type: "error", vertical: "top", horizontal: "center", message: defaultError
      })
    } finally {
      setLoading(false);
    }
  }

  function handleExitClick() {
    dialog.openDialog({
      content: "Are you sure you would like to exit without completing the questionnaire? You will have to start again next time.",
      confirmText: "Yes, exit without saving",
      cancelText: "No, continue the questionnaire",
      onConfirm: () => {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        navigateBack();
      }
    });
  }

  function navigateBack() {
    if (window.location.pathname.includes("editor")) {
      return navigate(`/groups/${groupId}/projects/${projectId}/editor/questionnaires`);
    }
    return navigate(`/groups/${groupId}/projects/${projectId}/questionnaires`);
  }

  if (loading || permissionsLoading) {
    return <LoadingSpinner/>;
  } else if (!projectPermissions.length) {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: "Access Denied: Insufficient permissions"
    });
    navigate(`/groups/${groupId}/projects/${projectId}`);
    return <></>;
  } else if (!questionnaire) {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: questionnaireError ?? "Failed to load questionnaire"
    });
    navigate(`/groups/${groupId}/projects/${projectId}`);
    return <></>;
  }

  return (<Grid container justifyContent={"center"} alignItems={"center"} spacing={2}>
    <Grid item xs={10}>
      <Card sx={{marginBottom: 2}}>
        <CardContent>
          <Grid container alignItems={"center"} justifyContent={"space-between"} mb={2}>
            <Grid item xs={12} md={true}>
              <Typography variant={"h5"} sx={{
                wordBreak: "break-word",
                paddingRight: 1
              }}>
                {questionnaire.name}
              </Typography>
            </Grid>
            <Grid item xs={12} md={"auto"}>
              <Typography variant={"body1"} sx={{
                wordBreak: "break-word",
                paddingRight: 1
              }}>
                Max Points: {questionnaire.maxPoints}
              </Typography>
            </Grid>
          </Grid>
          <RichTextDisplay content={questionnaire.description}/>
        </CardContent>
      </Card>
      <Box component={"form"} onSubmit={submitQuestionnaire}>
        <Stack spacing={2}>
          {questionnaire.questions.map((question, questionIndex) => {
            return (
              <Card key={question.id}>
                <CardContent>
                  <Stack direction={"row"} spacing={1} alignItems={"baseline"}>
                    <Typography>{question.order}.</Typography>
                    <RichTextDisplay content={question.text}/>
                  </Stack>
                  <Typography variant={"body2"} gutterBottom>Max
                    points: {question.points}</Typography>
                  {question.answers.map(answer => {
                    return <Grid container key={answer.id} spacing={1}
                                 justifyContent={"center"} alignItems={"baseline"}>
                      <Grid item>
                        {question.type === QuestionType.CHECKBOX ? (
                          <Checkbox
                            checked={formData.questions[questionIndex].checkedAnswers.some(a => a.answerId === answer.id)}
                            onChange={(event) => handleCheckboxChange(questionIndex, answer.id, event.target.checked)}
                          />
                        ) : (
                          <Radio
                            checked={formData.questions[questionIndex].checkedAnswers.some(a => a.answerId === answer.id)}
                            onChange={() => handleRadioChange(questionIndex, answer.id)}
                          />
                        )}
                      </Grid>
                      <Grid item xs={true} textAlign={"left"}>
                        <Stack spacing={0.5} direction={"row"}>
                          <Typography variant={"body1"}>
                            {String.fromCharCode(answer.order + 64)}:
                          </Typography>
                          <Typography variant={"body1"} gutterBottom>{answer.text}</Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  })}
                </CardContent>
              </Card>
            )
          })}
          <Card> <CardActions><Grid container spacing={2}>
            <Grid item xs={12} md={"auto"}>
              <Button sx={{width: "fit-content"}} variant={"contained"} type={"submit"}>
                Submit questionnaire
              </Button>
            </Grid>
            <Grid item xs={12} md={"auto"}>
              <Button sx={{width: "fit-content"}} variant={"outlined"} onClick={handleExitClick}>
                Exit without saving
              </Button>
            </Grid>
          </Grid> </CardActions> </Card>
        </Stack>
      </Box>
    </Grid>
  </Grid>)
}
