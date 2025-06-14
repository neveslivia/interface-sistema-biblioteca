const apiUrl = "http://localhost:8080/api/bibliotecario";

document.addEventListener("DOMContentLoaded", () => {
  carregarBibliotecarios();

  document.getElementById("formCadastro").addEventListener("submit", (e) => {
    e.preventDefault();
    cadastrarBibliotecario();
  });

  document.getElementById("btnAtualizar").addEventListener("click", () => {
    atualizarBibliotecario();
  });
});

function cadastrarBibliotecario() {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;

  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email }),
  })
    .then(res => res.json())
    .then(() => {
      Swal.fire("Sucesso!", "Bibliotecário cadastrado!", "success");
      limparFormulario();
      carregarBibliotecarios();
    });
}

function carregarBibliotecarios() {
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      const tabela = document.getElementById("tabelaCorpo");
      tabela.innerHTML = "";

      data.forEach(b => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="border px-4 py-2">${b.nome}</td>
          <td class="border px-4 py-2">${b.email}</td>
          <td class="border px-4 py-2">
            <button onclick="editarBibliotecario(${b.id})" class="bg-yellow-400 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-500">Editar</button>
            <button onclick="deletarBibliotecario(${b.id})" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Remover</button>
          </td>
        `;
        tabela.appendChild(tr);
      });
    });
}

function editarBibliotecario(id) {
  fetch(`${apiUrl}/${id}`)
    .then(res => res.json())
    .then(b => {
      document.getElementById("id").value = b.id;
      document.getElementById("nome").value = b.nome;
      document.getElementById("email").value = b.email;
      document.getElementById("btnAdicionar").classList.add("hidden");
      document.getElementById("btnAtualizar").classList.remove("hidden");
    });
}

function atualizarBibliotecario() {
  const id = document.getElementById("id").value;
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;

  fetch(`${apiUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email }),
  })
    .then(res => res.json())
    .then(() => {
      Swal.fire("Atualizado!", "Bibliotecário atualizado com sucesso!", "success");
      limparFormulario();
      carregarBibliotecarios();
    });
}

function deletarBibliotecario(id) {
  Swal.fire({
    title: "Tem certeza?",
    text: "Essa ação não poderá ser desfeita!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e3342f",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Sim, deletar!"
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`${apiUrl}/${id}`, {
        method: "DELETE"
      })
        .then(() => {
          Swal.fire("Removido!", "Bibliotecário removido com sucesso.", "success");
          carregarBibliotecarios();
        });
    }
  });
}

function limparFormulario() {
  document.getElementById("id").value = "";
  document.getElementById("nome").value = "";
  document.getElementById("email").value = "";
  document.getElementById("btnAdicionar").classList.remove("hidden");
  document.getElementById("btnAtualizar").classList.add("hidden");
}
