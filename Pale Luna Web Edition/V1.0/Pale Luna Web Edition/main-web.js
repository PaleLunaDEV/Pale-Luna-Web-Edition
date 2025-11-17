// --- Elementos do DOM ---
const statusBar = document.getElementById('status-bar');
const textBox = document.getElementById('text-box');
const choiceBox = document.getElementById('choice-box');

// --- Variáveis de Estado do Jogo ---
let nomeJogador = "Michael Nevins";
let Vida = 100;
let valorsanidade = 100;
let papega = false;
let temChave = false;
let chavedois = false;
let mapaachado = false;
let kitm = false;
let fotopega = false;
let leufoto = false;
let destruir = false;
let jafoinorte = false; 
let casafora = false;

// Estado dos caminhos visitados
let N = false, L = false, O = false, S = false;

// --- Controles de Finais ---
let BAD_ENDING = false;
let BAD_ENDING_2 = false;
let BAD_ENDING_3 = false;
let GOOD_ENDING = false;
let REAL_ENDING = false;
let SECRET_ENDING = false;

// --- ARTE ASCII (Adaptadas do mainBR.js) ---
const ASCII_GAMEOVER = [
    "",
    " ███████████████    ████████████    █████████████████████     █████████████",
    "██████             ██████  ██████   ██████  ██████  ██████   ██████",
    "██████             ██████  ██████   ██████  ██████  ██████   ██████",
    "██████  ████████   ██████████████   ██████  ██████  ██████   ██████████",
    "██████    ██████   ██████  ██████   ██████  ██████  ██████   ██████",
    "██████    ██████   ██████  ██████   ██████  ██████  ██████   ██████",
    " ███████████████   ██████  ██████   ██████  ██████  ██████    █████████████",
    "",
    "   ██████████████    ██████  ██████    █████████████   ██████████████",
    "  ████████████████   ██████  ██████   ██████           ██████   ██████",
    "  ██████    ██████   ██████  ██████   ██████           ██████   ██████",
    "  ██████    ██████   ██████  ██████   ██████████       █████████████",
    "  ██████    ██████   ██████  ██████   ██████           ███████████████",
    "  ████████████████   ██████  ██████   ██████           ██████   ██████",
    "   ██████████████    █████████████     █████████████   ██████   ██████",
    ""
];

const ASCII_SALA_ITENS = [
    "███████████████████████████████████████████████████████████████████",
    "██                                                               ██",
    "██    █      █                                                   ██",
    "██   ███     █                                                   ██",
    "██  (Pote)  ███                                                  ██",
    "██          (Pá)                                                 ██",
    "██                                                            █████",
    "██                               ██                           █  ██",
    "██                             ██████                         █  ██",
    "██                            █  ██  █                      ███  ██",
    "██                               ██                         █ █  ██",
    "██                             ██  ██                         █  ██",
    "██                            ██    ██                        █  ██",                                            
    "███████████████████████████████████████████████████████████████████"
];

const ASCII_FLORESTA_1 = [
    "██████████████████████████████████████████████████████         ████",
    "                   ██                                              ",
    "                 ██                                       /\\      ",
    "               ██                                        OESTE     ",
    "         ██  ██                                                    ",
    "       ██  ██                                                      ",
    "     ██                                                            ",
    "██   ██                            ██                 NORTE >      ",
    "██   ██                          ██████                            ",
    "██   ██                         █  ██  █                           ",
    "██   ██                            ██                              ",
    "██   ██                          ██  ██                 LESTE      ",
    "██   ██                         ██    ██                 \\/       ",                                            
    "██████████████████████████████████████████████████████         ████"
];

// --- Funções de Ajuda da Interface Web ---

function renderAscii(asciiArray) {
    return `<div class="ascii-art">${asciiArray.join('\n')}</div>`;
}

function replaceTags(text) {
    // CORREÇÃO DE SINTAXE: Escapando as chaves {} nas expressões regulares.
    return text
        .replace(/\{center\}/g, '<span class="center-text">') 
        .replace(/\{\/center\}/g, '</span>')                 
        .replace(/\{yellow-fg\}/g, '<span class="yellow-text">') 
        .replace(/\{green-fg\}/g, '<span class="green-text">')   
        .replace(/\{cyan-fg\}/g, '<span class="cyan-text">')     
        .replace(/\{red-fg\}/g, '<span class="red-text">')       
        .replace(/\{\/\}/g, '</span>');                      
}

