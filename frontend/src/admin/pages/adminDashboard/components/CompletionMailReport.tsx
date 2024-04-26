import {Accordion, AccordionDetails, AccordionSummary, Grid, Typography} from "@mui/material";
import ExpandIcon from "../../../../common/utils/components/ExpandIcon.tsx";
import {CompletionMailReportDto} from "../../../dto/CompletionMailReportDto.ts";

export default function CompletionMailReport(reportDto: CompletionMailReportDto) {
  return (<Grid container spacing={2}>
    <Grid item xs={12}>
      <Typography>Total users: {reportDto.totalUsers}</Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography>Successful: {reportDto.successful.length}</Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography>Failed to process: {Object.keys(reportDto.failed).length}</Typography>
    </Grid>
    <Grid item xs={12}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandIcon/>} sx={{minHeight: "fit-content"}}>
          <Typography>Detailed report</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <pre><code>{JSON.stringify(reportDto, null, 2)}</code></pre>
        </AccordionDetails>
      </Accordion>
    </Grid>
  </Grid>)
}
