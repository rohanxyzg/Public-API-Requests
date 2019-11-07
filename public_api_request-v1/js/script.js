const galleryDiv = document.getElementById('gallery');
const body = document.querySelector('body');
function fetchData(url){
    return fetch(url)
        .then(res=>res.json())
        .catch(error => console.log('Problem',error));
}

async function getRandomUsers(numOfUsers){
    const users = [];
    for(let i=0;i<numOfUsers;i++){
        await fetchData('https://randomuser.me/api/')
            .then(data=>users.push(data.results[0]));
    }
    return users;
}



function generateGalleryMarkup(users){
    console.log(users);
    console.log(typeof users);
    console.log(users.values())
    users.map(user=>{
        //const card = document.createElement('div');
        const name = user.name.first+' '+user.name.last;
        const img = user.picture.large;
        const email = user.email;
        const city = user.location.city;
        console.log("Hi");
        const html = `
        <div class="card">
            <div class="card-img-container">
                <img class="card-img" src='${img}' alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${name}</h3>
                <p class="card-text">${email}</p>
                <p class="card-text cap">${city}</p>
            </div>
        </div>
        `;
        //card.className = 'card';
        galleryDiv.innerHTML += html;
        //galleryDiv.append(card);
    });
    console.log(users);
    return users;
}

function generateModalMarkup(data,users){
    const modalContainer = document.createElement('div');
    const name = data.name.first+' '+data.name.last;
    const img = data.picture.large;
    const email = data.email;
    const city = data.location.city;
    const cell = data.cell;
    const address = data.location.street.name+' '+city+' '+data.location.postcode;
    const birthday = data.dob.date;
    const html = `
    <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src='${img}' alt="profile picture">
            <h3 id="name" class="modal-name cap">${name}</h3>
            <p class="modal-text">${email}</p>
            <p class="modal-text cap">${city}</p>
            <hr>
            <p class="modal-text">${cell}</p>
            <p class="modal-text">${address}</p>
            <p class="modal-text">${birthday}</p>
        </div>
    </div>

    // IMPORTANT: Below is only for exceeds tasks 
    <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div>
    `;
    modalContainer.className = 'modal-container';
    modalContainer.innerHTML += html;
    body.appendChild(modalContainer);
    generateModalListeners(modalContainer,users);

}
function generateModalListeners(modalContainer,users){
    const exitButton = modalContainer.querySelector('#modal-close-btn');
    exitButton.addEventListener('click',()=>modalContainer.remove());
}
function generateCardsListeners(users){
    const cards = galleryDiv.children;
    console.log(cards);
    for(let card of cards){
        card.addEventListener('click',()=>{
            const email = card.querySelector('p').textContent;
            console.log(email);
            for(let user of users){
                if(user.email === email){
                    data=user;
                    break;
                }
            }
            generateModalMarkup(data,users);
        })
    }
}


const promiseObject = getRandomUsers(12);
console.log(promiseObject);
promiseObject
    .then(generateGalleryMarkup)
    .then(generateCardsListeners)
    .catch(err => console.log('Oops... An error occured:', err));
