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
import useLocalized from "../../../../common/localization/hooks/useLocalized.tsx";

interface GroupListProps {
  loading: boolean,
  groups: GroupResponsePublicDto[],
  notFoundText: string,
  onActionButtonClick: (groupId: number) => unknown;
  actionButtonDisabled: boolean;
  userIsMember: boolean;
}

export default function GroupList(props: GroupListProps) {
  const localized = useLocalized();
  return props.loading
    ? <LoadingSpinner/>
    : props.groups?.length > 0
      ? props.groups.map((group, index) => {
        return <Card key={group.groupId}>
          <Accordion defaultExpanded={index === 0}
                     variant={"elevation"}
                     sx={{paddingTop: 0.5, paddingBottom: 0.5}}>
            <AccordionSummary expandIcon={<ExpandIcon/>}>
              {props.userIsMember
                ? <Button component={Link} to={`/groups/${group.groupId}`}>
                  <Stack direction={"row"} alignItems={"center"} spacing={1}>
                    <Typography variant={"h6"} sx={{
                      wordBreak: "break-word",
                      paddingRight: 1,
                      flexGrow: 1
                    }}>
                      {group.name}
                    </Typography>
                    <ForwardIcon/>
                  </Stack>
                </Button>
                : <Typography variant={"h6"} sx={{
                  wordBreak: "break-word",
                  paddingRight: 1,
                  minWidth: "100%",
                  flexGrow: 1
                }}>
                  {group.name}
                </Typography>}
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant={"body2"}>
                {group.description}
              </Typography>
            </AccordionDetails>
            <AccordionActions>
              <Button disabled={props.actionButtonDisabled}
                      onClick={() => {
                        props.onActionButtonClick(group.groupId);
                      }}>
                {props.userIsMember
                  ? localized("pages.groups.browser.view_dashboard")
                  : localized("pages.groups.browser.request_to_join")}
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
