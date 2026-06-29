import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '@/auth/useAuth';
import { getApiErrorMessage } from '@/api/client';
import type { LoginRequest } from '@/types/auth';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const from = (location.state as { from?: Location })?.from?.pathname ?? '/';

  const onSubmit = async (data: LoginRequest) => {
    setIsSubmitting(true);
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="col-lg-6 d-none d-lg-flex auth-side p-5">
        <div className="position-relative" style={{ zIndex: 1 }}>
          <span className="text-eyebrow d-block mb-3">UTN Villa María · Prog. IV</span>
          <h1 className="display-5 mb-3">
            Pronosticá.<br />Sumá puntos.<br />
            <span className="text-dorado">Subí al podio.</span>
          </h1>
          <p className="opacity-75 col-9">
            Competí con tu grupo o con todo el mundo prediciendo los resultados exactos de
            cada fecha.
          </p>
        </div>
      </div>

      <div className="col-lg-6 d-flex align-items-center justify-content-center p-4 bg-light">
        <div className="auth-card">
          <div className="d-lg-none text-center mb-4">
            <i className="bi bi-trophy-fill text-dorado fs-1" />
            <h2 className="h4 mt-2">PRODE</h2>
          </div>

          <h2 className="h3 mb-1">Iniciar sesión</h2>
          <p className="text-secondary small mb-4">Ingresá con tu email y contraseña.</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-3">
              <label htmlFor="email" className="form-label small fw-semibold">
                Email
              </label>
              <input
                id="email"
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="vos@email.com"
                {...register('email', { required: 'El email es obligatorio' })}
              />
              {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label small fw-semibold">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="••••••••"
                {...register('password', { required: 'La contraseña es obligatoria' })}
              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password.message}</div>
              )}
            </div>

            <button type="submit" className="btn btn-success w-100 py-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="spinner-border spinner-border-sm me-2" />
              ) : (
                <i className="bi bi-box-arrow-in-right me-2" />
              )}
              Ingresar
            </button>
          </form>

          <p className="text-center small text-secondary mt-4 mb-0">
            ¿No tenés cuenta? <Link to="/register">Registrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
