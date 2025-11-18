import { TextField, InputAdornment } from "@mui/material";
import { Email as EmailIcon } from "@mui/icons-material";

/**
 * Props for the EmailField component
 */
export interface EmailFieldProps {
  /** Current email value */
  value: string;
  /** Change handler for email input */
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Blur handler for validation timing */
  onBlur?: () => void;
  /** Whether to show validation error state */
  error?: boolean;
  /** Error message to display */
  helperText?: string;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Whether the field should auto-focus */
  autoFocus?: boolean;
  /** Custom label for the field */
  label?: string;
  /** Custom placeholder text */
  placeholder?: string;
  /** Whether the field is required */
  required?: boolean;
}

/**
 * Reusable email input field component for authentication forms
 * Pre-configured with email validation, icon, and consistent styling
 *
 * @example
 * ```tsx
 * <EmailField
 *   value={formData.email}
 *   onChange={createInputHandler('email')}
 *   onBlur={createBlurHandler('email')}
 *   error={shouldShowFieldError('email')}
 *   helperText={getFieldErrorMessage('email')}
 *   disabled={isLoading}
 * />
 * ```
 */
export const EmailField = ({
  value,
  onChange,
  onBlur,
  error = false,
  helperText,
  disabled = false,
  autoFocus = false,
  label = "Email Address",
  placeholder = "Enter your email address",
  required = true,
}: EmailFieldProps) => {
  return (
    <TextField
      fullWidth
      label={label}
      type="email"
      variant="outlined"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      disabled={disabled}
      autoComplete="email"
      autoFocus={autoFocus}
      placeholder={placeholder}
      required={required}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon color="action" />
            </InputAdornment>
          ),
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          "&:hover fieldset": {
            borderColor: "primary.main",
          },
        },
      }}
    />
  );
};
