/**
 * script.js - JavaScript Principal
 * 
 * Este arquivo contém todas as funcionalidades interativas da aplicação.
 * 
 * 💡 Analogia: Se HTML é o esqueleto e CSS é a roupa, JavaScript é o cérebro
 *    que faz tudo funcionar e responder às ações do usuário!
 */

// 🚀 Executa quando a página terminar de carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎉 Aplicação carregada com sucesso!');
    
    // Inicializa funcionalidades
    inicializarMenuMobile();
    inicializarValidacaoFormulario();
    verificarPromptReutilizado();
    adicionarAnimacoesDeEntrada();
});


// 📱 Menu Mobile - Abrir/Fechar
function inicializarMenuMobile() {
    const btnMenu = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    
    if (btnMenu && menu) {
        btnMenu.addEventListener('click', function() {
            menu.classList.toggle('hidden');
            
            // Anima o ícone do botão
            this.classList.toggle('rotate-90');
        });
    }
}


// ✅ Validação de Formulário
function inicializarValidacaoFormulario() {
    const form = document.getElementById('form-principal');
    
    if (!form) return;
    
    const textarea = document.getElementById('user_input');
    const btnSubmit = form.querySelector('button[type="submit"]');
    
    // Validação em tempo real
    textarea.addEventListener('input', function() {
        const tamanho = this.value.trim().length;
        
        if (tamanho < 3) {
            btnSubmit.disabled = true;
            btnSubmit.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            btnSubmit.disabled = false;
            btnSubmit.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    });
    
    // Prevenir envio de formulário vazio
    form.addEventListener('submit', function(e) {
        const texto = textarea.value.trim();
        
        if (texto.length < 3) {
            e.preventDefault();
            mostrarNotificacao('❌ Digite pelo menos 3 caracteres!', 'erro');
            textarea.focus();
            return false;
        }
        
        if (texto.length > 500) {
            e.preventDefault();
            mostrarNotificacao('❌ Texto muito longo! Máximo 500 caracteres.', 'erro');
            return false;
        }
        
        // Tudo OK - mostra loading
        mostrarLoading();
    });
}


// 🔄 Verificar se tem prompt reutilizado do histórico
function verificarPromptReutilizado() {
    if (window.location.pathname !== '/') return;
    
    const promptSalvo = localStorage.getItem('reutilizar_prompt');
    
    if (promptSalvo) {
        const textarea = document.getElementById('user_input');
        const charCount = document.getElementById('char-count');
        
        if (textarea) {
            textarea.value = promptSalvo;
            if (charCount) {
                charCount.textContent = promptSalvo.length;
            }
            
            // Scroll suave para o textarea
            textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
            textarea.focus();
            
            // Remove do localStorage
            localStorage.removeItem('reutilizar_prompt');
            
            // Mostra notificação
            mostrarNotificacao('✅ Prompt reutilizado! Edite ou envie novamente.', 'sucesso');
        }
    }
}


// ⏳ Mostrar Loading
function mostrarLoading() {
    const btnText = document.getElementById('btn-text');
    const btnLoading = document.getElementById('btn-loading');
    
    if (btnText && btnLoading) {
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');
    }
    
    // Cria barra de progresso
    criarBarraProgresso();
}


// 📊 Barra de Progresso
function criarBarraProgresso() {
    // Remove barra anterior se existir
    const barraExistente = document.querySelector('.progress-bar');
    if (barraExistente) {
        barraExistente.remove();
    }
    
    const barra = document.createElement('div');
    barra.className = 'progress-bar';
    barra.style.width = '0%';
    document.body.appendChild(barra);
    
    // Anima a barra
    let progresso = 0;
    const intervalo = setInterval(() => {
        progresso += Math.random() * 15;
        
        if (progresso > 90) {
            progresso = 90;
            clearInterval(intervalo);
        }
        
        barra.style.width = progresso + '%';
    }, 300);
}


// 🔔 Sistema de Notificações
function mostrarNotificacao(mensagem, tipo = 'info') {
    // Remove notificações anteriores
    const notifAnterior = document.querySelector('.notificacao');
    if (notifAnterior) {
        notifAnterior.remove();
    }
    
    // Cores por tipo
    const cores = {
        sucesso: 'bg-green-500',
        erro: 'bg-red-500',
        info: 'bg-blue-500',
        aviso: 'bg-yellow-500'
    };
    
    const cor = cores[tipo] || cores.info;
    
    // Cria notificação
    const notif = document.createElement('div');
    notif.className = `notificacao fixed top-4 right-4 ${cor} text-white px-6 py-4 rounded-lg shadow-2xl z-50 transform transition-all duration-300 translate-x-full`;
    notif.innerHTML = `
        <div class="flex items-center space-x-3">
            <span>${mensagem}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="text-white hover:text-gray-200">
                ✕
            </button>
        </div>
    `;
    
    document.body.appendChild(notif);
    
    // Anima entrada
    setTimeout(() => {
        notif.classList.remove('translate-x-full');
    }, 100);
    
    // Remove automaticamente após 5 segundos
    setTimeout(() => {
        notif.classList.add('translate-x-full');
        setTimeout(() => notif.remove(), 300);
    }, 5000);
}


// ✨ Animações de Entrada para Elementos
function adicionarAnimacoesDeEntrada() {
    const elementos = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    entry.target.style.transition = 'all 0.6s ease';
                    
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elementos.forEach(el => observer.observe(el));
}


// 🎯 Atalhos de Teclado
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K = Focar no input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const textarea = document.getElementById('user_input');
        if (textarea) {
            textarea.focus();
            mostrarNotificacao('✨ Campo focado!', 'info');
        }
    }
    
    // Ctrl/Cmd + Enter = Enviar formulário
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const form = document.getElementById('form-principal');
        if (form && document.activeElement.id === 'user_input') {
            e.preventDefault();
            form.dispatchEvent(new Event('submit'));
        }
    }
    
    // Esc = Limpar textarea
    if (e.key === 'Escape') {
        const textarea = document.getElementById('user_input');
        if (textarea && document.activeElement === textarea) {
            textarea.value = '';
            const charCount = document.getElementById('char-count');
            if (charCount) charCount.textContent = '0';
            mostrarNotificacao('🗑️ Campo limpo!', 'info');
        }
    }
});


