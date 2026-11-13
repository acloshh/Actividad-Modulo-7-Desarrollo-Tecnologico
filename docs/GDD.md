# BRASA — Mini GDD (Trabajo Práctico Módulo 7)

| Campo | Detalle |
|---|---|
| **Nombre** | Brasa |
| **Género** | Plataformas 2D con gestión de recursos |
| **Plataforma** | Navegador (WebGL / Canvas) |
| **Stack** | JavaScript · Node.js · Vite · Phaser 3 |
| **Duración** | 10–15 minutos (3 niveles) |
| **Equipo** | Santiago Tornau |
| **Versión** | 1.0 |

---

## 1. Concepto

Sos la última brasa de un mundo apagado. Tu cuerpo es fuego: **el Calor es tu vida, tu luz y tu munición al mismo tiempo**. Tenés que atravesar tres zonas en ruinas, juntar combustible y recuerdos, y llegar al Primer Fuego antes de apagarte.

La tensión central: iluminarte te permite ver y atacar, pero te consume; apagarte te protege de los enemigos, pero te deja sin recursos. Cada recuerdo que encontrás puede conservarse (puntaje y final) o quemarse para recuperar 100 de Calor.

---

## 2. Objetivo y condiciones

- **Objetivo:** completar los 3 niveles y encender el Primer Fuego.
- **Victoria:** llegar al Primer Fuego del nivel 3. El final y el puntaje dependen de los recuerdos conservados.
- **Derrota:** el Calor llega a 0. Se muestra la pantalla de derrota con puntaje y opción de reintentar.
- **Reinicio:** botón "Reintentar" en derrota/victoria y tecla `R` durante la partida. Reinicia la run completa (nivel 1, puntaje 0, Calor 100).

---

## 3. Bucle de juego

```
Explorar → juntar astillas/recuerdos → decidir si quemar un recuerdo
   ↑                                            ↓
Llegar a la puerta ← esquivar Apagados ← atravesar viento/agua
```

1. El Calor baja lentamente con el tiempo.
2. Las astillas recuperan +15 Calor; los recuerdos +100 si se queman.
3. Las chispas cuestan 10 Calor y encienden antorchas.
4. Las antorchas crean zonas seguras y ahuyentan enemigos.
5. La puerta de cada nivel consume 1 recuerdo para abrirse.

---

## 4. Mecánicas

### 4.1 Calor (recurso único)

| Estado | Rango | Efecto |
|---|---|---|
| Brasa | 1–25 | Luz mínima; los Apagados te detectan a 90 px |
| Llama | 26–65 | Estado normal; detección a 160 px |
| Fogata | 66–100 | Luz máxima; detección a 240 px |

- Drenaje pasivo: **1,2 Calor/s**.
- Correr: **+3 Calor/s**.
- Viento: **+6 Calor/s** adicionales mientras estés dentro.
- Cerca de una antorcha encendida: no hay drenaje y se regenera **3 Calor/s** (máximo 100).
- Recibir daño de enemigo: **−20 Calor** + empuje + 1 s de invulnerabilidad.
- Caer al agua/ceniza: **−20 Calor** y reaparición en el último punto seguro.
- Caer fuera del mundo: **−15 Calor** y reaparición.
- Al llegar a 0: derrota.

### 4.2 Combustible

| Objeto | Efecto | Puntaje |
|---|---|---|
| Astilla | +15 Calor | +10 |
| Recuerdo | Se guarda en el inventario | +50 al recogerlo |

- Inventario máximo de recuerdos: sin límite (máximo 8 en toda la run).
- **Quemar recuerdo (`Q`):** +100 Calor, +1 recuerdo quemado, se pierde para siempre.
- **Puerta de nivel:** consume 1 recuerdo y avanza al siguiente nivel.
- Recuerdos por nivel: **3 / 3 / 2**. Las puertas de los niveles 1 y 2 consumen 1 cada una, por lo que el máximo conservado al final es **6**.

### 4.3 Chispas y antorchas

- **Chispa (`J` o clic):** cuesta 10 Calor, vuela en línea recta, dura 1,2 s.
- Enciende antorchas durante **20 s**.
- Aturde a un Apagado durante **2 s**.
- Antorcha encendida: radio de luz y zona segura de 110 px; los enemigos a menos de 140 px retroceden.

### 4.4 Avivar (`K` o `Shift`)

