"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import ColorModeSelect from '../../common/theme/ColorModeSelect';
import AppTheme from '../../common/theme/AppTheme';
import ForgotPassword from '@/components/ForgotPassword';
import { FacebookIcon, GoogleIcon, SitemarkIcon, MicrosoftIcon } from '@/components/CustomIcons';
import { useAppStore } from '@/lib/store';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function LoginPage(props?: { disableCustomTheme?: boolean }) {
  const router = useRouter();
  const { setUser, setIsAuthenticated } = useAppStore();

  // フォーム入力値の管理
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validateInputs = (): boolean => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateInputs()) {
      return;
    }

    // ログイン成功時、ユーザー情報を Zustand に保存
    setUser({
      id: 'user-' + Date.now(),
      name: email.split('@')[0],
      email: email,
    });
    setIsAuthenticated(true);

    console.log({ email, password });

    // ログイン後、ホームページにリダイレクト
    router.push('/');
  };

  // マウント時に Easy Auth のログイン状態を確認して Zustand に反映
  React.useEffect(() => {
    let mounted = true;
    async function checkAuth() {
      try {
        const res = await fetch('/.auth/me');
        if (!mounted) return;
        if (!res.ok) return;
        const json = await res.json();

        // Helper to extract claim by multiple key possibilities
        const findClaim = (claims: any[], keys: string[]) => {
          if (!Array.isArray(claims)) return undefined;
          for (const c of claims) {
            const typ = c.typ || c.type || c.name;
            const val = c.val || c.value || c.name || c.Value;
            if (keys.includes(typ)) return val;
          }
          return undefined;
        };

        // Normalize various shapes of /.auth/me
        let principal: any = null;
        if (Array.isArray(json) && json.length > 0) {
          principal = json[0];
        } else if (json && typeof json === 'object') {
          // some environments return { clientPrincipal: { ... } }
          principal = json.clientPrincipal || json.client_principal || json;
        }

        if (!principal) return;

        // Attempt to read claims
        const claims = principal.user_claims || principal.userClaims || principal.claims || principal.user_claims || principal.user_claims;

        const name =
          findClaim(claims, ['name', 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']) ||
          principal.user_details ||
          principal.userName ||
          principal.userName ||
          principal.name ||
          '';

        const email =
          findClaim(claims, ['email', 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']) ||
          findClaim(claims, ['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn']) ||
          principal.user_email ||
          principal.userEmail ||
          '';

        const id = principal.user_id || principal.userId || principal.userId || principal.userId || principal.userId || principal.userId || principal.user_id || principal.identityProvider || principal.sub || 'azure-user';

        setUser({ id, name: name || 'AzureUser', email: email || '' });
        setIsAuthenticated(true);
      } catch (e) {
        // ignore errors
      }
    }
    checkAuth();
    return () => {
      mounted = false;
    };
  }, [setUser, setIsAuthenticated]);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Card variant="outlined">
          <SitemarkIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <ForgotPassword open={open} handleClose={handleClose} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
            >
              Sign in
            </Button>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Forgot your password?
            </Link>
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Google')}
              startIcon={<GoogleIcon />}
            >
              Sign in with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Facebook')}
              startIcon={<FacebookIcon />}
            >
              Sign in with Facebook
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => router.push('/api/auth/login?redirectTo=/')}
              startIcon={<MicrosoftIcon />}
            >
              Sign in with Microsoft
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <Link
                href="/material-ui/getting-started/templates/sign-in/"
                variant="body2"
                sx={{ alignSelf: 'center' }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
