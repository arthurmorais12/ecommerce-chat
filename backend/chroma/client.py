from pathlib import Path
from typing import Mapping, Optional

import chromadb
import chromadb.utils.embedding_functions as embedding_functions
from chromadb.config import Settings
from utils.documents import generate_document_id, split_pdf


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

        # Configurar embedding function explicitamente
        self.embedding_function = (
            embedding_functions.SentenceTransformerEmbeddingFunction(
                model_name="all-MiniLM-L6-v2"
            )
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

    def insert_documents(self, pdf_dir: str):
        pdf_paths = [str(p) for p in Path(pdf_dir).glob("*.pdf")]

        for path in pdf_paths:
            document_id = generate_document_id(path)
            filename = Path(path).name

            existing = self.collection.get(where={"document_id": document_id}, limit=1)

            if existing["ids"]:
                print(f"Document {filename} already exists")
                continue

            try:
                docs = split_pdf(path)

                ids = [f"{document_id}-chunk-{i}" for i in range(len(docs))]
                metadata = [
                    {
                        "document_id": document_id,
                        "chunk_index": i,
                        "filename": filename,
                        "source": path,
                    }
                    for i in range(len(docs))
                ]

                self.collection.add(documents=docs, ids=ids, metadatas=metadata)

                print(
                    f"Document {document_id} inserted successfully with filename {filename}"
                )

            except Exception as e:
                print(f"Error inserting document {filename}: {e}")

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


chroma_client = ChromaClient()
