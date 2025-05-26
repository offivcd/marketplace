const form = document.getElementById('productForm');
const container = document.getElementById('productsContainer');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const price = document.getElementById('price').value;
  const image = document.getElementById('image').value;

  const product = { name, price, image, approved: false };
  // Simulated API call: save product to backend for approval (not implemented)
  alert('Your product has been submitted for approval.');
  form.reset();
});

function addProductToDOM(product) {
  if (!product.approved) return; // Only show approved products
  const div = document.createElement('div');
  div.className = 'product';
  div.innerHTML = `
    <img src="${product.image}" alt="${product.name}" />
    <h3>${product.name}</h3>
    <p>💰 ${product.price} Robux</p>
  `;
  container.appendChild(div);
}

// Sample static load
const sampleProducts = [
  { name: 'Cool Hat', price: 100, image: 'https://via.placeholder.com/150', approved: true },
  { name: 'Fancy Shirt', price: 250, image: 'https://via.placeholder.com/150', approved: true }
];

sampleProducts.forEach(addProductToDOM);
