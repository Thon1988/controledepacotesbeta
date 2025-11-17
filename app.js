<!-- LÓGICA JAVASCRIPT SIMULADA -->
    <script>
        function handleLogin(event) {
            event.preventDefault(); // Impede o envio padrão do formulário
            
            const emailInput = document.getElementById('email').value;
            const passwordInput = document.getElementById('password').value;
            const statusMessage = document.getElementById('status-message');
            const loginButton = document.getElementById('login-button');

            // Simula um estado de carregamento
            loginButton.disabled = true;
            loginButton.textContent = 'Acessando...';
            statusMessage.textContent = ''; 
            statusMessage.classList.remove('text-red-600');

            console.log(`Tentativa de Login: Usuário=${emailInput}, Senha=${passwordInput}`);

            // Simulação de delay de rede
            setTimeout(() => {
                loginButton.disabled = false;
                loginButton.textContent = 'Entrar';

                // Simulação de autenticação
                if (emailInput === 'teste@email.com' && passwordInput === '123456') {
                    statusMessage.textContent = 'Login bem-sucedido! Redirecionando...';
                    statusMessage.classList.remove('text-red-600');
                    statusMessage.classList.add('text-green-600');
                    // Aqui seria o código de redirecionamento para o dashboard
                    console.log("Login OK.");
                } else {
                    statusMessage.textContent = 'Credenciais inválidas. Tente novamente.';
                    statusMessage.classList.add('text-red-600');
                    statusMessage.classList.remove('text-green-600');
                    console.error("Login Falhou.");
                }
            }, 1500); // 1.5 segundos de simulação
        }
    </script>
</body>
</html>
