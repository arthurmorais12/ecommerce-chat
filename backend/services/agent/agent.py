import sqlite3

from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
from langgraph.checkpoint.sqlite import SqliteSaver
from langgraph.prebuilt import create_react_agent

from .prompt import VENDEDOR_PROMPT
from .tools import tools

load_dotenv()


def create_agent():
    # Modelo
    model = init_chat_model(
        model="llama-3.1-8b-instant",
        model_provider="groq",
    )

    # Memória SQLite (maneira correta)
    conn = sqlite3.connect("chat_memory.db", check_same_thread=False)
    memory = SqliteSaver(conn)

    # Agente React com memória e prompt detalhado
    agent = create_react_agent(
        model=model, tools=tools, checkpointer=memory, prompt=VENDEDOR_PROMPT
    )

    return agent


def send_message(message: str, user_id: str = "default") -> str:
    agent = create_agent()

    result = agent.invoke(
        {"messages": [{"role": "user", "content": message}]},
        config={"configurable": {"thread_id": user_id}},
    )

    return result["messages"][-1].content
