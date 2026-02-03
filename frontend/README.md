# MarceTech - Frontend em React/TypeScript (starter)

Este projeto foi gerado a partir do seu `Views.zip` e já:
- Copia seus CSS para `public/css` (ex.: `site.css`, `login.css`, etc.)
- Copia imagens para `public/img`
- Cria um **layout** inspirado no `_Layout.cshtml`
- Cria a tela de **Login** e a página de **Clientes** (CRUD básico) consumindo os mesmos endpoints usados no JS legado.

## Como rodar

```bash
npm install
npm run dev
```

## Como apontar para o backend (ASP.NET)

### Opção A (mais simples): mesmo domínio
Compile o React e sirva os arquivos dentro do seu ASP.NET (wwwroot), mantendo cookie de sessão.

### Opção B: Vite em outra porta
Use proxy no `vite.config.ts` (descomente e ajuste a URL).

## Próximo passo recomendado (1 endpoint no backend)
Crie um endpoint leve tipo:

- `GET /Auth/Me` -> retorna `{ "usuario": "...", "marceneiro": "...", "ultimoAcesso": "..." }` e 401 se não logado.

Com isso dá pra implementar um `AuthGuard` e preencher o header do layout.

## Checklist de migração (página a página)
1. Pegar uma pasta de Views (ex.: `Views/Clientes`)
2. Identificar endpoints no `wwwroot/js/<pagina>.js`
3. Criar:
   - `src/api/<pagina>.ts` (funções axios)
   - `src/pages/<pagina>/<Pagina>Page.tsx` (UI)
4. Portar regras de UI e validações para React (sem manipular DOM direto)

Boa migração! :)