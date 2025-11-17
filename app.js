<!-- MODAL DE RECUPERAÇÃO DE SENHA -->
    <div id="forgot-password-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center modal-overlay transition-opacity duration-300" role="dialog" aria-modal="true">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all">
            <h3 class="text-lg font-bold leading-6 text-gray-900 mb-4">Recuperação de Senha</h3>
            <p class="text-sm text-gray-500 mb-4">
                Informe seu email ou telefone cadastrado para receber o código de confirmação via Email ou WhatsApp.
            </p>
            
            <input id="recovery-input" type="text" placeholder="Email ou Telefone" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            
            <div id="recovery-status" class="text-center text-xs font-medium h-4 mt-2"></div>

            <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button type="button" onclick="simulateRecovery()" class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm">
                    Enviar Código
                </button>
                <button type="button" onclick="closeForgotPassword()" class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    Cancelar
                </button>
            </div>
        </div>
    </div>

    <!-- LÓGICA JAVASCRIPT UNIFICADA -->
    <script>
        // Variáveis globais para os elementos da UI do SCANNER
        const videoElement = document.getElementById('scanner-webcam-stream');
        const statusMessageDiv = document.getElementById('scanner-status-message-overlay');
        const startButton = document.getElementById('scanner-start-button');

        let cameraStream = null;

        /**
         * LÓGICA DE LOGIN
         */
        function handleLogin() {
            const emailInput = document.getElementById('email').value.trim();
            const passwordInput = document.getElementById('password').value.trim();
            const statusMessage = document.getElementById('login-status-message');
            const loginButton = document.getElementById('login-button');

            statusMessage.textContent = ''; 
            statusMessage.className = 'text-center text-sm font-medium h-5';
            
            loginButton.disabled = true;
            loginButton.textContent = 'Acessando...';
            loginButton.classList.add('opacity-70');

            // Simulação de delay
            setTimeout(() => {
                loginButton.disabled = false;
                loginButton.textContent = 'Entrar';
                loginButton.classList.remove('opacity-70');

                // Autenticação Simulada. Use 'teste' e '123'
                if (emailInput === 'teste' && passwordInput === '123') {
                    statusMessage.textContent = 'Login bem-sucedido! Carregando scanner...';
                    statusMessage.classList.add('text-green-600');
                    
                    // CORREÇÃO FINAL: Substituído window.location.href por manipulação do DOM.
                    setTimeout(() => {
                        document.getElementById('login-container').classList.add('hidden');
                        document.getElementById('scanner-container').classList.remove('hidden');
                        startCamera(); // Inicia a câmera na nova tela
                    }, 500); 
                    
                } else {
                    statusMessage.textContent = 'Credenciais inválidas. Verifique seu usuário/email e senha.';
                    statusMessage.classList.add('text-red-600');
                }
            }, 1500);
        }

        // Adicionar suporte para pressionar Enter no login
        document.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                // Verifica se o modal de recuperação de senha está aberto
                if (!document.getElementById('forgot-password-modal').classList.contains('hidden')) {
                    simulateRecovery();
                } else if (!document.getElementById('login-container').classList.contains('hidden')) {
                    // Aciona o login se estiver na tela de login
                    handleLogin();
                }
            }
        });
        
        /**
         * LÓGICA DA CÂMERA (UNIFICADA DO ARQUIVO camera_scanner_8000.html)
         */

        /**
         * Atualiza a mensagem de status na tela da câmera.
         */
        function setStatus(message, isError = false) {
            statusMessageDiv.innerHTML = `<p class="text-xl font-semibold ${isError ? 'text-red-400' : 'text-white'}">${message}</p>`;
            statusMessageDiv.classList.add('opacity-100');
            statusMessageDiv.classList.remove('opacity-0');
        }

        /**
         * Esconde a mensagem de status da câmera.
         */
        function hideStatus() {
            statusMessageDiv.classList.add('opacity-0');
            statusMessageDiv.classList.remove('opacity-100');
        }

        /**
         * Tenta iniciar a câmera com restrições mínimas (qualquer câmera).
         */
        async function startCameraFallback() {
            setStatus("Tentando iniciar qualquer câmera disponível...");
            const simpleConstraints = { video: true, audio: false };
            const stream = await navigator.mediaDevices.getUserMedia(simpleConstraints);
            
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
            }
            cameraStream = stream;

            videoElement.srcObject = cameraStream;
            videoElement.onloadedmetadata = () => {
                videoElement.play();
                hideStatus();
            };
            console.log("Fallback de câmera bem-sucedido.");
        }

        /**
         * Inicia o acesso à câmera do celular.
         */
        async function startCamera() {
            startButton.disabled = true;
            setStatus("Solicitando acesso à câmera...");
            
            const constraints = { 
                video: {
                    facingMode: "environment" // Preferir a câmera traseira/ambiente
                }, 
                audio: false 
            };

            try {
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                
                if (cameraStream) {
                    cameraStream.getTracks().forEach(track => track.stop());
                }
                cameraStream = stream;

                videoElement.srcObject = cameraStream;
                
                videoElement.onloadedmetadata = () => {
                    videoElement.play();
                    hideStatus();
                };

                console.log("Câmera do celular iniciada com sucesso (preferência para traseira).");
                
            } catch (error) {
                let errorMessage = `Erro ao abrir câmera: ${error.name}`;
                console.error(`Erro ao abrir câmera: ${error.message}`, error);
                
                switch (error.name) {
                    case 'NotAllowedError':
                        errorMessage = "Permissão negada. Verifique as permissões do seu navegador para esta página.";
                        break;
                    case 'NotFoundError':
                        errorMessage = "Nenhuma câmera detectada no seu dispositivo.";
                        break;
                    case 'NotReadableError':
                        errorMessage = "A câmera está em uso por outro aplicativo.";
                        break;
                    case 'OverconstrainedError':
                        errorMessage = "Restrições incompatíveis. Tentando fallback simples...";
                        // Tenta fallback simples (qualquer câmera disponível)
                        try {
                             await startCameraFallback();
                             return; 
                        } catch (fallbackError) {
                            errorMessage = `Erro de Configuração. A câmera não pôde ser iniciada: ${error.message}`;
                        }
                        break;
                    case 'SecurityError':
                        errorMessage = "Acesso bloqueado. Este site deve ser acessado via HTTPS para usar a câmera.";
                        break;
                    default:
                        errorMessage = `Erro desconhecido: ${error.message}.`;
                }
                
                setStatus(`Falha! ${errorMessage}`, true);
            } finally {
                startButton.disabled = false;
            }
        }

        /**
         * Simula o logout e volta para a tela de login.
         */
        function logout() {
            // Para a stream da câmera, se estiver ativa
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
                cameraStream = null;
                videoElement.srcObject = null;
            }

            // Esconde scanner e mostra login
            document.getElementById('scanner-container').classList.add('hidden');
            document.getElementById('login-container').classList.remove('hidden');

            // Limpa campos de login
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
            document.getElementById('login-status-message').textContent = '';
        }


        // Funções do Modal de Recuperação de Senha (permanecem inalteradas)

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
                recoveryStatus.textContent = `Código enviado para ${recoveryInput}! Verifique seu Email ou WhatsApp.`;
                recoveryStatus.classList.remove('text-gray-500');
                recoveryStatus.classList.add('text-green-600');
                document.getElementById('recovery-input').value = '';
            }, 2000);
        }
    </script>
</body>
</html>


