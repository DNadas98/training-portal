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
import {GroupResponsePublicDto} from "../../../dto/GroupResponsePublicDto.ts";
import ExpandIcon from "../../../../common/utils/components/ExpandIcon.tsx";
import {Link} from "react-router-dom";
import ForwardIcon from "../../../../common/utils/components/ForwardIcon.tsx";

interface GroupListProps {
  loading: boolean,
  groups: GroupResponsePublicDto[],
  notFoundText: string,
  onActionButtonClick: (groupId: number) => unknown;
  actionButtonDisabled: boolean;
  userIsMember: boolean;
}

export default function GroupList(props: GroupListProps) {

  return props.loading
    ? <LoadingSpinner/>
    : props.groups?.length > 0
      ? props.groups.map((group) => {
        return <Card key={group.groupId}>
          <Accordion defaultExpanded={false}
                     variant={"elevation"}
                     sx={{paddingTop: 0.5, paddingBottom: 0.5}}>
            <AccordionSummary expandIcon={<ExpandIcon/>}>
              <Button component={Link} to={`/groups/${group.groupId}`}
                      sx={{textTransform: "none"}}>
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <ForwardIcon/>
                  <Typography variant={"h6"} sx={{
                    wordBreak: "break-word",
                    paddingRight: 1,
                    minWidth: "100%",
                    flexGrow: 1
                  }}>
                    {group.name}
                  </Typography>
                </Stack>
              </Button>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant={"body2"}>
                {group.description}
              </Typography>
            </AccordionDetails>
            <AccordionActions>
              <Button sx={{textTransform: "none"}}
                      disabled={props.actionButtonDisabled}
                      onClick={() => {
                        props.onActionButtonClick(group.groupId);
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
