import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authApi } from '@/api/auth';
import { getApiErrorMessage } from '@/api/client';
import type { RegisterRequest } from '@/types/auth';

interface RegisterFormValues extends RegisterRequest {
  confirmarPassword: string;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>();

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      await authApi.register({
        nombreUsuario: data.nombreUsuario,
        email: data.email,
        password: data.password,
      });
      toast.success('Cuenta creada. Ya podés iniciar sesión.');
      navigate('/login');
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
            Creá tu cuenta<br />y empezá a<br />
            <span className="text-dorado">pronosticar.</span>
          </h1>
        </div>
      </div>

      <div className="col-lg-6 d-flex align-items-center justify-content-center p-4 bg-light">
        <div className="auth-card">
          <h2 className="h3 mb-1">Crear cuenta</h2>
          <p className="text-secondary small mb-4">Te registrás con el rol de usuario por defecto.</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-3">
              <label htmlFor="nombreUsuario" className="form-label small fw-semibold">
                Nombre de usuario
              </label>
              <input
                id="nombreUsuario"
                type="text"
                className={`form-control ${errors.nombreUsuario ? 'is-invalid' : ''}`}
                placeholder="Tu nombre o apodo"
                {...register('nombreUsuario', { required: 'El nombre de usuario es obligatorio' })}
              />
              {errors.nombreUsuario && (
                <div className="invalid-feedback">{errors.nombreUsuario.message}</div>
              )}
            </div>

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

            <div className="mb-3">
              <label htmlFor="password" className="form-label small fw-semibold">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Mínimo 6 caracteres"
                {...register('password', {
                  required: 'La contraseña es obligatoria',
                  minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                })}
              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password.message}</div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="confirmarPassword" className="form-label small fw-semibold">
                Confirmar contraseña
              </label>
              <input
                id="confirmarPassword"
                type="password"
                className={`form-control ${errors.confirmarPassword ? 'is-invalid' : ''}`}
                placeholder="Repetí la contraseña"
                {...register('confirmarPassword', {
                  required: 'Confirmá la contraseña',
                  validate: (value) => value === watch('password') || 'Las contraseñas no coinciden',
                })}
              />
              {errors.confirmarPassword && (
                <div className="invalid-feedback">{errors.confirmarPassword.message}</div>
              )}
            </div>

            <button type="submit" className="btn btn-success w-100 py-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="spinner-border spinner-border-sm me-2" />
              ) : (
                <i className="bi bi-person-plus-fill me-2" />
              )}
              Crear cuenta
            </button>
          </form>

          <p className="text-center small text-secondary mt-4 mb-0">
            ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
