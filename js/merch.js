const products = [
  {id:1,name:"Infinity Black Tee",price:999,image:"images/tshirt.jpg"},
  {id:2,name:"Studio Hoodie",price:1999,image:"images/hoodie.jpg"},
  {id:3,name:"Creator Mug",price:499,image:"images/mug.jpg"},
  {id:4,name:"Infinity Bottle",price:799,image:"images/bottle.jpg"},
  {id:5,name:"Custom Mandala Art",price:1499,image:"images/mandala.jpg"}
];

let cart = [];

const productList = document.getElementById("product-list");

products.forEach(product=>{
  productList.innerHTML += `
    <div class="product">
      <img src="${product.image}">
      <h3>${product.name}</h3>
      <p>₹${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    </div>
  `;
});

function addToCart(id){
  const item = products.find(p=>p.id===id);
  cart.push(item);
  updateCart();
}

function updateCart(){
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");

  cartItems.innerHTML="";
  let total=0;

  cart.forEach((item,index)=>{
    total+=item.price;
    cartItems.innerHTML+=`
      <div class="cart-item">
        ${item.name} - ₹${item.price}
        <button onclick="removeItem(${index})">X</button>
      </div>
    `;
  });

  cartTotal.innerText=total;
  cartCount.innerText=cart.length;
}

function removeItem(index){
  cart.splice(index,1);
  updateCart();
}

function toggleCart(){
  document.getElementById("cart").classList.toggle("active");
}

function openCheckout(){
  document.getElementById("checkout").style.display="flex";
}

function closeCheckout(){
  document.getElementById("checkout").style.display="none";
}

function placeOrder(){
  alert("Order placed successfully! We will contact you shortly.");
  cart=[];
  updateCart();
  closeCheckout();
}