function updateStatus() {
    let status = `[Vida: <span class="green-text">${Vida}%</span>] | [Sanidade: <span class="cyan-text">${valorsanidade}%</span>] | [Itens: <span class="yellow-text">`;
    let itens = [];
    if (papega) itens.push('Pá');
    if (temChave) itens.push('Chave(Pote)');
    if (chavedois) itens.push('Chave(Lápide)');
    if (mapaachado) itens.push('Mapa');
    if (kitm) itens.push('Kit Médico');
    if (fotopega) itens.push('Foto');

    status += itens.join(', ') || 'Nenhum';
    status += '</span> ]';
    statusBar.innerHTML = status;
}

function showAlert(message) {
    // Remove tags HTML do output de alert()
    let formattedMessage = replaceTags(message);
    
    // Remove todas as tags HTML e formatação, deixando apenas texto puro
    formattedMessage = formattedMessage.replace(/<[^>]*>/g, '');
    
    alert(formattedMessage);
}

function displayScene(text, choices, choiceHandler) {
    textBox.innerHTML = replaceTags(text).replace(/\n/g, '<br>');
    choiceBox.innerHTML = ''; 

    choices.forEach((c, index) => {
        const button = document.createElement('button');
        const actionValue = c.action !== undefined ? c.action : index + 1;

        button.innerHTML = replaceTags(`[${index + 1}] ${c.text}`);
        button.onclick = () => {
            choiceBox.innerHTML = ''; 
            choiceHandler(actionValue);
        };
        choiceBox.appendChild(button);
    });
    textBox.scrollTop = textBox.scrollHeight;
}

// --- Funções de Estado e Efeitos ---

function checkGameOver() {
    if (Vida < 20) return 'MORTE';
    if (valorsanidade <= 10) return 'LOUCURA';
    return null;
}

function alterarVida(valor, showPopup = true) { 
    const oldVida = Vida;
    Vida = Math.min(100, Math.max(0, Vida + valor));
    
    if (checkGameOver() === 'MORTE') {
        endGame('Você perdeu muita vida!');
        return true; 
    } 
    
    if (showPopup && Vida !== oldVida) {
        let tipo = valor < 0 ? 'CAIU GRAVEMENTE' : 'SUBIU';
        showAlert(`[AVISO] SUA VIDA ${tipo}!\nVocê agora tem ${Vida}% de vida.`);
        updateStatus();
    }
    updateStatus(); 
    return checkGameOver() !== null;
}

function alterarSanidade(valor, showPopup = true) { 
    const oldSanidade = valorsanidade;
    valorsanidade = Math.min(100, Math.max(0, valorsanidade + valor));

    if (checkGameOver() === 'LOUCURA') {
        endGame('Você chegou em um nível muito baixo de sanidade durante o jogo!\nVocê enlouqueceu e se perdeu na floresta para sempre!');
        return true; 
    } else if (showPopup && valorsanidade !== oldSanidade) {
        let tipo = valor < 0 ? 'CAIU' : 'SUBIU';
        showAlert(`[AVISO] SUA SANIDADE ${tipo}!\nVocê agora tem ${valorsanidade}% de sanidade.`);
        updateStatus(); 
    }
    updateStatus(); 
    return checkGameOver() !== null;
}

function inventarioScene(currentSceneName) {
    let itensNoInventario = 0;
    
    // REMOVIDO: Linhas de separação e tags {center} para o alerta
    let inventarioText = "-------------------------------------------------\n";
    inventarioText += "Você tem no seu inventário:\n";
    inventarioText += "-------------------------------------------------\n";

    if (papega) { inventarioText += "- Pá\n"; itensNoInventario++; }
    if (temChave) { inventarioText += "- Chaves (Pote)\n"; itensNoInventario++; }
    if (chavedois) { inventarioText += "- Chave (Lápide)\n"; itensNoInventario++; }
    if (mapaachado) { inventarioText += "- Mapa\n"; itensNoInventario++; }
    if (kitm) { inventarioText += "- Kit Médico\n"; itensNoInventario++; }
    if (fotopega) { inventarioText += "- Foto\n"; itensNoInventario++; }

    if (itensNoInventario === 0) {
        inventarioText += "Você ainda não pegou nenhum item!\n";
    }
    inventarioText += "-------------------------------------------------";

    showAlert(inventarioText);
    transitionTo(currentSceneName, 0);
}

