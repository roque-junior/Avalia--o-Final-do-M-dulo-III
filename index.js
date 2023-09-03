
let currentpage = 1;
 


function loadCharacters(page) {
  axios.get(`https://rickandmortyapi.com/api/character/?page=${page}`)
    .then(response => {
      const characters = response.data.results;
      const charactersPerColumn = Math.ceil(characters.length / 4); // Divide os personagens em 4 colunas
      const columns = [[], [], [], []]; // Array para armazenar personagens em cada coluna

      // Divide os personagens em quatro colunas
      for (let i = 0; i < characters.length; i++) {
        const columnIndex = i % 4;
        columns[columnIndex].push(characters[i]);
      }

      // Renderiza os personagens em suas respectivas colunas
      columns.forEach((column, index) => {
        renderCharacters(column, index);
      });
    })
    .catch(error => {
      console.error('Erro ao obter os personagens:', error);
    });
}
  
   function fetchLastEpisodeForCharacters(characters) {
    const episodePromises = characters.map(character => {
      const lastEpisodeUrl = character.episode[character.episode.length - 1];
      return axios.get(lastEpisodeUrl);
    });
  
    Promise.all(episodePromises)
      .then(episodesResponses => {
        episodesResponses.forEach((response, index) => {
          const episodeName = response.data.name; 
                const episodeNumber = response.data.episode; 

                characters[index].lastEpisode = {
                    name: episodeName,
                    episode: episodeNumber
                };
            });

            renderCharacters(characters);
           
        })
        .catch(error => {
            console.error('Erro ao obter informações de episódio:', error);
        });
}

function proximo() {
    currentpage++
    loadCharacters(currentpage);
}


function retornar(){
    if (currentpage > 1) {
        currentpage--
        loadCharacters(currentpage);
    }
}


// Função para renderizar os personagens]
function renderCharacters(characters, columnIndex) {
  const characterListContainers = [
    document.querySelector("#character-list-1"),
    document.querySelector("#character-list-2"),
    document.querySelector("#character-list-3"),
    document.querySelector("#character-list-4"),
  ];

  const characterList = characterListContainers[columnIndex];
  characterList.innerHTML = '';

  characters.forEach((character, index) => {
    const characterCard = document.createElement('div');
    characterCard.classList.add('character-card', 'border', 'character-card-hover', 'rounded', 'border-4', 'border-success', 'mt-3');

    const characterImage = document.createElement('img');
    characterImage.src = character.image;

    const characterInfo = document.createElement('div');

    characterInfo.innerHTML = `
      <h2 class='nome text-black'>${character.name ? character.name : 'Nome Desconhecido'}</h2>
      <p class='text-black'> <span class="status-dot ${character.status.toLowerCase()}"></span>
      ${character.status} - ${character.species}</p>
      <p class='text-secondary'>Last Known Location: </p>
      <p class='text-black'>${character.location.name}</p>
      <p class='text-secondary'>Last seen on:</p>
      <p class='text-black'>${character.lastEpisode ? character.lastEpisode.name : 'No known Episode'}</p>
    `;

    characterCard.appendChild(characterImage);
    characterCard.appendChild(characterInfo);

    characterCard.addEventListener('click', () => abrirModal(character));

    characterList.appendChild(characterCard);
  });
}
  


// Função para pesquisar personagens pelo nome
function ProcurarPerso() {
  const input = document.getElementById("input");
  const ProcurarPers = input.value;

  if (ProcurarPers !== "") {
    axios.get(`https://rickandmortyapi.com/api/character/?name=${ProcurarPers}`)
      .then(response => {
        const characters = response.data.results;
        const charactersPerColumn = Math.ceil(characters.length / 4);
        const columns = [[], [], [], []];

        for (let i = 0; i < characters.length; i++) {
          const columnIndex = i % 4;
          columns[columnIndex].push(characters[i]);
        }

        columns.forEach((column, index) => {
          renderCharacters(column, index);
        });
      })
      .catch(error => {
        console.error('Erro ao buscar personagens:', error);
      });
  }
}

// nosso modal rapaz
function abrirModal (character) {
  const modal = new bootstrap.Modal(document.getElementById('characterModal'));
  const modalName = document.getElementById('modal-character-name');
  const modalImage = document.getElementById('modal-character-image');
  const modalStatus = document.getElementById('modal-character-status');
  const modalSpecies = document.getElementById('modal-character-species');
  const modalLocation = document.getElementById('modal-character-location');
  const modalEpisode = document.getElementById('modal-character-episode');

  modalName.textContent = character.name ? character.name : 'Name Unknown';
  modalImage.src = character.image;
  modalStatus.textContent = character.status;
  modalSpecies.textContent = character.species;
  modalLocation.textContent = character.location.name;
  modalEpisode.textContent = character.lastEpisode ? character.lastEpisode.name : 'No known Episode'
  
  modal.show();
}

  
  loadCharacters(currentpage);
  
 
  