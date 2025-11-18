import { Box, Typography, Paper, Grid } from "@mui/material";
import { Poll, HowToVote, TrendingUp } from "@mui/icons-material";

interface ProfileStatsProps {
  pollsCreated?: number;
  totalVotes?: number;
  activePollsCount?: number;
}

export const ProfileStats = ({
  pollsCreated = 0,
  totalVotes = 0,
  activePollsCount = 0,
}: ProfileStatsProps) => {
  const stats = [
    {
      icon: <Poll sx={{ fontSize: 40, color: "primary.main" }} />,
      label: "Polls Created",
      value: pollsCreated,
    },
    {
      icon: <HowToVote sx={{ fontSize: 40, color: "secondary.main" }} />,
      label: "Total Votes",
      value: totalVotes,
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: "success.main" }} />,
      label: "Active Polls",
      value: activePollsCount,
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
        Statistics
      </Typography>
      <Grid container spacing={2}>
        {stats.map((stat) => (
          <Grid size={{ xs: 12, sm: 4 }} key={stat.label}>
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
            >
              <Box sx={{ mb: 1 }}>{stat.icon}</Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