// --- Lógica de Cenas e Transição ---
let currentScene = 'intro';

function transitionTo(sceneName, optionSelected = 0) {
    currentScene = sceneName;
    updateStatus();

    if (checkGameOver()) {
        const type = checkGameOver();
        endGame(type === 'MORTE' ? 'Você perdeu muita vida!' : 'Você enlouqueceu e se perdeu na floresta para sempre!');
        return;
    }
    
    switch (sceneName) {
        case 'intro': sceneIntro(); break;
        case 'salaInicial': sceneSalaInicial(optionSelected); break;
        case 'floresta1': sceneFloresta1(optionSelected); break;
        case 'floresta2': sceneFloresta2(optionSelected); break;
        case 'floresta3': sceneFloresta3(optionSelected); break;
        case 'floresta4': sceneFloresta4(optionSelected); break;
        default: break; 
    }
}

function sceneIntro() {
    // REMOVIDO: Linhas de separação
    let text = `{center}[CONTEXTO]\n\n`;
    text += `Você é {yellow-fg}${nomeJogador}{/}, um engenheiro elétrico que foi chamado para consertar\n`;
    text += `postes, porém nem tudo ocorreu como planejado e\n`;
    text += `você foi sequestrado por alguém!\n\n`;
    text += `Seu objetivo é tentar fugir!{/center}`;

    textBox.innerHTML = replaceTags(text).replace(/\n/g, '<br>');
    choiceBox.innerHTML = ''; 

    const startButton = document.createElement('button');
    startButton.innerHTML = replaceTags('[1] INICIAR O JOGO');
    startButton.onclick = () => {
        transitionTo('salaInicial');
    };
    choiceBox.appendChild(startButton);
}

function sceneSalaInicial(choice) {
    let asciiArt = renderAscii(ASCII_SALA_ITENS);
    
    const narrativeText = "\n\n{center}Você está em uma sala escura. A luz da lua raia pela janela.\n" +
                          "Há um POTE de OURO no canto da sala, junto com uma PÁ. E do outro lado existe uma PORTA.{/center}";
    
    let currentText = asciiArt + narrativeText;

    const choices = [
        { text: `Examinar PÁ ${papega ? '(PEGO)' : ''}`, action: 1 },
        { text: `Examinar POTE de OURO ${temChave ? '(PEGO)' : ''}`, action: 2 },
        { text: `Tentar abrir PORTA`, action: 3 },
        { text: `INVENTÁRIO`, action: 4 },
        { text: `VER STATUS`, action: 5 }
    ];

    if (choice === 1) {
        if (papega) {
            showAlert('Você já pegou a pá!');
        } else {
            papega = true;
            showAlert('Você pegou a pá, talvez seja útil no futuro.');
        }
        transitionTo('salaInicial'); return;
    } else if (choice === 2) {
        if (temChave) {
            showAlert('Você já pegou o pote de ouro e a chave!');
        } else {
            temChave = true;
            showAlert('Você pegou o pote de ouro, dentro dele você achou uma chave.');
        }
        transitionTo('salaInicial'); return;
    } else if (choice === 3) {
        if (temChave) {
            temChave = false;
            showAlert('Você consegue abrir a porta com a chave encontrada!\n[AVISO] Você usou a chave!');
            transitionTo('floresta1');
        } else {
            showAlert('Você tenta abrir a porta, porém ela está trancada...');
            transitionTo('salaInicial');
        }
        return;
    } else if (choice === 4) {
        inventarioScene('salaInicial');
        return;
    } else if (choice === 5) {
        showAlert(`VIDA: {green-fg}${Vida}%{/}\nSANIDADE: {cyan-fg}${valorsanidade}%{/}`);
        transitionTo('salaInicial');
        return;
    }
    
    displayScene(currentText, choices, (c) => transitionTo('salaInicial', c));
}

