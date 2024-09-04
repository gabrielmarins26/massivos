// Função para gerar um ID único baseado em timestamp
function gerarIdUnico() {
  return Date.now().toString();
}

// Função para formatar datas no formato DD/MM/AAAA HH:MM
function formatarData(dataISO) {
  if (!dataISO) return "";
  const data = new Date(dataISO);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0"); // Mês começa do zero
  const ano = data.getFullYear();
  const horas = String(data.getHours()).padStart(2, "0");
  const minutos = String(data.getMinutes()).padStart(2, "0");
  return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
}

// Função para cadastrar um novo incidente
function cadastrarIncidente() {
  const titulo = document.getElementById("titulo").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const numero = document.getElementById("numero").value.trim();
  const dataIdentificacao = document.getElementById("dataIdentificacao").value;
  const dataAtualizacao = document.getElementById("dataAtualizacao").value;
  const dataResolucao = document.getElementById("dataResolucao").value;
  const nomeAnalista = document.getElementById("nomeAnalista").value.trim();

  if (!titulo) {
    alert("Titulo é obrigatório!");
    return;
  }

  let incidentes = JSON.parse(localStorage.getItem("incidentes")) || [];

  // Gerar um ID único
  const id = gerarIdUnico();

  const incidente = {
    id, // Salvar o ID único
    titulo,
    descricao,
    numero,
    dataIdentificacao,
    dataAtualizacao,
    dataResolucao,
    nomeAnalista,
  };

  incidentes.push(incidente);
  localStorage.setItem("incidentes", JSON.stringify(incidentes));

  carregarIncidentes();
  gerarComunicado();
}

// Função para carregar incidentes salvos no localStorage
function carregarIncidentes() {
  const incidentes = JSON.parse(localStorage.getItem("incidentes")) || [];
  const tabela = document
    .getElementById("incidentTable")
    .getElementsByTagName("tbody")[0];
  tabela.innerHTML = "";

  incidentes.forEach((incidente) => {
    const row = tabela.insertRow();
    const cell = row.insertCell(0);
    cell.textContent = incidente.titulo;

    // Adiciona o ID do incidente à linha da tabela
    row.setAttribute("data-id", incidente.id);

    // Tornar a linha clicável para carregar os dados no formulário
    row.addEventListener("click", function () {
      carregarIncidenteNoFormulario(incidente.id);
    });
  });
}

// Função para carregar dados do incidente selecionado no formulário
function carregarIncidenteNoFormulario(id) {
  const incidentes = JSON.parse(localStorage.getItem("incidentes")) || [];
  const incidente = incidentes.find((inc) => inc.id === id);

  if (!incidente) return;

  document.getElementById("titulo").value = incidente.titulo;
  document.getElementById("descricao").value = incidente.descricao;
  document.getElementById("numero").value = incidente.numero;
  document.getElementById("dataIdentificacao").value =
    incidente.dataIdentificacao;
  document.getElementById("dataAtualizacao").value = incidente.dataAtualizacao;
  document.getElementById("dataResolucao").value = incidente.dataResolucao;
  document.getElementById("nomeAnalista").value = incidente.nomeAnalista;

  // Salvar o ID do incidente atual em uma variável no formulário
  document.getElementById("comunicadoForm").setAttribute("data-id", id);

  gerarComunicado();
}

