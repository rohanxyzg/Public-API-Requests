const usersURL = 'https://randomuser.me/api/1.3/?nat=gb';
const gallery = document.getElementById('gallery');


// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------

/**
 * Gets json object from the specified url.
 * @param {String} url Endpoint.
 * @returns {Promise} Promise that resolves with the json object.
 */
async function getJSON(url){
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error){
        throw error;
    }
}

/**
 * Fetches for a certain number of users.
 * @param {int} numberOfUsers Number of users to fetch.
 * @returns {Promise} A promise that resolves with an array of user objects.
 */
async function getRandomUsers(numberOfUsers){
    const users = [];

    for (let i = 0; i < numberOfUsers; i++){
        const json = await getJSON(usersURL);
        // json.results contains the user information
        const user = json.results[0];
        users.push(user);
    }
    return users;
}


// ------------------------------------------
//  HELPER FUNCTIONS 
// ------------------------------------------

/**
 * Appends modal window to the page
 * @param {String} html HTML to be appended to the modal-container div
 */
function appendModalContainer(html){
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    modalContainer.innerHTML = html;
    document.querySelector('body').appendChild(modalContainer);

    // If the user to be displayed is the first or the last one on the page, turn opacity down
    // of the prev button and of the next button, respectively
    if (getUserIndex(modalContainer) === 0) {
        const prevButton = modalContainer.querySelector('#modal-prev');
        prevButton.style.opacity = '.6';
    } else if (getUserIndex(modalContainer) === 11) {
        const nextButton = modalContainer.querySelector('#modal-next');
        nextButton.style.opacity = '.6';
    }
}

/**
 * Gets the index of the user showing up on the modal window relative to
 * its position among the cards.
 * @param {Element} modalContainer modal container div element
 * @returns {Integer} Index of the user showing up on the modal window
 */
function getUserIndex(modalContainer){
    const modalEmail = modalContainer.querySelector('p').textContent;
    const cards = document.getElementsByClassName('card');
    let userIndex = 0;

    for (let card of cards){
        const cardEmail = card.querySelector('p').textContent;
        
        if (cardEmail == modalEmail){
            return userIndex;
        }
        userIndex++;
    }
}

/**
 * Generates modal HTML and passes it to the generateModalContainer helper function, so it is
 * appended to the page.
 * Sets all the event listeners for the modal window using generateModalListeners using a helper function.
 * @param {User Object} data User object used to get data for the html.
 * @param {Array} users user object array.
 * @returns {Element} container for the modal window html
 */
function generateModalHTML(data, users){
    const img = data.picture.medium;
    const firstAndLastName = data.name.first + ' ' + data.name.last;
    const email = data.email;
    const city = data.location.city;
    const phone = data.phone;
    const address = data.location.street.name + ', ' 
                        + data.location.street.number
                        + '. ' + data.location.city;
    const birthday = data.registered.date
                        .replace(/^(\d{4})-(\d{2})-(\d{2}).*/, 'Birthday: $2/$3/$1');
    
    const html = `
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${img}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${firstAndLastName}</h3>
                <p class="modal-text">${email}</p>
                <p class="modal-text cap">${city}</p>
                <hr>
                <p class="modal-text">${phone}</p>
                <p class="modal-text">${address}</p>
                <p class="modal-text">${birthday}</p>
            </div>
        </div>
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    `;
    
    appendModalContainer(html);
    const modalContainer = document.getElementsByClassName('modal-container')[0];
    generateModalListeners(modalContainer, users);
    
    return modalContainer;
}

/**
 * Generates all the event listeners for the modal window.
 * @param {Element} modalContainer Div element.
 * @param {Array} users user object array.
 */
function generateModalListeners(modalContainer, users){
    const userIndex = getUserIndex(modalContainer);
    const exitButton = modalContainer.querySelector('#modal-close-btn');
    const prevButton = modalContainer.querySelector('#modal-prev');
    const nextButton = modalContainer.querySelector('#modal-next');
    exitButton.addEventListener('click', () => modalContainer.remove());
    prevButton.addEventListener('click', () => {
        if (userIndex != 0){
            modalContainer.remove();
            generateModalHTML(users[userIndex - 1], users);    
        }
    });
    nextButton.addEventListener('click', () => {
        if (userIndex != 11) {
            modalContainer.remove();
            generateModalHTML(users[userIndex + 1], users);    
        }
    });
}

// ------------------------------------------
//  MAIN FUNCTIONS
// ------------------------------------------





/**
 * Generates HTML for the gallery
 * @param {Object} user User object
 * @returns users object to be used on Promise chainning
 */
function generateGaleryHTML(users){
    users.map( user => {
        const img = user.picture.medium;
        const firstAndLastName = user.name.first + ' ' + user.name.last;
        const email = user.email;
        const cityAndState = user.location.city + ', ' + user.location.state;
        const html = `
            <div class="card">
                <div class="card-img-container">
                    <img class="card-img" src="${img}" alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${firstAndLastName}</h3>
                    <p class="card-text">${email}</p>
                    <p class="card-text cap">${cityAndState}</p>
                </div>
            </div>
        `;
        document.getElementById('gallery').innerHTML += html;
    } );
    
    return users;
}

/**
 * Generates click event listeners for all of the card div elements.
 * @param {Array} users user object array
 */
function generateCardsListeners(users){
    const cards = gallery.children;
      
    for (let card of cards){
        
        card.addEventListener('click', () => {
            let data;
            const email = card.querySelector('p').textContent;
              
            for (let user of users){
                if (user.email === email){
                    data = user;
                    break;
                }
            }
              
            generateModalHTML(data, users);
        });
    }
    return users;
}

/**
 * Appends search form to the page
 */
function generateSearchForm(){
    const searchContainer = document.querySelector('.search-container');
    const html = `
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
        </form>
    `;
    searchContainer.innerHTML = html;
}

/**
 * Sets event listeners for the search form
 */
function generateSearchListeners() {
    // filter function will only be used inside the event handlers
    function filter() {
        const cards = gallery.children;
        const inputText = searchInput.value;
        
        $(cards).show();
        for (let card of cards){
            const name = card.querySelector('#name').textContent;
            if (inputText != ''){
                if (name.toLowerCase().includes(inputText.toLowerCase())) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            }
        }
    }
    const button = document.getElementById('search-submit');
    const searchInput = document.getElementById('search-input');
    button.addEventListener('click', (e) => {
        e.preventDefault();
        filter();

    });
    searchInput.addEventListener('input', () => {
        filter();
    });
}

// ------------------------------------------
//  PAGE INITIAL SET UP
// ------------------------------------------

const promise = getRandomUsers(12);
promise
  .then( generateGaleryHTML )
  .then( generateCardsListeners )
  .then( () => generateSearchForm() )
  .then( () => generateSearchListeners())
  .catch(err => console.log('Oops... An error occured:', err));