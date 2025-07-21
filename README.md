# E-commerce Chatbot

Um chatbot conversacional para vendas de produtos eletrônicos, construído com FastAPI, React e IA.

## 🚀 Demo

**Frontend**: [https://ecommerce-chat-beta.vercel.app/](https://ecommerce-chat-beta.vercel.app/)
**Nota: pela instância do backend ser gratuita, na primeira mensagem haverá um delay de 50 segundos para a resposta. Mensagens subsequentes funcionarão normalmente."

## 🛠️ Tecnologias

### Backend
- **FastAPI** - API REST
- **Python** - Linguagem principal
- **LangChain** - Framework de IA
- **ChromaDB** - Vector database
- **Google Gemini** - Modelo de IA

### Frontend
- **React** - Framework frontend
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI

## 📁 Estrutura

```
ecommerce-chat/
├── backend/          # API FastAPI
├── frontend/         # App React
└── README.md
```

## 🚀 Como rodar

### Backend
```bash
cd backend
uv run uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm run dev
```

## 📝 Funcionalidades

- Chat conversacional com IA
- Busca semântica em produtos
- Interface moderna e responsiva
- Integração com documentos PDF
