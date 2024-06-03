document.addEventListener('DOMContentLoaded', function() {
    // Captura elementos do formulário de roupas e do formulário de senha
    const clothesForm = document.getElementById('clothesForm');
    const passwordForm = document.getElementById('passwordForm');

    // entrada de senha e de mensagem de erro
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');

    //  senha 
    const correctPassword = '1234'; 

    // Formulário de roupas
    if (clothesForm) {
        clothesForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const size = document.getElementById('size').value;
            const description = document.getElementById('description').value;
            const price = parseFloat(document.getElementById('price').value).toFixed(2);
            const imageInput = document.getElementById('image');
            const imageFile = imageInput.files[0];
            
            // Verifica se todos os campos foram preenchidos
            if (!name || !size || !description || !price || !imageFile) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            const reader = new FileReader();

            reader.onload = function(event) {
                const imageUrl = event.target.result;
                const clothes = JSON.parse(localStorage.getItem('clothes')) || [];

                // adição da nova roupa à lista de roupas
                clothes.push({ name, size, description, price, imageUrl });
                localStorage.setItem('clothes', JSON.stringify(clothes));
                alert('Roupa adicionada!');

                // Limpeza do formulário de roupas
                clothesForm.reset();
                displayClothes();
            };
            reader.readAsDataURL(imageFile);
        });
    }

    // exibir a lista de roupas
    function displayClothes() {
        const clothesList = document.getElementById('clothesList');

        if (clothesList) {
            clothesList.innerHTML = '';
            const clothes = JSON.parse(localStorage.getItem('clothes')) || [];
            clothes.forEach((item, index) => {
                const newClothesItem = document.createElement('div');
                newClothesItem.classList.add('clothes-item');
                newClothesItem.innerHTML = `
                    <img src="${item.imageUrl}" alt="${item.name}">
                    <div>
                        <h3>${item.name}</h3>
                        <p>Tamanho: ${item.size}</p>
                        <p>${item.description}</p>
                        <p>Preço: R$${item.price}</p>
                        <button class="add-to-cart-button" onclick="addToCart(${index})">Adicionar ao Carrinho</button>
                    </div>
                `;
                clothesList.appendChild(newClothesItem);
            });
        }
    }

    // Função para adicionar um item ao carrinho
    window.addToCart = function(index) {
        const clothes = JSON.parse(localStorage.getItem('clothes')) || [];
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(clothes[index]);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Item adicionado ao carrinho!');
        displayTotal();
    }

    // Função para exibir o carrinho de compras
    function displayCart() {
        const cartList = document.getElementById('cartList');

        if (cartList) {
            cartList.innerHTML = '';
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.forEach((item, index) => {
                const newCartItem = document.createElement('div');
                newCartItem.classList.add('cart-item');
                newCartItem.innerHTML = `
                    <img src="${item.imageUrl}" alt="${item.name}">
                    <div>
                        <h3>${item.name}</h3>
                        <p>Tamanho: ${item.size}</p>
                        <p>${item.description}</p>
                        <p>Preço: R$${item.price}</p>
                        <button class="delete-button" onclick="removeFromCart(${index})">Remover</button>
                    </div>
                `;
                cartList.appendChild(newCartItem);
            });
        }
    }

    // Função para remover um item do carrinho
    window.removeFromCart = function(index) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        displayTotal();
    }

    // Função para limpar o carrinho
    window.clearCart = function() {
        localStorage.removeItem('cart');
        displayCart();
        displayTotal();
    }

    // Evento de envio do formulário de senha
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const enteredPassword = passwordInput.value;
            if (enteredPassword === correctPassword) {
                alert('Senha correta!');
                window.location.href = 'add-clothes.html';
            } else {
                errorMessage.textContent = 'Senha incorreta, tente novamente.';
            }
        });
    }

    displayClothes();
    displayCart();
    displayTotal();
});

// Função para exibir o total dos itens no carrinho
function displayTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;
    cart.forEach(item => {
        total += parseFloat(item.price);
    });
    const totalElement = document.getElementById('total');
    if (totalElement) {
        totalElement.textContent = 'Total: R$ ' + total.toFixed(2);
    }
}
