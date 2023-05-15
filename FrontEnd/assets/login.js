async function logIn() {
    const userEmail = document.querySelector("#email").value;
    const userPassword = document.querySelector("#password").value;

    const user = {
        email: userEmail,
        password: userPassword,
    };

    const userJSON = JSON.stringify(user);

    const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: userJSON
    });

    const result = await response.json();

    if(response.status==404){
        alert("Utilisateur inconnu");
        return;
    } else if (result.error) {
        alert("Mauvais Mot de Passe");
        return;
    } else {
        const {userId, token} = result;
        const userLogged = JSON.stringify(result);
        window.sessionStorage.setItem("loggedUser", userLogged);
        window.sessionStorage.setItem("userId", userId);
        window.sessionStorage.setItem("token", token);
        
        window.location.replace("./index.html");
    }
};

const formLogIn = document.querySelector("#login form");

formLogIn.addEventListener("submit", function(event){
    event.preventDefault();
    logIn();
});



