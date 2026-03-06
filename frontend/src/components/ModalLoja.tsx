import React, { useState, useEffect, type ChangeEvent } from 'react';
import ReactDOM from 'react-dom';

/**
 * Interface ILoja - Refletindo todos os campos do banco/modelo
 */
interface ILoja {
  IdLoja: number;
  Razaosocial: string;
  Cnpj: string;
  Telefone: string;
  Email: string;
  Cep: string;
  Logradouro: string;
  NumeroLogradouro: string;
  Complemento?: string;
  Bairro: string;
  Cidade: string;
  Estado: string;
}

interface ModalLojaProps {
  show: boolean;
  onClose: () => void;
  onSave: (dados: ILoja) => void;
  lojaEdicao: ILoja | null;
}

const ModalLoja: React.FC<ModalLojaProps> = ({ show, onClose, onSave, lojaEdicao }) => {
  const [formData, setFormData] = useState<ILoja>({
    IdLoja: 0, Razaosocial: '', Cnpj: '', Telefone: '', Email: '',
    Cep: '', Logradouro: '', NumeroLogradouro: '', Complemento: '',
    Bairro: '', Cidade: '', Estado: ''
  });

  const [loadingCep, setLoadingCep] = useState(false);

  // Sincronização ao abrir/editar
  useEffect(() => {
    if (show) {
      if (lojaEdicao) {
        setFormData(lojaEdicao);
      } else {
        setFormData({
          IdLoja: 0, Razaosocial: '', Cnpj: '', Telefone: '', Email: '',
          Cep: '', Logradouro: '', NumeroLogradouro: '', Complemento: '',
          Bairro: '', Cidade: '', Estado: ''
        });
      }
      document.body.style.overflow = 'hidden'; // Evita scroll no fundo
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [lojaEdicao, show]);

  // Máscaras automáticas
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    let val = value;

    if (id === 'Cnpj') {
      val = value.replace(/\D/g, '').substring(0, 14)
        .replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    }
    if (id === 'Cep') {
      val = value.replace(/\D/g, '').substring(0, 8)
        .replace(/^(\d{5})(\d{3})$/, '$1-$2');
    }
    if (id === 'Telefone') {
      const v = value.replace(/\D/g, '').substring(0, 11);
      val = v.length > 10 ? v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3') : v.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    }

    setFormData(prev => ({ ...prev, [id]: val }));
  };

  // Busca CEP (ViaCEP)
  const handleCepBlur = async () => {
    const cepLimpo = formData.Cep.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      setLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const dados = await response.json();
        if (!dados.erro) {
          setFormData(prev => ({
            ...prev,
            Logradouro: dados.logradouro || '',
            Bairro: dados.bairro || '',
            Cidade: dados.localidade || '',
            Estado: dados.uf || ''
          }));
        }
      } catch (error) { console.error("Erro CEP", error); }
      finally { setLoadingCep(false); }
    }
  };

  if (!show) return null;

  // Renderização via Portal para evitar cortes da Sidebar/Layout
  return ReactDOM.createPortal(
    <div style={{ 
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
      zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex' 
    }}>
      <div className="modal-dialog modal-fullscreen m-0 w-100">
        <div className="modal-content border-0 h-100 d-flex flex-column">
          
          {/* Cabeçalho */}
          <div className="modal-header bg-primary text-white rounded-0 p-3 shadow">
            <h5 className="modal-title d-flex align-items-center mb-0">
              <i className={`fas ${formData.IdLoja > 0 ? 'fa-edit' : 'fa-plus-circle'} me-2`}></i>
              {formData.IdLoja > 0 ? 'Alteração da Loja' : 'Inclusão da Loja'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          {/* Corpo - Com todos os campos do seu .cshtml */}
          <div className="modal-body bg-light p-4" style={{ flex: 1, overflowY: 'auto' }}>
            <div className="container">
              
              {/* Seção 1: Dados da Loja */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white py-3 fw-bold text-primary border-bottom">
                  <i className="fas fa-store me-2"></i>Identificação
                </div>
                <div className="card-body row g-3">
                  <div className="col-md-8">
                    <label className="form-label fw-bold">Razão Social</label>
                    <input type="text" className="form-control" id="Razaosocial" value={formData.Razaosocial} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold">CNPJ</label>
                    <input type="text" className="form-control" id="Cnpj" value={formData.Cnpj} onChange={handleInputChange} required />
                  </div>
                </div>
              </div>

              {/* Seção 2: Contato */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white py-3 fw-bold text-primary border-bottom">
                  <i className="fas fa-address-book me-2"></i>Canais de Contato
                </div>
                <div className="card-body row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Telefone</label>
                    <input type="text" className="form-control" id="Telefone" value={formData.Telefone} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">E-mail</label>
                    <input type="email" className="form-control" id="Email" value={formData.Email} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              {/* Seção 3: Endereço (Todos os campos do .cshtml) */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white py-3 fw-bold text-primary border-bottom">
                  <i className="fas fa-map-marker-alt me-2"></i>Localização
                </div>
                <div className="card-body">
                  <div className="row g-3 mb-3">
                    <div className="col-md-3">
                      <label className="form-label fw-bold">CEP</label>
                      <div className="input-group">
                        <input type="text" className="form-control" id="Cep" value={formData.Cep} onChange={handleInputChange} onBlur={handleCepBlur} required />
                        {loadingCep && <span className="input-group-text bg-white"><i className="fas fa-spinner fa-spin"></i></span>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Logradouro</label>
                      <input type="text" className="form-control" id="Logradouro" value={formData.Logradouro} onChange={handleInputChange} required />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label fw-bold">Número</label>
                      <input type="text" className="form-control" id="NumeroLogradouro" value={formData.NumeroLogradouro} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Complemento</label>
                      <input type="text" className="form-control" id="Complemento" value={formData.Complemento} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Bairro</label>
                      <input type="text" className="form-control" id="Bairro" value={formData.Bairro} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label fw-bold">Cidade</label>
                      <input type="text" className="form-control" id="Cidade" value={formData.Cidade} onChange={handleInputChange} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold">Estado</label>
                      <input type="text" className="form-control" id="Estado" value={formData.Estado} onChange={handleInputChange} required maxLength={2} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rodapé Fixo */}
          <div className="modal-footer bg-white border-top p-3 shadow-lg">
             <button type="submit" className="btn btn-success px-4">
              <i className="fas fa-save me-2"></i> Salvar
            </button>
            <button type="button" className="btn btn-danger" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ModalLoja;