
const userCardTemplate = document.querySelector("[data-user-template]");
const userCardContainer = document.querySelector("[data-user-cards-container]");
const searchInput = document.querySelector("[data-search]");
const searchInput2 = document.querySelector("[data-search1]");
const cartno = document.getElementById('cartno')
const cart = document.getElementById('cart')
const container = document.getElementById('orderlist');
const detailsContainer = document.getElementById('itembox');
const orderlist1 = document.getElementById('orderlist1');
const bb = document.getElementById('bb');


function showorder(){
    orderlist1.style.display='block'
}

function closeorder(){
    orderlist1.style.display='none'
}



searchInput2.addEventListener("input",function(){
    searchInput.value = this.value
})
document.getElementById('nor').innerHTML=`No Items found for `;
searchInput.addEventListener('input',function(){
    document.getElementById('nor2').innerText= this.value
}
)
searchInput2.addEventListener('input',function(){
    document.getElementById('nor2').innerText= this.value
}
)



let users = [];

searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    let visibleCount = 0;
    users.forEach(user => {
        const isVisible = user.name.toLowerCase().includes(value) || user.email.toLowerCase().includes(value);
        user.element.classList.toggle("hide", !isVisible);
      
       if(isVisible){
        user.element.style.display = "block"
        visibleCount++;
       }else{
        user.element.style.display="none"
       }
    });
   
    document.getElementById('noresult').style.display = visibleCount > 0 ? "none" : "block"
});

searchInput2.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    let visibleCount = 0;
    users.forEach(user => {
        const isVisible = user.name.toLowerCase().includes(value) || user.email.toLowerCase().includes(value);
        user.element.classList.toggle("hide", !isVisible);
        
        if(isVisible){
            user.element.style.display = "block"
            visibleCount++;
           }else{
            user.element.style.display="none"
           }
    });
   
    document.getElementById('noresult').style.display = visibleCount > 0 ? "none" : "block"
   
});










fetch("data.json")
    .then(response => response.json())
    .then(data => {
        users = data.map(user => {
            const card = userCardTemplate.content.cloneNode(true).children[0];
            const header = card.querySelector("[data-header]");
            const body = card.querySelector("[data-body]");
            const image = document.createElement("img");
            image.classList.add("user-image");
            header.textContent = user.name;
            body.textContent = user.email;
            
            image.src = user.image;
            image.width = 60;
            card.prepend(image);
            userCardContainer.append(card);

            // Add a unique identifier to each card (user ID)
            card.dataset.userId = user.id;  
            
            card.addEventListener('mousedown', () => handleCardClick(user));// Add user ID as a data attribute

            // Add a click event to each card
            card.addEventListener('mousedown', () => {
                const detailsContainer = document.getElementById('itembox');
               

                const userId = card.dataset.userId;
                const selectedUser = data.find(user => user.id == userId); // Find the user by ID
                

                if (selectedUser) {
                    // Check if the user content is already present in the #itembox container
                    const existingUser = detailsContainer.querySelector(`[data-user-id="${userId}"]`);
                    
                    // If the content is not already in the container, append it
                    if (!existingUser) {
                        detailsContainer.innerHTML += `
                            <div data-user-id="${userId}" class="mad" style="display: block;">
                                <h2 class="mad1">${selectedUser.name}</h2>
                                <p>${selectedUser.email}</p>
                                <button class="cl">x</button>
                                <p id="tt">${selectedUser.id}</p>
                            </div>
                        `;
                        
                       
                    }

                   
                }
                

                document.querySelectorAll('.cl').forEach(button => {
                    button.addEventListener("mousedown", function(){
                        console.log('button clicked')
                        this.closest('.mad').style.display="none";
                        
                    })
                })
           
            });

            return { name: user.name, email: user.email, element: card, id: user.id };
        });
    });




    

    


    // Function to handle card clicks
function handleCardClick(user) {
    // Different logic depending on the user
    if (user.id === 1) {
        cart.style.display='block'
            cartno.innerHTML= parseInt(cartno.textContent)+1;
            console.log(`User 1 clicked: ${user.name}`);
           
            // Add specific functionality for user 1 here
        
    } else if (user.id === 2) {
        cart.style.display='block'
        cartno.innerHTML= parseInt(cartno.textContent)+1;
            console.log(`User 1 clicked: ${user.name}`);
            
            // Add specific functionality for user 1 here
        
    } 
    else if (user.id === 3) {
        cart.style.display='block'
        cartno.innerHTML= parseInt(cartno.textContent)+1;
            console.log(`User 1 clicked: ${user.name}`);
            // Add specific functionality for user 1 here
        
    } else if (user.id === 4) {
        cart.style.display='block'
        cartno.innerHTML= parseInt(cartno.textContent)+1;
            console.log(`User 1 clicked: ${user.name}`);
            // Add specific functionality for user 1 here
        
    } else if (user.id === 5) {
        cart.style.display='block'
        cartno.innerHTML= parseInt(cartno.textContent)+1;
            console.log(`User 1 clicked: ${user.name}`);
            // Add specific functionality for user 1 here
        
    } else if (user.id === 6) {
        cart.style.display='block'
        cartno.innerHTML= parseInt(cartno.textContent)+1;
            console.log(`User 1 clicked: ${user.name}`);
            // Add specific functionality for user 1 here
        
    } else if (user.id === 7) {
        cart.style.display='block'
        cartno.innerHTML= parseInt(cartno.textContent)+1;
            console.log(`User 1 clicked: ${user.name}`);
            // Add specific functionality for user 1 here
        
    } else if (user.id === 8) {
        cart.style.display='block'
        cartno.innerHTML= parseInt(cartno.textContent)+1;
            console.log(`User 1 clicked: ${user.name}`);
            // Add specific functionality for user 1 here
        
    } else if (user.id === 9) {
        cart.style.display='block'
        cartno.innerHTML= parseInt(cartno.textContent)+1;
            console.log(`User 1 clicked: ${user.name}`);
            // Add specific functionality for user 1 here
        
    } else if (user.id === 10) {
        cart.style.display='block'
        cartno.innerHTML= parseInt(cartno.textContent)+1;
            console.log(`User 1 clicked: ${user.name}`);
            // Add specific functionality for user 1 here
        
    } 
    else {
        performDefaultAction(user);
    }
}

// Example of functions to perform on different users


function performActionForUser2(user) {
    console.log(`User 2 clicked: ${user.name}`);
    // Add specific functionality for user 2 here
}

function performDefaultAction(user) {
    console.log(`Other user clicked: ${user.name}`);
    // Default functionality for all other users
}


