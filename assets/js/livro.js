const apiUrl = "http://localhost:8080/api/livro";

document.addEventListener("DOMContentLoaded", () => {
  carregarLivros();

  document.getElementById("formCadastro").addEventListener("submit", (e) => {
    e.preventDefault();
    cadastrarLivro();
  });

  document.getElementById("btnAtualizar").addEventListener("click", () => {
    atualizarLivro();
  });
});

function cadastrarLivro() {
  const livro = coletarDados();

  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(livro),
  })
    .then(res => res.json())
    .then(() => {
      Swal.fire("Sucesso!", "Livro cadastrado!", "success");
      limparFormulario();
      carregarLivros();
    });
}

function carregarLivros() {
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      const tabela = document.getElementById("tabelaCorpo");
      tabela.innerHTML = "";

      data.forEach(l => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="border px-4 py-2">${l.id}</td>
          <td class="border px-4 py-2">${l.bibliotecario?.id || ""}</td>
          <td class="border px-4 py-2">${l.titulo}</td>
          <td class="border px-4 py-2">${l.autor}</td>
          <td class="border px-4 py-2">${l.genero}</td>
          <td class="border px-4 py-2">${l.status}</td>
          <td class="border px-4 py-2">${l.dataCadastro}</td>
          <td class="border px-4 py-2">
            <button onclick="editarLivro(${l.id})" class="bg-yellow-400 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-500">Editar</button>
            <button onclick="deletarLivro(${l.id})" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Remover</button>
          </td>
        `;
        tabela.appendChild(tr);
      });
    });
}

function editarLivro(id) {
  fetch(`${apiUrl}/${id}`)
    .then(res => res.json())
    .then(l => {
      document.getElementById("id").value = l.id;
      document.getElementById("bibliotecarioId").value = l.bibliotecario?.id || "";
      document.getElementById("titulo").value = l.titulo;
      document.getElementById("autor").value = l.autor;
      document.getElementById("genero").value = l.genero;
      document.getElementById("status").value = l.status;
      document.getElementById("dataCadastro").value = l.dataCadastro;

      document.getElementById("btnAdicionar").classList.add("hidden");
      document.getElementById("btnAtualizar").classList.remove("hidden");
    });
}

function atualizarLivro() {
  const id = document.getElementById("id").value;
  const livro = coletarDados();

  fetch(`${apiUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(livro),
  })
    .then(res => res.json())
    .then(() => {
      Swal.fire("Atualizado!", "Livro atualizado com sucesso!", "success");
      limparFormulario();
      carregarLivros();
    });
}

function deletarLivro(id) {
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
      }).then(() => {
        Swal.fire("Removido!", "Livro removido com sucesso.", "success");
        carregarLivros();
      });
    }
  });
}

function coletarDados() {
  return {
    bibliotecario: { id: parseInt(document.getElementById("bibliotecarioId").value) },
    titulo: document.getElementById("titulo").value,
    autor: document.getElementById("autor").value,
    genero: document.getElementById("genero").value,
    status: document.getElementById("status").value,
    dataCadastro: document.getElementById("dataCadastro").value,
  };
}

function limparFormulario() {
  document.getElementById("id").value = "";
  document.getElementById("bibliotecarioId").value = "";
  document.getElementById("titulo").value = "";
  document.getElementById("autor").value = "";
  document.getElementById("genero").value = "";
  document.getElementById("status").value = "";
  document.getElementById("dataCadastro").value = "";
  document.getElementById("btnAdicionar").classList.remove("hidden");
  document.getElementById("btnAtualizar").classList.add("hidden");
}
