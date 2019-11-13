
const users = [];
const gallery = document.getElementById('gallery');
$.ajax({
    url: 'https://randomuser.me/api/?format=json&results=12',
    dataType: 'json',
    success: function(data) {

        console.log(data.results);
        data.results.forEach(user => {
            //Storing each user in the array
            users.push(user);
        });
        //generating gallery HTML 
        generateGalleryHTML(users);
        //generating Modal Window for each user
        generateModalHTML(users);
        //generating modal listeners for each user
        generateModalListeners(users);
        //calling separate function for handling close button
        closeButton();
    }
  });
  console.log(users);

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
  function generateModalListeners(data){
      let cards = document.querySelectorAll('.card');
      cards.forEach( function(card){
          card.addEventListener('click',(event)=>{
              //console.log(card);
              let userIndex = findUserIndex(card);
              console.log(userIndex);
              showModalWindow(userIndex);
            
          })
        
      })

      
  }
  function findUserIndex(card){
      let email = card.querySelector('p').textContent;
      let userIndex = -1;
      users.forEach(function(user,index){
        
          if(user.email === email){
            console.log(user,typeof index);
            userIndex = index;
          }

    
      })
      return userIndex;
  }
  function showModalWindow(userIndex){
      const modalDiv = $('.modal-div');
      const modals = modalDiv.children();
      console.log(modals[userIndex]);
      $(modals[userIndex]).show();
    
  }
  
  
function generateModalHTML(users){

    let modalHTML = '';
    modalHTML += `<div class = "modal-div">`;
    users.forEach((user, index) => {
        // references for user information
        let userName = user.name;
        let userMail = user.email;
        let userImg = user.picture;
        let userBirthday = user.dob.date
        .replace(/^(\d{4})-(\d{2})-(\d{2}).*/, ' $2/$3/$1');
        let userLocation = user.location;
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
    modalHTML += `</div>`;
    $(modalHTML).insertAfter(".gallery");

    $('.modal-container').hide();
}

function closeButton(){
    $('.modal-close-btn').click((e)=>{
        let parentModalContainer= $(e.target).parents('.modal-container')[0];
        $(parentModalContainer).hide();
    })
}
 
     
