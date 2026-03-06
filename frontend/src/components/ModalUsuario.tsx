import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

export interface IUsuario {
  IdUsuario: number;
  Usuario: string;
  UsuarioLogado?: string;
}

interface ModalUsuarioProps {
  show: boolean;
  onClose: () => void;
  onSave: (dados: any) => void;
  usuarioEdicao: IUsuario | null;
}

const ModalUsuario: React.FC<ModalUsuarioProps> = ({ show, onClose, onSave, usuarioEdicao }) => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mensagem, setMensagem] = useState({ texto: '', cor: '' });

  useEffect(() => {
    if (show) {
      if (usuarioEdicao) {
        setUsuario(usuarioEdicao.Usuario);
        setSenha('');
        setConfirmarSenha('');
      } else {
        setUsuario('');
        setSenha('');
        setConfirmarSenha('');
      }
      setMensagem({ texto: '', cor: '' });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [show, usuarioEdicao]);

  if (!show) return null;

  const handleGravar = () => {
    if (!usuario || usuario.trim() === '') {
      setMensagem({ texto: 'Por favor, preencha o e-mail do usuário.', cor: 'red' });
      return;
    }
    if (!senha || senha.trim() === '') {
      setMensagem({ texto: 'Por favor, preencha a senha.', cor: 'red' });
      return;
    }
    if (senha !== confirmarSenha) {
      setMensagem({ texto: 'As senhas não conferem', cor: 'red' });
      return;
    }

    onSave({
      Id: usuarioEdicao?.IdUsuario || 0,
      Usuario: usuario,
      Senha: senha
    });
  };

  return ReactDOM.createPortal(
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex' }}>
      <div className="modal-dialog modal-fullscreen m-0 w-100">
        <div className="modal-content border-0 h-100 d-flex flex-column">
          <div className="modal-header bg-primary text-white rounded-0">
            <h5 className="modal-title">
              <i className={`fas ${usuarioEdicao ? 'fa-user-edit' : 'fa-user-plus'} me-2`}></i>
              {usuarioEdicao ? 'Alteração de Usuário' : 'Inclusão de Usuário'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body bg-light p-4" style={{ flex: 1, overflowY: 'auto' }}>
            <div className="container">
              {/* Seção Informações */}
              <div className="form-section mb-4">
                <h6 className="fw-bold mb-3 text-primary">
                  <i className="fas fa-user me-2"></i>Informações do Usuário
                </h6>
                <div className="mb-3">
                  <label className="form-label fw-bold small">E-mail do Usuário *</label>
                  <input
                    type="email"
                    className="form-control form-control-lg shadow-sm"
                    placeholder="exemplo@email.com"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                  />
                </div>
              </div>

              {/* Seção Segurança */}
              <div className="form-section mb-4">
                <h6 className="fw-bold mb-3 text-primary">
                  <i className="fas fa-lock me-2"></i>Segurança
                </h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Senha *</label>
                    <input
                      type="password"
                      className="form-control form-control-lg shadow-sm"
                      placeholder="••••••••"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Confirmar Senha *</label>
                    <input
                      type="password"
                      className="form-control form-control-lg shadow-sm"
                      placeholder="••••••••"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {mensagem.texto && (
                <div className="alert alert-light border-0 shadow-sm py-2" style={{ color: mensagem.cor }}>
                   <i className="fas fa-exclamation-circle me-2"></i>{mensagem.texto}
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer bg-white border-top p-3">
            <button className="btn btn-success btn-lg px-5" onClick={handleGravar}>
              <i className="fas fa-save me-2"></i>Gravar
            </button>
            <button className="btn btn-danger btn-lg px-5" onClick={onClose}>
              <i className="fas fa-times me-2"></i>Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ModalUsuario;