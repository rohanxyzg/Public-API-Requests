const usersURL = 'https://randomuser.me/api/';
const gallery = document.getElementById('gallery');
const body = document.querySelector('body');
const modalDiv = document.getElementById('modal-div');
async function fetchData(url){
    try{
        const response = await fetch(url);
        return await response.json();
    }catch(error){
        throw error;
    }
}
//fetchData(usersURL);
const users = [];
async function getRandomUsers(num){
    
    for(let i=0;i<num;i++){
        const currentUser = await fetchData(usersURL);
       // console.log(currentUser.results[0]);
        users.push(currentUser.results[0]);
    }
    return users;
}
//console.log(getRandomUsers(12));

function generateGalleryHTML(data){
    data.map(user=>{
        const name = user.name.first+' '+user.name.last;
        const img = user.picture.large;
        const email = user.email;
        const city = user.location.city;
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
        </div>`;
        gallery.innerHTML += html;
    });
    return users;
   
}
function generateModalHTML(users){

    let modalHTML = '';
    
    users.forEach((user, index) => {
        // references for user information
        let userName = user.name;
        let userMail = user.email;
        let userImg = user.picture;
        let userLocation = user.location;
        let userDob = user.dob;
        let userPhone = user.phone;
        modalHTML += `
        <div class = "modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${userImg.large}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${userName.first} ${userName.last}</h3>
                    <p class="modal-text">${userMail}l</p>
                    <p class="modal-text cap">${userLocation.city}</p>
                    <hr>
                    <p class="modal-text">${userPhone}</p>
                    <p class="modal-text">${userLocation.street.name}, ${userLocation.city}, ${userLocation.state} ${userLocation.postcode}</p>
                    <p class="modal-text">Birthday: ${userDob.date.substring(0, 10)}</p>
                </div>
            </div>
        </div>
        
        `; 

    }); 
    
    modalDiv.innerHTML = modalHTML;

    $('.modal-container').hide();
}

function displayModalElements(){
    $('.card').click((e)=>{
        const parentCards = $(e.target).parentsUntil('.gallery');
        let parentCard;
        if(parentCards.length===0){
            parentCard = e.target;
        }
        else{
            parentCard = parentCards[parentCards.length-1];
        }
        
        console.log(parentCards.length);
        console.log(parentCard);
        const $name = $(parentCard).find('.card-info-container>h3').text();
        console.log($name);
        const $currentModal = $(`.modal-container:has(h3:contains(${$name}))`);
        $currentModal.show();
    })
}
function closeButton(){
    $('.modal-close-btn').click((e)=>{
        let parentModalContainer= $(e.target).parents('.modal-container')[0];
        console.log(parentModalContainer);
        $(parentModalContainer).hide();
    })
}
getRandomUsers(12)
    .then(generateGalleryHTML)
    .then(generateModalHTML)
    .then(displayModalElements)
    .then(closeButton);
// generateGalleryHTML(getRandomUsers(12));


