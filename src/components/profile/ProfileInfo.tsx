import { Box, Typography, Stack, Chip } from "@mui/material";
import { CheckCircle, Block } from "@mui/icons-material";
import { format } from "date-fns";

interface ProfileInfoProps {
  fullName: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const ProfileInfo = ({
  fullName,
  isActive,
  createdAt,
  updatedAt,
}: ProfileInfoProps) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        Profile Information
      </Typography>
      <Stack spacing={2}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Full Name
          </Typography>
          <Typography variant="body1">{fullName || "Not provided"}</Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Account Status
          </Typography>
          <Chip
            icon={isActive ? <CheckCircle /> : <Block />}
            label={isActive ? "Active" : "Inactive"}
            color={isActive ? "success" : "error"}
            size="small"
          />
        </Box>

        {createdAt && (
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Member Since
            </Typography>
            <Typography variant="body1">
              {format(new Date(createdAt), "MMMM dd, yyyy")}
            </Typography>
          </Box>
        )}

        {updatedAt && (
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Last Updated
            </Typography>
            <Typography variant="body1">
              {format(new Date(updatedAt), "MMMM dd, yyyy 'at' h:mm a")}
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
};
