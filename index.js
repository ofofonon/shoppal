// Variables and Elements
const userCardTemplate = document.querySelector("[data-user-template]");
const userCardContainer = document.querySelector("[data-user-cards-container]");
const searchInput = document.querySelector("[data-search]");
const searchInput2 = document.querySelector("[data-search1]");
const cartno = document.getElementById('cartno');
const cart = document.getElementById('cart');
const detailsContainer = document.getElementById('itembox');
const orderlist1 = document.getElementById('orderlist1');



let addedValue = 3000; // You can change this value to any fixed amount (e.g., $10)

// Element to display the added value
const addedValueDisplay = document.getElementById('trans');

// Function to update the cart total
function updateCartTotal() {
    let total = 0;
    const madDivs = document.querySelectorAll('.mad');
    madDivs.forEach(madDiv => {
        const priceText = madDiv.querySelector('.pr').textContent;  // Get the price text from the .pr element
        const price = parseFloat(priceText.replace('₦', '').trim());  // Convert to float
        const quantity = parseInt(madDiv.querySelector('.numfig').value);  // Get quantity from .numfig input
        total += price * quantity;  // Add multiplied value to total
    });
    document.getElementById('cartTotal').innerText = `Sub-total: ₦${total.toFixed(1)}`;  // Update the cart total display


    addedValueDisplay.innerText = `Delivery fee: ₦${addedValue.toFixed(1)}`;

    // Update the final total (cart total + added value)
    const finalTotal = total + addedValue;
    document.getElementById('tot').innerText = `Total: ₦ ${finalTotal.toFixed(1)}`;
    document.getElementById('last').innerHTML = `${finalTotal.toFixed(1)}`

   
}


 //<input type="number" id="amount" placeholder="Enter amount">
//<button onclick="makePayment()">Pay Now</button>


function makePayment() {
    const amm=document.getElementById('last').textContent
    console.log(amm)
    let amount = parseFloat(amm);
    let form = document.getElementById('paymentform');
    const em = document.getElementById('email').value;
    const num = document.getElementById('num').value;
    const nam = document.getElementById('name').value;
    
    
    
    if (amount <= 0 || isNaN(amount)) {
        alert("Please enter a valid amount");
        return;
    }
    else if(!form.checkValidity()){
        alert('Please fill in all fields');
            return;
    }

    // Flutterwave Inline Checkout
    FlutterwaveCheckout({
        public_key: "FLWPUBK-fbc22cef3bd266be8cf8fc4880642ec1-X", // Replace with your actual Public Key
        tx_ref: "TX-" +  new Date().getTime(),  // Unique transaction reference
        amount: amount,  // Dynamically passed amount
        currency: "NGN",  // Change if needed (USD, GHS, KES, etc.)
        payment_options: "card, ussd, banktransfer",
        customer: {
            email: em,
            phone_number: num,
            name: nam
            
        },
        callback: function (data) { // Runs after payment
            console.log("Payment successful:", data);
            alert("Payment successful! Transaction ID: " + data.transaction_id);
        },
        onclose: function() {
            alert("Payment window closed.");
        }
    });
}











const itemCountDisplay = document.getElementById('noi');  // Update with your own element

// Function to update the count of .mad divs
function updateItemCount() {
    const cartno = document.getElementById('cartno')
    const madDivs = document.querySelectorAll('.mad'); // Get all .mad divs
    const itemCount = madDivs.length; // Get the count of .mad divs
    itemCountDisplay.innerText = "Number of Items:" + itemCount; // Display the count
    cartno.innerHTML=itemCount;
    function noitem(){
        if(itemCount === 0){
            document.getElementById('noitem').style.display='block'
        }
        else{ document.getElementById('noitem').style.display='none'}
    }
    noitem()
}




