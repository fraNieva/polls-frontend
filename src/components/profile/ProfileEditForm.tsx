import { TextField, Button, Stack, Box } from "@mui/material";
import { Save, Cancel } from "@mui/icons-material";
import type { ChangeEvent } from "react";

interface ProfileFormData {
  username: string;
  email: string;
  full_name: string;
}

interface ProfileEditFormProps {
  formData: ProfileFormData;
  errors: {
    username?: string;
    email?: string;
    full_name?: string;
  };
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (
    field: keyof ProfileFormData
  ) => (e: ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  hasChanges: boolean;
}

export const ProfileEditForm = ({
  formData,
  errors,
  isLoading,
  onSubmit,
  onChange,
  onCancel,
  hasChanges,
}: ProfileEditFormProps) => {
  return (
    <Box component="form" onSubmit={onSubmit} sx={{ mb: 4 }}>
      <Stack spacing={3}>
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={onChange("username")}
          error={!!errors.username}
          helperText={errors.username}
          fullWidth
          disabled={isLoading}
          required
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange("email")}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
          disabled={isLoading}
          required
        />

        <TextField
          label="Full Name"
          name="full_name"
          value={formData.full_name}
          onChange={onChange("full_name")}
          error={!!errors.full_name}
          helperText={errors.full_name}
          fullWidth
          disabled={isLoading}
        />

        <Stack direction="row" spacing={2}>
          <Button
            type="submit"
            variant="contained"
            startIcon={<Save />}
            disabled={isLoading || !hasChanges}
            fullWidth
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Cancel />}
            onClick={onCancel}
            disabled={isLoading}
            fullWidth
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
