from chroma.client import chroma_client
from langchain_core.tools import tool


@tool
def get_product_info(query: str) -> str:
    """
    Busca informações sobre um produto no banco de dados

    Args:
        query: A consulta para buscar informações sobre o produto

    Returns:
        Uma string com o resultado da busca
    """
    collection = chroma_client.get_or_create_collection()

    results = collection.query(
        query_texts=[query],
        n_results=3,  # Retorna apenas 2 documentos
    )

    if results["documents"] and results["documents"][0]:
        return "\n\n".join(results["documents"][0])

    return "Nenhum produto encontrado."


tools = [get_product_info]
