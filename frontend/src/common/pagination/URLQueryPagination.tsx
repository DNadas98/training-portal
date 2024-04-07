import {useLocation, useNavigate} from "react-router-dom";
import {Box, FormControl, InputLabel, MenuItem, Pagination, Select} from "@mui/material";
import {useEffect} from "react";

interface URLQueryPaginationProps {
  onSizeChange?: (page: number, newSize: number) => void;
  totalPages: number;
  defaultPage?: number;
  onPageChange?: (newPage: number) => void;
}

export default function URLQueryPagination(props: URLQueryPaginationProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const size = parseInt(searchParams.get('size') || '10', 10);

  useEffect(() => {
    searchParams.set('page', !isNaN(page) ? page.toString() : "1");
    searchParams.set("size", !isNaN(size) ? size.toString() : "10");
    navigate(`?${searchParams.toString()}`, {replace: true});
  }, [page, size]);

  const changePage = (_event, value) => {
    searchParams.set('page', value);
    navigate(`?${searchParams.toString()}`);
    if (props.onPageChange) {
      props.onPageChange(value);
    }
  };

  const changeSize = (newSize) => {
    searchParams.set('size', newSize);
    searchParams.set('page', "1");
    navigate(`?${searchParams.toString()}`, {replace: true});
    if (props.onSizeChange) {
      props.onSizeChange(1, newSize);
    }
  };

  return (
    <Box display="flex" justifyContent="left" alignItems="baseline" gap={2}>
      <Pagination disabled={!props.totalPages || props.totalPages < 2}
                  variant={"text"} shape={"rounded"}
                  count={props.totalPages ?? 1}
                  page={page} onChange={changePage}/>
      <FormControl size="small">
        <InputLabel sx={{minWidth: "fit-content"}}>Size</InputLabel>
        <Select disabled={!size} value={size} label="Size" onChange={e => {
          changeSize(e.target.value);
        }}>
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
