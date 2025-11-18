import { useState, useCallback, type ChangeEvent } from "react";

interface ProfileFormData {
  username: string;
  email: string;
  full_name: string;
}

interface ProfileFormErrors {
  username?: string;
  email?: string;
  full_name?: string;
}

interface UseProfileFormProps {
  initialData: ProfileFormData;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  validateForm?: (data: ProfileFormData) => ProfileFormErrors;
}

export const useProfileForm = ({
  initialData,
  onSubmit,
  validateForm,
}: UseProfileFormProps) => {
  const [formData, setFormData] = useState<ProfileFormData>(initialData);
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if form has changes
  const hasChanges = useCallback(() => {
    return (
      formData.username !== initialData.username ||
      formData.email !== initialData.email ||
      formData.full_name !== initialData.full_name
    );
  }, [formData, initialData]);

  // Create input change handler
  const createInputHandler = useCallback(
    (field: keyof ProfileFormData) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error for this field when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }

      // Mark field as touched
      if (!touched[field]) {
        setTouched((prev) => ({ ...prev, [field]: true }));
      }
    },
    [errors, touched]
  );

  // Validate form
  const validate = useCallback(() => {
    if (!validateForm) return true;

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [formData, validateForm]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Mark all fields as touched
      setTouched({
        username: true,
        email: true,
        full_name: true,
      });

      // Validate form
      if (!validate()) {
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validate, onSubmit]
  );

  // Reset form to initial data
  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  // Update initial data (when user data changes from server)
  const updateInitialData = useCallback((newData: ProfileFormData) => {
    setFormData(newData);
  }, []);

  return {
    formData,
    errors,
    touched,
    isSubmitting,
    hasChanges: hasChanges(),
    createInputHandler,
    handleSubmit,
    resetForm,
    updateInitialData,
  };
};
