import LoadingSpinner from "../../../../common/utils/components/LoadingSpinner.tsx";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardContent,
  Stack,
  Typography
} from "@mui/material";
import ExpandIcon from "../../../../common/utils/components/ExpandIcon.tsx";
import useLocalizedDateTime from "../../../../common/localization/hooks/useLocalizedDateTime.tsx";
import {ProjectResponsePublicDto} from "../../../dto/ProjectResponsePublicDto.ts";
import ForwardIcon from "../../../../common/utils/components/ForwardIcon.tsx";

interface ProjectListProps {
  loading: boolean,
  projects: ProjectResponsePublicDto[],
  notFoundText: string,
  onActionButtonClick: (projectId: number) => unknown;
  actionButtonDisabled: boolean;
  userIsMember: boolean;
}

export default function ProjectList(props: ProjectListProps) {
  const getLocalizedDateTime = useLocalizedDateTime();
  return props.loading
    ? <LoadingSpinner/>
    : props.projects?.length > 0
      ? props.projects.map((project) => {
        return <Card key={project.projectId}>
          <Accordion defaultExpanded={false}
                     variant={"elevation"}
                     sx={{paddingTop: 0.5, paddingBottom: 0.5}}>
            <AccordionSummary expandIcon={<ExpandIcon/>}>
              <Stack spacing={2}>
                {props.userIsMember
                  ? <Button onClick={() => {
                    props.onActionButtonClick(project.projectId);
                  }} sx={{textTransform: "none", width: "fit-content"}}>
                    <Stack direction={"row"} alignItems={"center"} spacing={1}>
                      <ForwardIcon/>
                      <Typography variant={"h6"} sx={{
                        wordBreak: "break-word",
                        paddingRight: 1,
                        minWidth: "100%",
                        flexGrow: 1
                      }}>
                        {project.name}
                      </Typography>
                    </Stack>
                  </Button>
                  : <Typography variant={"h6"} sx={{
                    wordBreak: "break-word",
                    paddingRight: 1,
                    minWidth: "100%",
                    flexGrow: 1
                  }}>
                    {project.name}
                  </Typography>}
                <Typography variant={"body2"} sx={{
                  wordBreak: "break-word",
                  paddingRight: 1
                }}>
                  {getLocalizedDateTime(project.startDate)} - {getLocalizedDateTime(project.deadline)}
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant={"body2"}>
                {project.description}
              </Typography>
            </AccordionDetails>
            <AccordionActions>
              <Button sx={{textTransform: "none"}}
                      disabled={props.actionButtonDisabled}
                      onClick={() => {
                        props.onActionButtonClick(project.projectId);
                      }}>
                {props.userIsMember ? "View Dashboard" : "Request to join"}
              </Button>
            </AccordionActions>
          </Accordion>
        </Card>
      })
      : <Card>
        <CardContent>
          <Typography>
            {props.notFoundText}
          </Typography>
        </CardContent>
      </Card>


}
