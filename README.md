# ROLDAN Dashboard

Sistema de Registro Diário para Contact Center — ROLDAN Marketing Educacional e Contact Center BPO.

## Requisitos

- Node.js 18 ou superior
- npm 8 ou superior
- Acesso SSH ao servidor (para deploy)

---

## Instalação Local (desenvolvimento)

```bash
# 1. Entrar na pasta do projeto
cd roldan-dashboard

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com seu editor preferido e defina JWT_SECRET e ADMIN_PASSWORD

# 4. Iniciar o servidor
npm start
# ou para desenvolvimento com reinício automático:
npm run dev
```

Acesse `http://localhost:3000`

**Login padrão criado automaticamente:**
- Usuário: `admin`
- Senha: `admin123`

> ⚠️ Altere a senha após o primeiro login em **Admin → Alterar Minha Senha**.

---

## Deploy em Servidor Linux (VPS / Ubuntu)

### 1. Conectar ao servidor e instalar Node.js

```bash
# Instalar Node.js 20 via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar versão
node -v && npm -v
```

### 2. Enviar os arquivos para o servidor

```bash
# Da sua máquina local (substitua user@SEU_IP)
scp -r roldan-dashboard/ user@SEU_IP:/var/www/roldan-dashboard
```

Ou via Git:
```bash
# No servidor
cd /var/www
git clone https://seu-repositorio.git roldan-dashboard
```

### 3. Configurar o projeto no servidor

```bash
cd /var/www/roldan-dashboard
npm install --omit=dev
cp .env.example .env
nano .env
```

Conteúdo do `.env` em produção:
```
PORT=3000
JWT_SECRET=uma_chave_secreta_longa_aleatoria_aqui
ADMIN_PASSWORD=SuaSenhaForte123
DB_PATH=/var/www/roldan-dashboard/data/roldan.db
```

### 4. Instalar PM2 (gerenciador de processos)

```bash
sudo npm install -g pm2

# Iniciar o app
pm2 start server.js --name roldan-dashboard

# Fazer o PM2 iniciar automaticamente ao reiniciar o servidor
pm2 startup
pm2 save
```

Comandos úteis do PM2:
```bash
pm2 status          # ver status
pm2 logs roldan-dashboard   # ver logs em tempo real
pm2 restart roldan-dashboard
pm2 stop roldan-dashboard
```

### 5. Configurar Nginx como proxy reverso

```bash
sudo apt install -y nginx

sudo nano /etc/nginx/sites-available/roldan-dashboard
```

Cole o seguinte conteúdo (substitua `seudominio.com.br`):

```nginx
server {
    listen 80;
    server_name seudominio.com.br www.seudominio.com.br;

    location / {
        proxy_pass         http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;

        # Aumentar timeout para exportação de relatórios
        proxy_read_timeout 120s;
        client_max_body_size 10M;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/roldan-dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Configurar SSL com Let's Encrypt (HTTPS)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d seudominio.com.br -d www.seudominio.com.br
```

O Certbot configurará o HTTPS automaticamente e renovará o certificado.

---

## Estrutura de Pastas

```
roldan-dashboard/
├── server.js              # Ponto de entrada do servidor
├── package.json
├── .env.example           # Modelo de configuração
├── .gitignore
├── README.md
├── database/
│   └── db.js              # Setup do SQLite e criação de tabelas
├── middleware/
│   └── auth.js            # Middleware de autenticação JWT
├── routes/
│   ├── auth.js            # Login, usuários, alterar senha
│   ├── registros.js       # CRUD de registros diários
│   └── relatorios.js      # Consolidado, exportação PDF e Excel
├── public/
│   ├── index.html         # Tela de login
│   ├── dashboard.html     # Dashboard principal
│   ├── registro.html      # Formulário de registro diário
│   ├── consolidado.html   # Visualização consolidada
│   ├── relatorios.html    # Relatórios com exportação
│   ├── admin.html         # Gestão de usuários (admin)
│   ├── css/
│   │   └── style.css      # Estilos globais
│   └── js/
│       └── app.js         # Utilitários compartilhados (auth, API, nav)
└── data/                  # Criado automaticamente — contém o banco SQLite
    └── roldan.db
```

---

## API REST (resumo)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Usuário atual |
| GET | `/api/auth/usuarios` | Listar usuários (admin) |
| POST | `/api/auth/usuarios` | Criar usuário (admin) |
| DELETE | `/api/auth/usuarios/:id` | Remover usuário (admin) |
| PUT | `/api/auth/senha` | Alterar senha |
| GET | `/api/registros` | Listar registros (filtro: data_inicio, data_fim, responsavel) |
| POST | `/api/registros` | Criar registro |
| GET | `/api/registros/:id` | Buscar registro |
| PUT | `/api/registros/:id` | Atualizar registro |
| DELETE | `/api/registros/:id` | Excluir registro |
| GET | `/api/relatorios/consolidado` | Dados consolidados + lista |
| GET | `/api/relatorios/pdf` | Download PDF |
| GET | `/api/relatorios/excel` | Download Excel (.xlsx) |

---

## Backup do banco de dados

O banco SQLite fica em `data/roldan.db`. Para fazer backup:

```bash
# Cópia simples
cp /var/www/roldan-dashboard/data/roldan.db ~/backup_roldan_$(date +%Y%m%d).db

# Cron diário às 3h (adicionar com: crontab -e)
0 3 * * * cp /var/www/roldan-dashboard/data/roldan.db ~/backups/roldan_$(date +\%Y\%m\%d).db
```

---

## Suporte

ROLDAN Marketing Educacional e Contact Center BPO  
📞 (11) 95474-2815
