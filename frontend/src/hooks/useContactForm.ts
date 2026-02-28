import { useState } from 'react';
import { useActor } from './useActor';

interface ContactFormState {
  name: string;
  email: string;
  message: string;
}

export function useContactForm() {
  const { actor } = useActor();
  const [form, setForm] = useState<ContactFormState>({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof ContactFormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('All fields are required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!actor) {
      setError('Service unavailable. Please try again.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await actor.addContactMessage(form.name, form.email, form.message);
      setIsSuccess(true);
      setForm({ name: '', email: '', message: '' });
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { form, updateField, submit, isSubmitting, isSuccess, error };
}
