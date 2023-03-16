const tela = document.querySelector('canvas')
const canvasCtx = tela.getContext('2d')
const larguraLinha = 15

const mouse = {
    x: 0,
    y: 0
}

//campo
const campo = {
    largura: window.innerWidth,
    altura: window.innerHeight,

    desenha: function () {
        canvasCtx.fillStyle = '#3f404e'
        canvasCtx.fillRect(0, 0, this.largura, this.altura)
    }
}

//linha central
const linha = {
    largura: larguraLinha,
    altura: campo.altura,

    desenha: function () {
        canvasCtx.fillStyle = '#808191'
        canvasCtx.fillRect(
            campo.largura / 2 - this.largura / 2,
            0,
            this.largura,
            this.altura
        )
    }
}

//bola
const bola = {
    x: 300,
    y: 100,
    raio: 20,
    velocidade: 5,
    direcaoY: 1,
    direcaoX: 1,

    //calcula a posição da bola
    calcPosicao: function () {
        //verifica se o jogador 1 fez ponto
        if (
            this.x >
            campo.largura - this.raio - raqueteDir.largura - larguraLinha
        ) {
            // verifica se y da requete direita é a mesma da bola
            if (
                this.y + this.raio > raqueteDir.y &&
                this.y - this.raio < raqueteDir.y + raqueteDir.altura
            ) {
                //rebate a bola
                this.reversoX()
            } else {
                placar.incrementaHumano()
                this.reset()
            }
        }

        //verifica se o jogador 2 fez ponto
        if (this.x < this.raio + raqueteEsq.largura + larguraLinha) {
            // verifica se y da requete esquerda é a mesma da bola
            if (
                this.y + this.raio > raqueteEsq.y &&
                this.y - this.raio < raqueteEsq.y + raqueteEsq.altura
            ) {
                //rebate a bola
                this.reversoX()
            } else {
                placar.incrementaComputador()
                this.reset()
            }
        }

        //verifica laterais superior e inferior do campo e faz rebater a bola
        if (
            (this.y - this.raio < 0 && this.direcaoY < 0) ||
            (this.y > campo.altura - this.raio && this.direcaoY > 0)
        ) {
            this.reversoY()
        }
    },

    reversoX: function () {
        this.direcaoX *= -1
    },

    reversoY: function () {
        this.direcaoY *= -1
    },

    reset: function () {
        this.x = campo.largura / 2
        this.y = campo.altura / 2
    },

    movimento: function () {
        this.x += this.direcaoX * this.velocidade
        this.y += this.direcaoY * this.velocidade
    },

    desenha: function () {
        canvasCtx.beginPath()
        canvasCtx.fillStyle = '#9c9c9c'
        canvasCtx.arc(this.x, this.y, this.raio, 2 * Math.PI, false)
        canvasCtx.fill()

        this.calcPosicao()
        this.movimento()
    }
}

//raquete esquerda (humano)
const raqueteEsq = {
    largura: larguraLinha,
    altura: 200,
    x: 10,
    y: campo.altura / 3,

    movimento: function () {
        this.y = mouse.y - this.altura / 2
    },

    desenha: function () {
        canvasCtx.fillRect(this.x, this.y, this.largura, this.altura)
        this.movimento()
    }
}

//raquete direita (computador)
const raqueteDir = {
    largura: larguraLinha,
    altura: 200,
    x: campo.largura - larguraLinha - 10,
    y: 120,

    movimento: function () {
        this.y = bola.y
    },

    desenha: function () {
        canvasCtx.fillRect(this.x, this.y, this.largura, this.altura)
        this.movimento()
    }
}

//placar
const placar = {
    humano: 0,
    computador: 0,

    incrementaHumano: function () {
        this.humano++
    },
    incrementaComputador: function () {
        this.computador++
    },

    fonte: 'bold 72px Arial',
    textAlign: 'center',
    textBaseline: 'top',

    desenha: function () {
        canvasCtx.font = this.fonte
        canvasCtx.textAlign = this.textAlign
        canvasCtx.textBaseline = this.textBaseline
        canvasCtx.fillStyle = '#fff'
        canvasCtx.fillText(this.humano, campo.largura / 4, 50)
        canvasCtx.fillText(
            this.computador,
            campo.largura / 4 + campo.largura / 2,
            50
        )
    }
}

//seta a tela
function setup() {
    tela.width = canvasCtx.width = campo.largura
    tela.height = canvasCtx.height = campo.altura
}

//função que desenha todo a tela
function desenha() {
    //desenha campo
    campo.desenha()

    //desenha linha central
    linha.desenha()

    //desenha raquete esquerda
    raqueteEsq.desenha()

    //desenha raquete direita
    raqueteDir.desenha()

    //desenha o placar
    placar.desenha()

    //desenha bola
    bola.desenha()
}

window.animateFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 1000 / 60)
        }
    )
})()

function main() {
    animateFrame(main)
    desenha()
}

setup()
main()

tela.addEventListener('mousemove', e => {
    mouse.x = e.pageX
    mouse.y = e.pageY
})
