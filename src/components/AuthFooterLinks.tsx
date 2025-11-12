import { Box, Typography, Link, Divider } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { DEMO_CREDENTIALS } from "../utils/authUtils";

/**
 * Link configuration for auth footer
 */
export interface AuthLink {
  /** Link text */
  text: string;
  /** Link destination */
  to: string;
  /** Whether to use React Router Link or external link */
  external?: boolean;
}

/**
 * Props for the AuthFooterLinks component
 */
export interface AuthFooterLinksProps {
  /** Primary link configuration */
  primaryLink?: {
    /** Text before the link */
    text: string;
    /** Link configuration */
    link: AuthLink;
  };
  /** Secondary link configuration */
  secondaryLink?: AuthLink;
  /** Whether to show demo credentials (development only) */
  showDemoCredentials?: boolean;
  /** Custom demo credentials */
  demoCredentials?: {
    email: string;
    password: string;
  };
}

/**
 * Reusable footer component for authentication pages
 * Displays navigation links and demo credentials
 *
 * @example
 * ```tsx
 * <AuthFooterLinks
 *   primaryLink={{
 *     text: "Don't have an account?",
 *     link: { text: "Sign Up", to: "/register" }
 *   }}
 *   secondaryLink={{
 *     text: "Forgot your password?",
 *     to: "/forgot-password"
 *   }}
 *   showDemoCredentials={true}
 * />
 * ```
 */
export const AuthFooterLinks = ({
  primaryLink,
  secondaryLink,
  showDemoCredentials = import.meta.env.DEV,
  demoCredentials = DEMO_CREDENTIALS,
}: AuthFooterLinksProps) => {
  const linkStyle = {
    textDecoration: "none",
    fontWeight: 600,
    "&:hover": {
      textDecoration: "underline",
    },
  };

  return (
    <>
      {/* Divider */}
      <Divider sx={{ my: 3 }} />

      {/* Footer Links */}
      <Box textAlign="center">
        {primaryLink && (
          <Typography variant="body2" color="text.secondary" mb={2}>
            {primaryLink.text}{" "}
            <Link
              component={primaryLink.link.external ? "a" : RouterLink}
              to={primaryLink.link.external ? undefined : primaryLink.link.to}
              href={primaryLink.link.external ? primaryLink.link.to : undefined}
              sx={{
                ...linkStyle,
                fontWeight: 600,
              }}
            >
              {primaryLink.link.text}
            </Link>
          </Typography>
        )}

        {secondaryLink && (
          <Typography variant="body2" color="text.secondary">
            <Link
              component={secondaryLink.external ? "a" : RouterLink}
              to={secondaryLink.external ? undefined : secondaryLink.to}
              href={secondaryLink.external ? secondaryLink.to : undefined}
              sx={linkStyle}
            >
              {secondaryLink.text}
            </Link>
          </Typography>
        )}
      </Box>

      {/* Demo Credentials (Development Only) */}
      {showDemoCredentials && (
        <Box mt={3} p={2} bgcolor="grey.50" borderRadius={1}>
          <Typography variant="caption" display="block" mb={1} fontWeight={600}>
            Demo Credentials:
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary">
            Email: {demoCredentials.email}
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary">
            Password: {demoCredentials.password}
          </Typography>
        </Box>
      )}
    </>
  );
};
