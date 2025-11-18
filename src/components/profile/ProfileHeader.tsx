import { Box, Typography, Avatar } from "@mui/material";
import { Person } from "@mui/icons-material";
import type { ReactNode } from "react";

interface ProfileHeaderProps {
  username: string;
  email: string;
  icon?: ReactNode;
}

export const ProfileHeader = ({
  username,
  email,
  icon,
}: ProfileHeaderProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mb: 4,
        pb: 3,
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Avatar
        sx={{
          width: 80,
          height: 80,
          mb: 2,
          bgcolor: "primary.main",
          fontSize: "2rem",
        }}
      >
        {icon || <Person sx={{ fontSize: "2.5rem" }} />}
      </Avatar>
      <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
        {username}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {email}
      </Typography>
    </Box>
  );
};
