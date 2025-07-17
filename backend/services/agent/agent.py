from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
from langchain_core.messages import AIMessageChunk
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver
from langgraph.prebuilt import create_react_agent

from .prompt import VENDEDOR_PROMPT
from .tools import tools

load_dotenv()


class Agent:
    def __init__(self):
        self.model = init_chat_model(
            model="gemini-2.5-flash-lite-preview-06-17", model_provider="google_genai"
        )
        self.tools = tools
        self.prompt = VENDEDOR_PROMPT
        self.db_path = "chat_memory.db"

    async def stream_message(self, user_message: str, thread_id: str):
        """Envia mensagem e faz streaming da resposta"""
        async with AsyncSqliteSaver.from_conn_string(self.db_path) as checkpointer:
            agent_executable = create_react_agent(
                model=self.model,
                tools=self.tools,
                checkpointer=checkpointer,
                prompt=self.prompt,
            )
            config = {"configurable": {"thread_id": thread_id}}
            try:
                async for chunk, metadata in agent_executable.astream(
                    {"messages": [("human", user_message)]},
                    config,
                    stream_mode="messages",
                ):
                    if isinstance(chunk, AIMessageChunk) and chunk.content:
                        yield {"type": "content", "data": chunk.content}
            except Exception as e:
                print(f"Error during agent stream: {e}")
                yield {"type": "error", "data": f"Error processing message: {str(e)}"}
