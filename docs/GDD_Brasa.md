# BRASA
### Documento de Diseño de Juego (GDD)

| Campo | Detalle |
|---|---|
| **Título provisorio** | *Brasa* |
| **Subtítulo** | El último fuego |
| **Género** | Plataformas 2D atmosférico con gestión de recursos y exploración |
| **Plataformas** | PC (Steam / itch.io). Prototipo jugable en navegador (WebGL) |
| **Modo** | Un jugador |
| **Duración estimada** | 3 a 4 horas (campaña) |
| **Público** | 12+ · Jugadores de *Inside*, *Little Nightmares*, *Journey*, *Hollow Knight* |
| **Motor propuesto** | Godot 4 (2D + luces 2D) o Unity 2D URP |
| **Equipo** | 4 a 6 personas |
| **Versión del documento** | 1.0 |
| **Estado** | Preproducción / Vertical slice |

---

## 1. High concept

> Sos la última brasa de un mundo que se apagó. Tu cuerpo es fuego: tu vida, tu luz y tu única arma son la misma cosa. Recorrés ruinas heladas buscando combustible, y cada llamarada que lanzás te acerca a la oscuridad.

*Brasa* es un plataformas 2D de atmósfera melancólica donde el jugador encarna una pequeña llama consciente. La **temperatura** funciona como salud, como radio de visión y como munición al mismo tiempo. Avanzar exige quemar; quemar exige explorar; explorar en la oscuridad exige gastar. Todo el juego nace de esa tensión.

El giro narrativo-mecánico: las **Memorias** que encontrás por el mundo son el mejor combustible del juego. Usarlas te da un respiro enorme, pero borra para siempre fragmentos de la historia y mejoras permanentes. El jugador decide, literalmente, cuánto del pasado está dispuesto a quemar para sobrevivir.

---

## 2. Pilares de diseño

1. **La luz es un recurso, no un adorno.**
   Cada decisión de diseño debe poder responderse con la pregunta: *¿esto hace que la luz sea más valiosa?* Si no, se descarta.

2. **Calor y vulnerabilidad en la misma llama.**
   Estar fuerte te hace visible y ruidoso; estar débil te vuelve invisible pero indefenso. Ningún estado es estrictamente mejor que el otro.

3. **El mundo se cuenta en silencio.**
   Sin diálogos hablados ni texto expositivo. La historia se reconstruye por escenarios, objetos y las Memorias que el jugador elige conservar o quemar.

4. **La pérdida es una decisión, no un castigo.**
   Nunca se quita algo al jugador por azar. Toda pérdida es consecuencia de una elección comprensible.

5. **Sesiones cortas, tensión continua.**
   Partidas de 20 a 40 minutos, puntos de guardado claros y un ritmo de "respirar, arriesgar, descansar".

---

## 3. Público objetivo

| Segmento | Descripción | Necesidad |
|---|---|---|
| **Primario** | 16–35 años, jugadores de experiencias narrativas cortas en PC | Atmósfera, originalidad, una mecánica que se sienta nueva |
| **Secundario** | Estudiantes y público de jam / itch.io | Entrada rápida, precio bajo, propuesta clara en 10 segundos |
| **Terciario** | Creadores de contenido y streamers | Momentos visualmente legibles y decisiones comentables |

**No es el público:** jugadores que buscan combate técnico, progresión por niveles extensa o multijugador.

---

## 4. Referencias e inspiración

| Obra | Qué tomamos | Qué evitamos |
|---|---|---|
| *Inside* | Ritmo, lenguaje visual, puzzles sin texto | Su linealidad rígida |
| *Little Nightmares* | Escala y vulnerabilidad del protagonista | El tono de horror explícito |
| *Hollow Knight* | Legibilidad de mapas y exploración | La extensión y dificultad de combate |
| *Journey* | Emoción por ambiente y música | La ausencia total de riesgo |
| *The Flame in the Flood* | Gestión de recursos en travesía | La supervivencia repetitiva |