function sceneFloresta1(choice) {
    let asciiArt = renderAscii(ASCII_FLORESTA_1);
    
    // REMOVIDO: Linhas de separação
    let narrativeText = "\n\n{center}Pegue sua recompensa. A lua pálida sorri para você.\n";
    narrativeText += "Você está em uma floresta, Existem caminhos para o NORTE, OESTE e LESTE:{/center}";
    
    let currentText = asciiArt + narrativeText;

    const choices = [
        { text: `Ir para NORTE ${jafoinorte ? '(Já tentou)' : ''}`, action: 1 },
        { text: `Ir para OESTE ${O ? '(Já tentou)' : ''}`, action: 2 },
        { text: `Ir para LESTE`, action: 3 },
        { text: `INVENTÁRIO`, action: 4 },
        { text: `VER STATUS`, action: 5 }
    ];

    if (choice === 1) { // NORTE
        if (jafoinorte) {
            showAlert('Você já foi pelo Norte!');
            transitionTo('floresta1'); return;
        }

        jafoinorte = true; 
        
        const choicesAtalho = [
            { text: 'Ir pelo atalho ({yellow-fg}BAD ENDING{/})', action: 1 },
            { text: 'Ignorar o atalho', action: 2 }
        ];
        
        displayScene("{center}Você se sente mais confiante em ir pelo norte...\nVocê encontra um atalho secreto!{/center}", choicesAtalho, (c) => {
            if (c === 1) {
                BAD_ENDING = true;
                endGame('Você avança rapidamente pela floresta, mas ainda restam segredos esperando para serem descobertos...');
            } else if (c === 2) {
                showAlert('Você acha perigoso e ignora o atalho');
                transitionTo('floresta1');
            } else {
                showAlert('Opção Inválida! Voltando ao caminho.');
                transitionTo('floresta1');
            }
        });
        return;
        
    } else if (choice === 2) { // OESTE (COMBINADO)
        O = true;
        const choicesOeste = [
            { text: 'Fugir', action: 1 },
            { text: 'Se esconder', action: 2 }
        ];
        displayScene("{center}Você vai pelo caminho Oeste...\nUm homem alto, com um machado e não muito amigável se aproxima.{/center}", choicesOeste, (c) => {
            let resultado = '';
            if (c === 1 || c === 2) {
                alterarSanidade(-10, false); 
                alterarVida(-50, false);

                if (checkGameOver()) return;

                if (c === 1) {
                    resultado = 'Você começa a correr, tropeça em uma raiz e leva uma machadada do homem.';
                } else {
                    resultado = 'Você decide se esconder, mas ele te vê e te dá uma machadada!';
                }

                showAlert(`${resultado}\n\nDano Recebido:\n- Vida atual: ${Vida}%\n- Sanidade atual: ${valorsanidade}%`);
                transitionTo('floresta1');
            } else {
                showAlert('Opção Inválida!');
                transitionTo('floresta1');
            }
        });
        return;

    } else if (choice === 3) { // LESTE
        L = true;
        showAlert('Depois de pensar, você decide ir pelo Leste...\nVocê começa a adentrar a floresta densa...');
        transitionTo('floresta2');
        return;
    } else if (choice === 4) {
        inventarioScene('floresta1');
        return;
    } else if (choice === 5) {
        showAlert(`VIDA: {green-fg}${Vida}%{/}\nSANIDADE: {cyan-fg}${valorsanidade}%{/}`);
        transitionTo('floresta1');
        return;
    }
    
    displayScene(currentText, choices, (c) => transitionTo('floresta1', c));
}

