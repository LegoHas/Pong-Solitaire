dificultad = 1
INICIO = true
PAUSA = false

function pausar() {
  PAUSA = true
  frameRate(6)
  sonido_fondo.setVolume(0)
}

function reanudar() {
  PAUSA = false
  frameRate(60)
  sonido_fondo.setVolume(0.7)
}

function dibujarElementosJuego() {
  if (!juego.juegoTerminado) {
    pelota.dibujar()
    raqueta.dibujar()
    dibujarBot贸nPausa()
  }
}

function dibujarBot贸nPausa() {
  btn_pausa.draw()
  push(); {
    if (btn_pausa.isMouseOver) {
      blendMode(SCREEN)
    }
    if (btn_pausa.isMousePressed) {
      blendMode(MULTIPLY)
    }
    btn_pausa.draw()
  }
  pop()
}

function dibujarInicio() {
  push()
  textSize(90)
  textAlign(CENTER, CENTER)
  fill(255)
  text(
    "INICIAR 馃彄",
    width / 2,
    height / 2
  )
  pop()
}

function dibujarPausa() {
  if (PAUSA && !juego.juegoTerminado) {
    textSize(60)
    textAlign(CENTER, CENTER)
    fill(255)
    text(
      "PAUSADO 馃槾",
      width / 2,
      height / 2
    )
  }
}

class Juego {

  constructor() {
    this.juegoTerminado = true
    let mp = cookie("mp-ps")
    this.mejorPuntuaci贸n = mp || 0
  }

  dibujar() {
    this.calculoDificultad()

    fill(200)
    textSize(20)

    if (this.juegoTerminado) {
      textAlign(CENTER, CENTER)

      let x = width / 2
      let y = height / 2

      let mp = this.mejorPuntuaci贸n
      let p = this.puntos
      let porc = p / mp

      if (this.mejorPuntuaci贸n == 0) {
        porc = 1
      }
      let sp = (porc * 100).toFixed(1)

      let ic = porc == 1 ? "馃槑" : "馃槦"

      let texto = "Juego Terminado " +
        ic +
        "\n" + p + "/" + mp +
        " (" + sp + "%)"

      text(texto, x, y - 10)

      push(); { //Dibujado de la barra
        let w = 150
        let h = 20;
        x = (width - w) / 2
        y = height / 2 + h + 5
        fill(porc == 1 ? 'gold' : 'green')
        rect(x, y, w * porc, h)
        stroke(255)
        noFill()
        rect(x, y, w, h)
      }
      pop()

      return
    }
    textAlign(LEFT, TOP)

    let texto = this.textoVidas() +
      "\n" + this.puntos
    text(
      texto,
      5,
      5
    )

    textAlign(CENTER, TOP)
    fill(255, 255, 100)
    text(
      "猸? " + this.mejorPuntuaci贸n,
      width / 2,
      5
    )
  }

  calculoDificultad() {
    dificultad = 1
    dificultad += (this.puntos % 20) * 0.1
    dificultad += (this.puntos / 20) * 0.2
  }

  textoVidas() {
    let cadena = ""
    for (let i = 0; i < this.vidas; i++) {
      cadena += "鉂わ笍"
    }
    return cadena;
  }

  reiniciar() {
    this.puntos = 0
    this.vidas = 3
    this.reiniciarObjetos()
  }

  perder() {
    this.vidas--
    if (this.vidas < 0) {
      this.terminarJuego()
    } else {
      this.reiniciarObjetos()
    }
    window.navigator.vibrate([100]);
  }

  nuevoJuego() {
    if (this.juegoTerminado) {
      
      this.reiniciar()
      this.juegoTerminado = false
      if (!sonido_fondo.isLooping()) {
        sonido_fondo.loop()
      }
      sonido_fondo.setVolume(0.7)
    }
  }

  terminarJuego() {
    this.juegoTerminado = true
    sonido_fondo.setVolume(0)
    if(this.puntos==this.mejorPuntuaci贸n){
      highscore.play()
    }else{
      sonido_juegoTerminado.play()
    }
  }

  reiniciarObjetos() {
    raqueta.reiniciar()
    pelota.reiniciar()
  }

  puntuar() {
    this.puntos++
    if (this.puntos % 10 == 0) {
      pelota.cambiarColor()
    }
    if (this.puntos % 20 == 0) {
      this.vidas++
      sonido_vida.play()
    }
    let mp = this.mejorPuntuaci贸n
    if (mp < this.puntos) {
      this.mejorPuntuaci贸n = this.puntos
      crearCookie(
        "mp-ps",
        this.mejorPuntuaci贸n
      )
    }
  }

}