**Frase guía:** *"Un juego donde la barra de vida ilumina el camino y por eso mismo atrae a lo que te quiere apagar."*

---

## 5. Bucle de juego

### 5.1 Bucle central (30–90 segundos)

```
   EXPLORAR  →  ENCONTRAR COMBUSTIBLE  →  ALIMENTAR LA LLAMA
      ↑                                            ↓
   DESCANSAR  ←  LLEGAR A LA PRÓXIMA HOGUERA  ←  ATRAVESAR LA OSCURIDAD
```

1. **Explorar** una zona en penumbras; la llama ilumina poco.
2. **Encontrar** astillas, tela, carbón o una Memoria.
3. **Decidir** si quemar ahora (seguridad inmediata) o guardar para un tramo difícil.
4. **Atravesar** un obstáculo (viento, agua, criatura, salto) gastando calor.
5. **Alcanzar** una hoguera: punto de guardado, recarga parcial y respiro narrativo.

### 5.2 Bucle de sesión (20–40 minutos)

- Entrar a un capítulo → explorar 2 o 3 zonas → resolver un puzzle de luz → enfrentar una "Ráfaga" o un "Apagado" → encender la hoguera del capítulo → guardar.

### 5.3 Bucle de campaña (3–4 horas)

- 5 capítulos con un bioma y una regla nueva cada uno.
- Recolectar Memorias (12 en total).
- Llegar al Primer Fuego y elegir un final según cuántas Memorias se conservaron.

---

## 6. Controles

| Acción | Teclado / Mouse | Gamepad | Notas |
|---|---|---|---|
| Moverse | `A` / `D` o flechas | Stick izquierdo / D-pad | Analógico con aceleración suave |
| Saltar | `Espacio` | `A` / Cruz | Salto variable según tiempo de pulsación |
| Correr | `Shift` (mantener) | `RB` / R1 | Consume calor |
| Lanzar chispa | Clic izquierdo / `J` | `X` / Cuadrado | Apunta con mouse o stick derecho |
| Avivar (soplar) | `K` (mantener) | `Y` / Triángulo | Impulso corto de calor y luz |
| Interactuar | `E` | `B` / Círculo | Encender, leer, alimentar |
| Pausa / Mapa | `Esc` / `Tab` | `Start` / `Select` | — |

**Regla de diseño:** toda acción debe poder ejecutarse sin mover la mano derecha del mouse en PC, y con una sola mano en gamepad para las secuencias de plataformas.

---

## 7. Sistemas y mecánicas

### 7.1 La llama como recurso único

La llama tiene un valor de **Calor** de 0 a 100.

| Estado | Rango | Efectos |
|---|---|---|
| **Brasa** | 1–25 | Radio de luz mínimo, velocidad reducida 10 %, no puede lanzar chispas |
| **Llama** | 26–65 | Estado base; radio y velocidad normales |
| **Fogata** | 66–100 | Radio máximo, +10 % velocidad, atrae enemigos desde 12 m |

- **Drenaje pasivo:** −1 Calor/s en interiores, −2 Calor/s a la intemperie.
- **Radio de luz:** `2 + 4 × √(Calor/100)` metros (de 2 m a 6 m).
- **Correr:** −4 Calor/s adicionales.
- **Avivar:** consume 8 Calor de golpe, duplica el radio durante 1,5 s y empuja enemigos cercanos.
- **Lanzar chispa:** 10 Calor; viaja 8 m; enciende antorchas y distrae 3 s.
- **Daño:** cada golpe de enemigo quita 20 Calor y aplica 2 s de "ahogo" (sin poder avivar).
- **Muerte:** al llegar a 0 se apaga. Se reaparece en la última hoguera con 40 Calor y sin pérdida de objetos.

> **Principio de legibilidad:** el jugador nunca ve un número. El tamaño, el color y el sonido de la llama comunican el estado. El HUD opcional muestra solo una barra difusa.

### 7.2 Combustible

