# Guion de la demo · 7 minutos

Workshop *"NFT más allá del arte"* · Team1 LatAm · jueves 10 de septiembre de 2026
Va entre el minuto 52 y el 59, justo después de la lámina 20.

---

## Opcional

La wallet de respaldo `0x78Bef96aC46b44073caAc33834df924DEef62f43` ya tiene el pass #1 acuñado y
sirve tal cual para el plan B. Si preferís que sea una cuenta tuya de Core: la creás, le pedís
AVAX en el faucet, y corrés

```
PRIVATE_KEY=<la de respaldo> CONTRATO=0x2C9a24f4e55A46195fc1838BCAf00506402a0Fa2 \
  bash scripts/mint-respaldo.sh
```

## Antes del día

- [ ] **Confirmar que tu wallet en vivo NO tiene el pass.** Pegá tu dirección en el campo de
      verificación libre: tiene que decir "No tiene el pass". Si dice que sí, la demo pierde el
      paso 2, porque el contrato permite uno por dirección.
- [ ] **Confirmar que tu wallet en vivo sí tiene AVAX de prueba** para pagar el gas.
- [ ] **Tener a mano la dirección de respaldo**, en un archivo de texto que puedas copiar de un
      solo golpe: `0x78Bef96aC46b44073caAc33834df924DEef62f43`

## Diez minutos antes de compartir pantalla

- [ ] Navegador al **150 por ciento** de zoom.
- [ ] **Una sola pestaña abierta**, con la URL de la aplicación. Nada más: sin correo, sin
      notificaciones, sin la otra charla.
- [ ] **Core desconectado del sitio**, para que la demo arranque en el paso 1. Si Core ya autorizó
      la página, la aplicación reconecta sola y arranca en el paso 2, y perdés el momento de
      conectar. En Core: ícono de la extensión, "Sitios conectados", y quitás este sitio. Si
      preferís, usá una ventana limpia con la extensión habilitada para ese modo.
- [ ] **Core en Avalanche Fuji**, o mejor todavía, en otra red: así podés mostrar en vivo el aviso
      de red equivocada y el botón que la cambia. Queda bien y dura diez segundos.
- [ ] La **dirección de respaldo copiada** en el portapapeles, o en un archivo de texto a mano.
- [ ] El **enlace de la aplicación pegado en el chat del workshop**, antes de empezar, para que la
      gente pueda seguirlo desde el teléfono mientras hablás.
- [ ] Silenciar notificaciones del sistema.

---

## El guion

### Minuto 0 a 1 · Presentar la pantalla

Compartís pantalla con la aplicación ya abierta en el paso 1.

> "Esto es lo mismo que acaban de ver en la lámina: cuatro pasos. Está en Fuji, que es la red de
> pruebas de Avalanche, así que los tokens no valen nada y ustedes pueden repetir esto hoy mismo
> sin gastar un peso. El enlace está en el chat."

Señalá el contador de arriba a la derecha: cuántos passes se acuñaron hasta ahora.

### Minuto 1 a 2 · Paso 1, conectar

Tocás **Conectar wallet**. Se abre la lista de wallets detectadas.

> "Fíjense que Core aparece acá con su nombre y su ícono. La página no sabe quién soy: le pregunta
> al navegador qué wallets hay instaladas y las muestra."

Elegís Core y firmás la conexión.

> "Listo. No hubo registro, no hubo contraseña, no hubo correo de confirmación. La wallet es la
> identidad."

Si arrancaste en otra red, aparece el aviso naranja. Tocás el botón que cambia a Fuji.

> "La aplicación se da cuenta sola de que estoy en la red equivocada y me ofrece cambiar. Un botón."

### Minuto 2 a 4 · Paso 2, crear el pass

La aplicación avanza sola al paso 2.

> "Acuñar es escribir un registro en la red. Un ID, un dueño, y las reglas. Y esas reglas son parte
> del token, no de un servidor: este pass no se puede transferir. Es un pase de acceso a un evento,
> no se revende."

Tocás **Acuñar mi pass**. Confirmás en Core.