- Cuesta **8 Calor**.
- Impulso de velocidad durante 0,25 s.
- Empuja y aturde a los Apagados a menos de 120 px durante 1,5 s.
- Se usa para escapar y para cruzar ráfagas de viento.

### 4.5 Enemigos y peligros

| Elemento | Comportamiento | Daño |
|---|---|---|
| **Apagado** | Patrulla; persigue según el estado de Calor; huye de antorchas | −20 Calor al contacto |
| **Viento** | Zona con partículas; empuja y drena Calor | −6 Calor/s |
| **Agua/Ceniza** | Zona letal en los huecos | −20 Calor + reaparición |

No hay combate directo: las chispas y "Avivar" sirven para controlar el espacio, no para eliminar enemigos.

---

## 5. Niveles

| # | Nombre | Ancho | Desafío | Recuerdos |
|---|---|---|---|---|
| 1 | El Bosque Húmedo | 3200 px | Tutorial: movimiento, astillas, chispa, antorcha, primer Apagado | 3 |
| 2 | La Ciudad Sumergida | 3400 px | Huecos con agua, más enemigos y viento | 3 |
| 3 | El Primer Fuego | 3800 px | Viento fuerte, tres Apagados y llegada al Primer Fuego | 2 |

Cada nivel tiene un punto de aparición, plataformas, astillas, antorchas, enemigos, zonas de viento, peligros y una salida.

---

## 6. Puntaje

| Acción | Puntos |
|---|---|
| Recoger astilla | +10 |
| Recoger recuerdo | +50 |
| Recuerdo conservado al ganar | +100 |
| Completar nivel | +250 + Calor restante |
| Quemar recuerdo | 0 (pero otorga +100 Calor) |

El puntaje máximo se guarda en `localStorage` y se muestra en el menú.

---

## 7. Controles

| Acción | Teclado / Mouse |
|---|---|
| Mover | `A` / `D` o flechas |
| Saltar | `Espacio` / `W` / `↑` |
| Correr | `Shift` |
| Chispa | `J` o clic izquierdo |
| Avivar | `K` |
| Quemar recuerdo | `Q` |
| Reintentar run | `R` |
| Pausa | `Esc` |
| Silenciar | `M` |

---

## 8. Presentación

- **Arte:** siluetas y formas geométricas generadas por código (sin assets externos). Paleta azul noche + ámbar.
- **Luz:** overlay de oscuridad con recorte radial sobre el jugador y las antorchas.
- **Partículas:** brasas, humo, chispas y ráfagas de viento.
- **Audio:** efectos sintetizados con Web Audio API (salto, recogida, daño, chispa, victoria, derrota). Sin archivos de audio.
- **UI:** barra de Calor, puntaje, recuerdos, nivel y avisos contextuales.

---

## 9. Alcance

**Incluido:** 3 niveles, 8 recuerdos, 2 tipos de peligro ambiental, 1 tipo de enemigo, puntaje, mejor puntaje, pausa, victoria, derrota, reinicio, audio sintetizado, controles por teclado y mouse.

**Fuera de alcance:** multijugador, guardado de partida, editor de niveles, jefes, assets externos, localización.

---

## 10. Arquitectura técnica

```
src/
├── scenes/      Boot, Menu, Game, HUD, GameOver, Victory
├── entities/    Player, Enemy, Fuel, Memory, Torch, Spark, WindZone
├── systems/     HeatSystem, ScoreSystem, LevelManager, AudioSystem, EventBus
├── patterns/    StateMachine, ObjectPool
├── data/        levels.js
└── main.js
```

**Patrones aplicados:**

- **State:** máquina de estados finitos para el jugador (idle/run/jump/fall) y para el Apagado (patrol/chase/flee/stunned).
- **Object Pool:** reutilización de chispas para evitar crear/destruir objetos en cada disparo.
- **Observer:** `EventBus` desacopla la lógica del juego de la interfaz (Calor, puntaje, recuerdos y avisos).

---

## 11. Criterios de aceptación

- [x] `npm install` y `npm run dev` funcionan sin errores.
- [x] `npm run build` genera una build estática válida.
- [x] Se puede iniciar, jugar, ganar y perder.
- [x] El Calor se agota, se recupera con astillas y se quema con recuerdos.
- [x] Los enemigos y el viento generan riesgo real.
- [x] El puntaje se actualiza y se conserva el mejor puntaje.
- [x] Reiniciar deja la partida en estado limpio.
- [x] Los 3 niveles son completables.

---

*Mini GDD del TP Módulo 7 — Desarrollo Tecnológico 2.*
