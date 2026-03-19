// ================= LOADER =================
window.addEventListener("load", ()=>{
  const loader = document.getElementById("loader");
  if(loader){
    loader.style.opacity = "0";
    setTimeout(()=> loader.style.display = "none", 500);
  }
});

// ================= GLOBAL CART =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  initSizeSelection();
  updateCartCount();
});

// ================= SIZE SELECT =================
function initSizeSelection(){
  document.querySelectorAll(".size-select span").forEach(el=>{
    el.addEventListener("click", function(){
      const parent = this.parentElement;
      parent.querySelectorAll("span").forEach(s=>s.classList.remove("active"));
      this.classList.add("active");
    });
  });
}

// ================= CART COUNT =================
function updateCartCount(){
  const count = cart.reduce((total, item) => total + item.qty, 0);
  const el = document.getElementById("cart-count");
  if(el) el.innerText = count;
}

// ================= QUANTITY =================
function changeQty(btn, change){
  const qtyEl = btn.parentElement.querySelector(".qty");
  let qty = parseInt(qtyEl.innerText);

  qty += change;
  if(qty < 1) qty = 1;

  qtyEl.innerText = qty;
}

// ================= ADD TO CART =================
function addToCartWithOptions(btn, name, price, type){

  const card = btn.closest(".product-card");
  const qty = parseInt(card.querySelector(".qty").innerText);

  let size = null;

  // SIZE CHECK
  if(type !== "normal"){
    const selected = card.querySelector(".size-select .active");

    if(!selected){
      showToast("⚠️ Please select size");
      return;
    }

    size = selected.innerText;
  }

  // CHECK EXISTING ITEM
  const existing = cart.find(item =>
    item.name === name && item.size === size
  );

  if(existing){
    existing.qty += qty;
  } else {
    cart.push({
      name,
      price,
      qty,
      size
    });
  }

  saveCart();
  updateCartCount();
  showToast(`Added: ${name}${size ? " ("+size+")" : ""}`);
}

// ================= SAVE =================
function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ================= TOAST (UPGRADED POPUP) =================
function showToast(message){

  const toast = document.createElement("div");
  toast.className = "cart-popup";
  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(()=>{
    toast.style.opacity = "0";
  },1500);

  setTimeout(()=>{
    toast.remove();
  },2000);
}

// ================= COUPON =================
function applyCoupon(code, total){

  code = code.toUpperCase();
  let discount = 0;

  if(["BIG40","FLAT40","BEEINFINITY40"].includes(code)){
    discount = total * 0.4;
  }

  return {
    discount,
    finalTotal: total - discount
  };
}

// ================= CLEAR CART =================
function clearCart(){
  localStorage.removeItem("cart");
  cart = [];
  updateCartCount();
  showToast("Cart cleared");
}

// ================= GET CART =================
function getCart(){
  return cart;
}

// ================= DEBUG =================
function logCart(){
  console.log("Cart:", cart);
}



function updateCartCount(){
  const count = cart.reduce((total, item) => total + item.qty, 0);

  const navCount = document.getElementById("cart-count");
  const floatingCount = document.getElementById("cart-count-floating");

  if(navCount) navCount.innerText = count;
  if(floatingCount) floatingCount.innerText = count;
}