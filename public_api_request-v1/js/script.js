const usersURL = 'https://randomuser.me/api/?results=12&nat=us,gb&inc=picture,name,email,location,dob,phone';
const gallery = document.getElementById('gallery');
const body = document.querySelector('body');
const modalDiv = document.getElementById('modal-div');
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
    return data;
   
}
function generateModalHTML(users){

    let modalHTML = '';
    
    users.forEach((user, index) => {
        // references for user information
        console.log(user);
        let userName = user.name;
        let userMail = user.email;
        let userImg = user.picture;
        let userAddress = user.location.street.name + ', ' 
        + user.location.street.number
        + '. ' + user.location.city;
        let userBirthday = user.dob.date
        .replace(/^(\d{4})-(\d{2})-(\d{2}).*/, ' $2/$3/$1');
        let userLocation = user.location;
        let userDob = user.dob;
        console.log(user.cell);
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
                    <p class="modal-text">${userLocation.street.number} ${userLocation.street.name}, ${userLocation.city}, ${userLocation.state} ${userLocation.postcode}</p>
                    <p class="modal-text">Birthday: ${userBirthday}</p>
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
 // getting random user data
 $.getJSON('https://randomuser.me/api/?results=12&nat=us,gb&inc=picture,name,email,location,dob,phone', 
 data => {
     // Hiding the loader when the request is complete
     $('.loader').hide();

     // appending the data into the gallery div
     (generateGalleryHTML(data.results));

     // appending modals to the modal-div
     (generateModalHTML(data.results));
     
     // handling modal display
     displayModalElements();

    

     // handling the x functionality
    closeButton();

    

 }); // close Random User API request    

