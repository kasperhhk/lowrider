import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { userService } from '../providers/UserService';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { Button, TextField } from '@mui/material';

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    if (userService.user) {
      router.push('/');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validationSchema = Yup.object().shape({
    username: Yup.string().label('Username').default('').required('Username is required')
  });

  const { handleSubmit, control, register } = useForm({ resolver: yupResolver(validationSchema) });

  function onSubmit({ username }: { username: string }) {
    userService.login(username);

    const returnUrl = router.query.returnUrl as string || '/';
    router.push(returnUrl);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField {...register('username')}/>      
      <Button type="submit" variant='contained'>Login</Button>
    </form>
  );
}