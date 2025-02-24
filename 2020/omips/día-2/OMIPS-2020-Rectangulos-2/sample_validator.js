function validate(world, callbacks) {
  var validados = new Map();
  var tamanios = new Map();
  var repetidos = 0;
  var beeps = 0;
  var valid = true;
  var msg_err = "";

  for (var y = 1; y <= world.h && valid; y++) {
    for (var x = 1; x <= world.w && valid; x++) {
      beeps += world.buzzers(y, x);

      if (world.buzzers(y, x) == 0 || validados.get(x + "." + y) == 1) {
        continue;
      }

      //revisar rectangulo
      var ancho = 1;
      for (var i = x + 1; i <= world.w; i++) {
        if (world.buzzers(y, i) == 1) {
          ancho++;
        } else {
          break;
        }
      }

      var alto = 1;
      for (var j = y + 1; j <= world.h; j++) {
        if (world.buzzers(j, x) == 1) {
          alto++;
        } else {
          break;
        }
      }

      //callbacks.info("("+x+","+y+"): ancho: " + ancho + " alto: " + alto);

      for (var i = x; valid && i < x + ancho; i++) {
        for (var j = y; valid && j < y + alto; j++) {
          validados.set(i + "." + j, 1);
          if (world.buzzers(j, i) != 1) {
            valid = false;
            msg_err = "No es un rectángulo válido. Casilla " + i + " " + j;
          }
        }
      }

      if (!valid) {
        break;
      }

      //callbacks.info("desde " + (x - 1) + ", " + (y - 1));
      //callbacks.info("hasta " + (x + ancho) + ", " + (y + alto));

      zs = 0;
      for (
        var i = Math.max(1, x - 1);
        i < Math.min(x + ancho, world.w + 1);
        i++
      ) {
        for (
          var j = Math.max(1, y - 1);
          j < Math.min(y + alto, world.h + 1);
          j++
        ) {
          zs += world.buzzers(j, i);
        }
      }

      //callbacks.info("area " + zs);

      if (zs != alto * ancho) {
        valid = false;
        msg_err = "Se detectaron zumbadores adyacentes al rectángulo.";
      }

      if (!valid) {
        break;
      }

      var n = tamanios.get(ancho + "." + alto) || 0;
      if (n > 0) {
        repetidos += 1;
      }
      tamanios.set(ancho + "." + alto, n + 1);
    }
  }

  if (valid) {
    var t = tamanios.size;
    var msg_t = "Tamaños distinos: " + t;
    var msg_r = "Tamaños repetidos: " + repetidos;
    var msg_z = "Zumbadores usados: " + beeps;
    var msg_p =
      "Resultado: " + Math.max(0, (beeps + Math.floor(repetidos / 2)) * t);
    callbacks.info(msg_t);
    callbacks.info(msg_r);
    callbacks.info(msg_z);
    callbacks.info(msg_p);
  } else {
    callbacks.info(msg_err);
  }

  return valid;
}
