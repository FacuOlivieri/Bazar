import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { InlineError, Notice } from '../../components/ui/Feedback';
import { Icon } from '../../components/ui/Icon';
import { PanelHeader } from '../../components/ui/PanelHeader';
import { Field } from '../../components/ui/RecordForm';
import { SESSION_END, describeLoginError } from '../../domain/session';
import { useAuth } from '../../hooks/useAuth';
import './login.css';

function PasswordField({ value, onChange }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="form-field">
      <label htmlFor="login-password" className="field-label">
        Contraseña
      </label>
      <div className="password-input">
        <input
          id="login-password"
          className="input"
          type={isVisible ? 'text' : 'password'}
          autoComplete="current-password"
          required
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          type="button"
          className="icon-btn password-input__toggle"
          aria-label={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          aria-pressed={isVisible}
          onClick={() => setIsVisible((visible) => !visible)}
        >
          <Icon name={isVisible ? 'eyeOff' : 'eye'} size={20} />
        </button>
      </div>
    </div>
  );
}

export function LoginPage() {
  const { session, endReason, login } = useAuth();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState(null);

  if (session) {
    return <Navigate to={location.state?.from ?? '/mostrador'} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsBusy(true);
    setError(null);
    try {
      await login({ username: username.trim(), password });
    } catch (loginError) {
      setError(describeLoginError(loginError));
      setPassword('');
      setIsBusy(false);
    }
  }

  return (
    <div className="login">
      <main className="login__box">
        <p className="login__brand">BAZAR</p>
        <section className="login__sheet" aria-label="Ingresar">
          <PanelHeader title="Ingresar" subtitle="Gestión del local" />
          <form className="record-form side-column__body" onSubmit={handleSubmit}>
            {endReason === SESSION_END.EXPIRED && !error && <Notice>Tu sesión venció. Volvé a entrar para seguir.</Notice>}

            <Field
              id="login-username"
              label="Usuario"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              autoFocus
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <PasswordField value={password} onChange={setPassword} />

            {error && <InlineError>{error}</InlineError>}

            <button type="submit" className="btn btn--primary login__submit" disabled={isBusy}>
              {isBusy ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        </section>
        <p className="helper-text login__help">Si no tenés usuario o te olvidaste la contraseña, pedíselo a un administrador del local.</p>
      </main>
    </div>
  );
}
