import { TextField, InputAdornment, IconButton } from "@mui/material";
import {
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

/**
 * Props for the PasswordField component
 */
export interface PasswordFieldProps {
  /** Current password value */
  value: string;
  /** Change handler for password input */
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Blur handler for validation timing */
  onBlur?: () => void;
  /** Whether to show validation error state */
  error?: boolean;
  /** Error message to display */
  helperText?: string;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Whether the password is currently visible */
  showPassword: boolean;
  /** Handler for toggling password visibility */
  onToggleVisibility: () => void;
  /** Custom label for the field */
  label?: string;
  /** Custom placeholder text */
  placeholder?: string;
  /** Auto-complete attribute value */
  autoComplete?: string;
  /** Whether the field is required */
  required?: boolean;
}

/**
 * Reusable password input field component for authentication forms
 * Pre-configured with visibility toggle, icon, and consistent styling
 *
 * @example
 * ```tsx
 * const { showPassword, togglePasswordVisibility } = usePasswordToggle();
 *
 * <PasswordField
 *   value={formData.password}
 *   onChange={createInputHandler('password')}
 *   onBlur={createBlurHandler('password')}
 *   error={shouldShowFieldError('password')}
 *   helperText={getFieldErrorMessage('password')}
 *   disabled={isLoading}
 *   showPassword={showPassword}
 *   onToggleVisibility={togglePasswordVisibility}
 * />
 * ```
 */
export const PasswordField = ({
  value,
  onChange,
  onBlur,
  error = false,
  helperText,
  disabled = false,
  showPassword,
  onToggleVisibility,
  label = "Password",
  placeholder = "Enter your password",
  autoComplete = "current-password",
  required = true,
}: PasswordFieldProps) => {
  return (
    <TextField
      fullWidth
      label={label}
      type={showPassword ? "text" : "password"}
      variant="outlined"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      disabled={disabled}
      autoComplete={autoComplete}
      placeholder={placeholder}
      required={required}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={onToggleVisibility}
                onMouseDown={(event) => event.preventDefault()}
                edge="end"
                disabled={disabled}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
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
