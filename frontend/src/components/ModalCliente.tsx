import React, { useState, useEffect } from 'react';

// Funções de Máscara (Mantidas conforme sua solicitação)
const mTel = (val: string) => {
  if (!val) return "";
  const v = val.replace(/\D/g, "");
  if (v.length === 11) return v.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})$/, '($1) $2 $3-$4');
  if (v.length === 10) return v.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  if (v.length > 2) return v.replace(/^(\d{2})(.*)$/, '($1) $2');
  return v;
};

interface ModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (d: any) => void;
  clienteEdicao?: any;
}

const ModalCliente: React.FC<ModalProps> = ({ show, onClose, onSave, clienteEdicao }) => {
  const [formData, setFormData] = useState({
    IdCliente: 0, Nome: "", Telefone: "", Email: ""
  });

  useEffect(() => {
    if (clienteEdicao) setFormData(clienteEdicao);
    else setFormData({ IdCliente: 0, Nome: "", Telefone: "", Email: "" });
  }, [clienteEdicao, show]);

  // Função para lidar com o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Impede o recarregamento da página
    onSave(formData);
  };

  // Função para mensagens personalizadas de validação
  const handleInvalid = (e: React.FormEvent<HTMLInputElement>, mensagem: string) => {
    const target = e.target as HTMLInputElement;
    target.setCustomValidity(mensagem);
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    target.setCustomValidity(""); // Limpa a mensagem ao começar a digitar
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
      <div className="modal-dialog modal-lg">
        {/* Adicionado a tag form em volta de todo o conteúdo */}
        <form onSubmit={handleSubmit} className="modal-content shadow-lg border-0">
          
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="fas fa-user-edit me-2"></i> 
              {formData.IdCliente > 0 ? 'Editar Cliente' : 'Cadastro de Cliente'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          
          <div className="modal-body p-4">
            <div className="row g-3">
              <div className="col-md-12">
                <label className="form-label fw-bold">Nome do Cliente</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.Nome} 
                  required
                  onInvalid={(e) => handleInvalid(e, "Por favor, informe o nome completo do cliente.")}
                  onInput={handleInput}
                  onChange={e => setFormData({...formData, Nome: e.target.value})} 
                />
              </div>
              
              <div className="col-md-6">
                <label className="form-label fw-bold">Telefone / WhatsApp</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.Telefone} 
                  required
                  onInvalid={(e) => handleInvalid(e, "O telefone é obrigatório para o contato.")}
                  onInput={handleInput}
                  onChange={e => setFormData({...formData, Telefone: mTel(e.target.value)})} 
                  placeholder="(00) 0 0000-0000" 
                />
              </div>
              
              <div className="col-md-6">
                <label className="form-label fw-bold">E-mail</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={formData.Email} 
                  required
                  onInvalid={(e) => handleInvalid(e, "Insira um endereço de e-mail válido.")}
                  onInput={handleInput}
                  onChange={e => setFormData({...formData, Email: e.target.value})} 
                  placeholder="email@provedor.com" 
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            {/* O botão agora é type="submit" */}
            <button type="submit" className="btn btn-success px-4">
              <i className="fas fa-save me-2"></i> Salvar
            </button>
            <button type="button" className="btn btn-danger" onClick={onClose}>
              Cancelar
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default ModalCliente;