import { TextField } from "@mui/material";

interface PollDescriptionFieldProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
}

/**
 * Description textarea field for poll creation
 *
 * Features:
 * - Multiline text input (3 rows minimum)
 * - Optional field
 * - Max 500 characters
 * - Error state display
 *
 * @example
 * ```tsx
 * <PollDescriptionField
 *   value={formData.description}
 *   onChange={createInputHandler('description')}
 *   error={shouldShowFieldError('description')}
 *   helperText={getFieldErrorMessage('description')}
 * />
 * ```
 */
export const PollDescriptionField = ({
  value,
  onChange,
  onBlur,
  error,
  helperText,
  disabled = false,
}: PollDescriptionFieldProps) => {
  return (
    <TextField
      fullWidth
      multiline
      rows={3}
      label="Description (Optional)"
      name="description"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText || `Max 500 characters (${value.length}/500)`}
      disabled={disabled}
      slotProps={{
        htmlInput: {
          maxLength: 500,
        },
      }}
    />
  );
};
