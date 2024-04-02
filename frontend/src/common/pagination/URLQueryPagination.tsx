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
    searchParams.set('page', page.toString());
    searchParams.set("size", size.toString());
    navigate(`?${searchParams.toString()}`,{replace:true});
  }, []);

  const changePage = (_event, value) => {
    searchParams.set('page', value);
    navigate(`?${searchParams.toString()}`);
    if (props.onPageChange) {
      props.onPageChange(value);
    }
  };

  const changeSize = (newSize) => {
    searchParams.set('size', newSize);
    navigate(`?${searchParams.toString()}`,{replace:true});
    if (props.onSizeChange) {
      props.onSizeChange(page, newSize);
    }
  };

  return (
    <Box display="flex" justifyContent="left" alignItems="baseline" gap={2}>
      <Pagination disabled={!props.totalPages||props.totalPages<2}
                  variant={"text"} shape={"rounded"}
                  count={props.totalPages??1}
                  page={page} onChange={changePage}/>
      <FormControl size="small">
        <InputLabel>Size</InputLabel>
        <Select disabled={!size} value={size} label="Size" onChange={e => {
          changeSize(e.target.value);
        }}>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