// 📋 Função Global para Copiar Texto
window.copiarTexto = async function(texto) {
    try {
        await navigator.clipboard.writeText(texto);
        mostrarNotificacao('✅ Copiado para área de transferência!', 'sucesso');
        return true;
    } catch (err) {
        mostrarNotificacao('❌ Erro ao copiar: ' + err, 'erro');
        return false;
    }
};


// 💾 Salvar Rascunho Automaticamente (LocalStorage)
let timeoutRascunho;

function salvarRascunhoAutomatico() {
    const textarea = document.getElementById('user_input');
    
    if (!textarea) return;
    
    textarea.addEventListener('input', function() {
        clearTimeout(timeoutRascunho);
        
        timeoutRascunho = setTimeout(() => {
            if (this.value.trim().length > 0) {
                localStorage.setItem('rascunho_ia', this.value);
                console.log('💾 Rascunho salvo automaticamente');
            }
        }, 1000); // Salva 1 segundo após parar de digitar
    });
}

// Restaurar rascunho ao carregar página
function restaurarRascunho() {
    if (window.location.pathname !== '/') return;
    
    const rascunho = localStorage.getItem('rascunho_ia');
    const textarea = document.getElementById('user_input');
    
    if (rascunho && textarea && !textarea.value) {
        if (confirm('📝 Encontramos um rascunho salvo. Deseja restaurá-lo?')) {
            textarea.value = rascunho;
            const charCount = document.getElementById('char-count');
            if (charCount) charCount.textContent = rascunho.length;
        } else {
            localStorage.removeItem('rascunho_ia');
        }
    }
}

// Inicializa salvamento automático
document.addEventListener('DOMContentLoaded', function() {
    salvarRascunhoAutomatico();
    restaurarRascunho();
});


// 🎨 Easter Egg - Konami Code (↑ ↑ ↓ ↓ ← → ← → B A)
let codigoKonami = [];
const sequenciaKonami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', function(e) {
    codigoKonami.push(e.key);
    codigoKonami = codigoKonami.slice(-10);
    
    if (JSON.stringify(codigoKonami) === JSON.stringify(sequenciaKonami)) {
        ativarModoEasterEgg();
    }
});

function ativarModoEasterEgg() {
    document.body.classList.add('animated-gradient');
    mostrarNotificacao('🎉 MODO SECRETO ATIVADO! 🚀', 'sucesso');
    
    // Adiciona confete (se quiser, pode instalar biblioteca de confetes)
    console.log('🎊 Easter Egg Ativado!');
}


// 📊 Analytics Simples (Opcional)
function registrarEvento(categoria, acao, valor) {
    console.log(`📊 Evento: ${categoria} - ${acao} - ${valor}`);
    // Aqui você pode integrar com Google Analytics, etc
}


// 🔧 Utilitários Globais
window.utils = {
    copiarTexto,
    mostrarNotificacao,
    registrarEvento
};


// 🎯 Log de Boas-vindas
console.log(`
╔══════════════════════════════════════╗
║   🤖 Projeto IA - Starter Code      ║
║   Desenvolvido com ❤️ por seu grupo ║
║   FastAPI + Gemini AI + Tailwind    ║
╚══════════════════════════════════════╝

💡 Dicas:
- Ctrl/Cmd + K = Focar no input
- Ctrl/Cmd + Enter = Enviar
- Esc = Limpar campo

📚 Explore e customize!
`);
