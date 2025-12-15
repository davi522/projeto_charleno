"""
models.py - Modelos de dados usando Programação Orientada a Objetos

Aqui você pode criar classes que representam as "coisas" do seu projeto.
Pense em classes como "moldes" ou "receitas" para criar objetos.

Analogia: Se você tem uma receita de bolo (classe), pode fazer vários bolos (objetos)
         diferentes usando a mesma receita, mas com sabores diferentes!
"""

from datetime import datetime
from typing import Optional


class Interacao:
    """
    Classe que representa uma interação do usuário com a IA.
    
    É como um "registro" de uma conversa - guarda o que o usuário perguntou,
    o que a IA respondeu e quando isso aconteceu.
    
    Atributos:
        id: Número único da interação
        usuario_input: O que o usuário digitou/enviou
        ia_resposta: O que a IA respondeu
        timestamp: Quando isso aconteceu
        categoria: Tipo de interação (opcional)
    """
    
    # Contador de classe - compartilhado por todas as interações
    _contador = 0
    
    def __init__(
        self, 
        usuario_input: str, 
        ia_resposta: str, 
        categoria: Optional[str] = None
    ):
        """
        Construtor - É chamado quando você cria uma nova interação.
        
        Analogia: Como preencher uma ficha com os dados da conversa!
        
        Args:
            usuario_input: O que o usuário digitou
            ia_resposta: Resposta da IA
            categoria: Tipo de interação (ex: "pergunta", "geração")
        """
        Interacao._contador += 1
        self.id = Interacao._contador
        self.usuario_input = usuario_input
        self.ia_resposta = ia_resposta
        self.timestamp = datetime.now()
        self.categoria = categoria or "geral"
    
    def para_dict(self) -> dict:
        """
        Transforma a interação em um dicionário (útil para JSON/templates).
        
        Returns:
            Dicionário com todos os dados da interação
        """
        return {
            "id": self.id,
            "usuario_input": self.usuario_input,
            "ia_resposta": self.ia_resposta,
            "timestamp": self.timestamp.strftime("%d/%m/%Y %H:%M:%S"),
            "categoria": self.categoria
        }
    
    def __str__(self) -> str:
        """
        Representação em texto da interação (útil para debug).
        """
        return f"Interacao #{self.id} [{self.categoria}] - {self.timestamp}"
    
    def __repr__(self) -> str:
        """
        Representação técnica do objeto.
        """
        return f"Interacao(id={self.id}, categoria='{self.categoria}')"


class HistoricoInteracoes:
    """
    Classe que gerencia um histórico de várias interações.
    
    Analogia: Como um caderno onde você anota todas as conversas!
    
    Essa classe usa o conceito de COMPOSIÇÃO - ela "tem" várias
    Interacoes dentro dela (relação "tem-um").
    """
    
    def __init__(self, limite: int = 50):
        """
        Cria um novo histórico.
        
        Args:
            limite: Máximo de interações a guardar (evita usar muita memória)
        """
        self.interacoes: list[Interacao] = []
        self.limite = limite
    
    def adicionar(self, interacao: Interacao) -> None:
        """
        Adiciona uma nova interação ao histórico.
        
        Se já tiver muitas interações, remove as mais antigas.
        
        Args:
            interacao: Objeto Interacao para adicionar
        """
        self.interacoes.append(interacao)
        
        # Se passou do limite, remove as mais antigas
        if len(self.interacoes) > self.limite:
            self.interacoes.pop(0)  # Remove a primeira (mais antiga)
    
    def obter_todas(self) -> list[dict]:
        """
        Retorna todas as interações como lista de dicionários.
        
        Returns:
            Lista com todas as interações em formato dict
        """
        return [interacao.para_dict() for interacao in self.interacoes]
    
    def obter_por_categoria(self, categoria: str) -> list[dict]:
        """
        Filtra interações por categoria.
        
        Args:
            categoria: Categoria para filtrar
            
        Returns:
            Lista de interações da categoria especificada
        """
        return [
            interacao.para_dict() 
            for interacao in self.interacoes 
            if interacao.categoria == categoria
        ]
    
    def limpar(self) -> None:
        """
        Remove todas as interações do histórico.
        """
        self.interacoes.clear()
    
    def total(self) -> int:
        """
        Retorna quantas interações estão no histórico.
        
        Returns:
            Número de interações
        """
        return len(self.interacoes)
    
    def __len__(self) -> int:
        """
        Permite usar len(historico) para saber quantas interações tem.
        """
        return self.total()


# 💡 DICA: Você pode criar suas próprias classes aqui!
#
# Exemplos:
# - class Personagem (para gerador de personagens RPG)
# - class Historia (para gerador de histórias)
# - class Quiz (para sistema de perguntas)
# - class Rima (para batalha de rimas)
#
# Lembre-se: Classes devem representar "coisas" do seu domínio!