| Recurso | Calor | Tiempo de recogida | Frecuencia | Notas |
|---|---|---|---|---|
| Astilla | +10 | 0,5 s | Alta | Común en el suelo |
| Tela encerada | +20 | 0,8 s | Media | Se quema más lento |
| Carbón | +35 | 1,2 s | Baja | Pesado: reduce salto 15 % hasta usarlo |
| Savia ardiente | +50 | 1,5 s | Muy baja | Zonas secretas |
| **Memoria** | **+100** | 2,0 s | 12 en total | **Destruye lore y mejora permanente** |

- El inventario es **de 3 ranuras**. No se puede acumular indefinidamente: obliga a decidir.
- Alimentar la llama es instantáneo, pero tarda 0,8 s de animación e inmoviliza al personaje: **punto de riesgo**.
- Las astillas se pueden **arrojar** (no encender) para distraer criaturas sin gastar Calor.

### 7.3 Viento y clima

El viento es el principal antagonista ambiental y se representa con un vector visible en partículas.

| Intensidad | Efecto sobre el jugador | Señal visual |
|---|---|---|
| Brisa | −0,5 Calor/s extra | Llama inclinada 15° |
| Ráfaga | −8 Calor/s mientras dure (2–4 s) | Silbido, hojas volando |
| Vendaval | −15 Calor/s; empuja 1,5 m/s | Pantalla vibra, música se corta |
| Lluvia | −3 Calor/s; apaga antorchas | Gotas y vapor |

**Contra-juego:** el jugador puede **refugiarse** detrás de muros, encender antorchas como "cortavientos" (absorben la ráfaga 5 s) o **avivar** para resistir un instante. Ninguna solución es perfecta: todas cuestan calor.

### 7.4 Luz, oscuridad y sigilo

- Las criaturas **Apagadas** no ven al jugador: perciben su **calor**. Cuanto más brillante, más lejos te detectan.
- Esconderse en sombras reduce el radio de detección a 2 m, pero impide recuperar Calor.
- Algunas zonas solo se abren con luz (mecanismos sensibles), lo que fuerza a iluminar y por lo tanto a exponerse.
- **Regla de tensión:** los puzzles de luz siempre tienen una alternativa más lenta y más costosa en calor. El jugador elige su ritmo.

### 7.5 Chispas y antorchas

- Las chispas son la única habilidad "a distancia". Sirven para:
  - encender antorchas fijas (crean zonas seguras y cortavientos),
  - activar mecanismos,
  - distraer a los Apagados,
  - quemar telarañas y raíces.
- Cada antorcha encendida dura **30 s** y otorga +1 Calor/s al jugador si está dentro de su radio (máx. +3/s).
- Las antorchas son **compartidas**: encender una puede alertar a un enemigo cercano.

### 7.6 Memorias: el gran intercambio

Cada Memoria es un fragmento de la historia del mundo y otorga una mejora pasiva mientras se conserve:

| Memoria | Mejora si se conserva | Si se quema |
|---|---|---|
| La casa | +10 Calor máximo | +100 Calor inmediato |
| El nombre | Los Apagados tardan +1 s en detectarte | +100 Calor |
| La tormenta | Resistencia al viento +25 % | +100 Calor |
| El faro | Las antorchas duran +10 s | +100 Calor |
| … (12 en total) | … | … |

- Quemar una Memoria **no se puede deshacer** y **bloquea** ese fragmento de lore en la partida.
- El final se decide por cuántas Memorias quedan: **0–3** (Final del Ascua), **4–8** (Final de la Lámpara), **9–12** (Final del Faro).
- El juego no indica cuántas hay ni cuántas se quemaron. El jugador lo descubre en el epílogo.

### 7.7 Hogueras y progresión

- **Hogueras grandes:** guardado, recarga a 60 Calor, mapa y "banco" de objetos.
- **Fogones pequeños:** recarga a 30 Calor, un solo uso, se apagan para siempre.
- **Mejoras permanentes** (no ligadas a Memorias):
  - +1 ranura de inventario (2 mejoras en total, 3 → 5).
  - Chispa más lejana (+3 m).
  - Salto doble (se obtiene en el capítulo 3).
  - Resistencia al agua (capítulo 4).