Mientras confirma, señalá los tres estados: firmando, esperando confirmación, confirmada.

> "Estoy pagando el gas con AVAX de prueba, que no vale nada. Y estamos esperando a que la red diga
> que sí."

Cuando confirma, aparece el número del pass.

> "Ese es mi pass. Lo puedo ver en el explorador."

Abrís el enlace a la transacción en una pestaña nueva, lo mostrás dos segundos, y volvés.

### Minuto 4 a 5 y medio · Paso 3, verificar

Esta es la parte importante. La aplicación ya está en el paso 3.

> "Acá es donde quiero que se fijen bien. La app le pregunta a la red, no a su base de datos."

Señalá la fila de abajo del resultado: red, chainId, contrato, hora exacta.

> "Esto de acá dice de dónde salió la respuesta: Avalanche Fuji, chainId 43113, este contrato, y
> contestó a esta hora. No hay ninguna base de datos con una lista de invitados. No hay un servidor
> nuestro guardando nombres. La pregunta viaja hasta la red y vuelve."

Tocás **preguntar de nuevo**. La hora cambia.

> "Cada vez que pregunto, vuelvo a preguntar de verdad."

### Minuto 5 y medio a 6 y medio · Paso 4, desbloquear

Tocás **Entrar al contenido**.

> "Y esto es lo que abre el pass. Fíjense que esta página no confía en lo que pasó antes: vuelve a
> preguntarle a la red antes de mostrarme nada."

Mostrás los tres enlaces. Volvés a los pasos.

### Minuto 6 y medio a 7 · Cerrar

Pegás la dirección de respaldo en el campo de **verificar otra dirección** y tocás Verificar.

> "Y no hace falta ser yo. Esta es la dirección de otra persona, yo no conecté nada, y la red me
> dice que tiene su pass. Cualquiera puede verificar a cualquiera, porque el registro es público."

> "El enlace está en el chat. Es gratis, es la red de pruebas, y lo pueden hacer ahora mismo desde
> el teléfono mientras seguimos."

---

## Si algo falla

**Core no aparece en la lista.** Cerrá el diálogo, recargá la página y volvé a abrirlo. Si sigue
sin aparecer, seguí con el plan B de abajo.

**La transacción se cuelga o la rechazás sin querer.** El botón queda disponible y el mensaje
explica qué pasó. Reintentá una vez. Si vuelve a fallar, plan B.

**Dice que ya tenés el pass.** Alguien acuñó con tu wallet antes, o lo probaste y te olvidaste.
No insistas: pasá directo al paso 3, que la verificación va a dar positivo igual, y contá que el
contrato permite uno por dirección. El punto pedagógico se sostiene solo.

**Te quedaste sin AVAX de prueba.** La aplicación te lo dice y te ofrece el faucet. Son treinta
segundos, pero en vivo son eternos: mejor plan B.

**Plan B, la salida que siempre funciona.** Pegá la dirección de la wallet de respaldo en el campo
de **verificar otra dirección** y tocá Verificar. No necesita wallet conectada, no necesita gas, y
te devuelve el paso 3 completo, con la red y el contrato a la vista. Desde ahí seguís el guion
como si nada, contando que estás verificando la credencial de otra persona. La frase que importa,
"la app le pregunta a la red", se sostiene exactamente igual.

**Se cae la aplicación entera.** Abrí el contrato en el explorador y mostrá `hasPass` ahí mismo. Es
la misma pregunta, hecha con otra herramienta, y refuerza el argumento: la información no era de la
aplicación, era de la red.

---

## Los números para tener a mano

| | |
|---|---|
| Aplicación | https://team1-workshop-pass.vercel.app |
| Contrato en Fuji | `0x2C9a24f4e55A46195fc1838BCAf00506402a0Fa2` |
| Wallet en vivo | la tuya, la que abrís en Core el día del workshop |
| Wallet de respaldo | `0x78Bef96aC46b44073caAc33834df924DEef62f43` (pass #1) |
| Explorador | subnets.avax.network/c-chain-testnet |
| Faucet | core.app/tools/testnet-faucet |
