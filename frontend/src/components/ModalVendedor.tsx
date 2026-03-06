import React, { useState, useEffect } from 'react';

// Funções de Máscara
const mCPF = (v: string) => v.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").substring(0, 14);
const mTel = (val: string) => {
if (!val) return "";
  
  // Remove tudo que não for número
  const v = val.replace(/\D/g, "");

  // (99) 9 9999-9999 (Celular com 11 dígitos)
  if (v.length === 11) {
    return v.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})$/, '($1) $2 $3-$4');
  } 
  
  // (99) 9999-9999 (Fixo com 10 dígitos)
  if (v.length === 10) {
    return v.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  }

  // Retorno para números incompletos (enquanto o usuário digita)
  if (v.length > 2) {
    return v.replace(/^(\d{2})(.*)$/, '($1) $2');
  }

  return v;
};

const ModalVendedor: React.FC<{show: any, onClose: any, onSave: any, vendedorEdicao: any}> = 
({ show, onClose, onSave, vendedorEdicao }) => {
  
  const initialForm = {
    IdVendedor: 0, Nome: "", Cpf: "", Telefone: "", Email: ""
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (vendedorEdicao) setFormData(vendedorEdicao);
    else setFormData(initialForm);
  }, [vendedorEdicao, show]);

  if (!show) return null;

  return (
    <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
      <div className="modal-dialog modal-lg">
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title"><i className="fas fa-id-card me-2"></i> Dados do Vendedor</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          
          <div className="modal-body p-4">
            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label fw-bold">Nome Completo</label>
                <input type="text" className="form-control" required value={formData.Nome}
                  onChange={e => setFormData({...formData, Nome: e.target.value})} />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold">CPF</label>
                <input type="text" className="form-control" required value={formData.Cpf}
                  onChange={e => setFormData({...formData, Cpf: mCPF(e.target.value)})} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">E-mail</label>
                <input type="email" className="form-control" required value={formData.Email}
                  onChange={e => setFormData({...formData, Email: e.target.value})} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Telefone</label>
                <input type="text" className="form-control" required value={formData.Telefone}
                  onChange={e => setFormData({...formData, Telefone: mTel(e.target.value)})} />
              </div>
            </div>
          </div>

          <div className="modal-footer bg-light">
            <button type="submit" className="btn btn-success px-4"><i className="fas fa-save me-2"></i>Salvar Vendedor</button>
            <button type="button" className="btn btn-danger" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalVendedor;