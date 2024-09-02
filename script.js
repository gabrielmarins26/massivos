// Carregar incidentes do localStorage ao carregar a página
window.onload = function () {
  loadIncidentsFromStorage();
};

// Função para carregar os incidentes do localStorage para o select
function loadIncidentsFromStorage() {
  const incidentSelect = document.getElementById("incidentSelect");
  const incidents = JSON.parse(localStorage.getItem("incidents")) || [];

  // Limpar o select
  incidentSelect.innerHTML = '<option value="">Selecione...</option>';

  // Adicionar incidentes ao select
  incidents.forEach((incident, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.text = `${incident.titulo} (${incident.numero || "Sem número"})`;
    incidentSelect.appendChild(option);
  });
}

// Função para carregar os dados do incidente selecionado
function loadIncident() {
  const incidents = JSON.parse(localStorage.getItem("incidents")) || [];
  const selectedIndex = document.getElementById("incidentSelect").value;

  if (selectedIndex !== "") {
    const incident = incidents[selectedIndex];
    document.getElementById("tipo").value = incident.tipo;
    document.getElementById("titulo").value = incident.titulo;
    document.getElementById("numero").value = incident.numero;
    document.getElementById("descricao").value = incident.descricao;
    document.getElementById("dataIdentificacao").value =
      incident.dataIdentificacao;
    document.getElementById("dataAtualizacao").value = incident.dataAtualizacao;
    document.getElementById("dataResolucao").value = incident.dataResolucao;
    document.getElementById("nomeAnalista").value = incident.nomeAnalista;
  } else {
    document.getElementById("tipo").value = "";
    document.getElementById("titulo").value = "";
    document.getElementById("numero").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("dataIdentificacao").value = "";
    document.getElementById("dataAtualizacao").value = "";
    document.getElementById("dataResolucao").value = "";
    document.getElementById("nomeAnalista").value = "";
  }

  gerarComunicado();
}

// Função para salvar o incidente no localStorage
function salvarIncidente() {
  const incidents = JSON.parse(localStorage.getItem("incidents")) || [];
  const titulo = document.getElementById("titulo").value.trim();
  const numero = document.getElementById("numero").value.trim();

  if (!titulo) {
    alert("O título do incidente é obrigatório.");
    return;
  }

  const newIncident = {
    tipo: document.getElementById("tipo").value,
    titulo,
    numero,
    descricao: document.getElementById("descricao").value,
    dataIdentificacao: document.getElementById("dataIdentificacao").value,
    dataAtualizacao: document.getElementById("dataAtualizacao").value,
    dataResolucao: document.getElementById("dataResolucao").value,
    nomeAnalista: document.getElementById("nomeAnalista").value,
  };

  // Verifica se o incidente já existe com base no título e número
  const existingIndex = incidents.findIndex(
    (incident) => incident.titulo === titulo && incident.numero === numero
  );

  if (existingIndex !== -1) {
    // Atualizar incidente existente
    incidents[existingIndex] = newIncident;
  } else {
    // Adicionar novo incidente
    incidents.push(newIncident);
  }

  localStorage.setItem("incidents", JSON.stringify(incidents));
  loadIncidentsFromStorage();
}

// Função para excluir o incidente selecionado
function excluirIncidente() {
  const incidents = JSON.parse(localStorage.getItem("incidents")) || [];
  const selectedIndex = document.getElementById("incidentSelect").value;

  if (selectedIndex !== "") {
    incidents.splice(selectedIndex, 1);
    localStorage.setItem("incidents", JSON.stringify(incidents));
    alert("Incidente excluído com sucesso!");
    loadIncidentsFromStorage();
    // Limpar campos de formulário
    document.getElementById("comunicadoForm").reset();
  } else {
    alert("Selecione um incidente para excluir.");
  }
}

// Função para formatar a data no modelo "dd/mm/aaaa às hh:mm"
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

