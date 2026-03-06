🚀 MarceTech - Sistema Completo de Gestão
<div align="center"> Sistema profissional para gestão comercial, orçamentos e produção</div>
📋 Sobre o Projeto
O MarceTech é um sistema completo desenvolvido em ASP.NET Core MVC para otimizar processos comerciais e de produção, oferecendo soluções integradas para gestão de clientes, orçamentos, materiais e muito mais. Este projeto demonstra habilidades full-stack com tecnologias modernas e boas práticas de desenvolvimento.

🎯 Destaques do Projeto
Arquitetura MVC completa com separação clara de responsabilidades

Interface moderna e responsiva com Razor Pages e Bootstrap

Integração com MySQL via Entity Framework Core

Validações robustas no servidor e cliente

Sistema de gestão comercial completo

Layout responsivo com design profissional

🏗️ Arquitetura do Sistema
text
marcetech/
├── 📁 Controllers/          # Controladores MVC
├── 📁 Models/              # Modelos de dados e ViewModels
├── 📁 Views/               # Views Razor
├── 📁 Services/            # Serviços e lógica de negócio
├── 📁 Data/                # Contexto do banco e configurações
├── 📁 wwwroot/             # Arquivos estáticos (CSS, JS, imagens)
└── 📄 Program.cs           # Ponto de entrada da aplicação
🛠️ Tecnologias Utilizadas
Backend
ASP.NET Core 9 MVC - Framework web completo

Entity Framework Core - ORM para acesso a dados

Pomelo.EntityFrameworkCore.MySql - Provider MySQL

Razor Pages - Motor de templates para views

Bootstrap 5 - Framework CSS para interface responsiva

Banco de Dados
MySQL - Banco de dados relacional

Code-First/Migrations - Controle de versão do esquema do banco

⚙️ Funcionalidades Implementadas
✅ Módulos Concluídos
CRUD de Ambientes - Gestão completa

Categorias - Gestão com validações de negócio

Clientes - Cadastro com validações de CPF/CNPJ

Itens de Categoria - Gestão de produtos/serviços

Orçamentos - Criação vinculada a clientes

Dashboard - Visão geral do sistema

Layout Responsivo - Design adaptativo para diferentes dispositivos

🔄 Em Desenvolvimento
Módulo de Contratos

Gestão Comercial Avançada

Gestão de Produção

Cronogramas e Timeline

Sistema de Usuários e Permissões

🚀 Como Executar o Projeto
Pré-requisitos
.NET 9.0 SDK ou superior

MySQL Server 8.0+

Git

1. Clone o repositório
bash
git clone <url-do-repositorio>
cd marcetech
2. Configuração do Banco de Dados
bash
# Atualize a connection string no appsettings.json

# Execute as migrações do banco de dados
dotnet ef database update

# Ou execute via Package Manager Console
Update-Database
3. Configuração e Execução da Aplicação
bash
# Restaurar pacotes NuGet
dotnet restore

# Executar aplicação
dotnet run

# Ou executar em modo desenvolvimento
dotnet watch run
Aplicação disponível em: https://localhost:5001 ou http://localhost:5000

📊 Características Técnicas Destacadas
Arquitetura MVC Excellence
Separação de Responsabilidades - Model, View, Controller bem definidos

Tratamento de Erros - Middleware global e páginas de erro customizadas

Validações de Negócio - DataAnnotations e validações customizadas

Injeção de Dependência - Configuração nativa do ASP.NET Core

Migrations EF Core - Controle de versão do banco de dados

ViewModels - Padrão para transferência de dados entre Controller e View

Frontend com Razor e Bootstrap
Razor Pages - Templates dinâmicos com sintaxe C#

Layouts e Partial Views - Reutilização de componentes de UI

Bootstrap 5 - Componentes responsivos e modernos

JavaScript Interop - Interatividade com JavaScript

CSS Modular - Estilos organizados e escopados

UX/UI Intuitiva - Interface amigável com feedback visual

Integração com Banco de Dados
Entity Framework Core - Mapeamento objeto-relacional

LINQ - Consultas tipadas e seguras

Repositório Pattern - Isolamento da camada de dados (opcional)

Transações - Controle de operações atômicas

🎯 Habilidades Demonstradas
Desenvolvimento ASP.NET Core MVC
Arquitetura MVC padrão e padrões de design

Entity Framework Core e ORM avançado

MySQL e modelagem de dados relacional

Validações com DataAnnotations e customizadas

Segurança básica (CORS, validações, sanitização)

Razor Pages e templates dinâmicos

Desenvolvimento Frontend
Bootstrap 5 para interfaces responsivas

JavaScript para interatividade

CSS3 com organização modular

Design responsivo e mobile-first

Componentização com Partial Views

DevOps e Ferramentas
Controle de versão com Git

Gerenciamento de dependências com NuGet

Migrations do Entity Framework Core

Configuração de múltiplos ambientes

Build e deployment otimizados

📈 Próximos Passos Planejados
Implementar autenticação e autorização

Adicionar testes unitários e de integração

Criar sistema de relatórios com gráficos

Implementar upload de arquivos

Adicionar exportação para PDF/Excel

Implementar logging estruturado

Adicionar cache para melhor performance

Criar API RESTful para integrações futuras

🤝 Contato
Desenvolvido com 💙 por um profissional apaixonado por tecnologia

<div align="center"> "Código não é apenas instruções para máquinas, é a materialização da solução de problemas reais." </div>
Nota: Este projeto utiliza uma stack tecnológica moderna e consolidada da Microsoft (ASP.NET Core MVC + Entity Framework Core + MySQL), proporcionando alto desempenho, segurança e manutenibilidade para sistemas empresariais.