// Handle quantity changes (both increase and decrease)
document.body.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('gt')) {  // "+" button
        const numfigInput = e.target.closest('.mad').querySelector('.numfig');
        numfigInput.value = parseInt(numfigInput.value) + 1;  // Increase the quantity
        updateCartTotal();  // Update the total
    }

    if (e.target && e.target.classList.contains('gtm')) {  // "-" button
        const numfigInput = e.target.closest('.mad').querySelector('.numfig');
        if (numfigInput.value > 1) {
            numfigInput.value = parseInt(numfigInput.value) - 1;  // Decrease the quantity
            updateCartTotal();  // Update the total
        }
    }

    if (e.target && e.target.classList.contains('cl')) {  // "x" button (remove item)
        const madDiv = e.target.closest('.mad');
        const priceText = madDiv.querySelector('.pr').textContent;
        const price = parseFloat(priceText.replace('₦', '').trim());
        const quantity = parseInt(madDiv.querySelector('.numfig').value);
        const itemTotal = price * quantity;
        
        // Subtract the item total from the global total(
        let currentTotal = parseFloat(document.getElementById('cartTotal').innerText.replace('Sub-total: $', '').trim());
        currentTotal -= itemTotal;  // Subtract the item total
        document.getElementById('cartTotal').innerText = `Sub-total: ₦${currentTotal.toFixed(2)}`;

       
       
        madDiv.remove();   // Hide the item
        cartno.innerHTML = parseInt(cartno.textContent) - 1;
        updateCartTotal();
          // Decrease cart count
          updateItemCount()
    }

    updateItemCount() 
});






// Handle direct input changes in quantity
document.body.addEventListener('input', (e) => {
    if (e.target && e.target.classList.contains('numfig')) {
        updateCartTotal();  // Update total when input value changes directly
    }
});







// Function to handle the addition of items to the cart
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
            body.textContent = '₦'+' '+ user.email;
            image.src = user.image;
            image.width = 60;
            card.prepend(image);
            card.addEventListener('mousedown', () => handleCardClick(user));
            userCardContainer.append(card);

            // Add a unique identifier to each card (user ID)
            card.dataset.userId = user.id;

            // Add event listener to handle item click and show details
            card.addEventListener('mousedown', () => {
                const userId = card.dataset.userId;
                const selectedUser = data.find(user => user.id == userId);
                const detailsContainer = document.getElementById('itembox');
                
                if (selectedUser) {
                    // Check if the user content already exists in the #itembox container
                    const existingUser = detailsContainer.querySelector(`[data-user-id="${userId}"]`);
                    
                    if (existingUser) {
                        existingUser.style.display = "block";
                    } else {
                        // Add new item to cart
                        detailsContainer.innerHTML += `
                            <div data-user-id="${userId}" class="mad" style="display: block;">
                                <img src="${selectedUser.image}" class="itemimage1">
                                <h3 class="mad1">${selectedUser.name}</h3>
                               <p>₦</p><p class="pr">${selectedUser.email}</p>
                                <div class="num">
                                    <button class="gtm" style="cursor: pointer; border: none;">-</button>
                                    <input type="number" class="numfig" value="1" min="1" />
                                    <button class="gt" style="cursor: pointer; border: none;">+</button>
                                </div>
                                <button class="bl"><i class="cl fa-solid fa-xmark "></i></button>
                            </div>
                        `;
                        updateCartTotal();

                        
                    }
                }
            });

            return { name: user.name, email: user.email, element: card, id: user.id };
            
        });
    });





    function getCartItems() {
        const madDivs = document.querySelectorAll('.mad'); // Get all cart items
        const cartItems = [];
    
        madDivs.forEach(madDiv => {
            const itemName = madDiv.querySelector('.mad1')?.textContent.trim(); // Get item name
            const priceText = madDiv.querySelector('.pr')?.textContent.trim(); // Get price text
            const quantity = madDiv.querySelector('.numfig')?.value; // Get quantity
    
            const price = parseFloat(priceText.replace('$', '').trim()); // Convert price to float
            const qty = parseInt(quantity); // Convert quantity to integer
    
            if (!isNaN(price) && !isNaN(qty)) {
                cartItems.push({
                    name: itemName,
                    price: price,
                    quantity: qty
                });
            }
        });
    
        console.log(cartItems);
        document.getElementById('dis').innerHTML = cartItems;// Logs the array of cart items
        return cartItems;
    }
    
    

    (function () {
        emailjs.init("RA1Kqya_IGt_DITwX"); // Replace with your actual EmailJS Public Key
      })();

  function sendCartDetails() {
    // Get all cart items
    
    const madDivs = document.querySelectorAll('.mad'); // Get all cart items
    const cartItems = [];

    madDivs.forEach(madDiv => {
        const itemName = madDiv.querySelector('.mad1')?.textContent.trim(); // Get item name
        const priceText = madDiv.querySelector('.pr')?.textContent.trim(); // Get price text
        const quantity = madDiv.querySelector('.numfig')?.value; // Get quantity

        const price = parseFloat(priceText.replace('₦', '').trim()); // Convert price to float
        const qty = parseInt(quantity); // Convert quantity to integer

        if (!isNaN(price) && !isNaN(qty)) {
            cartItems.push(`${itemName} - ${qty} x ₦${price}`);
        }
    });
    
    const cartDetailsString = cartItems.join("\n");




    var params = {
        cart_data: cartDetailsString, // Now it's a formatted string, not an array
        email: document.getElementById('email').value,
        name: document.getElementById('name').value,
        Number: document.getElementById('num').value,
        total: document.getElementById('last').textContent,
        address: document.getElementById('ad').value,
        region: document.getElementById('region').value
    };

    console.log("Params to send:", params);
    // Send email using EmailJS
    emailjs
      .send("service_cqlpxyd", "template_c6a0v6m", params)
      .then(function (response) {
        alert("Cart details sent successfully!");
      })
      .catch(function (error) {
        alert("Failed to send cart details. Try again!");
        console.error("EmailJS Error:", error);
      });
  }


    // Call this function to test
    
    











    