- No hay árbol de habilidades: las mejoras son **hallazgos** en el mundo, coherentes con la ficción.

### 7.8 Enemigos

| Enemigo | Comportamiento | Debilidad | Peligro |
|---|---|---|---|
| **Apagado** | Patrulla; detecta calor a 10 m; persigue 4 s | Luz directa lo empuja | Quita 20 Calor |
| **Ráfaga** | Ráfagas erráticas; apaga antorchas | Refugio / muros | −8 Calor/s |
| **Ahogado** | Emerge del agua; apaga la llama a distancia | Mantenerse en altura | −15 Calor + empuje |
| **La Ceniza** (jefe) | Copia tus movimientos con 1 s de retraso | Usar tu propia luz contra ella | Capítulo 5 |

**Regla de diseño:** ningún enemigo mata de un golpe. Todos se pueden evitar sin combatir. El combate nunca es la solución óptima.

---

## 8. Estructura de niveles

| Cap. | Bioma | Regla nueva | Duración | Clímax |
|---|---|---|---|---|
| **1. El Bosque Húmedo** | Bosque quemado y lluvia | Viento y refugio | 25 min | Enseñar el intercambio de Memorias |
| **2. La Ciudad Sumergida** | Ruinas inundadas | Agua que apaga | 35 min | Primer Apagado |
| **3. El Desierto de Ceniza** | Dunas y tormentas | Visibilidad y ráfagas | 40 min | Salto doble y carrera contra el vendaval |
| **4. La Catedral Helada** | Interior vertical | Frío y alturas | 45 min | Puzzle de espejos y luz |
| **5. El Primer Fuego** | Núcleo del mundo | Todas las reglas juntas | 50 min | La Ceniza y la elección final |

**Diseño de niveles — pautas:**
- Cada zona enseña una regla, la prueba y la combina con la anterior.
- Puntos de decisión visibles a 15 m de distancia (silueta, color, sonido).
- Zonas seguras cada 2–3 minutos de juego.
- Todos los saltos obligatorios deben ser posibles con 10 Calor (estado crítico), para evitar bloqueos.
- Las rutas opcionales conducen a Memorias y mejoras; nunca a la progresión principal.

**Mini-mapa:** no existe. El jugador se orienta por puntos de referencia (hogueras, luces, siluetas). El mapa solo aparece en la hoguera como "memoria del camino" y se dibuja a mano.

---

## 9. Narrativa y mundo

### 9.1 Premisa

Hace mucho tiempo, el mundo estaba iluminado por el **Primer Fuego**. Nadie recuerda quién lo encendió. Un día empezó a apagarse y, con él, se apagaron las ciudades, los nombres y las personas. De aquel incendio solo quedó una brasa: vos.

La brasa despierta sin memoria y con un único impulso: llegar al centro del mundo, donde aún late el Primer Fuego. En el camino descubre que las ruinas están habitadas por los **Apagados**, antiguos habitantes que se negaron a soltar su calor y se convirtieron en sombras que lo buscan.

### 9.2 Temas

- La memoria como combustible: qué se conserva y qué se sacrifica para seguir vivo.
- La comunidad frente a la autopreservación.
- El duelo y la posibilidad de volver a empezar.

### 9.3 Estructura narrativa

- **Sin diálogo.** Voz en off solo en el prólogo y el epílogo (texto breve, 6 líneas).
- La historia se cuenta con **escenarios**: una mesa puesta para cuatro, un faro sin luz, un aula con nombres en la pared.
- Las Memorias son escenas jugables de 10–20 segundos, en blanco y negro, que se ven al recogerlas y se pierden si se queman.
- **Los tres finales** no juzgan al jugador: el Ascua (seguir siendo pequeño), la Lámpara (compartir la luz) y el Faro (volver a encender el mundo).

### 9.4 Personajes

