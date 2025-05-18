'use client'

import { useMemo } from 'react';
import { useAppSelector } from '@/lib/redux/hooks';

export function useProfileFormValues() {
  const { user } = useAppSelector((state) => state.auth);

  const initialValues = useMemo(() => ({
    name: user.name || '',
    email: user.email || '',
    new_password: '',
    old_password: '',
  }), [user]);

  const hasChanges = (values: typeof initialValues) => {
    return (
      values.name !== initialValues.name ||
      values.email !== initialValues.email ||
      values.new_password.trim() !== '' ||
      values.old_password.trim() !== ''
    );
  };

  return { initialValues, hasChanges };
}
