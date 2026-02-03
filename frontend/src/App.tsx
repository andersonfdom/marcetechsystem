import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { ClientesPage } from './pages/clientes/ClientesPage'

function Placeholder({ title }: { title: string }) {
  return (
    <div>
      <h1>{title}</h1>
      <div className="alert alert-info">Página ainda não migrada.</div>
    </div>
  )
}

/**
 * Proteção simples:
 * - como seu backend usa Session (cookie), o jeito mais confiável é ter um endpoint tipo /Auth/Me.
 * - enquanto isso, mantemos um "soft guard": se a primeira chamada de API der 401/302, você redireciona no axios interceptor.
 */
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clientes" element={<ClientesPage />} />

          <Route path="/lojas" element={<Placeholder title="Lojas" />} />
          <Route path="/vendedores" element={<Placeholder title="Vendedores" />} />
          <Route path="/materiais" element={<Placeholder title="Materiais" />} />
          <Route path="/usuarios" element={<Placeholder title="Usuários" />} />
          <Route path="/orcamentos" element={<Placeholder title="Orçamentos" />} />
          <Route path="/configuracoes" element={<Placeholder title="Configurações" />} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}