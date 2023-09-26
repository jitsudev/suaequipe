HTMLOptionsCollection.prototype.filter = Array.prototype.filter;

document.addEventListener('DOMContentLoaded',()=>{


  const form = document.getElementById("form-equipes");

  const estados = document.getElementById("select-estados");

  const cidades = document.getElementById("select-cidades");

  const status = document.getElementById("status");

  estados.onchange = (e)=>{
    var uf = e.target.options.filter((o)=>o.selected)[0].value;
    getDistritos(uf);
  }

  async function getDistritos(uf){
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/distritos`;
    fetch(url).then(response => {
      if (response.ok) {
        cidades.innerHTML = "<option selected>Escolher...</option>";

        response.json().then(data => {
          data.sort((a, b) => {
            const nameA = a.nome.toUpperCase(); // ignore upper and lowercase
            const nameB = b.nome.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
          
            // names must be equal
            return 0;
          });
          data.forEach((cidade)=>{
            var newOption = document.createElement('option');
            newOption.value = cidade.nome;
            newOption.innerText = cidade.nome
            cidades.appendChild(newOption);
          })
        })
      }
    }).catch(error => {
      console.log(error);
    });
  }



  async function handleSubmit(event) {
    event.preventDefault();
    
    var data = new FormData(event.target);
    fetch(event.target.action, {
      method: form.method,
      body: data,
      headers: {
          'Accept': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        form.classList.add('hide');
        status.classList.remove('hide');
        status.innerHTML = "Obrigado ! Aguarde nosso contato...";
        form.reset()
      } else {
        response.json().then(data => {
          if (Object.hasOwn(data, 'errors')) {
            status.innerHTML = data["errors"].map(error => error["message"]).join(", ")
          } else {
            status.innerHTML = "Oops! Ocorreu um erro, tente novamente."
          }
        })
      }
    }).catch(error => {
      status.classList.add("show");
      status.innerHTML = "Oops! Ocorreu um erro, tente novamente."
    });
  }

  form.addEventListener("submit", handleSubmit);
})