function sceneFloresta2(choice) {
    let asciiArt = renderAscii(ASCII_FLORESTA_1);
    
    // REMOVIDO: Linhas de separação
    let narrativeText = "\n\n{center}Pegue sua recompensa. A lua pálida sorri para você.\n";
    narrativeText += "Você está em uma floresta, Existem caminhos para o NORTE, SUL e LESTE:{/center}";
    
    let currentText = asciiArt + narrativeText;

    const choices = [
        { text: `Ir para NORTE ${N ? '(Já foi)' : ''}`, action: 1 },
        { text: `Ir para SUL ${S ? '(Já foi)' : ''}`, action: 2 },
        { text: `Ir para LESTE`, action: 3 },
        { text: `INVENTÁRIO`, action: 4 },
        { text: `VER STATUS`, action: 5 }
    ];

    if (choice === 1) { // NORTE (Cabana)
        N = true;
        
        const choicesCabana = [
            { text: 'Entrar na cabana', action: 1 },
            { text: 'Ignorar a cabana', action: 2 }
        ];
        
        displayScene("{center}Você decide ir pelo Norte...\nVocê encontra uma cabana velha feita de madeira{/center}", choicesCabana, (c) => {
            if (c === 1) { // Entrar na cabana
                const choicesBau = [
                    { text: 'Pegar o mapa', action: 1 },
                    { text: 'Voltar para a bifurcação', action: 2 },
                    { text: `Pegar Kit Médico ${kitm ? '(PEGO)' : ''} (Cura 50% da vida)`, action: 3 }
                ];
                
                displayScene("{center}Você entra na cabana e encontra um baú velho. Dentro dele, um pergaminho com um mapa.{/center}", choicesBau, (c2) => {
                    if (c2 === 1) { // Pegar o mapa
                        mapaachado = true;
                        showAlert('Você pega o mapa!'); 
                        transitionTo('floresta2');
                    } else if (c2 === 2) { // Voltar
                        transitionTo('floresta2');
                    } else if (c2 === 3) { // Kit Médico
                        if (kitm) {
                            showAlert('Você já pegou o kit médico!');
                            transitionTo('floresta2');
                        } else {
                            kitm = true;
                            alterarVida(50, false); 
                            showAlert(`[KIT MÉDICO USADO]\n\nSua vida foi restaurada em 50 pontos. Vida atual: ${Vida}%`);
                            transitionTo('floresta2');
                        }
                    } else {
                        showAlert('Opção Inválida!');
                        transitionTo('floresta2');
                    }
                });
            } else if (c === 2) { // Ignorar a cabana
                const choicesPonte = [
                    { text: 'Pular a ponte', action: 1 },
                    { text: 'Voltar para a bifurcação', action: 2 }
                ];
                displayScene("{center}Você ignora a cabana e continua...\nEncontra uma ponte quebrada.{/center}", choicesPonte, (c2) => {
                    if (c2 === 1) {
                        endGame('Você tenta pular a ponte, porém você cai e morre');
                    } else if (c2 === 2) {
                        transitionTo('floresta2');
                    } else {
                        showAlert('Opção Inválida!');
                        transitionTo('floresta2');
                    }
                });
            } else {
                showAlert('Opção Inválida!');
                transitionTo('floresta2');
            }
        });
        return;
    } else if (choice === 2) { // SUL (Barco/Pergaminho)
        S = true;
        const choicesSul = [
            { text: 'Pegar o barco', action: 1 },
            { text: 'Ignorar o barco', action: 2 },
            { text: 'Voltar para a bifurcação', action: 3 }
        ];
        
        displayScene("{center}Você vai pelo Sul.\nVocê encontra um lago, e um barco a sua frente.{/center}", choicesSul, (c) => {
            if (c === 1) { // Pegar o barco
                const choicesCaverna = [
                    { text: 'Ignorar caverna', action: 1 },
                    { text: 'Entrar dentro da caverna', action: 2 }
                ];

                displayScene("{center}O barco afunda. Você vê uma caverna submersa!{/center}", choicesCaverna, (c2) => {
                    if (c2 === 1) {
                        showAlert('Você ignora a caverna e decide voltar nadando.');
                        transitionTo('floresta2');
                    } else if (c2 === 2) { // Caverna / Pergaminho
                        const choicesPergaminho = [
                            { text: 'Ler (Perde Sanidade)', action: 1 },
                            { text: 'Não Ler', action: 2 },
                            { text: 'DESTRUIR! (Altera Final Secreto)', action: 3 }
                        ];

                        displayScene("{center}Você encontra um cemitério submerso com um pergaminho aberto...{/center}", choicesPergaminho, (c3) => {
                            if (c3 === 1) { // Ler
                                let sanidadePerdida = false;
                                if (!destruir) {
                                    sanidadePerdida = alterarSanidade(-10, false); 
                                }
                                
                                if (checkGameOver()) return; 

                                showAlert('O diário é assustador. Você teme pelo autor.' + 
                                    (sanidadePerdida ? `\n\n[AVISO] Sua sanidade caiu para ${valorsanidade}%` : ''));

                                const choicesVoltar = [
                                    { text: 'Tentar voltar nadando (50% de chance de afogar)', action: 1 },
                                    { text: 'Ficar na caverna e procurar (Encontra Chave)', action: 2 }
                                ];
                                displayScene("{center}O que fazer agora?{/center}", choicesVoltar, (c4) => {
                                    if (c4 === 1) {
                                        if (Math.random() < 0.5) {
                                            showAlert('Você consegue voltar!');
                                            transitionTo('floresta2');
                                        } else {
                                            if(alterarVida(-100)) return;
                                        }
                                    } else if (c4 === 2) {
                                        chavedois = true;
                                        showAlert('Você encontra uma chave na lápide e volta à superfície.');
                                        transitionTo('floresta2');
                                    } else {
                                        showAlert('Opção Inválida!');
                                        transitionTo('floresta2');
                                    }
                                });
                            } else if (c3 === 2) { // Não Ler
                                showAlert('Você decide não ler e tenta voltar nadando.');
                                transitionTo('floresta2');
                            } else if (c3 === 3) { // DESTRUIR!
                                destruir = true;
                                showAlert('VOCÊ DESTRUIU O PERGUMINHO! ISSO AFETARÁ O FINAL SECRETO...');
                                transitionTo('floresta2');
                            } else {
                                showAlert('Opção Inválida!');
                                transitionTo('floresta2');
                            }
                        });
                    } else {
                        showAlert('Opção Inválida!');
                        transitionTo('floresta2');
                    }
                });

            } else if (c === 2) { // Ignorar o barco (Lobo)
                const choicesLobo = [
                    { text: 'Correr', action: 1 },
                    { text: 'Se esconder', action: 2 }
                ];

                displayScene("{center}Você ignora o barco e encontra um lobo.{/center}", choicesLobo, (c2) => {
                    let resultado = '';
                    let dano = 0;
                    if (c2 === 1) {
                        dano = -20;
                        alterarVida(dano, false);
                        resultado = 'Você corre, mas o lobo te morde. Ferido em nível médio!';
                    } else if (c2 === 2) {
                        dano = -70;
                        alterarVida(dano, false);
                        resultado = 'Você se esconde na caverna do lobo e é gravemente ferido!';
                    } else {
                        showAlert('Opção Inválida!');
                        transitionTo('floresta2');
                        return;
                    }

                    if (checkGameOver()) return;

                    showAlert(`${resultado}\n\nDano Recebido:\n- Vida atual: ${Vida}%`);
                    transitionTo('floresta2');
                });
            } else if (c === 3) { // Voltar
                transitionTo('floresta2');
            } else {
                showAlert('Opção Inválida!');
                transitionTo('floresta2');
            }
        });
        return;

    } else if (choice === 3) { // LESTE (Avançar)
        L = true;
        showAlert('Você atravessa as folhas e galhos, e encontra uma outra bifurcação');
        transitionTo('floresta3');
        return;
    } else if (choice === 4) {
        inventarioScene('floresta2');
        return;
    } else if (choice === 5) {
        showAlert(`VIDA: {green-fg}${Vida}%{/}\nSANIDADE: {cyan-fg}${valorsanidade}%{/}`);
        transitionTo('floresta2');
        return;
    }

    displayScene(currentText, choices, (c) => transitionTo('floresta2', c));
}

