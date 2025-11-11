import { Typography, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <Box textAlign="center" py={8}>
      <Typography variant="h2" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" color="text.secondary" mb={4}>
        Page not found
      </Typography>
      <Button variant="contained" component={Link} to="/">
        Go Home
      </Button>
    </Box>
  );
};
