import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@mui/material';
import React from 'react';
import { apiCall } from '../helpers/helpers';

function ResetPopup ({
  open,
  setOpen
}) {
  const [alert, setAlert] = React.useState(null);
  const [stage, setStage] = React.useState(1);
  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordconf, setPasswordconf] = React.useState('');

  async function handleSubmitEmail () {
    const validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (!email || !validEmailRegex.test(email)) {
      setAlert('Invalid email');
    }
    const body = {
      email
    }
    const data = await apiCall('auth/reset/password/request', 'POST', body);
    if (data.status === 400) {
      setAlert(data.message);
    } else {
      setAlert(null);
      setStage(2);
    }
  }

  async function handleSubmitCode () {
    /* Should check if code is right */
    const body = {
      email,
      reset_code: code
    }
    const data = await apiCall('auth/reset/password/code', 'POST', body);
    if (data.status === 400) {
      setAlert(data.message);
    } else {
      setAlert(null);
      setStage(3);
    }
  }

  async function handleSubmitPassword () {
    /* call api to update password */
    if (password !== passwordconf) {
      setAlert('Passwords do not match');
      return;
    }
    if (!/[0-9]/.test(password) || !/\w/.test(password) || !/\W/.test(password)) {
      setAlert('Password requires at least one letter, number and special character');
      return;
    }
    const body = {
      new_password: password,
      email
    }
    const data = await apiCall('auth/reset/password/confirm', 'POST', body);
    if (data.status === 400) {
      setAlert(data.message);
    } else {
      setAlert(null);
      setOpen(false);
    }
  }

  function handleClose () {
    setOpen(false);
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Reset Password</DialogTitle>
      {stage === 1 && <>
        <DialogContent>
          <DialogContentText>Enter email that reset code will be sent to</DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            id='email'
            label='Email Address'
            type='email'
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmitEmail}>Send to email</Button>
        </DialogActions></>}
      {stage === 2 && <>
        <DialogContent>
          <DialogContentText>Enter code that was sent</DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            id='code'
            label='Code'
            type='text'
            fullWidth
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmitCode}>Enter code</Button>
        </DialogActions></>}
      {stage === 3 && <>
        <DialogContent>
          <DialogContentText>Set new password</DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            id='password1'
            label='Enter password'
            type='password'
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            autoFocus
            margin='dense'
            id='password2'
            label='Confirm password'
            type='password'
            fullWidth
            value={passwordconf}
            onChange={(e) => setPasswordconf(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmitPassword}>Submit password</Button>
        </DialogActions></>}
      {alert &&
        <Alert severity='error' aria-label='errorAlert' sx={{
          margin: 'auto',
          width: '300px'
        }}>{alert}</Alert>}
    </Dialog>
  )
}

export default ResetPopup;