function sceneFloresta3(choice) {
    let asciiArt = renderAscii(ASCII_FLORESTA_1);
    
    // REMOVIDO: Linhas de separação
    let narrativeText = "\n\n{center}Pegue sua recompensa. A lua pálida sorri para você.\n";
    narrativeText += "Você está em uma floresta, Existem caminhos para o NORTE, SUL e OESTE:{/center}";
    
    let currentText = asciiArt + narrativeText;

    const choices = [
        { text: `Ir para NORTE`, action: 1 },
        { text: `Ir para SUL`, action: 2 },
        { text: `Ir para OESTE`, action: 3 },
        { text: `INVENTÁRIO`, action: 4 },
        { text: `VER STATUS`, action: 5 }
    ];

    if (choice === 1) { // NORTE (Escavar/Foto)
        N = true;
        const choicesObjeto = [
            { text: 'Escavar o chão', action: 1 },
            { text: 'Ignorar o objeto', action: 2 }
        ];

        displayScene("{center}Você encontra algo brilhante no chão.{/center}", choicesObjeto, (c) => {
            if (c === 1) { // Escavar
                if (papega) {
                    const choicesFoto = [
                        { text: 'Ler o que está escrito (Perde Sanidade)', action: 1 },
                        { text: 'Ignorar a foto', action: 2 }
                    ];

                    displayScene("{center}Você escava e encontra uma foto de uma criança. Há algo escrito atrás.{/center}", choicesFoto, (c2) => {
                        fotopega = true;
                        if (c2 === 1) {
                            leufoto = true;
                            alterarSanidade(-10, false); 
                            
                            if (checkGameOver()) return;

                            showAlert(`A foto diz: 'VOCÊ NÃO DEVERIA TER VINDO AQUI'.\nSua sanidade caiu para ${valorsanidade}%.\nVocê chega em uma bifurcação.`);
                            transitionTo('floresta4');
                        } else if (c2 === 2) {
                            leufoto = false;
                            showAlert('Você ignora a foto e continua.\nVocê chega em uma bifurcação.');
                            transitionTo('floresta4');
                        } else {
                            showAlert('Opção Inválida!');
                            transitionTo('floresta3');
                        }
                    });
                } else {
                    showAlert('Você não pode escavar, porque você não tem uma pá!');
                    transitionTo('floresta3');
                }
            } else if (c === 2) { // Ignorar
                showAlert('Você ignora o objeto e continua.\nVocê chega em uma bifurcação.');
                transitionTo('floresta4');
            } else {
                showAlert('Opção Inválida!');
                transitionTo('floresta3');
            }
        });
        return;
    } else if (choice === 2) { // SUL (Morte)
        S = true;
        const choicesLobo = [
            { text: 'Correr', action: 1 },
            { text: 'Se esconder', action: 2 }
        ];
        
        displayScene("{center}Você vai pelo caminho do Sul...\nVocê encontra um lobo{/center}", choicesLobo, (c) => {
            if (c === 1 || c === 2) {
                endGame('Você corre, mas o lobo é mais rápido e te mata!');
            } else {
                showAlert('Opção Inválida!');
                transitionTo('floresta3');
            }
        });
        return;
    } else if (choice === 3) { // OESTE (Morte)
        O = true;
        endGame('Você decide ir pelo Oeste, cai dentro do rio e morre afogado!');
        return;
    } else if (choice === 4) {
        inventarioScene('floresta3');
        return;
    } else if (choice === 5) {
        showAlert(`VIDA: {green-fg}${Vida}%{/}\nSANIDADE: {cyan-fg}${valorsanidade}%{/}`);
        transitionTo('floresta3');
        return;
    }

    displayScene(currentText, choices, (c) => transitionTo('floresta3', c));
}

