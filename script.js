document.addEventListener('DOMContentLoaded', function() {
    // Captura dos elementos do formulário de roupas e do formulário de senha
    const clothesForm = document.getElementById('clothesForm');
    const passwordForm = document.getElementById('passwordForm');

    // Captura do campo de entrada de senha e do elemento de mensagem de erro
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');

    // senha correta 
    const correctPassword = '1234'; 

    // Função do envio do formulário de roupas
    if (clothesForm) {
        clothesForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Captura dos valores dos campos do formulário de roupas
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

            // Leitura do arquivo de imagem usando FileReader
            const reader = new FileReader();

            reader.onload = function(event) {
                // Captura da URL da imagem carregada
                const imageUrl = event.target.result;

                // Obtenção da lista de roupas do localStorage ou inicialização de uma nova lista
                const clothes = JSON.parse(localStorage.getItem('clothes')) || [];

                // Adição da nova roupa à lista de roupas
                clothes.push({ name, size, description, price, imageUrl });
                localStorage.setItem('clothes', JSON.stringify(clothes));

                // Exibição de uma mensagem de sucesso
                alert('Roupa adicionada!');

                // Limpeza do formulário de roupas e atualização da lista de roupas exibida
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

            // lista de roupas ou inicialização de uma nova lista vazia
            const clothes = JSON.parse(localStorage.getItem('clothes')) || [];

            // Loop das roupas e criação dos elementos HTML 
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

        // Adiciona o item selecionado ao carrinho
        cart.push(clothes[index]);
        localStorage.setItem('cart', JSON.stringify(cart));

        // Exibe uma mensagem de sucesso
        alert('Item adicionado ao carrinho!');

        // Atualiza o total ao adicionar um item ao carrinho
        displayTotal();
    }

    // Função para exibir o carrinho de compras
    function displayCart() {
        const cartList = document.getElementById('cartList');

        if (cartList) {
            cartList.innerHTML = '';

            // inicialização de um novo carrinho vazio
            const cart = JSON.parse(localStorage.getItem('cart')) || [];

            // Loop através dos itens do carrinho e criação dos elementos HTML
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

        // Remove o item selecionado do carrinho
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));

        // Atualiza o carrinho exibido e o total
        displayCart();
        displayTotal();
    }

    // Função para limpar o carrinho
    window.clearCart = function() {
        localStorage.removeItem('cart');

        // Limpa o carrinho exibido e atualiza o total
        displayCart();
        displayTotal();
    }

    // Evento de envio do formulário de senha
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Evita o comportamento padrão do formulário

            // Captura da senha digitada pelo usuário
            const enteredPassword = passwordInput.value;

            // Verifica se a senha está correta
            if (enteredPassword === correctPassword) {
                alert('Senha correta!');

                // Redireciona para a página de adicionar roupas
                window.location.href = 'add-clothes.html';
            } else {
                // Exibe uma mensagem de erro se a senha estiver incorreta
                errorMessage.textContent = 'Senha incorreta, tente novamente.';
            }
        });
    }

    // Exibe a lista de roupas, o carrinho e o total ao carregar a página
    displayClothes();
    displayCart();
    displayTotal();
});

// Função para exibir o total dos itens no carrinho
function displayTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;

    // Percorre os itens do carrinho e adiciona o preço de cada um ao total
    cart.forEach(item => {
        total += parseFloat(item.price);
    });

    // Exibe o total formatado
    const totalElement = document.getElementById('total');
    if (totalElement) {
        totalElement.textContent = 'Total: R$ ' + total.toFixed(2);
    }
}
