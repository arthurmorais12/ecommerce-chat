import uuid

from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver
from langgraph.prebuilt import create_react_agent

from .prompt import VENDEDOR_PROMPT
from .tools import tools

load_dotenv()


class Agent:
    def __init__(self, thread_id: str = None):
        self.model = init_chat_model(
            model="llama-3.1-8b-instant", model_provider="groq"
        )
        self.db_path = "chat_memory.db"
        self.tools = tools
        self.prompt = VENDEDOR_PROMPT
        self.thread_id = thread_id or str(uuid.uuid4())

    async def send_message(self, user_message: str) -> str:
        """Envia mensagem e retorna resposta completa"""
        async with AsyncSqliteSaver.from_conn_string(self.db_path) as checkpointer:
            agent = create_react_agent(
                model=self.model,
                tools=self.tools,
                checkpointer=checkpointer,
                prompt=self.prompt,
            )

            config = {"configurable": {"thread_id": self.thread_id}}

            result = await agent.ainvoke(
                {"messages": [("human", user_message)]}, config
            )

            return result["messages"][-1].content

    async def stream_message(self, user_message: str):
        """Envia mensagem e faz streaming da resposta"""
        async with AsyncSqliteSaver.from_conn_string(self.db_path) as checkpointer:
            agent = create_react_agent(
                model=self.model,
                tools=self.tools,
                checkpointer=checkpointer,
                prompt=self.prompt,
            )

            config = {"configurable": {"thread_id": self.thread_id}}

            try:
                full_response = ""

                async for chunk, metadata in agent.astream(
                    {"messages": [("human", user_message)]},
                    config,
                    stream_mode="messages",
                ):
                    chunk_type = chunk.__class__.__name__
                    if chunk_type in ["AIMessageChunk", "AIMessage"]:
                        token_content = chunk.content
                        full_response += token_content

                        yield {"type": "content", "data": token_content}

                # completion message
                yield {"type": "complete", "data": full_response}
            except Exception as e:
                print(f"Error in streaming: {e}")
                yield {"type": "error", "data": f"Error processing message: {str(e)}"}

    @classmethod
    def build(cls, thread_id: str = None):
        """Factory method para criar instância (não precisa mais ser async!)"""
        return cls(thread_id=thread_id)
