// Seleção de elementos
const form = document.getElementById('agendamento-form');
const lista = document.getElementById('lista-agendamentos');
const statusHoje = document.getElementById('status-hoje');

// Carregar dados do LocalStorage ou iniciar vazio
let agendamentos = JSON.parse(localStorage.getItem('agenda_pro')) || [];

// 1. Configurar data mínima no calendário (Hoje)
const hojeData = new Date().toISOString().split('T')[0];
document.getElementById('data').setAttribute('min', hojeData);

// 2. Função para Renderizar a Visão do Proprietário
function renderizarAgenda() {
    const hoje = new Date().toISOString().split('T')[0];
    
    // Filtro rápido para o dono saber quantos tem hoje
    const totalHoje = agendamentos.filter(a => a.data === hoje).length;
    statusHoje.innerText = `Você tem ${totalHoje} compromisso(s) para hoje.`;

    // Ordenar por data e hora
    const agendamentosOrdenados = agendamentos.sort((a, b) => 
        a.data.localeCompare(b.data) || a.horario.localeCompare(b.horario)
    );

    lista.innerHTML = agendamentosOrdenados.map(a => {
        const eHoje = a.data === hoje;
        return `
            <div class="card-agendamento" style="border-left: 6px solid ${eHoje ? '#fdbb2d' : '#1a2a6c'}">
                <div class="info">
                    ${eHoje ? '<span class="tag-hoje">HOJE</span>' : ''}
                    <h4>${a.cliente}</h4>
                    <p>📅 ${a.data.split('-').reverse().join('/')} às 🕒 ${a.horario}</p>
                </div>
                <button onclick="excluirAgendamento(${a.id})" class="btn-excluir">Remover</button>
            </div>
        `;
    }).join('');
}

// 3. Função para Adicionar Agendamento
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const novo = {
        id: Date.now(),
        cliente: document.getElementById('cliente').value,
        data: document.getElementById('data').value,
        horario: document.getElementById('horario').value
    };

    // REGRA: Checar se o horário já está ocupado
    const conflito = agendamentos.find(a => a.data === novo.data && a.horario === novo.horario);

    if (conflito) {
        alert(`🚨 Erro: O horário ${novo.horario} já está reservado por ${conflito.cliente}.`);
        return;
    }

    // Sucesso: Adicionar e Salvar
    agendamentos.push(novo);
    localStorage.setItem('agenda_pro', JSON.stringify(agendamentos));
    
    alert("✅ Agendamento confirmado com sucesso!");
    form.reset();
    renderizarAgenda();
});

// 4. Função para Excluir (Dono limpando a agenda)
function excluirAgendamento(id) {
    if (confirm("Deseja remover este agendamento do sistema?")) {
        agendamentos = agendamentos.filter(a => a.id !== id);
        localStorage.setItem('agenda_pro', JSON.stringify(agendamentos));
        renderizarAgenda();
    }
}

// Inicialização
renderizarAgenda();