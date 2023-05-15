let userLogged = window.sessionStorage.getItem("loggedUser");
if(userLogged !== null){
    userLogged = JSON.parse(userLogged);
    editionMode();
  };

//récupération catégories + travaux 

fetch('http://localhost:5678/api/categories')
  .then(response => response.json())
  .then(categories => {
    const categoryLinks = document.querySelectorAll('.link');
    categoryLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const category = link.dataset.category;
        getWorksByCategory(category);
      });
    });
  });

function getWorksByCategory(category) {
  fetch(`http://localhost:5678/api/works`)
    .then(response => response.json())
    .then(data => {
      const filteredData = data.filter(image => {
        return image.categoryId == category || category == "all";
      });

      const gallery = document.querySelector('#portfolio .gallery');
      gallery.innerHTML = ''; // vide le contenu HTML

      const imageList = filteredData.map(image => {
        return `<img src="${image.imageUrl}" alt="${image.title}">`;
      }).join('');

      gallery.innerHTML = imageList;
    })
    .catch(error => console.error(error));
}

fetch('http://localhost:5678/api/works')
  .then(response => response.json())
  .then(data => {
    const gallery = document.querySelector('#portfolio .gallery');
    gallery.innerHTML = ''; // vide le contenu HTML

    data.forEach(image => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const figcaption = document.createElement("figcaption");
      
      img.src = image.imageUrl;
      img.alt = image.title;
      figcaption.textContent = image.title;

      figure.appendChild(img);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
    });
  })
  .catch(error => console.error(error));


    //mode edition création bannière + insertion dans la partie header 
    
    function editionMode() {
    
    if (window.sessionStorage.getItem("loggedUser") !== null) {
      const utilisateur_connecte = "Utilisateur connecté";
        console.log(utilisateur_connecte);

      const categoryForm = document.querySelector('#category');
        categoryForm.style.display = 'none';
      
      
      function createBanner(iconClass, text, buttonCallback) {
        const banner = document.createElement("div");
          banner.classList.add("banner");
  
        const icon = document.createElement("i");
          icon.classList.add("fas", "fa-light", "fa-pen-to-square", iconClass);
          banner.appendChild(icon);
  
        const textElement = document.createElement("span");
          textElement.textContent = "Mode édition";
          banner.appendChild(textElement);
  
        const button = document.createElement("button");
          button.textContent = "publier les changements";
          button.addEventListener("click", buttonCallback);
          banner.appendChild(button);
  
        const body = document.querySelector("body");
          body.parentNode.insertBefore(banner, body);
      }
  
      function createButtonModif(iconClass, buttonModifPhoto) {
        const buttonModif = document.createElement("div");
          buttonModif.classList.add("buttonModif");
      
        const icon = document.createElement("i");
          icon.classList.add("fas", "fa-light", "fa-pen-to-square", iconClass);
          buttonModif.appendChild(icon);
      
        const button = document.createElement("button");
          button.textContent = "modifier";
          button.addEventListener("click", buttonModifPhoto);
          buttonModif.appendChild(button);
      
        const introductionSection = document.querySelector('#introduction');
        const figureElement = introductionSection.querySelector('figure');
          figureElement.appendChild(buttonModif);
      } 

      
    
    
      

      

    

      // Fonction de rappel
      createBanner("icon-class", "texte", function() {
        console.log("Publier les changements");
      });
  
      // Fonction de rappel 
      createButtonModif("icon-class", function() {
        console.log("modifier la photo");
      });

    }
  }
  

