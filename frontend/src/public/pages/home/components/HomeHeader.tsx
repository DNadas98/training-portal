import {Avatar, Stack, Typography, useTheme} from "@mui/material";
import siteConfig from "../../../../common/config/siteConfig.ts";

export default function HomeHeader(props: { justify?: string, align?: string }) {
  const theme = useTheme();
  const siteName = siteConfig.siteName;
  return <Stack spacing={2} alignItems={props.align ?? "center"} justifyContent={props.justify ?? "center"}>
    <Avatar variant={"rounded"} src={"/logo.png"} sx={{
      height: 120, width: 120, objectFit: "contain",
      filter: `drop-shadow(0 0 0.3em ${theme?.palette?.primary?.main})`
    }}/>
    <Typography variant="h4" gutterBottom>
      {siteName}
    </Typography>
  </Stack>
}
