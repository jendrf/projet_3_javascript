let userLogged = window.sessionStorage.getItem("loggedUser");
if(userLogged !== null){
    userLogged = JSON.parse(userLogged);
    editionMode();
  };

//récupération catégories + travaux 

function generateWorks() {
  fetch('http://localhost:5678/api/categories')
    .then(response => response.json())
    .then(() => {
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
  }

  generateWorks();

// Création Main + Modal 

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

  // Fermeture modale 1

  const closeButton = document.createElement("div");
    closeButton.classList = "buttons";
    
  const closeModal = document.createElement("button");
    closeModal.id = "close-modal-button";
  const closeModalIcon = document.createElement("i");
    closeModalIcon.classList.add("fas", "fa-light", "fa-xmark");
    closeModal.appendChild(closeModalIcon);
    closeButton.appendChild(closeModal);
    mainDivModal.appendChild(closeButton);
    
  // retour modale 1 

  const goBackModal = document.createElement("button");
    goBackModal.id = "go-back-modal-button";
  const goBackModalIcon = document.createElement("i");
    goBackModalIcon.classList.add("fas", "fa-light", "fa-arrow-left");
  goBackModal.appendChild(goBackModalIcon);
  closeButton.prepend(goBackModal);

  const divMainContent = document.createElement("div");
  mainDivModal.appendChild(divMainContent);

  const divGrid = document.createElement("div");
  divGrid.classList.add("gallery");


// Contenu modale

function generateModalContent() {
  divMainContent.innerHTML = "";
  goBackModal.style.display = "none";

        /*Bouton retour modale*/ 
  const goBackModalButton = document.getElementById("go-back-modal-button");
  goBackModalButton.addEventListener("click", function() {
  console.log("Retour galerie modale");
  generateModalContent();
  });

  const titleModal = document.createElement("h3");
  titleModal.innerText = "Galerie photos";
  divMainContent.appendChild(titleModal);
  
  const galleryModal = document.createElement("div");
  divGrid.classList.add("gallery-modal");
  galleryModal.appendChild(divGrid);
  divMainContent.appendChild(galleryModal);

  generateWorksModal();
  
  const hrSeparator = document.createElement("hr");
  divMainContent.appendChild(hrSeparator);

  const buttonsModifModal = document.createElement("div");
  buttonsModifModal.classList.add("btnsModifModal");
  divMainContent.appendChild(buttonsModifModal);

  const addWorkGallery = document.createElement("button");
  addWorkGallery.innerText = "Ajouter une photo";
  addWorkGallery.classList.add("add-work-button");
  buttonsModifModal.appendChild(addWorkGallery);

  addWorkGallery.addEventListener("click", function () {
    divMainContent.innerHTML = "";
    divMainContent.appendChild(generateAddWorkModalContent());
  });

  const deleteGallery = document.createElement("a");
  deleteGallery.innerText = "Supprimer la galerie";
  deleteGallery.classList.add("delete-gallery");
  buttonsModifModal.appendChild(deleteGallery);
  }
  
  // Modale 2

  let works;

  async function refreshWorks() {
    try {
      const response = await fetch("http://localhost:5678/api/works");
      works = await response.json();
      const worksJSON = JSON.stringify(works);
      window.sessionStorage.setItem("works", worksJSON);

      generateWorks();
      generateWorksModal();

    } catch (error) {
      console.error("Erreur lors de la récupération des travaux :", error);
    }
  }
  
function generateAddWorkModalContent() {
  goBackModal.style.display = "flex";

  const modalContent2 = document.createElement("div");
  modalContent2.classList.add("modalContent2");

  // Titre modale 2 
  
  const titleModal2 = document.createElement("h3");
  titleModal2.innerText = "Ajout photo";
  modalContent2.appendChild(titleModal2);

  // Création du formulaire modale 2 

  const formModal2 = document.createElement("form");
  formModal2.id = "form-add-work";
  formModal2.action = "#";
  formModal2.method = "post";

  // "Ajouter photo"

  const addPhoto2 = document.createElement("div");
  addPhoto2.classList.add("addWorkDiv");
  formModal2.appendChild(addPhoto2);

  const addPhoto2Icon = document.createElement("img");
  addPhoto2Icon.setAttribute("src", "assets/icons/image.png");
  addPhoto2Icon.classList.add("image-icon");
  addPhoto2.appendChild(addPhoto2Icon);

  const addPhotoButton = document.createElement("button");
  addPhotoButton.classList.add("button-ajouter");
  addPhotoButton.innerText = "+ Ajouter photo";
  addPhotoButton.addEventListener("click", function (event) {
    event.preventDefault();
    addPhotoInput.click();
  });

  addPhoto2.appendChild(addPhotoButton);

  const addPhotoInput = document.createElement("input");
  addPhotoInput.type = "file";
  addPhotoInput.id = "select-photo";
  addPhotoInput.name = "select-photo";
  addPhotoInput.setAttribute("accept", "image/png, image/jpeg");
  addPhotoInput.style.display = "none";
  addPhoto2.appendChild(addPhotoInput);

  addPhotoInput.addEventListener("change", function () {
    const fileExtension = /\.(jpg|png)$/i;
    if (this.files.length === 0 || !fileExtension.test(this.files[0].name)) {
      return;
    }

    addPhoto2.innerHTML = "";

    const file = this.files[0];
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.addEventListener("load", (e) => displayImage(e, file));
  });

  let selectedImage;

  function displayImage(e, file) {
    const figureElement = document.createElement("figure");
    figureElement.id = "selected-image";
    selectedImage = file;

    const image = document.createElement("img");
    const imageBlob = new Blob([e.target.result], { type: file.type });
    image.src = URL.createObjectURL(imageBlob);
    image.style.height = "200px";
    addPhoto2.style.justifyContent = "center";

    figureElement.appendChild(image);
    addPhoto2.appendChild(figureElement);
  }

  // "Titre" Formulaire

  const divTitle2 = document.createElement("div");
  divTitle2.classList.add("title-div2");
  formModal2.appendChild(divTitle2);

  const labelTitle = document.createElement("label");
  labelTitle.htmlFor = "title";
  labelTitle.textContent = "Titre";
  divTitle2.appendChild(labelTitle);

  const inputTitle = document.createElement("input");
  inputTitle.classList.add("input-title");
  inputTitle.type = "text";
  inputTitle.name = "title";
  divTitle2.appendChild(inputTitle);

  //  "Catégorie" Formulaire 

  const formCategory2 = document.createElement("div");
  formCategory2.classList.add("form-category");
  formModal2.appendChild(formCategory2);

  const labelCategory = document.createElement("label");
  labelCategory.htmlFor = "category";
  labelCategory.textContent = "Catégorie";
  formCategory2.appendChild(labelCategory);

  const categorySelect = document.createElement("select");
  categorySelect.id = "category-select-id";
  formCategory2.appendChild(categorySelect);

  fetch('http://localhost:5678/api/categories')
    .then((response) => response.json())
    .then((data) => {
      data.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.text = category.name;
        categorySelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Erreur récupération des catégories :", error);
    });

  // Séparation Formulaire

  const hrSeparator2 = document.createElement("hr");
  formModal2.appendChild(hrSeparator2);

  // Bouton "Valider" Formulaire 

  const submitButton2 = document.createElement("input");
  submitButton2.type = "submit";
  submitButton2.value = "Valider";
  submitButton2.classList.add("submit-valider");
  submitButton2.id = "submit-valider";
  formModal2.appendChild(submitButton2);

  // Ajout du formulaire au document

  modalContent2.appendChild(formModal2);

  const textElement = document.createElement("span");
  textElement.textContent = "jpg, png : 4mo max";
  addPhoto2.appendChild(textElement);

  // Gestion de la soumission du formulaire

  formModal2.addEventListener("submit", async function (event) {
    event.preventDefault();
  
    if (selectedImage && inputTitle.value && categorySelect.value) {
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("title", inputTitle.value);
      formData.append("category", categorySelect.value);
  
      try {
        const response = await fetch("http://localhost:5678/api/works", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userLogged.token}`,
          },
          body: formData,
        });
  
        console.log(response);
  
        if (response.ok) {
          await refreshWorks();
          console.log("Projet ajouté");
  
          alert("Votre travail a été ajouté avec succès");

          closeModal();

          generateModalContent();

        } else {
          alert("Une erreur s'est produite lors de l'ajout du travail");
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout du travail :", error);
        alert("Une erreur s'est produite lors de l'ajout du travail");
      }
    } else {
      alert("Veuillez remplir tous les champs");
      
    }
  });

  function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
  }
  
  return modalContent2;
};
  
// Modale 1 - Works + Delete Works 

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
                figure.remove(); // supprime work modal
                
                const workDelete = document.querySelector(`img[src='${image.imageUrl}']`).closest('figure');
                workDelete.remove(); // supprime work DOM
                console.log("Projet supprimé");
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
    };

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
    };

    // Modale 

    const portfolioSection = document.querySelector("#portfolio");
    const buttonModal = document.createElement("div");
      buttonModal.classList.add("portfoliotitle");
      portfolioSection.prepend(buttonModal);

    const titleModal = document.querySelector("#portfolio h2");
      buttonModal.appendChild(titleModal);

    const linkModal = document.createElement("a");
      linkModal.href = "#modal";
      titleModal.after(linkModal);

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
      console.log("Fermeture modale")
      if (openModal === null) return;
      event.preventDefault();
      window.setTimeout(function(){
        openModal.style.display = "none";
        openModal = null;
      }, 500);
      openModal.setAttribute("aria-hidden", "true");
      openModal.removeEventListener("click", closeModalFonction);
      openModal.querySelector("#close-modal-button").addEventListener("click", closeModalFonction);
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
      console.log("Modifier la photo de profil");
    });
  }
  }


