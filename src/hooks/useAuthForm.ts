import { useState, useCallback, useEffect } from "react";
import { useAppDispatch } from "../store";
import { clearError } from "../store/slices/authSlice";
import type { FormErrors, TouchedFields } from "../utils/authUtils";
import {
  createInitialFormData,
  createInitialTouchedState,
  markAllFieldsTouched,
  shouldShowFieldError,
  getFieldErrorMessage,
  createInputChangeHandler,
  createFieldBlurHandler,
} from "../utils/authUtils";

/**
 * Configuration for the auth form hook
 */
export interface UseAuthFormConfig<T extends Record<string, string>> {
  /** Initial form data */
  initialData?: Partial<T>;
  /** Form field names */
  fields: (keyof T)[];
  /** Validation function */
  validateForm: (data: T) => FormErrors<T>;
  /** Form submission handler */
  onSubmit: (data: T) => Promise<void> | void;
  /** Error handler */
  onError?: (error: Error) => void;
}

/**
 * Return type for the auth form hook
 */
export interface UseAuthFormReturn<T extends Record<string, string>> {
  /** Current form data */
  formData: T;
  /** Form validation errors */
  formErrors: FormErrors<T>;
  /** Touched fields tracking */
  touched: TouchedFields<T>;
  /** Update form data */
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  /** Update form errors */
  setFormErrors: React.Dispatch<React.SetStateAction<FormErrors<T>>>;
  /** Update touched fields */
  setTouched: React.Dispatch<React.SetStateAction<TouchedFields<T>>>;
  /** Handle form submission */
  handleSubmit: (event: React.FormEvent) => Promise<void>;
  /** Create input change handler for a field */
  createInputHandler: (
    field: keyof T
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Create blur handler for a field */
  createBlurHandler: (field: keyof T) => () => void;
  /** Check if field should show error */
  shouldShowFieldError: (field: keyof T) => boolean;
  /** Get field error message */
  getFieldErrorMessage: (field: keyof T) => string | undefined;
  /** Validate entire form */
  validateEntireForm: () => boolean;
  /** Mark all fields as touched */
  markAllTouched: () => void;
  /** Reset form to initial state */
  resetForm: () => void;
}

/**
 * Custom hook for managing authentication forms
 * Provides comprehensive form state management, validation, and submission handling
 *
 * @param config - Configuration object for the form
 * @returns Form state and handlers
 *
 * @example
 * ```tsx
 * interface LoginFormData {
 *   email: string;
 *   password: string;
 * }
 *
 * const validateLoginForm = (data: LoginFormData): FormErrors<LoginFormData> => {
 *   const errors: FormErrors<LoginFormData> = {};
 *   if (!data.email) errors.email = 'Email is required';
 *   if (!data.password) errors.password = 'Password is required';
 *   return errors;
 * };
 *
 * const LoginForm = () => {
 *   const {
 *     formData,
 *     handleSubmit,
 *     createInputHandler,
 *     shouldShowFieldError,
 *     getFieldErrorMessage,
 *   } = useAuthForm({
 *     fields: ['email', 'password'],
 *     validateForm: validateLoginForm,
 *     onSubmit: async (data) => {
 *       await dispatch(loginUser(data));
 *     },
 *   });
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <TextField
 *         value={formData.email}
 *         onChange={createInputHandler('email')}
 *         error={shouldShowFieldError('email')}
 *         helperText={getFieldErrorMessage('email')}
 *       />
 *     </form>
 *   );
 * };
 * ```
 */
export const useAuthForm = <T extends Record<string, string>>({
  initialData,
  fields,
  validateForm,
  onSubmit,
  onError,
}: UseAuthFormConfig<T>): UseAuthFormReturn<T> => {
  const dispatch = useAppDispatch();

  // Initialize form data
  const [formData, setFormData] = useState<T>(() => ({
    ...createInitialFormData<T>(fields),
    ...initialData,
  }));

  // Initialize form errors
  const [formErrors, setFormErrors] = useState<FormErrors<T>>({});

  // Initialize touched fields
  const [touched, setTouched] = useState<TouchedFields<T>>(() =>
    createInitialTouchedState<T>(fields)
  );

  // Clear auth errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Validate entire form
  const validateEntireForm = useCallback((): boolean => {
    const errors = validateForm(formData);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, validateForm]);

  // Mark all fields as touched
  const markAllTouched = useCallback(() => {
    setTouched(markAllFieldsTouched<T>(fields));
  }, [fields]);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setFormData({ ...createInitialFormData<T>(fields), ...initialData });
    setFormErrors({});
    setTouched(createInitialTouchedState<T>(fields));
    dispatch(clearError());
  }, [fields, initialData, dispatch]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      // Mark all fields as touched for validation display
      markAllTouched();

      // Validate form before submission
      if (!validateEntireForm()) {
        return;
      }

      try {
        await onSubmit(formData);
      } catch (error) {
        console.error("Form submission error:", error);
        onError?.(error as Error);
      }
    },
    [formData, validateEntireForm, markAllTouched, onSubmit, onError]
  );

  // Create input change handler
  const createInputHandler = useCallback(
    (field: keyof T) =>
      createInputChangeHandler<T>(
        field,
        setFormData,
        setFormErrors,
        formErrors
      ),
    [formErrors]
  );

  // Create blur handler
  const createBlurHandler = useCallback(
    (field: keyof T) => createFieldBlurHandler<T>(field, setTouched),
    []
  );

  // Check if field should show error
  const shouldShowFieldErrorFn = useCallback(
    (field: keyof T): boolean =>
      shouldShowFieldError(field, formErrors, touched),
    [formErrors, touched]
  );

  // Get field error message
  const getFieldErrorMessageFn = useCallback(
    (field: keyof T): string | undefined =>
      getFieldErrorMessage(field, formErrors, touched),
    [formErrors, touched]
  );

  return {
    formData,
    formErrors,
    touched,
    setFormData,
    setFormErrors,
    setTouched,
    handleSubmit,
    createInputHandler,
    createBlurHandler,
    shouldShowFieldError: shouldShowFieldErrorFn,
    getFieldErrorMessage: getFieldErrorMessageFn,
    validateEntireForm,
    markAllTouched,
    resetForm,
  };
};
