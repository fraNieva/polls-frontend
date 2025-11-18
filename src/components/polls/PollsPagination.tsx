import { Box, Pagination } from "@mui/material";
import type { PaginationMeta } from "../types/poll";

interface PollsPaginationProps {
  pagination: PaginationMeta | null;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}

/**
 * Pagination component for navigating through polls
 * Only shows when there are multiple pages
 */
export const PollsPagination = ({
  pagination,
  onPageChange,
}: PollsPaginationProps) => {
  if (!pagination || pagination.pages <= 1) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Pagination
        count={pagination.pages}
        page={pagination.page}
        onChange={onPageChange}
        color="primary"
        size="large"
        showFirstButton
        showLastButton
      />
    </Box>
  );
};
