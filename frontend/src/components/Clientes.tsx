import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalCliente from './ModalCliente'; 
import '../index.css';

// Interface principal
interface Cliente {
  IdCliente: number;
  Nome: string;
  Telefone: string;
  Email: string;
  // Campos de endereço (opcionais na tabela, mas usados no modal)
  Cep?: string;
  Logradouro?: string;
  Numero?: string;
  Bairro?: string;
  Cidade?: string;
  UF?: string;
}

const formatarTelefoneTabela = (val: string) => {
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

const Clientes: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busca, setBusca] = useState("");
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });
  
  // Estados do Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [clienteParaEditar, setClienteParaEditar] = useState<Cliente | null>(null);

  // Carregamento inicial (Simulando API)
  useEffect(() => {
    const dadosIniciais: Cliente[] = [
      { IdCliente: 1, Nome: "João Silva", Telefone: "11999998888", Email: "joao@email.com" },
      { IdCliente: 2, Nome: "Oficina do Marceneiro", Telefone: "4333334444", Email: "contato@marceneiro.com" },
    ];
    setClientes(dadosIniciais);
  }, []);

  // Abrir modal para novo cliente
  const handleNovoCliente = () => {
    setClienteParaEditar(null);
    setModalAberto(true);
  };

  // Abrir modal para edição
  const handleEditarCliente = (id: number) => {
    const cli = clientes.find(c => c.IdCliente === id);
    if (cli) {
      setClienteParaEditar(cli);
      setModalAberto(true);
    }
  };

  // Salvar (Insert ou Update)
  const handleSalvarCliente = (dados: Cliente) => {
    if (dados.IdCliente === 0) {
      // Simulação de POST
      const novoCliente = { ...dados, IdCliente: Math.floor(Math.random() * 1000) };
      setClientes([...clientes, novoCliente]);
      setMensagem({ texto: "Cliente cadastrado com sucesso!", tipo: "success" });
    } else {
      // Simulação de PUT
      setClientes(clientes.map(c => c.IdCliente === dados.IdCliente ? dados : c));
      setMensagem({ texto: "Dados atualizados com sucesso!", tipo: "success" });
    }
    setModalAberto(false);
    
    // Auto-limpar mensagem após 3 segundos
    setTimeout(() => setMensagem({ texto: "", tipo: "" }), 3000);
  };

  const handleExcluirCliente = (id: number) => {
    if (window.confirm("Deseja realmente excluir este cliente?")) {
      setClientes(clientes.filter(c => c.IdCliente !== id));
      setMensagem({ texto: "Cliente removido da base de dados.", tipo: "danger" });
      setTimeout(() => setMensagem({ texto: "", tipo: "" }), 3000);
    }
  };

  // Filtro de busca
  const clientesFiltrados = clientes.filter(c =>
    c.Nome.toLowerCase().includes(busca.toLowerCase()) ||
    c.Email.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="clients-container p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Cadastro de Clientes</h1>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={handleNovoCliente}>
            <i className="fas fa-plus"></i> Novo Cliente
          </button>
          <button className="btn btn-danger" onClick={() => navigate('/')}>
            <i className="fas fa-arrow-left"></i> Voltar
          </button>
        </div>
      </div>

      <div className="alert alert-info py-2">
        <i className="fas fa-info-circle me-2"></i> 
        Gerencie sua base de clientes para emissão de orçamentos.
      </div>

      {mensagem.texto && (
        <div className={`alert alert-${mensagem.tipo} alert-dismissible fade show`}>
          {mensagem.texto}
          <button type="button" className="btn-close" onClick={() => setMensagem({texto: "", tipo: ""})}></button>
        </div>
      )}

      <div className="card shadow-sm border-0">
        <div className="card-body">
            <input 
              type="search" 
              className="form-control mb-3" 
              placeholder="🔍 Procurar Clientes..." 
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
                  <th className="text-center" style={{ width: '120px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.length > 0 ? (
                  clientesFiltrados.map((cliente) => (
                    <tr key={cliente.IdCliente}>
                      <td>{cliente.Nome}</td>
                      <td>{formatarTelefoneTabela(cliente.Telefone)}</td>
                      <td>{cliente.Email}</td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm">
                          <button 
                            className="btn btn-info" 
                            onClick={() => handleEditarCliente(cliente.IdCliente)}
                            title="Editar"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="btn btn-danger" 
                            onClick={() => handleExcluirCliente(cliente.IdCliente)}
                            title="Excluir"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-5 text-muted">
                      Nenhum cliente encontrado com "{busca}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Vinculado */}
      <ModalCliente 
        show={modalAberto}
        onClose={() => setModalAberto(false)}
        onSave={handleSalvarCliente}
        clienteEdicao={clienteParaEditar}
      />
    </div>
  );
};

export default Clientes;