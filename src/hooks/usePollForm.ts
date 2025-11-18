import { useState } from "react";
import {
  validateTitle,
  validateDescription,
  validateOptions,
  type PollFormData,
  type PollFormErrors,
} from "../utils/pollValidation";

interface UsePollFormReturn {
  formData: PollFormData;
  errors: PollFormErrors;
  touched: Record<keyof PollFormData, boolean>;
  isValid: boolean;
  handleTitleChange: (value: string) => void;
  handleDescriptionChange: (value: string) => void;
  handleOptionsChange: (options: string[]) => void;
  handleIsPublicChange: (isPublic: boolean) => void;
  handleIsActiveChange: (isActive: boolean) => void;
  handleTitleBlur: () => void;
  handleDescriptionBlur: () => void;
  handleOptionsBlur: () => void;
  resetForm: () => void;
}

const initialFormData: PollFormData = {
  title: "",
  description: "",
  options: [],
  isPublic: true,
  isActive: true,
};

/**
 * Custom hook for poll form state management
 *
 * Features:
 * - Form state management
 * - Field-level validation
 * - Touched state tracking
 * - Options array management
 * - Form reset
 *
 * @example
 * ```tsx
 * const {
 *   formData,
 *   errors,
 *   touched,
 *   isValid,
 *   handleTitleChange,
 *   handleDescriptionChange,
 * } = usePollForm();
 *
 * <PollTitleField
 *   value={formData.title}
 *   onChange={(e) => handleTitleChange(e.target.value)}
 *   onBlur={handleTitleBlur}
 *   error={touched.title && !!errors.title}
 *   helperText={touched.title ? errors.title : ""}
 * />
 * ```
 */
export const usePollForm = (): UsePollFormReturn => {
  const [formData, setFormData] = useState<PollFormData>(initialFormData);
  const [errors, setErrors] = useState<PollFormErrors>({});
  const [touched, setTouched] = useState<Record<keyof PollFormData, boolean>>({
    title: false,
    description: false,
    options: false,
    isPublic: false,
    isActive: false,
  });

  // Title handlers
  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, title: value }));
    const error = validateTitle(value);
    setErrors((prev) => ({ ...prev, title: error }));
  };

  const handleTitleBlur = () => {
    setTouched((prev) => ({ ...prev, title: true }));
  };

  // Description handlers
  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
    const error = validateDescription(value);
    setErrors((prev) => ({ ...prev, description: error }));
  };

  const handleDescriptionBlur = () => {
    setTouched((prev) => ({ ...prev, description: true }));
  };

  // Options handlers
  const handleOptionsChange = (options: string[]) => {
    setFormData((prev) => ({ ...prev, options }));
    const error = validateOptions(options);
    setErrors((prev) => ({ ...prev, options: error }));
    // Mark as touched when options change
    setTouched((prev) => ({ ...prev, options: true }));
  };

  const handleOptionsBlur = () => {
    setTouched((prev) => ({ ...prev, options: true }));
  };

  // Visibility handlers
  const handleIsPublicChange = (isPublic: boolean) => {
    setFormData((prev) => ({ ...prev, isPublic }));
    setTouched((prev) => ({ ...prev, isPublic: true }));
  };

  const handleIsActiveChange = (isActive: boolean) => {
    setFormData((prev) => ({ ...prev, isActive }));
    setTouched((prev) => ({ ...prev, isActive: true }));
  };

  // Reset form
  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setTouched({
      title: false,
      description: false,
      options: false,
      isPublic: false,
      isActive: false,
    });
  };

  // Form validity
  const isValid =
    !errors.title &&
    !errors.description &&
    !errors.options &&
    formData.title.trim().length >= 5;

  return {
    formData,
    errors,
    touched,
    isValid,
    handleTitleChange,
    handleDescriptionChange,
    handleOptionsChange,
    handleIsPublicChange,
    handleIsActiveChange,
    handleTitleBlur,
    handleDescriptionBlur,
    handleOptionsBlur,
    resetForm,
  };
};
