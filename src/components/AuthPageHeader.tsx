import { Box, Typography } from "@mui/material";
import type { SvgIconComponent } from "@mui/icons-material";

/**
 * Props for the AuthPageHeader component
 */
export interface AuthPageHeaderProps {
  /** Icon to display above the title */
  icon: SvgIconComponent;
  /** Main title text */
  title: string;
  /** Subtitle/description text */
  subtitle: string;
  /** Optional custom icon color */
  iconColor?: string;
  /** Optional custom spacing below header */
  marginBottom?: number;
}

/**
 * Reusable header component for authentication pages
 * Displays an icon, title, and subtitle in a consistent layout
 *
 * @example
 * ```tsx
 * <AuthPageHeader
 *   icon={LoginIcon}
 *   title="Welcome Back"
 *   subtitle="Sign in to your account to continue"
 * />
 * ```
 */
export const AuthPageHeader = ({
  icon: Icon,
  title,
  subtitle,
  iconColor = "primary.main",
  marginBottom = 4,
}: AuthPageHeaderProps) => {
  return (
    <Box textAlign="center" mb={marginBottom}>
      <Icon
        sx={{
          fontSize: 48,
          color: iconColor,
          mb: 2,
        }}
      />
      <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {subtitle}
      </Typography>
    </Box>
  );
};
