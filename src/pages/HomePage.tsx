import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Poll, Create, BarChart } from "@mui/icons-material";

export const HomePage = () => {
  return (
    <Box>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Polls App
        </Typography>
        <Typography variant="h5" color="text.secondary" mb={4}>
          Create, share, and participate in polls with real-time results
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/polls"
          sx={{ mr: 2 }}
        >
          Explore Polls
        </Button>
        <Button variant="outlined" size="large" component={Link} to="/register">
          Get Started
        </Button>
      </Box>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={4}
        sx={{ width: "100%" }}
      >
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent sx={{ textAlign: "center", p: 4 }}>
              <Poll sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Vote on Polls
              </Typography>
              <Typography color="text.secondary">
                Participate in public polls and see real-time results
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent sx={{ textAlign: "center", p: 4 }}>
              <Create sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Create Polls
              </Typography>
              <Typography color="text.secondary">
                Design custom polls with multiple options and settings
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent sx={{ textAlign: "center", p: 4 }}>
              <BarChart sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Real-time Results
              </Typography>
              <Typography color="text.secondary">
                Watch results update in real-time as people vote
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
};
