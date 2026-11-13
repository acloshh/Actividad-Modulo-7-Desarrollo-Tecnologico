# Plan de implementación — Brasa (TP Módulo 7)

> Documento de modo **Plan**. No se modificó código en esta etapa.
> El objetivo es dividir el desarrollo en pasos pequeños, verificables y ordenados.

## 1. Análisis del enunciado

El TP pide un videojuego completo pero pequeño con:

- mecánica principal e interacción del jugador,
- enemigos / obstáculos / desafíos,
- progreso o puntuación,
- victoria y derrota,
- reinicio de partida,
- stack JavaScript + Node.js + Vite + Phaser,
- repo público con `src/`, `docs/GDD.pdf`, `AGENTS.md`, `README.md` y evidencias,
- flujo de trabajo Plan → Build → prueba → commit.

## 2. Alcance elegido

Se adapta el GDD de *Brasa* a un plataformas 2D de 3 niveles y 10–15 minutos:

- **Calor** como salud, luz y munición.
- **Astillas** para recuperar Calor.
- **Recuerdos** como recurso de riesgo: conservar (puntaje/final) o quemar (+100 Calor).
- **Chispas** para encender antorchas y aturdir enemigos.
- **Apagados** como enemigos; **viento** y **agua/ceniza** como obstáculos.
- **Puerta** al final de cada nivel que consume 1 recuerdo.
- **Puntaje**, mejor puntaje y tres pantallas de cierre según los recuerdos conservados.

Queda fuera: jefes, guardado persistente de partida, multijugador, assets externos.

## 3. Arquitectura propuesta

```
src/
├── main.js
├── scenes/     BootScene, MenuScene, GameScene, HUDScene, GameOverScene, VictoryScene
├── entities/   Player, Enemy, Fuel, Memory, Torch, Spark, WindZone
├── systems/    HeatSystem, ScoreSystem, LevelManager, AudioSystem, EventBus
├── patterns/   StateMachine, ObjectPool
└── data/       levels.js
```

Decisiones:

- `EventBus` (Observer) para comunicar sistemas y HUD sin acoplar escenas.
- `StateMachine` para player y enemigo.
- `ObjectPool` para las chispas.
- Los niveles se declaran como datos en `src/data/levels.js`; `LevelManager` los construye.
- Todos los gráficos y sonidos se generan por código para que el repo no dependa de assets externos.

## 4. Pasos de implementación

### Paso 1 — Scaffold del proyecto

- **Qué:** `package.json`, `vite.config.js`, `index.html`, `src/main.js`, estilos base.
- **Comportamiento esperado:** `npm install` y `npm run dev` levantan una página con el canvas de Phaser.
- **Verificación:** abrir el servidor local y comprobar que no hay errores en consola.
- **Depende de:** nada.
- **Fuera de esta etapa:** lógica de juego.

### Paso 2 — Texturas y escenas base

- **Qué:** `BootScene` (genera texturas), `MenuScene`, transición a `GameScene`.
- **Comportamiento esperado:** menú con título, botón Jugar y controles; el botón inicia el juego.
- **Verificación:** clic en Jugar cambia de escena.
- **Depende de:** paso 1.
- **Fuera de esta etapa:** gameplay.

### Paso 3 — Jugador, calor y nivel 1

- **Qué:** `Player`, `HeatSystem`, `LevelManager`, `levels.js`, colisiones, cámara, oscuridad.
- **Comportamiento esperado:** el jugador se mueve, salta, pierde Calor, recoge astillas y puede morir.
- **Verificación:** recorrer el nivel 1; ver la barra bajar y subir al recoger astillas.
- **Depende de:** paso 2.
- **Fuera de esta etapa:** enemigos y puntaje.

### Paso 4 — Recuerdos, chispas y antorchas

- **Qué:** `Memory`, `Spark`, `Torch`, `ObjectPool`, quema con `Q`, iluminación de antorchas.
- **Comportamiento esperado:** recoger recuerdos, quemarlos por +100 Calor y encender antorchas con chispas.
- **Verificación:** la antorcha queda encendida 20 s y regenera Calor cerca.
- **Depende de:** paso 3.
- **Fuera de esta etapa:** enemigos.

### Paso 5 — Enemigos, viento y peligros

- **Qué:** `Enemy` con `StateMachine`, `WindZone`, agua/ceniza, daño e invulnerabilidad.
- **Comportamiento esperado:** el Apagado patrulla y persigue; el viento drena Calor; el agua devuelve al último punto seguro.
- **Verificación:** provocar daño y comprobar la pérdida de Calor y el empuje.
- **Depende de:** paso 3.
- **Fuera de esta etapa:** puntaje y cierre de run.

### Paso 6 — Puntaje, HUD y progresión

- **Qué:** `ScoreSystem`, `HUDScene`, puertas, transición entre niveles y avisos.
- **Comportamiento esperado:** puntaje visible, puerta consume 1 recuerdo y avanza de nivel.
- **Verificación:** completar el nivel 1 y verificar el reinicio de Calor y el puntaje acumulado.
- **Depende de:** pasos 3–5.
- **Fuera de esta etapa:** pantallas finales.

### Paso 7 — Victoria, derrota y reinicio

- **Qué:** `GameOverScene`, `VictoryScene`, reinicio completo, mejor puntaje.
- **Comportamiento esperado:** al morir se puede reintentar; al ganar se ve el final según recuerdos conservados.
- **Verificación:** morir, reintentar y comprobar que el estado vuelve a cero; ganar y ver el resumen.
- **Depende de:** paso 6.
- **Fuera de esta etapa:** pulido visual.

### Paso 8 — Pulido, documentación y entrega

- **Qué:** partículas, audio sintetizado, pausa, accesibilidad básica, README, AGENTS.md, evidencias y PDF.
- **Comportamiento esperado:** build sin errores y documentación completa.
- **Verificación:** `npm run build`; revisar README y PDF.
- **Depende de:** pasos 1–7.
- **Fuera de esta etapa:** contenido extra.

## 5. Riesgos detectados

| Riesgo | Mitigación |
|---|---|
| Que el Calor no se entienda | Avisos contextuales y tutorial implícito en el nivel 1 |
| Softlock al quemar todos los recuerdos | Cada nivel tiene 3 recuerdos y la puerta consume 1 |
| Escenas que acumulan listeners al reiniciar | Limpieza explícita de listeners en `shutdown` |
| Falta de assets | Todo el arte y audio se genera por código |
| Build pesada | Sin dependencias extra ni archivos multimedia |

## 6. Criterio de finalización del plan

El plan se considera ejecutado cuando:

1. El juego se puede jugar de principio a fin.
2. Victoria y derrota funcionan.
3. El reinicio no arrastra estado.
4. `npm run build` termina sin errores.
5. El repositorio contiene `README.md`, `AGENTS.md`, `docs/GDD.pdf` y evidencias.
