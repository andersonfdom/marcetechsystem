import React, { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { Save, X, Upload, Trash, Info, Smartphone, Mail, MapPin, IdCard, User, Loader2 } from 'lucide-react';
import '../index.css';
import { CKEditor } from 'ckeditor4-react';

interface MarceneiroData {
  Id: string;
  Tipopessoa: string; // 'false' para PF, 'true' para PJ
  Nome: string;
  Rg: string; // Usado para RG ou Inscrição Estadual
  Cpfcnpj: string;
  Telefone: string;
  Email: string;
  Cep: string;
  Logradouro: string;
  Numerologradouro: string;
  Complemento: string;
  Bairro: string;
  Cidade: string;
  Estado: string;
  LogoBase64?: string;
  TextoCabecalhoPadraoOrcamentos: string;
  RodapePadraoOrcamentos: string;
}

const Configuracoes: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);

  const [formData, setFormData] = useState<MarceneiroData>({
    Id: '',
    Tipopessoa: 'false',
    Nome: '',
    Rg: '',
    Cpfcnpj: '',
    Telefone: '',
    Email: '',
    Cep: '',
    Logradouro: '',
    Numerologradouro: '',
    Complemento: '',
    Bairro: '',
    Cidade: '',
    Estado: '',
    LogoBase64: '',
    TextoCabecalhoPadraoOrcamentos: '',
    RodapePadraoOrcamentos: ''
  });

  // Máscaras de Input
  const maskCEP = (value: string) => value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').substring(0, 9);
  
  const maskCpfCnpj = (value: string, isPj: boolean) => {
    const raw = value.replace(/\D/g, '');
    if (isPj) {
      return raw.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d)/, '$1.$2.$3/$4-$5').substring(0, 18);
    }
    return raw.replace(/^(\d{3})(\d{3})(\d{3})(\d)/, '$1.$2.$3-$4').substring(0, 14);
  };

  const maskTelefone = (value: string) => {
    const raw = value.replace(/\D/g, '');
    if (raw.length <= 10) {
      return raw.replace(/^(\d{2})(\d{4})(\d)/, '($1) $2-$3').substring(0, 14);
    }
    return raw.replace(/^(\d{2})(\d{5})(\d)/, '($1) $2-$3').substring(0, 15);
  };

  // Busca de CEP (ViaCEP)
  const handleCepBlur = async () => {
    const cep = formData.Cep.replace(/\D/g, '');
    if (cep.length === 8) {
      setBuscandoCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            Logradouro: data.logradouro,
            Bairro: data.bairro,
            Cidade: data.localidade,
            Estado: data.uf // Nota: O cshtml tenta converter UF para nome extenso, mas UF é mais padrão
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP", error);
      } finally {
        setBuscandoCep(false);
      }
    }
  };

  // Upload de Logo
  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Tamanho máximo 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreviewLogo(base64);
        setFormData(prev => ({ ...prev, LogoBase64: base64.split(',')[1] }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSalvar = async () => {
    setLoading(true);

    try {
      const response = await fetch("/GravarDadosMarceneiro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, IsNovoCadastro: 'false' })
      });

      const result = await response.json();
      if (result.status === 'sucesso') {
        setMensagem({ texto: "Dados salvos com sucesso!", tipo: 'sucesso' });
      } else {
        setMensagem({ texto: result.message, tipo: 'erro' });
      }
    } catch (error) {
      setMensagem({ texto: "Erro ao conectar com o servidor", tipo: 'erro' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="clients-container p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="h3 mb-0">Parâmetros Configuração do Sistema</h1>
        </div>
        <div className="alert alert-info py-2">
          <i className="fas fa-info-circle me-2"></i> 
        Este espaço é reservado para o Parâmetros Configuração do Sistema.
        </div>

        {mensagem.texto && (
          <div className={`alert alert-${mensagem.tipo} alert-dismissible fade show`}>
            {mensagem.texto}
            <button type="button" className="btn-close" onClick={() => setMensagem({texto: "", tipo: ""})}></button>
          </div>
        )}

        {/* Seção Tipo de Pessoa */}
      <div className="mb-8 p-4 border rounded-lg">
        <h6><i className="fas fa-user me-2"></i>Tipo de Pessoa</h6>
        <div className="row">
          <label className="col">
            <input 
              type="radio" 
              checked={formData.Tipopessoa === 'false'} 
              onChange={() => setFormData({...formData, Tipopessoa: 'false'})}
            /> Pessoa Física
          </label>
          <label className="col">
            <input 
              type="radio" 
              checked={formData.Tipopessoa === 'true'} 
              onChange={() => setFormData({...formData, Tipopessoa: 'true'})}
            /> Pessoa Jurídica
          </label>
        </div>
      </div>

      {/* Informações Pessoais */}
      <div className="mb-8 p-4 border rounded-lg">
       <h6><i className="fas fa-id-card me-2"></i>Informações Pessoais</h6>
        <div className="row">
          <div className="col">
            <label className="form-label">
              {formData.Tipopessoa === 'false' ? 'Nome Completo' : 'Razão Social'}
            </label>
            <input 
              type="text" 
              className="form-control"
              value={formData.Nome}
              onChange={e => setFormData({...formData, Nome: e.target.value})}
            />
          </div>
        </div>
         <div className="row">
           <div className="col">
            <label className="form-label">
              {formData.Tipopessoa === 'false' ? 'CPF' : 'CNPJ'}
            </label>
            <input 
              type="text" 
              className="form-control"
              value={formData.Cpfcnpj}
              onChange={e => setFormData({...formData, Cpfcnpj: maskCpfCnpj(e.target.value, formData.Tipopessoa === 'true')})}
            />
           </div>
              {formData.Tipopessoa === "false" && (
              <div id="dadosRg" className="col">
                <label id="lblRg" htmlFor="Rg" className="form-label">
                  RG
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="Rg"
                  name="Rg"
                  value={formData.Rg}
                  onChange={e => setFormData({...formData,Rg: e.target.value})}
                 />
              </div>
            )}
         </div>
      </div>

      {/* Contato */}
      <div className="mb-8 p-4 border rounded-lg">
        <h6><i className="fas fa-address-book me-2"></i>Contato</h6>
        <div className="row">
          <div className='col'>
            <label className="form-label">Telefone</label>
            <input 
              type="text" 
              className="form-control"
              value={formData.Telefone}
              onChange={e => setFormData({...formData, Telefone: maskTelefone(e.target.value)})}
            />
          </div>
          <div className='col'>
            <label className="form-label">E-mail</label>
            <input 
              type="email" 
              className="form-control"
              value={formData.Email}
              onChange={e => setFormData({...formData, Email: e.target.value})}
            />
          </div>
        </div>
      </div>
      {/* Endereço */}
      <div className="mb-8 p-4 border rounded-lg">
         <h6><i className="fas fa-map-marker-alt me-2"></i>Endereço</h6>
        <div className="row">
          <div className='col-md-3'>
            <label className="form-label">CEP</label>
            <input 
              type="text" 
              className="form-control"
              value={formData.Cep}
              onBlur={handleCepBlur}
              onChange={e => setFormData({...formData, Cep: maskCEP(e.target.value)})}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Logradouro</label>
            <input 
              type="text" 
              className="form-control"
              value={formData.Logradouro}
              onChange={e => setFormData({...formData, Logradouro: e.target.value})}
            />
          </div>  
          <div className='col-md-3'>
            <label className="form-label">Número</label>
            <input 
              type="text" 
              className="form-control"
              value={formData.Numerologradouro}
              onChange={e => setFormData({...formData, Numerologradouro: e.target.value})}
            />
          </div>  
        </div>    
        <div className='row'>      
          <div className="col">
            <label className="form-label">Complemento</label>
            <input 
              type="text" 
               className="form-control"
              value={formData.Complemento}
              onChange={e => setFormData({...formData, Complemento: e.target.value})}
            />
          </div>
          <div className="col">
            <label className="form-label">Bairro</label>
            <input 
              type="text" 
               className="form-control"
              value={formData.Bairro}
              onChange={e => setFormData({...formData, Bairro: e.target.value})}
            />
          </div>  
        </div>    
        <div className='row'>   
          <div className="col">
            <label className="form-label">Cidade</label>
            <input 
              type="text" 
               className="form-control"
              value={formData.Cidade}
              onChange={e => setFormData({...formData, Cidade: e.target.value})}
            />
          </div>
         <div className="col">
            <label className="form-label">Estado</label>
            <input 
              type="text" 
               className="form-control"
              value={formData.Estado}
              onChange={e => setFormData({...formData, Estado: e.target.value})}
            />
          </div>
        </div>
      </div>
       {/* Upload de Logo */}
      <div className="mb-8 p-4 border rounded-lg">
         <h6><i className="fas fa-upload me-2"></i>Upload de Logo</h6>
        <input 
          type="file" 
          accept="image/*"
          className="form-control"
          onChange={handleLogoChange}
        />
        
        {previewLogo && (
          <div className="mt-4 p-4 border rounded bg-gray-50 flex flex-col items-center">
            <img src={previewLogo} alt="Preview" className="img-fluid" />
            <button 
              onClick={() => { setPreviewLogo(null); setFormData({...formData, LogoBase64: ''}) }}
              className="btn btn-sm btn-outline-danger mt-2"
            >
              <Trash size={14} /> Remover
            </button>
          </div>
        )}
      </div>

      {/* Só renderiza o editor quando o formulário estiver pronto ou carregado */}
      <div className="mb-8 p-4 border rounded-lg">
          <h6><i className="fas fa-copyright me-2"></i>Texto padrão Cabeçalho Orçamentos</h6>
          <CKEditor
              editorUrl="/ckeditor/ckeditor.js"
              // Use data para garantir sincronia se initData falhar no React 19
              data={formData.TextoCabecalhoPadraoOrcamentos} 
              config={{
                  versionCheck: false,
              }}
              onChange={(evt) => {
                  const data = evt.editor.getData();
                  setFormData(prev => ({ ...prev, TextoCabecalhoPadraoOrcamentos: data }));
              }}
          />
      </div>
    </div>
  );
};

export default Configuracoes;