import {  CardContent,  Divider,  Grid,  Stack,  Typography} from "@mui/material";
import useLocalizedDateTime from "../../../../../common/localization/hooks/useLocalizedDateTime.tsx";
import {QuestionnaireSubmissionResponseEditorDto} from "../../../../dto/QuestionnaireSubmissionResponseEditorDto.ts";
import IsSmallScreen from "../../../../../common/utils/IsSmallScreen.tsx";
import {QuestionnaireSubmissionResponseDto} from "../../../../dto/QuestionnaireSubmissionResponseDto.ts";

interface QuestionnaireSubmissionCardProps {
  submission: QuestionnaireSubmissionResponseEditorDto | QuestionnaireSubmissionResponseDto;
}

export default function QuestionnaireSubmissionCard(props: QuestionnaireSubmissionCardProps) {
  const getLocalizedDateTime = useLocalizedDateTime();
  const isSmallScreen = IsSmallScreen();
  return <CardContent key={props.submission.id}>
    <Stack spacing={0.5} width={"100%"}>
      <Grid container alignItems={"baseline"} spacing={1} justifyContent={"left"}>
        <Grid item xs={12} sm={"auto"}>
          <Typography variant={"h6"}>
            {props.submission.receivedPoints} / {props.submission.maxPoints} Points
          </Typography>
        </Grid>
        {!isSmallScreen ? <Grid item><Divider variant={"fullWidth"} orientation={"vertical"}/></Grid> : <></>}
        <Grid item xs={12} sm={"auto"}>
          <Typography variant={"body1"} sx={{
            wordBreak: "break-word",
            paddingRight: 1
          }}>
            {getLocalizedDateTime(new Date(props.submission.createdAt))}
          </Typography>
        </Grid>
        {!isSmallScreen ? <Grid item><Divider variant={"fullWidth"} orientation={"vertical"}/></Grid> : <></>}
        {props.submission?.status
          ? <Grid item xs={12} sm={"auto"}>
            <Typography variant={"body1"} sx={{
              wordBreak: "break-word",
              paddingRight: 1
            }}> Submitted Status: {props.submission.status}
            </Typography>
          </Grid>
          : <></>}
      </Grid>
    </Stack>
  </CardContent>;
}
