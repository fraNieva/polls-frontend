import { TextField } from "@mui/material";

interface PollTitleFieldProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
}

/**
 * Title input field for poll creation
 *
 * Features:
 * - 5-200 character validation
 * - Required field indicator
 * - Auto-focus for better UX
 * - Error state display
 *
 * @example
 * ```tsx
 * <PollTitleField
 *   value={formData.title}
 *   onChange={createInputHandler('title')}
 *   error={shouldShowFieldError('title')}
 *   helperText={getFieldErrorMessage('title')}
 * />
 * ```
 */
export const PollTitleField = ({
  value,
  onChange,
  onBlur,
  error,
  helperText,
  disabled = false,
}: PollTitleFieldProps) => {
  return (
    <TextField
      fullWidth
      required
      autoFocus
      label="Poll Title"
      name="title"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText || "5-200 characters"}
      disabled={disabled}
      slotProps={{
        htmlInput: {
          minLength: 5,
          maxLength: 200,
        },
      }}
    />
  );
};
