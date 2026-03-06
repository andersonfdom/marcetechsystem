import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'success' | 'danger' | 'info', texto: string } | null>(null);
  
  const navigate = useNavigate();
  const usuarioRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    usuarioRef.current?.focus();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem(null);

    try {
      // Simulação da chamada de API
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Mock de sucesso
      localStorage.setItem("TokenAcesso", "token_123");
      localStorage.setItem("DadosUsuario", JSON.stringify({
        nome: "Administrador",
        marceneiro: "MarceTech Matriz"
      }));

      navigate('/');
    } catch (error) {
      setMensagem({ tipo: 'danger', texto: "Usuário ou senha inválidos." });
    } finally {
      setLoading(false);
    }
  };

  const handleRecuperarSenha = () => {
    if (!usuario) {
      setMensagem({ tipo: 'danger', texto: "Informe seu e-mail no campo de usuário." });
      usuarioRef.current?.focus();
      return;
    }
    setMensagem({ tipo: 'info', texto: "Verificando e-mail..." });
    setTimeout(() => {
      setMensagem({ tipo: 'success', texto: "Instruções enviadas para seu e-mail." });
    }, 1500);
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <img src="/img/logo.jpg" className="logo" alt="MarceTech Logo" />
        <h2>Acesso Restrito</h2>

        {mensagem && (
          <div className={`alert alert-${mensagem.tipo} ${mensagem.tipo === 'danger' ? 'shake' : ''}`}>
            <i className={`fas fa-${mensagem.tipo === 'danger' ? 'exclamation-circle' : (mensagem.tipo === 'info' ? 'info-circle' : 'check-circle')}`}></i>
            <span>{mensagem.texto}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <input 
              type="text" 
              className="form-login"
              placeholder="Usuário ou E-mail"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              ref={usuarioRef}
              required 
            />
            <i className="fas fa-user input-icon"></i>
          </div>

          <div className="input-group">
            <input 
              type="password" 
              className="form-login"
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required 
            />
            <i className="fas fa-lock input-icon"></i>
          </div>

          <div className="row-links">
            <Link to="/cadastro" className="recuperar">
              <i className="fas fa-user-plus me-1"></i> Criar conta
            </Link>
            <button type="button" onClick={handleRecuperarSenha} className="recuperar">
              <i className="fas fa-key me-1"></i> Esqueci a senha
            </button>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <><div className="loading"></div> Entrando...</>
            ) : (
              <>Acessar Sistema <i className="fas fa-arrow-right"></i></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;