function sceneFloresta4(choice) {
    // REMOVIDO: Linhas de separação
    let text = "{center}A lua pálida sorri para você\n";
    text += "A sua frente existem caminhos, ao NORTE e SUL{/center}";
    
    let currentText = text;

    const choices = [
        { text: `Ir para NORTE (Estrada)`, action: 1 },
        { text: `Ir para SUL (Casa)`, action: 2 },
        { text: `INVENTÁRIO`, action: 3 },
        { text: `VER STATUS`, action: 4 }
    ];

    if (choice === 1) { // NORTE (Carro - ENDINGS RUINS/BONS)
        N = true;
        const choicesCarro = [
            { text: 'Tentar ligar o carro', action: 1 },
            { text: 'Ignorar o carro', action: 2 },
            { text: 'Sair andando pela estrada (MORTE)', action: 3 }
        ];

        displayScene("{center}Você encontra um carro encostado na beira de uma estrada.{/center}", choicesCarro, (c) => {
            if (c === 1) { // Ligar o carro
                const choicesCarroFinal = [
                    { text: 'Ir embora (Final)', action: 1 },
                    { text: 'Voltar para o caminho', action: 2 }
                ];
                
                displayScene("{center}Você consegue ligar o carro. Ir embora?{/center}", choicesCarroFinal, (c2) => {
                    if (c2 === 1) { // Ir embora
                        if (fotopega && leufoto) {
                            GOOD_ENDING = true;
                            endGame('Você chama a polícia (GOOD ENDING)');
                        } else if (fotopega && !leufoto) {
                            BAD_ENDING_2 = true;
                            endGame('Você ignora a foto (BAD ENDING 2)');
                        } else {
                            BAD_ENDING_3 = true;
                            endGame('Você vai embora sem pensar (BAD ENDING 3)');
                        }
                    } else if (c2 === 2) {
                        showAlert('Você resolve voltar.');
                        transitionTo('floresta4');
                    } else {
                        showAlert('Opção Inválida!');
                        transitionTo('floresta4');
                    }
                });
            } else if (c === 2) { // Ignorar o carro
                showAlert('Você ignora o carro e precisa voltar para a bifurcação.');
                transitionTo('floresta4');
            } else if (c === 3) { // Andar (Morte)
                endGame('Você é atropelado por um carro sem farol. Você Morreu!');
            } else {
                showAlert('Opção Inválida!');
                transitionTo('floresta4');
            }
        });
        return;
    } else if (choice === 2) { // SUL (Casa - REAL/SECRET ENDING)
        S = true;
        const choicesCasa = [
            { text: 'Entrar na casa', action: 1 },
            { text: 'Ignorar a casa e seguir o caminho', action: 2 }
        ]

        displayScene("{center}Você encontra uma casa que parece normal.{/center}", choicesCasa, (c) => {
            if (c === 1) { // Entrar na casa
                const choicesMapa = [
                    { text: 'Seguir mapa', action: 1 },
                    { text: 'Não seguir o mapa (MORTE)', action: 2 }
                ];

                displayScene("{center}Você encontra um bilhete com um mapa rudimentar desenhado com setas.{/center}", choicesMapa, (c2) => {
                    if (c2 === 1) { // Seguir mapa
                        const choicesCavar = [
                            { text: 'Escavar em busca de algo', action: 1 },
                            { text: 'Não escavar (MORTE)', action: 2 }
                        ];

                        displayScene("{center}Você segue o mapa. No 'X' marcado, o chão soa oco. O que fazer?{/center}", choicesCavar, (c3) => {
                            if (c3 === 1) { // Escavar
                                if (destruir) {
                                    SECRET_ENDING = true;
                                    endGame("O corpo da criança levanta: 'VOCÊ DESTRUIU MEU PERGUMINHO...' (FINAL SECRETO)");
                                } else {
                                    REAL_ENDING = true;
                                    endGame("Você encontra o corpo de uma criança e a coordenada '—— 40.24248 —— -121.4434 ——' (FINAL REAL)");
                                }
                            } else if (c3 === 2) { // Não escavar (Morte)
                                endGame('Você decide não cavar. Uma figura o ataca e o mata.');
                            } else {
                                showAlert('Opção Inválida!');
                                transitionTo('floresta4');
                            }
                        });
                    } else if (c2 === 2) { // Não seguir o mapa (Morte)
                        endGame('Você ignora o mapa. O dono volta e o mata.');
                    } else {
                        showAlert('Opção Inválida!');
                        transitionTo('floresta4');
                    }
                });
            } else if (c === 2) { // Ignorar a casa
                if (!casafora) {
                    casafora = true;
                    showAlert('Você ignora a casa. O caminho o leva em círculos. Você precisa voltar.');
                    transitionTo('floresta4');
                } else {
                    showAlert('Você já tentou fazer isso, o caminho está te levando em círculos.');
                    transitionTo('floresta4');
                }
            } else {
                showAlert('Opção Inválida!');
                transitionTo('floresta4');
            }
        });
        return;
    } else if (choice === 3) {
        inventarioScene('floresta4');
        return;
    } else if (choice === 4) {
        showAlert(`VIDA: {green-fg}${Vida}%{/}\nSANIDADE: {cyan-fg}${valorsanidade}%{/}`);
        transitionTo('floresta4');
        return;
    }

    displayScene(currentText, choices, (c) => transitionTo('floresta4', c));
}

