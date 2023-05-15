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


  // prépa main + modal 

const main = document.querySelector("main");

  const modal = document.createElement("aside");
  modal.id = "modal";
  modal.classList.add("modal");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true"); //accessibilité
  modal.setAttribute("aria-labelledby", "title-modal"); //accessibilité
  main.appendChild(modal);
  
  const mainDivModal = document.createElement("div");
  mainDivModal.classList.add("modal-wrapper");
  modal.appendChild(mainDivModal);
  
  //fermeture fenêtre 

  const closeButton = document.createElement("div");
    closeButton.classList = "buttons";
  const closeModal = document.createElement("button");
    closeModal.id = "close-modal-button";
  const closeModalIcon = document.createElement("i");
    closeModalIcon.classList.add("fas", "fa-light", "fa-xmark");
    closeModal.appendChild(closeModalIcon);
    closeButton.appendChild(closeModal);
    mainDivModal.appendChild(closeButton);
   
 // retour fenêtre 
  const goBackModal = document.createElement("button");
    goBackModal.id = "go-back-modal-button";
  const goBackModalIcon = document.createElement("i");
    goBackModalIcon.classList.add("fas", "fa-light", "fa-xmark");
  goBackModal.appendChild(goBackModalIcon);
    closeButton.prepend(goBackModal);

  const divMainContent = document.createElement("div");
  mainDivModal.appendChild(divMainContent);

  const divGrid = document.createElement("div");

  divGrid.classList.add("gallery");


  // content modal 

  function generateModalContent(){
    divMainContent.innerHTML = "";
    goBackModal.style.display = "none";
    

    const titleModal = document.createElement("h3");
    titleModal.innerText = "Galerie photos";
    divMainContent.appendChild(titleModal);

    divGrid.classList.add("gallery-modal");
    divMainContent.appendChild(divGrid);


    generateWorksModal();

    const hrSeperator = document.createElement("hr");
    divMainContent.appendChild(hrSeperator);

    const buttonsModifModal = document.createElement("div");
    buttonsModifModal.classList.add("btnsModifModal");
    divMainContent.appendChild(buttonsModifModal);


    const addWorkGallery = document.createElement("button");
    addWorkGallery.innerText = "Ajouter une photo";
    addWorkGallery.classList.add("add-work-button");
    buttonsModifModal.appendChild(addWorkGallery);

    addWorkGallery.addEventListener("click", function(){
      divMainContent.innerText = "";
      generateAddWorkModalContent();
    });

    const deleteGallery = document.createElement("a");
      deleteGallery.innerText = "Supprimer la galerie";
      deleteGallery.classList.add("delete-gallery");
      buttonsModifModal.appendChild(deleteGallery);
};


function generateWorksModal() {
  fetch(`http://localhost:5678/api/works`)
    .then(response => response.json())
    .then(data => {
      const gallery = document.querySelector('.gallery-modal');
      gallery.innerHTML = ''; // vide le contenu HTML

      data.forEach(image => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const icon = document.createElement("i");
        const figcaption = document.createElement("figcaption");

        img.src = image.imageUrl;
        img.alt = image.title;
        icon.classList.add("fa-solid", "fa-trash-can", "delete-icon");
        figcaption.textContent = "éditer";

        icon.addEventListener("click", () => {
          if (confirm("Voulez-vous vraiment supprimer cet élément ?")) {
            fetch(`http://localhost:5678/api/works/${image.id}`, {
              method: "DELETE",
              headers: {
                "Authorization": `Bearer ${sessionStorage.token}`,
                "accept": "application/json"
              }
            })

            .then(response => {
              if (response.ok) {
                figure.remove(); // supprime l'élément dans la modal
                const workInDom = document.querySelector(`img[src='${image.imageUrl}']`).closest('figure');
                workInDom.remove(); // supprime l'élément dans le DOM
                console.log(response);
              }
            })
            .catch(error => {
              console.error(error);
            });
          }
        });

        figure.appendChild(img);
        figure.appendChild(figcaption);
        figure.appendChild(icon);
        gallery.appendChild(figure);
      });
    })
    .catch(error => console.error(error));
} 


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

      // Modale 
    
      const portfolioSection = document.querySelector("#portfolio");
      const buttonModal = document.createElement("div");
        buttonModal.classList.add("portfoliotitle");
        portfolioSection.prepend(buttonModal);
  
      const titleModal = document.querySelector("#portfolio h2");
        buttonModal.appendChild(titleModal);
  
      const linkModal = document.createElement("a");
       linkModal.href = "#modal";
        titleModal.after(linkModal)
    
      const icon = document.createElement("i");
        icon.classList.add("fas", "fa-light", "fa-pen-to-square");
        linkModal.appendChild(icon);
  
      const modifP = document.createElement("p");
        modifP.innerText = "modifier";
        linkModal.appendChild(modifP);
  
                                                       
      let openModal = null;

      
      linkModal.addEventListener("click", function(event){
        event.preventDefault();
        modal.style.display = null;
        modal.setAttribute("aria-hidden", "false");
        generateModalContent();
      openModal = modal;
      openModal.addEventListener("click", closeModalFonction);
      openModal.querySelector("#close-modal-button").addEventListener("click", closeModalFonction);
      openModal.querySelector(".modal-wrapper").addEventListener("click", function(event){
      event.stopPropagation();
      });

      });

      

      const closeModalFonction = function(event){
        console.log("fermeture modal")
        if (openModal === null) return;
        event.preventDefault();
        window.setTimeout(function(){
          openModal.style.display = "none";
          openModal = null;
        }, 500);
        openModal.setAttribute("aria-hidden", "true");
        openModal.removeEventListener("click", closeModalFonction);
        openModal.querySelector(".modal-close-icon").addEventListener("click", closeModalFonction);
        console.log("Clic sur l'icône de fermeture de la modal");
        openModal.querySelector("#close-modal-button").removeEventListener("click", closeModalFonction);
        openModal.querySelector(".modal-wrapper").removeEventListener("click", function(event){
            event.stopPropagation();
        })
    };

    

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
  

