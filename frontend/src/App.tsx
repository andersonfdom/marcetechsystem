import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './components/Clientes';
import Vendedores from './components/Vendedores';
import Lojas from './components/Lojas';
import Materiais from './components/Materiais';
import Ambientes from './components/Ambientes';
import Categorias from './components/Categorias';
import Usuarios from './components/Usuarios';
import Configuracoes from './components/Configuracoes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota de Login (sem o layout da sidebar) */}
        <Route path="/login" element={<Login />} />

        {/* Rotas Protegidas (dentro do Layout) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="vendedores" element={<Vendedores />} />
          <Route path="lojas" element={<Lojas />} />
          <Route path="materiais" element={<Materiais />} />
          <Route path="ambientes" element={<Ambientes />} />
          <Route path="categorias" element={<Categorias />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="configuracoes" element={<Configuracoes />} />
          {/* Adicione outras rotas aqui conforme converter suas Views .cshtml */}
        </Route>

        {/* Redireciona qualquer rota não encontrada para o Dashboard */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;