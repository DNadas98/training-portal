import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Stack,
  TextField
} from "@mui/material";
import {FormEvent} from "react";
import AddIcon from "../../../../../common/utils/components/AddIcon.tsx";
import QuestionnaireList from "./QuestionnaireList.tsx";
import {QuestionnaireResponseEditorDto} from "../../../../dto/QuestionnaireResponseEditorDto.ts";

interface QuestionnaireBrowserProps {
  questionnairesLoading: boolean;
  questionnaires: QuestionnaireResponseEditorDto[];
  handleQuestionnaireSearch: (event: FormEvent<HTMLInputElement>) => void;
  onAddClick: () => void;
  onEditClick: (questionnaireId: number) => unknown;
  onDeleteClick: (questionnaireId: number) => void;
}

export default function QuestionnaireBrowser(props: QuestionnaireBrowserProps) {
  return (
    <Grid container spacing={2} justifyContent={"center"} alignItems={"top"}>
      <Grid item xs={10} sm={10} md={9} lg={8}>
        <Stack spacing={2}>
          <Card>
            <CardHeader title={"Questionnaires"} sx={{textAlign: "center"}}/>
            <CardContent>
              <Stack direction={"row"} spacing={1} alignItems={"baseline"}>
                <IconButton onClick={props.onAddClick}>
                  <AddIcon/>
                </IconButton>
                <TextField variant={"standard"} type={"search"}
                           label={"Search"}
                           fullWidth
                           onInput={props.handleQuestionnaireSearch}
                />
              </Stack>
            </CardContent>
          </Card>
          <QuestionnaireList loading={props.questionnairesLoading}
                             questionnaires={props.questionnaires}
                             notFoundText={"No questionnaires were found."}
                             onEditClick={props.onEditClick}
                             onDeleteClick={props.onDeleteClick}/>
        </Stack>
      </Grid>
    </Grid>
  );
}
