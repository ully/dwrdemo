/*
 * Handles a submission of the search form
 */
var DWRUtil = dwr.util;
function searchFormSubmitHandler() {

  var searchexp = $("searchbox").value;

  Catalogue.findItems(searchexp, displayItems);
  return false;
}

/*
 * Handles a click on an Item's "Add to Cart" button
 */
function addToCartButtonHandler() {

  Cart.addItemToCart(this.itemId,displayCart);
}

/*
 * Array of functions to populate a row of the items table
 * using DWRUtil's addRows function
 */
var cellFunctions = [
  function(item) { return item.name; },
  function(item) { return item.description; },
  function(item) { return item.formattedPrice; },
  function(item) { 
    var btn = document.createElement("button");
    btn.innerHTML = "Add to cart";
    btn.itemId = item.id;
    btn.onclick = addToCartButtonHandler;
    return btn;
  }
];

/*
 * Displays a list of catalogue items
 */
function displayItems(items) {

  DWRUtil.removeAllRows("items");

  if (items.length == 0) {
    alert("No matching products found");
    $("catalogue").style.visibility = "hidden";
  } else {
    DWRUtil.addRows("items",items,cellFunctions);
    $("catalogue").style.visibility = "visible";
  }
}

/*
 * Displays the contents of the user's shopping cart
 */
function displayCart(cart) {
  
  // Clear existing content of Cart
  var contentsUL = $("contents");
  contentsUL.innerHTML="";

  // Loop over cart items
  for (var I in cart.simpleContents) {

    // Add a list element with the name and quantity of each
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(
                    cart.simpleContents[I] + " x " + I)
                  );
    contentsUL.appendChild(li);
  }

  // Update cart total
  var totalSpan = $("totalprice");
  totalSpan.innerHTML = cart.formattedTotalPrice;
}

window.onload = function() {

  // Update Cart state from session
  Cart.getCart(displayCart);
  $("searchform").onsubmit = searchFormSubmitHandler;
}