// Function to show/hide order
function showorder() {
    orderlist1.style.display = 'block';
}

function closeorder() {
    orderlist1.style.display = 'none';
}

// Handle search input synchronization
searchInput2.addEventListener("input", function () {
    searchInput.value = this.value;
});
document.getElementById('nor').innerHTML=`No Items found for `;
searchInput.addEventListener('input', function () {
    document.getElementById('nor2').innerText = this.value;
});
searchInput2.addEventListener('input', function () {
    document.getElementById('nor2').innerText = this.value;
});

// Handle user search/filtering in the list
searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    let visibleCount = 0;
    users.forEach(user => {
        const isVisible = user.name.toLowerCase().includes(value) || user.email.toLowerCase().includes(value);
        user.element.classList.toggle("hide", !isVisible);
        user.element.style.display = isVisible ? "block" : "none";
        visibleCount += isVisible ? 1 : 0;
    });
    document.getElementById('noresult').style.display = visibleCount > 0 ? "none" : "block";
});

searchInput2.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    let visibleCount = 0;
    users.forEach(user => {
        const isVisible = user.name.toLowerCase().includes(value) || user.email.toLowerCase().includes(value);
        user.element.classList.toggle("hide", !isVisible);
        user.element.style.display = isVisible ? "block" : "none";
        visibleCount += isVisible ? 1 : 0;
    });
    document.getElementById('noresult').style.display = visibleCount > 0 ? "none" : "block";
});





















function handleCardClick(user) {
    // Different logic depending on the user
    if (user.id >= 1 && user.id <=200) {
        cart.style.display='block'
            
            console.log(`User 1 clicked: ${user.name}`);
           document.getElementById('dis').style.bottom='5%'
            setTimeout( function(){
                document.getElementById('dis').style.bottom='-19%';
            }, 800)
        
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



function showpay(){
    document.getElementById('payinfo').style.display='block'
}

function closepay(){
    document.getElementById('payinfo').style.display='none'
}







