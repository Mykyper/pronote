// api-project/add_teacher.js

document.getElementById('create-teacher-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = {
        nom: document.getElementById('nom').value,
        prenom: document.getElementById('prenom').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        role: document.getElementById('role').value
    };

    try {
        const response = await fetch('http://localhost:3000/api/users', {  // URL complète ici
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const result = await response.json();
            alert('Utilisateur créé avec succès');
            console.log('Nouvel utilisateur:', result);
        } else {
            const error = await response.json();
            alert('Erreur lors de la création de l’utilisateur: ' + error.message);
        }
    } catch (error) {
        console.error('Erreur lors de la requête:', error);
        alert('Une erreur est survenue lors de la création de l’utilisateur.');
    }
});