// Função para atualizar o incidente sempre que um campo for modificado
function gerarComunicado() {
  const id = document.getElementById("comunicadoForm").getAttribute("data-id");
  const titulo = document.getElementById("titulo").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const numero = document.getElementById("numero").value.trim();
  const dataIdentificacao = document.getElementById("dataIdentificacao").value;
  const dataAtualizacao = document.getElementById("dataAtualizacao").value;
  const dataResolucao = document.getElementById("dataResolucao").value;
  const nomeAnalista = toCamelCase(
    document.getElementById("nomeAnalista").value.trim()
  );

  if (!titulo) {
    return;
  }

  atualizarIncidente(
    id,
    titulo,
    descricao,
    numero,
    dataIdentificacao,
    dataAtualizacao,
    dataResolucao,
    nomeAnalista
  );

  const tipo = document.getElementById("tipo").value;
  let emailTexto = "";
  let whatsappTexto = "";
  let workplaceTexto = "";

  if (tipo === "PADRÃO") {
    emailTexto = `🔔🚨INCIDENTE MASSIVO - ${titulo} - <<${numero}>>🚨🔔
Olá!

${descricao}

⏳ A falha foi identificada em ${formatarData(dataIdentificacao)}.
⏰ Nova atualização sobre este caso em ${formatarData(dataAtualizacao)}.

Para mais informações, entrar em contato com ${nomeAnalista}.

Atenciosamente,`;

    whatsappTexto = `*🔔🚨INCIDENTE MASSIVO - ${titulo}🚨🔔*
Olá!

${descricao}

⏳ A falha foi identificada em ${formatarData(dataIdentificacao)}.
⏰ Nova atualização sobre este caso em ${formatarData(dataAtualizacao)}.

Para mais informações, entrar em contato com ${nomeAnalista}.`;

    workplaceTexto = `🔔🚨INCIDENTE MASSIVO - ${titulo}🚨🔔
Olá!  ${descricao}
⏳ A falha foi identificada em ${formatarData(dataIdentificacao)}.
⏰ Nova atualização sobre este caso em ${formatarData(dataAtualizacao)}.
Para mais informações, entrar em contato com ${nomeAnalista}.
#comunicadooficial #incidentemassivo #incidentetecnologia #falhadeservico #indisponibilidade #getic`;
  } else if (tipo === "ATUALIZAÇÃO") {
    emailTexto = `🔔🚨[ATUALIZAÇÃO] INCIDENTE MASSIVO - ${titulo} - <<${numero}>>🚨🔔
Olá!

${descricao}

⏰ Nova atualização sobre este caso em ${formatarData(dataAtualizacao)}.

Para mais informações, entrar em contato com ${nomeAnalista}.

Atenciosamente,`;

    whatsappTexto = `*🔔🚨[ATUALIZAÇÃO] INCIDENTE MASSIVO - ${titulo}🚨🔔*
Olá!

${descricao}

⏰ Nova atualização sobre este caso em ${formatarData(dataAtualizacao)}.

Para mais informações, entrar em contato com ${nomeAnalista}.`;

    workplaceTexto = `🔔🚨[ATUALIZAÇÃO] INCIDENTE MASSIVO - ${titulo}🚨🔔
Olá!  ${descricao}
⏰ Nova atualização sobre este caso em ${formatarData(dataAtualizacao)}.
Para mais informações, entrar em contato com ${nomeAnalista}.
#comunicadooficial #incidentemassivo #incidentetecnologia #falhadeservico #indisponibilidade #getic`;
  } else if (tipo === "RESOLVIDO") {
    emailTexto = `🔔✅[RESOLVIDO] INCIDENTE MASSIVO - ${titulo} - <<${numero}>>✅🔔
Olá!
 
${descricao}

✅ O problema foi resolvido em ${formatarData(dataResolucao)}.

Para mais informações, entrar em contato com ${nomeAnalista}.
 
Atenciosamente,`;

    whatsappTexto = `*🔔✅[RESOLVIDO] INCIDENTE MASSIVO - ${titulo}✅🔔*
Olá!

${descricao}

✅ O problema foi resolvido em ${formatarData(dataResolucao)}.

Para mais informações, entrar em contato com ${nomeAnalista}.`;

    workplaceTexto = `🔔✅[RESOLVIDO] INCIDENTE MASSIVO - ${titulo}✅🔔
Olá!  ${descricao}
✅ O problema foi resolvido em ${formatarData(dataResolucao)}.
Para mais informações, entrar em contato com ${nomeAnalista}.
#comunicadooficial #incidentemassivo #incidentetecnologia #falhadeservico #indisponibilidade #getic`;
  }

  document.getElementById("outputEmail").innerText = emailTexto;
  document.getElementById("outputWhatsApp").innerText = whatsappTexto;
  document.getElementById("outputWorkplace").innerText = workplaceTexto;
}

// Função para atualizar o incidente no localStorage
function atualizarIncidente(
  id,
  titulo,
  descricao,
  numero,
  dataIdentificacao,
  dataAtualizacao,
  dataResolucao,
  nomeAnalista
) {
  let incidentes = JSON.parse(localStorage.getItem("incidentes")) || [];

  const indiceIncidente = incidentes.findIndex((inc) => inc.id === id);

  if (indiceIncidente !== -1) {
    // Atualizar incidente existente
    incidentes[indiceIncidente] = {
      id, // Preserva o ID do incidente
      titulo,
      descricao,
      numero,
      dataIdentificacao,
      dataAtualizacao,
      dataResolucao,
      nomeAnalista,
    };

    localStorage.setItem("incidentes", JSON.stringify(incidentes));
    carregarIncidentes(); // Atualiza a lista de incidentes na tela
  }
}

// Função para excluir um incidente
function excluirIncidente() {
  const id = document.getElementById("comunicadoForm").getAttribute("data-id");

  let incidentes = JSON.parse(localStorage.getItem("incidentes")) || [];

  // Filtra a lista de incidentes removendo aquele com o ID especificado
  incidentes = incidentes.filter((incidente) => incidente.id !== id);

  // Atualiza o localStorage com a lista filtrada
  localStorage.setItem("incidentes", JSON.stringify(incidentes));

  // Recarregar a tabela de incidentes
  carregarIncidentes();

  // Limpar o formulário e saídas
  document.getElementById("comunicadoForm").reset();
  document.getElementById("outputEmail").innerText = "";
  document.getElementById("outputWhatsApp").innerText = "";
  document.getElementById("outputWorkplace").innerText = "";

  // Verificar se há incidentes restantes após a exclusão
  if (incidentes.length > 0) {
    // Selecionar a tabela de incidentes
    const tabela = document
      .getElementById("incidentTable")
      .getElementsByTagName("tbody")[0];

    // Obter a última linha da tabela
    const ultimaLinha = tabela.rows[tabela.rows.length - 1];

    // Simular o clique no último item da tabela
    ultimaLinha.click();
  }
}

// Função para copiar o conteúdo gerado
function copiarConteudo(id) {
  const preElement = document.getElementById(id);
  const tempTextArea = document.createElement("textarea");

  let content = preElement.innerHTML.replace(/<br\s*\/?>/gi, "\n");

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = content;
  content = tempDiv.textContent || tempDiv.innerText || "";

  tempTextArea.value = content;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand("copy");
  document.body.removeChild(tempTextArea);
}

// Função para converter texto para camel case
function toCamelCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function limparFormulario() {
  document.getElementById("comunicadoForm").reset();
}

// Função para limpar todo o localStorage
function limparLocalStorage() {
  if (confirm("Tem certeza de que deseja limpar todos os dados?")) {
    localStorage.clear();
    carregarIncidentes();
    alert("Todos os dados foram removidos.");
  }
}

// Carrega os incidentes quando a página for carregada
window.onload = function () {
  carregarIncidentes();
};
