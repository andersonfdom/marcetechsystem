import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalVendedor from './ModalVendedor'

interface Vendedor {
  IdVendedor: number;
  Nome: string;
  Telefone: string;
  Email: string;
  Cpf: string;
}

const Vendedores: React.FC = () => {
  const navigate = useNavigate();
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [busca, setBusca] = useState("");
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });
  const [modalAberto, setModalAberto] = useState(false);
  const [vendedorEdicao, setVendedorEdicao] = useState<Vendedor | null>(null);

  // Simulação de carga de dados
  useEffect(() => {
    const dadosMock: Vendedor[] = [
      { IdVendedor: 1, Nome: "Carlos Vendedor", Telefone: "11988887777", Email: "carlos@loja.com", Cpf: "123.456.789-00" }
    ];
    setVendedores(dadosMock);
  }, []);

  const formatarTelefone = (val: string) => {
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

  const handleSalvar = (dados: Vendedor) => {
    if (dados.IdVendedor === 0) {
      setVendedores([...vendedores, { ...dados, IdVendedor: Math.random() }]);
      setMensagem({ texto: "Vendedor cadastrado com sucesso!", tipo: "success" });
    } else {
      setVendedores(vendedores.map(v => v.IdVendedor === dados.IdVendedor ? dados : v));
      setMensagem({ texto: "Vendedor atualizado!", tipo: "success" });
    }
    setModalAberto(false);
    setTimeout(() => setMensagem({ texto: "", tipo: "" }), 3000);
  };

  const handleExcluir = (id: number) => {
    if (window.confirm("Deseja excluir este vendedor?")) {
      setVendedores(vendedores.filter(v => v.IdVendedor !== id));
      setMensagem({ texto: "Removido com sucesso.", tipo: "danger" });
      setTimeout(() => setMensagem({ texto: "", tipo: "" }), 3000);
    }
  };

  const filtrados = vendedores.filter(v => 
    v.Nome.toLowerCase().includes(busca.toLowerCase()) || 
    v.Email.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Cadastro de Vendedores</h1>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={() => { setVendedorEdicao(null); setModalAberto(true); }}>
            <i className="fas fa-plus me-2"></i> Novo Vendedor
          </button>
          <button className="btn btn-danger" onClick={() => navigate('/')}>
            <i className="fas fa-arrow-left me-2"></i> Voltar
          </button>
        </div>
      </div>

      <div className="alert alert-info py-2">
        <i className="fas fa-info-circle me-2"></i> Este espaço é reservado para a gestão da sua equipe de vendas.
      </div>

      {mensagem.texto && (
        <div className={`alert alert-${mensagem.tipo} alert-dismissible fade show`}>
          {mensagem.texto}
          <button className="btn-close" onClick={() => setMensagem({texto:"", tipo:""})}></button>
        </div>
      )}

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <input 
            type="search" 
            className="form-control mb-3" 
            placeholder="🔍 Procurar Vendedores..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          <div className="table-responsive">
            <table className="table table-hover align-middle">
               <thead className="tituloTabela">
                <tr>
                  <th>Nome</th>
                  <th>Telefone</th>
                  <th>E-mail</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(v => (
                  <tr key={v.IdVendedor}>
                    <td> {v.Nome}</td>
                    <td>{formatarTelefone(v.Telefone)}</td>
                    <td>{v.Email}</td>
                    <td className="text-center">
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-primary" onClick={() => { setVendedorEdicao(v); setModalAberto(true); }}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-outline-danger" onClick={() => handleExcluir(v.IdVendedor)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ModalVendedor 
        show={modalAberto} 
        onClose={() => setModalAberto(false)} 
        onSave={handleSalvar} 
        vendedorEdicao={vendedorEdicao} 
      />
    </div>
  );
};

export default Vendedores;