| Personaje | Rol | Descripción |
|---|---|---|
| **Brasa** | Protagonista | Una llama pequeña, sin rostro, con ojos de dos puntos de luz. No habla. |
| **El Farero** | Mentor ausente | Solo se lo conoce por notas y una voz grabada. Encendió el último faro. |
| **Los Apagados** | Antagonistas trágicos | No son malvados: buscan calor porque no pueden producir el suyo. |
| **La Ceniza** | Jefe final | Lo que queda del Primer Fuego; quiere consumir a Brasa para volver a arder. |
| **La Niña de la Casa** | Memoria recurrente | Aparece en 4 Memorias; su historia se completa solo si se conservan todas. |

---

## 10. Dirección de arte

- **Estilo:** 2D ilustrado, siluetas planas con capas de profundidad y luces volumétricas falsas. Paleta reducida: negro azulado, ámbar y ceniza.
- **La llama es el único color saturado de la pantalla.** Todo lo demás es desaturado; cuando el jugador se apaga, el mundo pierde también su último color.
- **Animación:** 12 fps para el personaje (sensación de dibujo), 60 fps para partículas y luz.
- **Cámara:** lateral 2.5D con parallax de 4 capas; zoom suave que se abre en zonas amplias y se cierra en pasillos.
- **Paleta por capítulo:**

| Capítulo | Fondo | Acento | Luz |
|---|---|---|---|
| Bosque | `#0B1418` | `#E8A33D` | Ámbar cálido |
| Ciudad | `#0A1A22` | `#4FB3A8` | Verde azulado |
| Desierto | `#1A1410` | `#D96C3B` | Naranja polvoriento |
| Catedral | `#0D1220` | `#9BB7D4` | Azul frío |
| Primer Fuego | `#120A08` | `#FFD27A` | Blanco dorado |

- **Interfaz diegética:** no hay barras flotantes. El estado se lee en la llama, en el sonido y en la postura del personaje.

---

## 11. Diseño de audio

- **Música:** cuarteto de cuerdas + piano preparado + coro sin palabras. Tema principal de 3 notas que se transforma según el Calor.
- **Capas dinámicas:** a más Calor, más instrumentos; en estado Brasa queda solo un drone y el latido.
- **SFX clave:**
  - Llama: crepitar continuo, con filtro pasa-altos según tamaño.
  - Chispa: "tick" agudo + silbido.
  - Viento: ruido rosa con ráfagas y silbido direccional.
  - Apagado: inversión de un acorde + silencio de 0,5 s.
- **Silencio intencional:** 3 segundos de silencio total al perder la última Memoria de una zona. Es el sonido más importante del juego.
- **Mezcla:** la música baja 4 dB cuando hay viento fuerte para que el jugador escuche la amenaza.

---

## 12. Interfaz y experiencia de usuario

### 12.1 Pantallas

1. **Menú principal:** logo, "Continuar", "Nueva partida", "Opciones", "Salir". Fondo: la llama respirando.
2. **Pausa:** reanudar, opciones, "Volver a la hoguera" (con confirmación).
3. **Hoguera:** guardar, alimentar, ver Memorias conservadas, mapa dibujado a mano.
4. **Epílogo:** texto breve + estadística final (Memorias conservadas / quemadas / tiempo).
5. **Créditos:** secuencia animada con la llama apagándose y volviendo a encender.

### 12.2 Onboarding (primeros 90 segundos)

- El jugador despierta en una fogata.
- Movimiento y salto se enseñan con geometría, sin texto.
- La primera astilla está a 4 m; al recogerla aparece un ícono diegético de "alimentar".
- El primer viento llega a los 60 s, con refugio visible.
- La primera Memoria aparece a los 3 minutos, con una elección clara y consecuencias visibles.

### 12.3 Accesibilidad