function endGame(message) {
    let finalType = 'MORTE/LOUCURA';
    
    if (BAD_ENDING) finalType = 'BAD ENDING';
    else if (GOOD_ENDING) finalType = 'GOOD ENDING';
    else if (REAL_ENDING) finalType = 'REAL ENDING';
    else if (SECRET_ENDING) finalType = 'SECRET ENDING';
    else if (BAD_ENDING_2) finalType = 'BAD ENDING 2';
    else if (BAD_ENDING_3) finalType = 'BAD ENDING 3';

    console.log(`[CONQUISTA DESBLOQUEADA] Final: ${finalType}`);

    // REMOVIDO: Linhas de separação
    let content = renderAscii(ASCII_GAMEOVER);
    content += `<br><br>{center}FIM DE JOGO{/}<br><br>{red-fg}${message}{/}<br><br>FINAL CONCLUÍDO: [{yellow-fg}${finalType}{/}]{/center}`;
    
    textBox.innerHTML = replaceTags(content).replace(/\n/g, '<br>');
    choiceBox.innerHTML = '';
    
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Reiniciar Jogo (Recarregar a Página)';
    restartButton.onclick = () => window.location.reload();
    choiceBox.appendChild(restartButton);

    updateStatus();
}

// --- Início do Jogo ---
document.addEventListener('DOMContentLoaded', () => {
    updateStatus();
    sceneIntro();
});