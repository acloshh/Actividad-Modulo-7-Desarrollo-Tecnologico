# AGENTS.md — Brasa

Instrucciones para agentes de OpenCode (y para cualquier persona) que trabajen en este
repositorio. Leer antes de modificar código.

## 1. Contexto del proyecto

**Brasa — El último fuego** es un plataformas 2D corto (3 niveles, 10–15 minutos)
hecho con **JavaScript, Vite y Phaser 3.90**. El jugador es una brasa viviente:
el **Calor** es a la vez vida, radio de luz y munición. Los recuerdos se pueden
conservar (puntaje/final) o quemar (+100 Calor).

- Documento de diseño: `docs/GDD.md` (el PDF se genera desde ahí).
- Plan de implementación: `docs/PLAN.md`.
- Evidencias y pruebas: `docs/EVIDENCIAS_OPENCODE.md`.
- Capturas: `docs/capturas/`.

El objetivo del TP es demostrar un juego completo y pequeño, con mecánica propia,
progreso, victoria/derrota, reinicio y uso documentado de OpenCode.

## 2. Comandos

```bash
npm install            # instalar dependencias
npm run dev            # servidor de desarrollo (Vite)
npm run build          # build de producción en dist/
npm run preview        # servir la build en un puerto local
npm run generate:pdf   # regenerar docs/GDD.pdf (requiere Edge/Chrome)
```

Antes de dar una tarea por terminada:

```bash
npm run build
```

Si se tocó `docs/GDD.md`, regenerar el PDF:

```bash
npm run generate:pdf
```

## 3. Arquitectura

```text
src/main.js                 Configuración de Phaser y lista de escenas
src/config.js               Dimensiones, colores, tuning y estados de Calor
src/data/levels.js          Datos de los 3 niveles (plataformas, spawns, etc.)

src/scenes/
  BootScene.js              Genera TODAS las texturas por código
  MenuScene.js              Título, controles, mejor puntaje, inicio
  GameScene.js              Núcleo: input, física, peligros, cámara, oscuridad,
                            transiciones, victoria y derrota
  HUDScene.js               Barra de Calor, puntaje, recuerdos, avisos
  GameOverScene.js          Derrota + reintentar/menú
  VictoryScene.js           Tres finales según recuerdos conservados

src/entities/
  Player.js                 Movimiento, salto, dash, daño, luz, máquina de estados
  Enemy.js                  Apagado: patrol/chase/flee/stunned
  Fuel.js                   Astilla (+15 Calor)
  Memory.js                 Recuerdo (conservar o quemar)
  Torch.js                  Antorcha encendible/apagable
  Spark.js                  Chispa proyectil (pool)
  WindZone.js               Zona de viento con partículas

src/systems/
  HeatSystem.js             Fuente única de verdad del Calor
  ScoreSystem.js            Puntaje de la run
  LevelManager.js           Construye el nivel desde datos y expone grupos
  AudioSystem.js            SFX sintetizados con Web Audio API
  EventBus.js               Observer: eventos de gameplay → HUD
  Storage.js                Mejor puntaje en localStorage

src/patterns/
  StateMachine.js           State pattern (player/enemy)
  ObjectPool.js             Object pool (sparks)

src/ui/Button.js            Botón reutilizable
src/assets/README.md        Documenta que no hay assets binarios
```

### Flujo de escenas

```text
BootScene → MenuScene → GameScene + HUDScene
                              ├─→ GameOverScene → GameScene (reintentar) / MenuScene
                              └─→ VictoryScene → GameScene (nueva run) / MenuScene
```

`GameScene` se reinicia con `scene.restart({ ...carry })` entre niveles conservando
puntaje, recuerdos y tiempo. Al terminar la run se vuelve a empezar desde cero.

### Principios de diseño

- **El Calor es la única fuente de verdad** (`HeatSystem`). No duplicar lógica de
  vida/luz/municiones en otros archivos.
- **Los niveles son datos**, no código: `src/data/levels.js` + `LevelManager`.
- **El HUD escucha eventos** (`EventBus`), no consulta el estado interno del juego.
- **Sin assets binarios**: texturas en `BootScene`, sonidos en `AudioSystem`.
- **Reinicio limpio**: todos los listeners, tweens, partículas y grupos deben
  destruirse en `GameScene.handleShutdown()` y en los `shutdown` de las escenas.

## 4. Convenciones de código

- JavaScript moderno con **ES Modules** (`import`/`export`).
- 2 espacios, punto y coma, comillas simples.
- Una clase o responsabilidad principal por archivo.
- Nombres de clases en `PascalCase`; métodos y variables en `camelCase`.
- Comentarios y textos de UI **en español** (el público del TP es hispanohablante).
- No introducir TypeScript, frameworks de UI ni dependencias nuevas sin justificarlo.
- Mantener el estilo y la paleta existentes (azul noche + ámbar).
- Evitar `console.log` en el código de producción; usar el HUD/avisos para feedback.

