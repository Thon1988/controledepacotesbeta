<!-- LÓGICA JAVASCRIPT CORRIGIDA -->
    <script>
        // Função para simular o login
        function handleLogin(event) {
            event.preventDefault(); // Impede o envio padrão do formulário
            
            // CORREÇÃO: Usando .trim() para garantir que não haja espaços acidentais
            const emailInput = document.getElementById('email').value.trim();
            const passwordInput = document.getElementById('password').value.trim();
            const statusMessage = document.getElementById('status-message');
            const loginButton = document.getElementById('login-button');

            // Limpa mensagens anteriores
            statusMessage.textContent = ''; 
            statusMessage.className = 'text-center text-sm font-medium h-5';
            
            // Simula um estado de carregamento
            loginButton.disabled = true;
            loginButton.textContent = 'Acessando...';
            loginButton.classList.add('opacity-70');

            console.log(`Tentativa de Login: Usuário=${emailInput}, Senha=${passwordInput}`);

            // Simulação de delay de rede
            setTimeout(() => {
                loginButton.disabled = false;
                loginButton.textContent = 'Entrar';
                loginButton.classList.remove('opacity-70');

                // Lógica de Autenticação Simulada. Use 'teste' e '123' para login bem-sucedido.
                if (emailInput === 'teste' && passwordInput === '123') {
                    statusMessage.textContent = 'Login bem-sucedido! Acesso liberado para digitalização.';
                    statusMessage.classList.add('text-green-600');
                    console.log("Login OK. Próximo passo: Inicializar Firebase e Scanner.");
                    // Neste ponto, você faria o redirecionamento para a tela principal (QR Code Scanner)
                } else {
                    statusMessage.textContent = 'Credenciais inválidas. Verifique seu usuário/email e senha.';
                    statusMessage.classList.add('text-red-600');
                    console.error("Login Falhou. Credenciais incorretas ou usuário não autorizado.");
                }
            }, 1500); // 1.5 segundos de simulação
        }

        // Funções do Modal de Recuperação de Senha

        function showForgotPassword(event) {
            event.preventDefault();
            document.getElementById('forgot-password-modal').classList.remove('hidden');
            document.getElementById('recovery-status').textContent = '';
        }

        function closeForgotPassword() {
            document.getElementById('forgot-password-modal').classList.add('hidden');
        }

        function simulateRecovery() {
            const recoveryInput = document.getElementById('recovery-input').value.trim();
            const recoveryStatus = document.getElementById('recovery-status');
            
            recoveryStatus.className = 'text-center text-xs font-medium h-4 mt-2';
            
            if (recoveryInput.length < 5) {
                recoveryStatus.textContent = "Por favor, insira um email ou telefone válido.";
                recoveryStatus.classList.add('text-red-500');
                return;
            }

            recoveryStatus.textContent = "Verificando dados...";
            recoveryStatus.classList.add('text-gray-500');

            setTimeout(() => {
                // Simulação de envio
                recoveryStatus.textContent = `Código enviado para ${recoveryInput}! Verifique seu Email ou WhatsApp.`;
                recoveryStatus.classList.remove('text-gray-500');
                recoveryStatus.classList.add('text-green-600');
                document.getElementById('recovery-input').value = '';
            }, 2000);
        }
    </script>
</body>
</html>
