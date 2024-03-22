const containerVideos = document.querySelector('.videos__container')
const barraDePesquisa = document.querySelector('.pesquisar__input')
const botoesCategoria = document.querySelectorAll('.superior__item')

async function buscarEMostrarVideos(){
    try {
        const busca = await fetch("https://raw.githubusercontent.com/NickProfessor/projeto-vidflow/main/backend/videos.json");
        if (!busca.ok) {
            throw new Error("Erro ao carregar os vídeos: " + busca.status);
        }

        const data = await busca.json();
        let videos;
        // Verifica se a resposta é um objeto com uma chave de vídeos
        if (data && data.videos && Array.isArray(data.videos)) {
            videos = data.videos;
        } else if (Array.isArray(data)) { // Verifica se a resposta é diretamente uma matriz
            videos = data;
        } else {
            throw new Error("Os vídeos não estão em um formato válido.");
        }

        videos.forEach((video) => {
            if (!video.categoria) {
                throw new Error("Vídeo sem categoria.");
            }
            containerVideos.innerHTML += `
            <li class="videos__item">
                    <iframe src="${video.url}" title="${video.titulo}" frameborder="0" allowfullscreen></iframe>
                    <div class="descricao-video">
                        <img class="img-canal" src="${video.imagem} alt="Logo do canal">
                        <h3 class="titulo-video" id="titulo-video">${video.titulo}</h3>
                        <p class="titulo-canal">${video.descricao}</p>
                        <p class="categoria" hidden>${video.categoria}</p>
                    </div>
                </li>
            `;
        });
    } catch(error) {
        containerVideos.innerHTML += `<p style="background-color: red;">Houve um erro ao carregar os vídeos: ${error.message}</p>`;
    } finally {
        
    }
}
{/*  */}
buscarEMostrarVideos();

barraDePesquisa.addEventListener('input', filtrarPesquisa);

function filtrarPesquisa() {
    const videos = document.querySelectorAll('.videos__item');
    const valorFiltro = barraDePesquisa.value.toLowerCase();
  
    videos.forEach((video) => {
      const titulo = video.querySelector('.titulo-video').textContent.toLowerCase();
  
      video.style.display = valorFiltro ? titulo.includes(valorFiltro) ? 'block' : 'none' : 'block';
    });
  }
  
botoesCategoria.forEach((botao) => {
    let nomeDaCategoria = botao.getAttribute("name");
    botao.addEventListener('click', () => filtrarPorCategorias(nomeDaCategoria));
})

function filtrarPorCategorias(filtro) {
    const videos = document.querySelectorAll('.videos__item');
    videos.forEach ((video) => {
        const categoriaVideo = video.querySelector('.categoria').textContent.toLowerCase();
        const valorFiltroCategoria = filtro.toLowerCase();
        video.style.display = !categoriaVideo.includes(valorFiltroCategoria) && valorFiltroCategoria != "tudo" ? 'none' : 'block';
    })
}