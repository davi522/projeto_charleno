"""
main.py - Aplicação FastAPI principal
Agora totalmente adaptado para ser um GERADOR DE PIADAS 😂
"""

from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from typing import Annotated

# Importa nossos módulos personalizados
from gemini_service import GeminiService
from models import Interacao, HistoricoInteracoes


# 🚀 Cria a aplicação FastAPI
app = FastAPI(
    title="Gerador de Piadas 😂",
    description="Aplicação de IA especializada em contar piadas",
    version="1.0.0"
)

# 📁 Arquivos estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")

# 🎨 Templates Jinja2
templates = Jinja2Templates(directory="templates")

# 🤖 Inicializa serviço do Gemini
gemini = GeminiService()

# 📝 Histórico
historico = HistoricoInteracoes(limite=50)


# 🏠 Página inicial
@app.get("/", response_class=HTMLResponse)
async def pagina_inicial(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "titulo": "Gerador de Piadas ",
        "descricao": "Peça qualquer tema e receba uma piada na hora!"
        }
    )


# 🎯 Processar input -> gerar piada
@app.post("/processar", response_class=HTMLResponse)
async def processar_input(
    request: Request,
    user_input: Annotated[str, Form()],
    temperatura: Annotated[float, Form()] = 0.9
):
    try:
        if not user_input or len(user_input.strip()) < 2:
            return templates.TemplateResponse(
                "resultado.html",
                {
                    "request": request,
                    "erro": "❌ Escreva pelo menos 2 caracteres!",
                    "user_input": user_input
                }
            )

        #Prompt especializado para gerar piadas
        prompt = f"""
Você agora é um gerador profissional de PIADAS.

Sua função:
- Criar **sempre** uma piada curta, criativa e engraçada.
- Não faça piadas ofensivas ou sem sentido.
- O tema da piada deve ser baseado no pedido do usuário: "{user_input}"
- Não explique a piada, não fale nada além dela.

Agora gere UMA piada:
"""

        resposta_ia = gemini.gerar_conteudo(
            prompt=prompt,
            temperatura=temperatura
        )

        interacao = Interacao(
            usuario_input=user_input,
            ia_resposta=resposta_ia,
            categoria="piada"
        )
        historico.adicionar(interacao)

        return templates.TemplateResponse(
            "resultado.html",
            {
                "request": request,
                "user_input": user_input,
                "resultado": resposta_ia,
                "temperatura": temperatura,
                "total_interacoes": historico.total()
            }
        )

    except Exception as e:
        return templates.TemplateResponse(
            "resultado.html",
            {
                "request": request,
                "erro": f"❌ Erro: {str(e)}",
                "user_input": user_input
            }
        )


# 📜 Histórico
@app.get("/historico", response_class=HTMLResponse)
async def ver_historico(request: Request):
    return templates.TemplateResponse(
        "historico.html",
        {
            "request": request,
            "interacoes": historico.obter_todas(),
            "total": historico.total()
        }
    )


# 🗑️ Limpar histórico
@app.post("/limpar-historico")
async def limpar_historico():
    historico.limpar()
    return {"mensagem": "Histórico limpo!", "total": 0}


# 🏥 Health Check
@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "mensagem": "Aplicação rodando!",
        "versao": "1.0.0",
        "total_interacoes": historico.total()
    }

