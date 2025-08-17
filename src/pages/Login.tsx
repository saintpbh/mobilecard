import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import '../styles/Login.css';

interface LoginFormData {
  email: string;
  password: string;
}

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin
  } = useForm<LoginFormData>();

  const {
    register: signupRegister,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
    watch,
    reset: resetSignup
  } = useForm<SignupFormData>();

  const password = watch('password');

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      toast.success('로그인되었습니다!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('로그인 실패:', error);
      toast.error(error.message || '로그인에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSignupSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    try {
      await signup(data.email, data.password);
      toast.success('회원가입이 완료되었습니다!');
      setIsLogin(true);
      resetSignup();
    } catch (error: any) {
      console.error('회원가입 실패:', error);
      toast.error(error.message || '회원가입에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetLogin();
    resetSignup();
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>{isLogin ? '로그인' : '회원가입'}</h1>
            <p>{isLogin ? '계정에 로그인하세요' : '새 계정을 만드세요'}</p>
          </div>

          {isLogin ? (
            <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="login-form">
              <div className="form-group">
                <label htmlFor="login-email">이메일</label>
                <div className="input-group">
                  <Mail size={20} className="input-icon" />
                  <input
                    type="email"
                    id="login-email"
                    {...loginRegister('email', {
                      required: '이메일을 입력해주세요.',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: '유효한 이메일 주소를 입력해주세요.'
                      }
                    })}
                    placeholder="이메일을 입력하세요"
                  />
                </div>
                {loginErrors.email && <span className="error">{loginErrors.email.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="login-password">비밀번호</label>
                <div className="input-group">
                  <Lock size={20} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                    {...loginRegister('password', {
                      required: '비밀번호를 입력해주세요.'
                    })}
                    placeholder="비밀번호를 입력하세요"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {loginErrors.password && <span className="error">{loginErrors.password.message}</span>}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-large"
                disabled={isSubmitting}
              >
                {isSubmitting ? '로그인 중...' : '로그인'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit(onSignupSubmit)} className="login-form">
              <div className="form-group">
                <label htmlFor="signup-email">이메일</label>
                <div className="input-group">
                  <Mail size={20} className="input-icon" />
                  <input
                    type="email"
                    id="signup-email"
                    {...signupRegister('email', {
                      required: '이메일을 입력해주세요.',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: '유효한 이메일 주소를 입력해주세요.'
                      }
                    })}
                    placeholder="이메일을 입력하세요"
                  />
                </div>
                {signupErrors.email && <span className="error">{signupErrors.email.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="signup-password">비밀번호</label>
                <div className="input-group">
                  <Lock size={20} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="signup-password"
                    {...signupRegister('password', {
                      required: '비밀번호를 입력해주세요.',
                      minLength: {
                        value: 6,
                        message: '비밀번호는 최소 6자 이상이어야 합니다.'
                      }
                    })}
                    placeholder="비밀번호를 입력하세요"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {signupErrors.password && <span className="error">{signupErrors.password.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirm-password">비밀번호 확인</label>
                <div className="input-group">
                  <Lock size={20} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirm-password"
                    {...signupRegister('confirmPassword', {
                      required: '비밀번호를 다시 입력해주세요.',
                      validate: value => value === password || '비밀번호가 일치하지 않습니다.'
                    })}
                    placeholder="비밀번호를 다시 입력하세요"
                  />
                </div>
                {signupErrors.confirmPassword && <span className="error">{signupErrors.confirmPassword.message}</span>}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-large"
                disabled={isSubmitting}
              >
                {isSubmitting ? '회원가입 중...' : '회원가입'}
              </button>
            </form>
          )}

          <div className="login-footer">
            <button onClick={toggleMode} className="mode-toggle">
              {isLogin ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
            </button>
            
            <Link to="/" className="back-home">
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
