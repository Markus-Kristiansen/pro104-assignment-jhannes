// Declares a function with the name renderProductList which can be used other place in the code
function renderProductList() {
    // Retrieves the value of the localStorage item "productList" AS A STRING (text)
    const productListJSON = window.localStorage.getItem("productList");

    // Parse (interpret) the textual product list as objects
    let productList = JSON.parse(productListJSON);
    if (productList === null) {
        productList = [];
    }

    // Retrieve the <div id='productList'></div>
    const productListEl = document.getElementById("productList");

    // remove all the contents of the <div id='productList'></div
    productListEl.innerHTML = "";
    
    // In turn assign each product in productList to "product"
    for (const product of productList) {
        // Creates a new <div> that can be placed in the document - currently it's living in the air
        const productEl = document.createElement("div");

        // Object destructoring - we're taking product apart
        const { name, image, price, description } = product;
        // This is the same as the following.
        //const name = product.name;
        //const image = product.image;
        //const price = product.price;

        // Ternary operator "? :" gives a conditional value
        const imageTag = (image ? `<div><img src='${image}' /></div>` : "");
        // It means the same as
        //let imageTag;
        //if (image) {
        //    imageTag = `<div><img src='${image}' /></div>`;
        //} else {
        //    imageTag = "";
        //}

        // Replace the contents of the productEl
        productEl.innerHTML = `<h4>${name}</h4>
            <button onclick='addItemToCart(event)'>Add to cart</button>
            ${imageTag}
            <div>${description}</div>
            <div><small>Price: ${price}</small></div>`;

        // Finally add the <div> to the <div id="productList">
        productListEl.appendChild(productEl);
    }   
}

function addItemToCart(event) {
    const productName = event.target.parentElement.querySelector("h4").innerText;
    console.log(productName);

    const shoppingCart = JSON.parse(window.localStorage.getItem("shoppingCart")) || [];
    shoppingCart.push(productName);
    window.localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));

    renderShoppingList();
}

function renderShoppingList() {

    const shoppingList = JSON.parse(window.localStorage.getItem("shoppingCart")) || [];
    const shoppingListEl = document.getElementById("items");
    shoppingListEl.innerHTML = "";
    
    for (const item of shoppingList) {
        const itemEl = document.createElement("div");
        itemEl.innerHTML = item;
        shoppingListEl.appendChild(itemEl);
    }
}


// declares a function createNewProduct with an parameter event
//  Event is a object with methods like
//    preventDefault (don't actually submit the form)
//  And properties like
//    target - the <form> that was submitted
function createNewProduct(event) {
    // Prevents browser for submitting page
    event.preventDefault();
 
    // Finds <input name='name'> [propertyName='propertyValue']
    //   and gets the contents of the input field (value)
    const name = document.querySelector("[name='name']").value;
    // Ditto for <input name='price' />
    const price = document.querySelector("[name='price']").value;
    const description = document.querySelector("[name='description']").value;
    // Find the <input name='image' /> and get the data-image="..." attribute
    //  This is the image as "base64 encoded data url"
    const image = document.querySelector("[name='image']").dataset.image;

    // Creates a new object with properties taken from the variables with the same name
    /*const product = {
        name: name, price: price, description: description, image: image
    }
        // This is the same
    const product = new Object();
    product.name = name;
    product.price = price;
    */
    const product = {name, price, description, image};


    const productList = JSON.parse(window.localStorage.getItem("productList")) || [];
    // Adds the new product to the end of the list
    productList.push(product);
    window.localStorage.setItem("productList", JSON.stringify(productList));

    // event.target refers to the <form>, <form>.reset clear alls values
    event.target.reset();
    // Find the <div id="imagePreview"> and remove the contents
    const previewEl = document.getElementById("imagePreview");
    previewEl.innerHTML = "";
    // Also reset <input name='image' data-image attribute
    delete document.querySelector("[name='image']").dataset.image;
}


// Declared a function handleFileLoad with a parameter event
function handleFileSelect(event) {
    // Declares inner function handleFileLoad can only be executed from handleFileSelect
    function handleFileLoad(event) {
        // We confusingly have two variables both named event
        const previewEl = document.getElementById("imagePreview");
        // Set the contents of the <div id='imagePreview' /> to the image|
        previewEl.innerHTML = "<img src='" + event.target.result + "' height='150px' />";
        // Sets the <input type='file' data-image attibute
        document.querySelector("[name='image']").dataset.image = event.target.result;
    }

    // FileReader lets me look at the contents of a <input type='file' />
    const reader = new FileReader()
    // When the reader is done with what I'm about to tell it, call the function handleFileLoad
    reader.onload = handleFileLoad;
    // Reads the contents of the file as a data-url and calls handleFileLoad with event.target.result
    reader.readAsDataURL(event.target.files[0])
}