// Função para gerar os textos de comunicado
function gerarComunicado() {
  const tipo = document.getElementById("tipo").value;
  const titulo = document.getElementById("titulo").value.trim();
  const numero = document.getElementById("numero").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const dataIdentificacao = formatarData(
    document.getElementById("dataIdentificacao").value
  );
  const dataAtualizacao = formatarData(
    document.getElementById("dataAtualizacao").value
  );
  const dataResolucao = formatarData(
    document.getElementById("dataResolucao").value
  );
  const nomeAnalista = toCamelCase(
    document.getElementById("nomeAnalista").value.trim()
  );

  let emailTexto = "";
  let whatsappTexto = "";
  let workplaceTexto = "";

  if (tipo === "PADRÃO") {
    emailTexto = `🔔🚨INCIDENTE MASSIVO - ${titulo} - <<${numero}>>🚨🔔
Olá!

${descricao}

⏳ A falha foi identificada em ${dataIdentificacao}.
⏰ Nova atualização sobre este caso em ${dataAtualizacao}.

Para mais informações, o(a) analista ${nomeAnalista} poderá ser consultado(a).

Atenciosamente,`;
    whatsappTexto = `*🔔🚨INCIDENTE MASSIVO - ${titulo}🚨🔔*
Olá!

${descricao}

⏳ A falha foi identificada em ${dataIdentificacao}.
⏰ Nova atualização sobre este caso em ${dataAtualizacao}.

Para mais informações, o(a) analista ${nomeAnalista} poderá ser consultado(a).`;
    workplaceTexto = `🔔🚨INCIDENTE MASSIVO - ${titulo}🚨🔔
Olá!  ${descricao}
⏳ A falha foi identificada em ${dataIdentificacao}.
⏰ Nova atualização sobre este caso em ${dataAtualizacao}.
Para mais informações, o(a) analista ${nomeAnalista} poderá ser consultado(a).
#comunicadooficial #incidentemassivo #incidentetecnologia #falhadeservico #indisponibilidade #getic`;
  } else if (tipo === "ATUALIZAÇÃO") {
    emailTexto = `🔔🚨[ATUALIZAÇÃO] INCIDENTE MASSIVO - ${titulo} - <<${numero}>>🚨🔔
Olá!

${descricao}

⏰ Nova atualização sobre este caso em ${dataAtualizacao}.

Para mais informações, o(a) analista ${nomeAnalista} poderá ser consultado(a).

Atenciosamente,`;
    whatsappTexto = `*🔔🚨[ATUALIZAÇÃO] INCIDENTE MASSIVO - ${titulo}🚨🔔*
Olá!

${descricao}

⏰ Nova atualização sobre este caso em ${dataAtualizacao}.

Para mais informações, o(a) analista ${nomeAnalista} poderá ser consultado(a).`;
    workplaceTexto = `🔔🚨[ATUALIZAÇÃO] INCIDENTE MASSIVO - ${titulo}🚨🔔
Olá!  ${descricao}
⏰ Nova atualização sobre este caso em ${dataAtualizacao}.
Para mais informações, o(a) analista ${nomeAnalista} poderá ser consultado(a).
#comunicadooficial #incidentemassivo #incidentetecnologia #falhadeservico #indisponibilidade #getic`;
  } else if (tipo === "RESOLVIDO") {
    emailTexto = `🔔✅[RESOLVIDO] INCIDENTE MASSIVO - ${titulo} - <<${numero}>>✅🔔
Olá!
 
${descricao}

✅ O problema foi resolvido em ${dataResolucao}.

Para mais informações, o(a) analista ${nomeAnalista} poderá ser consultado(a).
 
Atenciosamente,`;
    whatsappTexto = `*🔔✅[RESOLVIDO] INCIDENTE MASSIVO - ${titulo}✅🔔*
Olá!

${descricao}

✅ O problema foi resolvido em ${dataResolucao}.

Para mais informações, o(a) analista ${nomeAnalista} poderá ser consultado(a).`;
    workplaceTexto = `🔔✅[RESOLVIDO] INCIDENTE MASSIVO - ${titulo}✅🔔
Olá!  ${descricao}
✅ O problema foi resolvido em ${dataResolucao}.
Para mais informações, o(a) analista ${nomeAnalista} poderá ser consultado(a).
#comunicadooficial #incidentemassivo #incidentetecnologia #falhadeservico #indisponibilidade #getic`;
  }

  document.getElementById("outputEmail").innerText = emailTexto;
  document.getElementById("outputWhatsApp").innerText = whatsappTexto;
  document.getElementById("outputWorkplace").innerText = workplaceTexto;
}

function copiarConteudo(id) {
  const preElement = document.getElementById(id);
  const tempTextArea = document.createElement("textarea");

  // Substitui <br> por quebras de linha reais
  let content = preElement.innerHTML.replace(/<br\s*\/?>/gi, "\n");

  // Cria um elemento temporário para decodificar entidades HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = content;

  // Obtém o texto decodificado
  content = tempDiv.textContent || tempDiv.innerText || "";

  // Copia o conteúdo decodificado para a área de transferência
  tempTextArea.value = content;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand("copy");
  document.body.removeChild(tempTextArea);
}

function toCamelCase(str) {
  return str
    .toLowerCase() // Transforma toda a string em minúsculas
    .split(" ") // Separa as palavras por espaço
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1); // Capitaliza a primeira letra de cada palavra
    })
    .join(" "); // Junta as palavras novamente com espaço
}
