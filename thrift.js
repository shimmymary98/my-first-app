/*====================================
        =            Data & Utils            =
        ====================================*/
        const products = [
            {
                id: 1,
                name: "Red T‑Shirt",
                price: 30000,
                img: "https://media.istockphoto.com/id/802266788/photo/red-tshirt-clothes-on-isolated.jpg?s=1024x1024&w=is&k=20&c=JUmdFPoeKrjIgLINHls4qvfCs2MV6oBnIwlns7krZA0=",
            },
            {
                id: 2,
                name: "Blue Jeans",
                price: 60000,
                img: "https://plus.unsplash.com/premium_photo-1665664652383-2308d742943c?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
            {
                id: 3,
                name: "Sneakers",
                price: 120000,
                img: "https://media.istockphoto.com/id/1688015574/photo/white-sneaker-isolated-on-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=6JRmdS5V14lvIBrVvfu8Q6qHgZ8-gYRr4X45xXrByp8=",
            },
        ];

        // Cart object: { id: { ...product, qty } }
        const cart = {};

        const money = (n) =>
            n.toLocaleString("en-UG", { maximumFractionDigits: 0 });

        /*=====  End of Data & Utils  ======*/

        /*========================================
        =            Render Products            =
        ========================================*/
        function renderProducts() {
            const row = document.getElementById("product-row");
            products.forEach((p) => {
                const col = document.createElement("div");
                col.className = "col-sm-6 col-md-4";
                col.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <img src="${p.img}" class="card-img-top" alt="${p.name}" />
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${p.name}</h5>
                        <p class="card-text fw-bold mb-4">UGX ${money(p.price)}</p>
                        <button class="btn btn-primary mt-auto" data-id="${p.id}">Add to Cart</button>
                    </div>
                </div>`;
                row.appendChild(col);
            });
        }
        /*=====  End of Render Products  ======*/

        /*====================================
        =            Cart Helpers            =
        ====================================*/
        function updateCartCount() {
            const count = Object.values(cart).reduce((s, c) => s + c.qty, 0);
            document.getElementById("cart-count").textContent = count;
        }

        function updateCartModal() {
            const body = document.getElementById("cart-body");
            body.innerHTML = "";
            let total = 0;

            Object.values(cart).forEach((item) => {
                const subtotal = item.price * item.qty;
                total += subtotal;
                body.insertAdjacentHTML(
                    "beforeend",
                    `
                <tr>
                    <td>${item.name}</td>
                    <td>
                        <input
                            type="number"
                            min="1"
                            value="${item.qty}"
                            data-id="${item.id}"
                            class="form-control form-control-sm qty-input"
                        />
                    </td>
                    <td>UGX ${money(item.price)}</td>
                    <td>UGX ${money(subtotal)}</td>
                    <td>
                        <button
                            class="btn btn-sm btn-outline-danger remove-btn"
                            data-id="${item.id}"
                        >
                            &times;
                        </button>
                    </td>
                </tr>`
                );
            });

            document.getElementById("cart-total").textContent = money(total);
        }

        function addToCart(id) {
            const prod = products.find((p) => p.id === id);
            if (!cart[id]) cart[id] = { ...prod, qty: 0 };
            cart[id].qty += 1;
            updateCartCount();
        }
        /*=====  End of Cart Helpers  ======*/

        /*=============================================
        =            Global Event Listeners            =
        =============================================*/
        // Add to cart & remove buttons
        document.addEventListener("click", (e) => {
            // Add to cart
            if (e.target.matches("button[data-id]")) {
                addToCart(Number(e.target.dataset.id));
            }
            // Remove
            if (e.target.classList.contains("remove-btn")) {
                const id = Number(e.target.dataset.id);
                delete cart[id];
                updateCartCount();
                updateCartModal();
            }
        });

        // Quantity input inside modal
        document.addEventListener("input", (e) => {
            if (e.target.classList.contains("qty-input")) {
                const id = Number(e.target.dataset.id);
                const val = Math.max(1, Number(e.target.value));
                cart[id].qty = val;
                updateCartCount();
                updateCartModal();
            }
        });

        // Open modal updates its content
        document
            .getElementById("cartModal")
            .addEventListener("show.bs.modal", updateCartModal);

        // Checkout button
        document.getElementById("checkout-btn").addEventListener("click", () => {
            if (Object.keys(cart).length === 0) {
                alert("Your cart is empty!");
                return;
            }
            alert("Thank you for your purchase! (Demo checkout)");
            // Reset cart
            for (const id in cart) delete cart[id];
            updateCartCount();
            document.querySelector("#cartModal .btn-close").click();
        });
        /*=====  End of Global Event Listeners  ======*/

        // Initial render
        renderProducts();