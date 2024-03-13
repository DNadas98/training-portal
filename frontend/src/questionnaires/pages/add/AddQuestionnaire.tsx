import {useAuthJsonFetch} from "../../../common/api/service/apiService.ts";
import {
  useNotification
} from "../../../common/notification/context/NotificationProvider.tsx";
import {FormEvent, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import usePermissions from "../../../authentication/hooks/usePermissions.ts";
import {
  PermissionType
} from "../../../authentication/dto/applicationUser/PermissionType.ts";
import {QuestionnaireCreateRequestDto} from "../../dto/QuestionnaireCreateRequestDto.ts";
import {
  QuestionnaireResponseEditorDto
} from "../../dto/QuestionnaireResponseEditorDto.ts";
import {QuestionType} from "../../dto/QuestionType.ts";
import {QuestionCreateRequestDto} from "../../dto/QuestionCreateRequestDto.ts";

function getEmptQuestion(): QuestionCreateRequestDto {
  return {
    text: "",
    type: QuestionType.RADIO,
    order: 1,
    points: 1,
    answers: [{text: "", correct: false, order: 1}]
  }
}

export default function AddQuestionnaire() {
  const {loading: permissionsLoading, projectPermissions} = usePermissions();
  const groupId = useParams()?.groupId;
  const projectId = useParams()?.projectId;
  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const [name, setName] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [questions, setQuestions] = useState<QuestionCreateRequestDto[]>([getEmptQuestion()]);

  /**
   * Handles the change of a question field in the questionnaire.<br/>
   * If question type is switched to radio button, keep the first correct answer and
   set all other answers to incorrect (only one correct allowed)<br/>
   * @param {number} index - The index of the question in the questionnaire.
   * @param {string} field - The field of the question to be changed.
   * @param {any} value - The new value for the field.
   * @returns {void}
   */
  const handleQuestionChange = (index: number, field, value) => {
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
    } else if (field === "answers") {
      newQuestions[index].answers = value;
    } else {
      newQuestions[index][field] = value;
    }
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, {...getEmptQuestion(), order: questions.length + 1}]);
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

  const handleAnswerChange = (questionIndex: number, answerIndex: number, field, value) => {
    const newQuestions = [...questions];
    const answers = newQuestions[questionIndex].answers.map((answer, i) => {
      if (field === "correct" && value === true && newQuestions[questionIndex].type === QuestionType.RADIO) {
        return i === answerIndex ? {...answer, correct: true} : {
          ...answer, correct: false
        };
      } else {
        return i === answerIndex ? {...answer, [field]: value} : answer;
      }
    });
    newQuestions[questionIndex].answers = answers;
    setQuestions(newQuestions);
  };

  const removeAnswer = (questionIndex: number, answerIndex: number) => {
    const newQuestions = [...questions];
    const answers = newQuestions[questionIndex].answers.filter((_, i) => i !== answerIndex)
      .map((a, i) => ({...a, order: i + 1}));
    newQuestions[questionIndex].answers = answers;
    setQuestions(newQuestions);
  };

  const addQuestionnaire = async (requestDto: QuestionnaireCreateRequestDto) => {
    return await authJsonFetch({
      path: `groups/${groupId}/projects/${projectId}/questionnaires`,
      method: "POST",
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
      if (!name || !description || !questions?.length) {
        return;
      }
      const questionnaire: QuestionnaireCreateRequestDto = {
        name, description, questions
      };
      const response = await addQuestionnaire(questionnaire);
      if (!response || response.error || response?.status > 399 || !response.data) {
        handleError(response?.error ?? response?.message
          ?? "An unknown error has occurred, please try again later");
        return;
      }
      const addedQuestionnaire = response.data as QuestionnaireResponseEditorDto;
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center",
        message: `Questionnaire ${addedQuestionnaire.name} has been added successfully!`
      });
      navigate(`/groups/${groupId}/projects/${projectId}/questionnaires`);
    } catch (e) {
      handleError("An unknown error has occurred, please try again later!");
    } finally {
      setLoading(false);
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
    <form onSubmit={handleSubmit}>
      <h1>Add new questionnaire</h1>
      <div>
        <label>Questionnaire Name</label><br/>
        <input type="text"
               required
               minLength={1}
               maxLength={50}
               value={name}
               onChange={(e) => setName(e.target.value)}/>
      </div>
      <div>
        <label>Description</label><br/>
        <textarea
          required
          minLength={1}
          maxLength={500}
          cols={100}
          rows={10}
          value={description}
          onChange={(e) => setDescription(e.target.value)}/>
      </div>
      <h2>Questions</h2>
      {questions.map((question, qIndex) => (
        <div key={qIndex}>
          <label><big>{question.order}.</big></label>{" "}
          <input
            type="text"
            required
            minLength={1}
            maxLength={100}
            placeholder="Question Text"
            value={question.text}
            onChange={(e) => handleQuestionChange(qIndex, "text", e.target.value)}
          />
          {" "}<label>Question type:</label>{" "}
          <select
            value={question.type}
            required
            onChange={(e) => handleQuestionChange(qIndex, "type", e.target.value)}
          >
            <option value={QuestionType.RADIO}>Radio</option>
            <option value={QuestionType.CHECKBOX}>Checkbox</option>
          </select>
          {" "}<label>Points:</label>{" "}
          <input
            type="number"
            required
            min={1}
            max={1000}
            step={1}
            value={question.points}
            onChange={(e) => handleQuestionChange(qIndex, "points", e.target.value)}
          />
          {" "}
          <button type="button" onClick={() => removeQuestion(qIndex)}>Remove Question
          </button>
          <h3>Answers</h3>
          {question.answers.map((answer, aIndex) => (
            <div key={aIndex}>
              <span>{answer.order}. </span>
              <input
                type="text"
                required
                minLength={1}
                maxLength={100}
                placeholder="Answer Text"
                value={answer.text}
                onChange={(e) => handleAnswerChange(qIndex, aIndex, "text", e.target.value)}
              />
              <span> Correct: </span>
              <input
                type={question.type === QuestionType.RADIO ? "radio" : "checkbox"}
                checked={answer.correct}
                onChange={(e) => handleAnswerChange(qIndex, aIndex, "correct", e.target.checked)}
              />
              {" "}
              <button type="button" onClick={() => removeAnswer(qIndex, aIndex)}>
                Remove Answer
              </button>
            </div>
          ))}
          <br/>
          <button type="button" onClick={() => addAnswer(qIndex)}>Add Answer</button>
          <br/><br/>
        </div>
      ))}
      <br/>
      <button type="button" onClick={addQuestion}>Add Question</button>
      <br/>
      <br/>
      <button type="submit">Submit Questionnaire</button>{"  "}
      <button type="button" onClick={() => {
        navigate(`/groups/${groupId}/projects/${projectId}/questionnaires`);
      }}>
        Back
      </button>
    </form>
  );
}
