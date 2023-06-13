import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { userService } from '../providers/UserService';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Controller, ControllerFieldState, FieldError, useForm } from 'react-hook-form';
import { Box, Button, Paper, TextField } from '@mui/material';

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    if (userService.user) {
      router.push('/');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required')
  });

  const { handleSubmit, control, register } = useForm({ resolver: yupResolver(validationSchema) });

  function onSubmit({ username }: { username: string }) {
    userService.login(username);

    const returnUrl = router.query.returnUrl as string || '/';
    router.push(returnUrl);
  }

  return (
    <Box sx={{ margin: '10% auto auto auto', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper sx={{ padding: '10px 50px 50px 50px', justifyItems: 'center', display: 'flex', justifyContent: 'center', width: 'fit-content', justifySelf: 'center', flexDirection: 'column', gap: '20px' }}>
          <h1>Login</h1>
          <Controller control={control} name='username' defaultValue='' render={({ field, fieldState }) =>
            <TextField {...field} label="Username" error={fieldState.invalid} helperText={fieldState.error?.message} />
          } />
          <Button sx={{marginTop: '20px'}} type="submit" variant='contained'>Login</Button>
        </Paper>
      </form>
    </Box>
  );
}