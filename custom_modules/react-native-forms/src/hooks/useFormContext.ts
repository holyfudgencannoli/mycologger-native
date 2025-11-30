import { useForm, Controller } from 'react-hook-form';

export const useMyForm = <T>() => {
  return useForm<T>();
};