| Opción | Implementación |
|---|---|
| Dificultad asistida | Drenaje de Calor −50 %, enemigos más lentos |
| Modo "luz estable" | El radio de luz no baja nunca de 4 m |
| Sin vibración / sin flashes | Opciones independientes |
| Subtítulos y textos grandes | Sí, incluidos los susurros ambientales |
| Remapeo completo | Teclado, mouse y gamepad |
| Alto contraste | Contorno de peligros y plataformas |
| Pausa activa | El juego se pausa al abrir el menú |
| Sin pérdida por tiempo | Nada se pierde por inactividad |

---

## 13. Diseño técnico

### 13.1 Arquitectura propuesta (Godot 4)

```
res://
├── scenes/
│   ├── world/          # niveles, props, hogueras
│   ├── actors/         # player, enemigos, NPCs
│   └── ui/             # menús, hoguera, epílogo
├── systems/
│   ├── HeatSystem.gd   # recurso central, señales de estado
│   ├── WindSystem.gd   # vector global + zonas de ráfaga
│   ├── LightSystem.gd  # luces 2D, antorchas, detección
│   ├── MemorySystem.gd # memorias, flags persistentes
│   └── SaveSystem.gd   # JSON + slots
├── data/
│   ├── fuel.tres       # recursos de combustible
│   ├── memories.tres   # definición de memorias
│   └── tuning.tres     # valores ajustables
└── art/ audio/ fonts/
```

- **HeatSystem** es la única fuente de verdad del Calor. Emite señales (`heat_changed`, `state_changed`, `extinguished`) que consumen la UI, el audio y la iluminación. Ningún otro sistema modifica el Calor directamente.
- **Detección de enemigos** por radio de calor, no por línea de visión: usa `Area2D` + multiplicador según estado de la llama.
- **Guardado:** al encender una hoguera; serializa posición, Calor, inventario, memorias conservadas/quemadas, antorchas encendidas y flags de nivel. Sin guardado automático en medio de una zona de peligro.
- **Rendimiento objetivo:** 60 fps en PC con GPU integrada; 1080p; menos de 60 draw calls por escena.
- **Iluminación:** `Light2D` con máscaras y "falsos volúmenes" por sprites aditivos; sin sombras dinámicas costosas.
- **Plataforma web:** build WebGL con texturas comprimidas y audio en `.ogg`; límite de 150 MB.

### 13.2 Riesgos técnicos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Luces 2D costosas en escenas grandes | FPS inestable | Limitar luces activas a 8 por pantalla; culling |
| Física de viento poco legible | Mala experiencia | Prototipo temprano con partículas y audio |
| Pérdida de datos de Memorias | Rompe la narrativa | Tests de guardado y versión de save |
| Build web pesado | No carga en itch.io | Presupuesto de assets y compresión |

---

## 14. Producción

### 14.1 Equipo mínimo

| Rol | Dedicación | Responsabilidad |
|---|---|---|
| Diseñador/a de juego | 100 % | Sistemas, niveles, tuning, GDD |
| Programador/a | 100 % | Núcleo, física, guardado, herramientas |
| Artista 2D | 100 % | Personajes, escenarios, luces, UI |
| Diseñador/a de sonido | 50 % | Música, SFX, mezcla |
| QA / productor | 25 % | Tests, planificación, builds |

### 14.2 Cronograma (12 semanas)

| Semana | Hito | Entregable |
|---|---|---|
| 1 | Preproducción | GDD v1, referencias, prototipo de llama |
| 2–3 | Prototipo | Movimiento, Calor, viento, una sala jugable |
| 4–5 | Vertical slice | Capítulo 1 completo con arte y audio provisionales |
| 6 | **Revisión de slice** | Test con 5 personas, ajustes de tuning |
| 7–9 | Producción | Capítulos 2, 3 y 4; sistemas de Memorias y enemigos |
| 10 | Contenido completo | Capítulo 5, finales, epílogo |
| 11 | Pulido | Accesibilidad, optimización, balance, localización ES/EN |
| 12 | **Release** | Build final, tráiler, página de itch.io/Steam |

### 14.3 Alcance (scope) explícito