## 5. Reglas para agentes

### Hacer

1. Leer `docs/GDD.md` y este archivo antes de cambios grandes.
2. Mantener el alcance: 3 niveles, una mecánica central, sin jefes ni multijugador.
3. Verificar `npm run build` después de cada cambio relevante.
4. Probar el flujo afectado en `npm run preview` (no solo en desarrollo).
5. Actualizar `docs/GDD.md` y regenerar el PDF si cambia una regla de juego.
6. Actualizar `docs/EVIDENCIAS_OPENCODE.md` si se agrega una iteración importante.
7. Usar `window.__BRASA__` solo para pruebas; no convertirlo en API del juego.
8. Mantener las capturas de `docs/capturas/` actualizadas si cambia la UI.

### No hacer

- No commitear `node_modules/`, `dist/`, `docs/pdf-preview/` ni logs.
- No agregar imágenes/audio externos: el GDD promete assets generados por código.
- No romper los guards de `GameScene` (`isTransitioning`, `isGameOver`, `isPaused`).
- No dejar listeners de `EventBus` o timers vivos al cambiar de escena.
- No cambiar el orden de los argumentos de los colliders sin probarlo: Phaser
  normaliza grupo↔sprite a `(sprite, groupChild)`.
- No usar `canvas.toDataURL()` sin un `game.step()` inmediatamente anterior
  (el buffer WebGL se limpia).
- No editar `package-lock.json` a mano.

## 6. Cómo agregar o modificar un nivel

1. Editar `src/data/levels.js`:
   - `width`, `spawn`, `platforms`, `fuels`, `memories`, `torches`, `enemies`,
     `winds`, `hazards`, `exit`, `hint`.
2. Verificar que las plataformas sean alcanzables con el salto actual:
   - salto ≈ 128 px de altura, velocidad 205 px/s (300 corriendo).
   - separación vertical recomendada entre plataformas: ≤ 80 px.
3. Asegurar que los enemigos patrullen dentro de un segmento con piso continuo.
4. Asegurar que haya al menos 1 recuerdo alcanzable antes de la puerta.
5. Probar la transición: `Memoria(s) → puerta → siguiente nivel`.
6. Actualizar la tabla de niveles del GDD si cambia el diseño.

## 7. Verificación mínima (Definition of Done)

- [ ] `npm run build` termina sin errores.
- [ ] `npm run preview` sirve la build y el menú carga.
- [ ] Se puede iniciar una partida.
- [ ] Movimiento (`A`/`D`), salto (`Espacio`), chispa (`J`) y quema (`Q`) funcionan.
- [ ] El Calor baja, se recupera con astillas y con antorchas.
- [ ] Un enemigo hace daño y el viento empuja/drena.
- [ ] Caer al agua respawnea y descuenta Calor.
- [ ] La puerta consume un recuerdo y cambia de nivel.
- [ ] Victoria y derrota muestran la pantalla correcta.
- [ ] `R` reinicia la run con nivel 1, puntaje 0 y Calor 100.
- [ ] El mejor puntaje persiste en `localStorage`.
- [ ] No hay errores en la consola del navegador.
- [ ] Si cambió el GDD, `docs/GDD.pdf` está regenerado.

## 8. Pruebas automatizadas en navegador

`src/main.js` expone `window.__BRASA__` (la instancia de `Phaser.Game`) para pruebas.
Ejemplos útiles en la consola:

```js
const game = window.__BRASA__;
game.scene.getScenes(true).map((s) => s.scene.key); // escenas activas
game.scene.getScene('GameScene').heat.value;        // Calor actual
game.scene.getScene('GameScene').levelIndex;        // nivel actual
```

Para avanzar escenas cuando la pestaña está oculta/throttled:

```js
game.scene.processQueue();
for (let i = 0; i < 60; i++) game.scene.update(performance.now() + i * 16.67, 16.67);
```

Para capturas:

```js
game.step(performance.now(), 16.67);
const png = game.canvas.toDataURL('image/png');
```

## 9. Contacto y entrega

- Repositorio público: **<https://github.com/acloshh/Actividad-Modulo-7-Desarrollo-Tecnologico>**
- Integrante: **Santiago Tornau**
- Entrega: Campus Virtual, Módulo 7.

Si sos un agente y falta algún dato de la entrega, dejalo marcado como
`[completar]` y avisá en la respuesta final; no inventes nombres ni URLs.
