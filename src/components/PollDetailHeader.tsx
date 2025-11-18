import { Box, Avatar, Typography } from "@mui/material";
import { HowToVote } from "@mui/icons-material";

/**
 * Props for PollDetailHeader component
 */
export interface PollDetailHeaderProps {
  /** Poll title */
  title: string;
  /** Optional poll description */
  description?: string;
  /** Optional custom icon component */
  icon?: React.ElementType;
}

/**
 * Poll Detail Header Component
 * Displays poll title and description with icon
 *
 * @example
 * ```tsx
 * <PollDetailHeader
 *   title="What's your favorite programming language?"
 *   description="Vote for your preferred language for web development"
 * />
 * ```
 */
export const PollDetailHeader = ({
  title,
  description,
  icon: Icon = HowToVote,
}: PollDetailHeaderProps) => {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 3 }}>
      <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
        <Icon />
      </Avatar>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>
        {description && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {description}
          </Typography>
        )}
      </Box>
    </Box>
  );
};
