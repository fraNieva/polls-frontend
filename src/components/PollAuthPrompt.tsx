import { AlertMessage } from "./AlertMessage";

/**
 * Props for PollAuthPrompt component
 */
export interface PollAuthPromptProps {
  /** Optional custom message */
  message?: string;
}

/**
 * Poll Auth Prompt Component
 * Prompts unauthenticated users to sign in to vote
 *
 * @example
 * ```tsx
 * <PollAuthPrompt />
 * ```
 */
export const PollAuthPrompt = ({
  message = "Please sign in to vote on this poll",
}: PollAuthPromptProps) => {
  return (
    <AlertMessage
      severity="info"
      message={message}
      inlineLink={{
        text: "sign in",
        to: "/login",
        bold: true,
      }}
    />
  );
};