**Incluido:** 5 capítulos, 12 Memorias, 3 finales, 4 tipos de enemigo, 12–15 mejoras, opciones de accesibilidad, español e inglés.

**Fuera de alcance (v1):** multijugador, editor de niveles, modo foto, voces, nuevos game+, versión consola.

---

## 15. Riesgos del proyecto

| Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|
| Scope creep narrativo | Alta | Alto | 12 Memorias cerradas; cualquier idea nueva va a "post-lanzamiento" |
| La mecánica de Calor no se entiende | Media | Alto | Onboarding sin texto + test semanal |
| Arte 2D más lento de lo previsto | Media | Medio | Estilo de siluetas reutilizable; assets modulares |
| Falta de tiempo en el módulo | Media | Alto | Priorizar vertical slice sobre contenido total |
| Audio dependiente de un solo proveedor | Baja | Medio | Biblioteca de SFX con licencia desde la semana 1 |

---

## 16. Métricas y criterios de aceptación

### 16.1 Métricas de playtest

| Métrica | Objetivo |
|---|---|
| Comprensión de la mecánica de Calor sin explicación | 80 % de testers en 3 min |
| Tiempo medio por zona | 6–10 min |
| Muertes por zona (promedio) | ≤ 2 |
| Uso de Memorias como combustible | 30–60 % de los testers |
| Final más elegido | Distribución equilibrada entre los 3 |
| Abandono en el capítulo 1 | < 15 % |

### 16.2 Criterios de "vertical slice terminado"

- [ ] El jugador puede recorrer el capítulo 1 de principio a fin.
- [ ] Calor, viento, chispas y antorchas funcionan y se sienten legibles.
- [ ] Una Memoria con consecuencia real (mejora vs. combustible).
- [ ] Guardado y carga estables.
- [ ] Arte final en al menos 3 salas; audio integrado.
- [ ] 5 testers externos completaron la sesión sin ayuda.

---

## 17. Monetización y distribución

- **Precio:** USD 9,99 en Steam; demo gratuita en itch.io.
- **Sin microtransacciones, sin pases de batalla, sin publicidad.**
- **Demo:** capítulo 1 completo (25 min) con final abierto que invita a continuar.
- **Localización:** español (es-AR) e inglés; textos externalizados en CSV.
- **Comunidad:** devlog quincenal y build de playtest cerrada.

---

## 18. Post-lanzamiento (ideas, no comprometidas)

- **Modo "Fósforo":** sin hogueras, una sola vida, Calor máximo 50.
- **Galería de Memorias:** las conservadas se pueden revisar; las quemadas quedan como siluetas.
- **Nuevo capítulo:** "El Faro", precuela del Farero.
- **Photo mode** con la llama como fuente de luz.

---

## 19. Glosario

| Término | Definición |
|---|---|
| **Calor** | Recurso central (0–100). Salud, luz y munición. |
| **Brasa** | Estado de Calor bajo (1–25). |
| **Avivar** | Habilidad que consume Calor para aumentar luz y empujar enemigos. |
| **Chispa** | Proyectil que enciende antorchas y distrae. |
| **Apagado** | Criatura que detecta calor y persigue al jugador. |
| **Memoria** | Objeto narrativo que otorga una mejora si se conserva o +100 Calor si se quema. |
| **Hoguera** | Punto de guardado y recarga. |
| **Vertical slice** | Versión jugable y pulida de una porción representativa del juego. |

---

## 20. Anexo: una página de pitch

> **Brasa** es un plataformas 2D donde sos la última llama de un mundo apagado.
> Tu vida, tu luz y tu única arma son el mismo recurso: el calor.
> Cada paso hacia adelante te consume; cada recuerdo que encontrás puede salvarte la vida o borrar quién fuiste.
> Tres horas, cinco mundos, doce memorias y una pregunta: **¿cuánto del pasado estás dispuesto a quemar para seguir encendido?**

---

*Documento vivo. Versión 1.0 — Módulo 7, Desarrollo Tecnológico 2.*
