import { z } from 'zod';
import { HTMLInputTypeAttribute } from 'react';
import { schemaDb } from './UniversalForm';

export type FormFieldConfig = {
  name: string;
  label: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  description?: string;
  value?: string;
};

export type UniversalFormProps<T extends z.ZodType> = {
  fields: FormFieldConfig[];
  schemaName: typeof schemaDb[number]['name'];
  action: (prev: any, formData: FormData) => void;
  defaultValues?: Partial<z.infer<T>>;
  submitText?: string;
};
