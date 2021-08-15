document.addEventListener("DOMContentLoaded", () => {
    //fetch("https://makeup-api.herokuapp.com/api/v1/products.json").then(resp=>resp.json()).then(product=>console.log(product)) 

    const baseURL = "https://makeup-api.herokuapp.com/api/v1/products.json?brand=";
    // created an array of brands that i wanted to fetch from the api and used map to iterate over the array and fetch the brands
    const mainContainer = document.getElementById("main-container");

    function fetchSelectedBrands() {
        const brands = ["nyx", "maybelline", "clinique", "milani"];
        brands.map((brands) => {
            fetch(`${baseURL}${brands}`)
                .then(resp => resp.json())
                .then(product => displayData(product))
        })
    } fetchSelectedBrands();

    function displayData(product) {
        product.map(element => {
            createCards(element)
        });
    }

    function createCards(product) {

        const createDiv = document.createElement("div");
        createDiv.className = "card"

        const aTag = document.createElement("a");
        aTag.href = "#"
        aTag.className = "link"
        aTag.id = "aId"
        aTag.innerHTML = product.name;

        aTag.addEventListener("click", () => {
            productInfoOnClick(product);
        })

        const img = document.createElement("img");
        img.src = product.image_link;
        img.id = "mainImg"
        img.className = "product-image"

        img.addEventListener("click", () => {
            productInfoOnClick(product);
        })

        const p = document.createElement("p")
        p.innerText = ` $ ${product.price} `;
        p.id = "price"

        // adds the add to cart button
        const addToCart = document.createElement("button")
        addToCart.className = "addCartBtn";
        addToCart.innerText = "ADD TO CART"

        addToCart.addEventListener("click", () => {
            postItemToCart(product);
        })
        createDiv.append(aTag, img, p, addToCart);
        mainContainer.append(createDiv);

    }

    function postItemToCart(product) {
        alert("item has been added to the cart");
        fetch(`https://beauty-mart.herokuapp.com/cart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json"
            },
            body: JSON.stringify({
                "title": product.name,
                "productId": product.id,
                "img": product.image_link,
                "price": product.price
            })
        }).then(resp => resp.json())
    }

    function productInfoOnClick(product) {
        mainContainer.innerHTML = "";

        const name = document.createElement("h2")
        name.innerText = product.name;
        name.className = "cartAppear"
        name.id = "nameTitle"

        const img = document.createElement("img");
        img.src = product.image_link;
        img.className = "imgonA"

        const pr = document.createElement("p")
        pr.innerText = ` $ ${product.price} `;
        pr.id = "price"
        pr.className = "cartAppear"

        const addItem = document.createElement("button");
        addItem.innerText = "Add this item to cart"
        addItem.className = "cartAppear"
        addItem.id = "additem"

        addItem.addEventListener("click", () => {
            postItemToCart(product)
        })

        const p = document.createElement('p');
        p.innerHTML = `Product description: <br> <br>${product.description}`;
        p.className = "cartAppear";

        const productType = document.createElement("p")
        productType.innerText = `Product Type: ${product.product_type.toUpperCase()}`;
        productType.className = "cartAppear";

        /// creates a form for reviews 
        const commentForm = document.createElement("form")
        commentForm.id = "commentInput";

        const commentInput = document.createElement("input")
        commentInput.id = "enter-comment";
        commentInput.type = "text";
        commentInput.className = "cartAppear";
        commentInput.placeholder = "Enter your Review";

        const submitReview = document.createElement("button");
        submitReview.innerText = "Submit Review";
        submitReview.className = "submit-review";

        commentForm.append(commentInput, submitReview);
        commentForm.addEventListener("submit", (e) => {
            e.preventDefault();
            renderComments(commentInput.value);
            fetch(`https://beauty-mart.herokuapp.com/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "accept": "application/json"
                },
                body: JSON.stringify({
                    "review": commentInput.value,
                    "productId": product.id
                })
            }).then(resp => resp.json())
            e.target.reset();
        })
        fetchComments(product.id);
        // reviews.map(x=>x.productId===product.id)

        mainContainer.append(name, img, pr, addItem, p, productType, commentForm);
    }

    function renderComments(comment) // // commentInput.value passed
    {
        const commentSection = document.createElement("li");
        commentSection.className = "comment-box";
        commentSection.innerHTML = `📝${comment}`;

        const comUL = document.createElement("ul");
        comUL.append(commentSection);
        mainContainer.append(comUL);
    }

    function fetchComments(product)// product.id is passed to compare
    {
        fetch(`https://beauty-mart.herokuapp.com/reviews`)
            .then(resp => resp.json())
            .then(review => review.map((x) => {
                if (x.productId === product) {
                    renderComments(x.review)
                }
            }))
    }

    function callCart() {

        mainContainer.innerHTML = "";
        fetch(`https://beauty-mart.herokuapp.com/cart`)
            .then(resp => resp.json())
            .then(cart => {
                // checks the db.json cart if it's empty to show the message
                if (cart.length === 0) {
                    const message = document.createElement("h2");
                    message.className = "cartEmpty"
                    message.innerText = "Cart is Empty, please add an item to the cart ❤️"
                    mainContainer.append(message);
                }
                else {
                    cart.map(cart => renderCart(cart))
                }
            })
    }
    document.getElementById("cart").addEventListener("click", callCart);

    function deleteFromCart(ids) // passing card.id from delete button event listener
    {
        //console.log(cart);
        fetch(`https://beauty-mart.herokuapp.com/cart/${ids}`, {
            method: "DELETE",
            headers: {
                "content-type": 'application/json'
            }
        }).then(resp => resp.json())
    }

    function renderCart(cart) {
        const h2 = document.createElement("h2");
        h2.innerText = cart.title;
        h2.className = "cartAppear"
        h2.id = "titleId"

        const img = document.createElement("img");
        img.src = cart.img;
        img.className = "cartImage"

        const p = document.createElement("p");
        p.innerText = `$ ${cart.price}`
        p.className = "cartAppear"
        p.id = "price";

        const deleteButton = document.createElement("button");
        deleteButton.innerText = "delete item from cart"
        deleteButton.className = "deleteItem"

        deleteButton.addEventListener("click", () => {
            deleteFromCart(cart.id);
            callCart();
        })

        const checkout = document.createElement("button");
        checkout.innerText = "Place order for this Item";
        checkout.className = "placeOrder"

        checkout.addEventListener("click", () => {

            mainContainer.innerHTML = "";
            const order = document.createElement("h3");
            order.innerText = "YAYYY!! Your order has been placed!!";
            order.className = "cartEmpty";

            const h2 = document.createElement("h2");
            h2.innerText = "Thank you for shopping with us!"
            h2.className = "cartEmpty";

            const backToCart = document.createElement("button");
            backToCart.innerText = "Back to cart"
            backToCart.className = "backToCart"
            backToCart.addEventListener("click", () => {
                callCart();
            })
            const contShop = document.createElement("button");
            contShop.innerText = "Continue Shopping";
            contShop.className = "placeOrder"
            // used the same class as for place the order button to style it same
            contShop.addEventListener("click", () => {
                mainContainer.innerHTML = "";
                fetchSelectedBrands();
            });
            mainContainer.append(order, h2, backToCart, contShop);
            const ids = cart.id;
            deleteFromCart(ids);
        })
        mainContainer.append(h2, img, p, deleteButton, checkout);
    }

    document.getElementById("drp").addEventListener("click", () => {
        //we gonna access the classlist active and toggle it
        document.getElementById("myDropdown").classList.toggle("show")
    })
    // Close the dropdown menu if the user clicks outside of it
    // this refers to windows object
    this.onclick = function (event) {
        if (!event.target.matches('.dropbtn')) {
            let dropdowns = document.getElementsByClassName("dropdown-content");
            for (let i = 0; i < dropdowns.length; i++) {
                let openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }

    function dropDown() {
        const productType = ["lipstick", "blush", "bronzer", "eyeliner", "eyeshadow", "foundation"];
        for (let i = 0; i < productType.length; i++) {
            const productids = document.getElementById(productType[i])
            //console.log(productids);
            productids.addEventListener("click", () => {
                mainContainer.innerHTML = "";
                productCategory(productType[i])
            })
        }
    } dropDown();

    function productCategory(productType) {
        const brands = ["nyx", "maybelline", "clinique", "milani"];

        brands.map((brands) => {
            fetch(`${baseURL}${brands}&product_type=${productType}`)
                .then(resp => resp.json())
                .then(product => displayData(product))
        })
    }

    function search() {
        // event listener on the form itself
        document.getElementById("searchbar").addEventListener("submit", (e) => {
            findMakeup(e);
            // e.preventDefault();
            // //console.log(brands);
            // const val = e.target.lastElementChild.value.toString(); // value of this is input text in search field 
            // // console.log(val);
            // switch (val.toLowerCase()) {
            //     case "nyx": fetchMakeup("nyx");
            //         break;
            //     case "milani": fetchMakeup("milani");
            //         break;
            //     case "clinique": fetchMakeup("clinique");
            //         break;
            //     case "maybelline": fetchMakeup("maybelline");
            //         break;
            //     default: alert("Please enter correct Brand name");
            //         fetchSelectedBrands();
            // }
            // e.target.reset();
            // mainContainer.innerHTML = "";
        })
    }
    search();
    function findMakeup(e) {
        e.preventDefault();
        //console.log(brands);
        const val = e.target.lastElementChild.value.toString(); // value of this is input text in search field 
        // console.log(val);
        switch (val.toLowerCase()) {
            case "nyx": fetchMakeup("nyx");
                break;
            case "milani": fetchMakeup("milani");
                break;
            case "clinique": fetchMakeup("clinique");
                break;
            case "maybelline": fetchMakeup("maybelline");
                break;
            default: alert("Please enter correct Brand name");
                fetchSelectedBrands();
        }
        e.target.reset();
        mainContainer.innerHTML = "";
    }

    function fetchMakeup(brand) {
        fetch(`${baseURL}${brand}`)
            .then(resp => resp.json())
            .then(product => displayData(product))
    }
})

