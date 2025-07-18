import os
from pathlib import Path
from typing import Mapping, Optional

import chromadb
from chromadb.config import Settings
from chromadb.utils import embedding_functions
from dotenv import load_dotenv

load_dotenv()


class ChromaClient:
    def __init__(self):
        # Diretório para armazenar dados do ChromaDB
        self.data_path = Path("./emb")
        self.data_path.mkdir(exist_ok=True)

        # Configurar ChromaDB com persistência
        self.client = chromadb.PersistentClient(
            path=str(self.data_path),
            settings=Settings(anonymized_telemetry=False, allow_reset=True),
        )

        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError(
                "Chave da API do Google não encontrada. Defina GOOGLE_API_KEY no seu arquivo .env"
            )

        self.embedding_function = (
            embedding_functions.GoogleGenerativeAiEmbeddingFunction(api_key=api_key)
        )

        self.collection = self.client.get_or_create_collection(
            name="docs", embedding_function=self.embedding_function
        )

    def get_client(self):
        """Retorna o cliente do ChromaDB"""
        return self.client

    def get_or_create_collection(self):
        """Obtém ou cria uma coleção"""
        return self.collection

    def get_collection_by_document(self, document_id: str) -> Optional[Mapping]:
        try:
            result = self.collection.get(where={"document_id": document_id})

            if not result["ids"]:
                print(f"Document {document_id} not found")
                return None

            return result

        except Exception as e:
            print(f"Error getting document {document_id}: {e}")
            return None

    def search_similar(
        self, query: str, n_results: int = 5, filename: Optional[str] = None
    ) -> Optional[Mapping]:
        where = {"filename": filename} if filename else None

        results = self.collection.query(
            query_texts=[query],
            n_results=n_results,
            where=where,
        )

        return results


# O código abaixo permanece igual
chroma_client = ChromaClient()
