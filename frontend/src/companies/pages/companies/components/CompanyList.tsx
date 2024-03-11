import LoadingSpinner from "../../../../common/utils/components/LoadingSpinner.tsx";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardContent,
  Typography
} from "@mui/material";
import {CompanyResponsePublicDto} from "../../../dto/CompanyResponsePublicDto.ts";
import ExpandIcon from "../../../../common/utils/components/ExpandIcon.tsx";

interface CompanyListProps {
  loading: boolean,
  companies: CompanyResponsePublicDto[],
  notFoundText: string,
  onActionButtonClick: (companyId: number) => unknown;
  actionButtonDisabled: boolean;
  userIsMember: boolean;
}

export default function CompanyList(props: CompanyListProps) {

  return props.loading
    ? <LoadingSpinner/>
    : props.companies?.length > 0
      ? props.companies.map((company) => {
        return <Card key={company.companyId}>
          <Accordion defaultExpanded={false}
                     variant={"elevation"}
                     sx={{paddingTop: 0.5, paddingBottom: 0.5}}>
            <AccordionSummary expandIcon={<ExpandIcon/>}>
              <Typography variant={"h6"} sx={{
                wordBreak: "break-word",
                paddingRight: 1
              }}>
                {company.name}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant={"body2"}>
                {company.description}
              </Typography>
            </AccordionDetails>
            <AccordionActions>
              <Button sx={{textTransform: "none"}}
                      disabled={props.actionButtonDisabled}
                      onClick={() => {
                        props.onActionButtonClick(company.companyId);
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
