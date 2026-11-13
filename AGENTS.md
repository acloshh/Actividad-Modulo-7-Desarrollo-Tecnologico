# AGENTS.md — Brasa

Instrucciones para agentes de IA que trabajen en este repositorio. Se aplican al inicio de cada
consulta y antes de modificar el proyecto. Los comandos, la arquitectura, la edición de niveles y
el Definition of Done están en `README.md` y `docs/GDD.md`.

## 1. Alcance y contexto

- Brasa — El último fuego es un plataformas 2D de 3 niveles (10–15 minutos) hecho con JavaScript,
  Vite y Phaser 3.90.
- Responder en español y adaptar la profundidad del análisis a la complejidad de la solicitud.
- Documentación vigente:
  - `docs/GDD.md`: documento principal de requisitos y reglas del juego.
  - `docs/GDD.pdf`: versión PDF del GDD; al citarla, indicar la página y aclarar si la numeración
    del archivo difiere de la impresa.
  - `docs/PLAN.md`: plan de implementación.
  - `docs/EVIDENCIAS_OPENCODE.md`: prompts, pruebas, errores y soluciones.
  - `README.md`: uso, comandos, controles y estructura.
  - `docs/capturas/`: capturas de referencia de la interfaz.
- Revisar la información vigente en esos archivos; no depender de resúmenes de conversaciones
  anteriores.
- Preservar el trabajo existente del usuario: revisar antes de borrar o sobrescribir y consultar
  cuando haya duda.

## 2. Revisar la documentación y el requisito

Antes de proponer o implementar una solución:

1. Identificar el requisito y su comportamiento esperado.
2. Revisar `docs/` y las secciones pertinentes del GDD: §4 Mecánicas, §5 Niveles, §6 Puntaje,
   §7 Controles, §8 Presentación, §9 Alcance, §10 Arquitectura técnica y §11 Criterios de
   aceptación.
3. Clasificar el requisito como:
   - **Definido:** la documentación describe suficientemente el comportamiento.
   - **Parcialmente definido:** está contemplado, pero faltan detalles necesarios.
   - **No definido:** no aparece en la documentación revisada.
   - **En contradicción:** la solicitud difiere de una regla documentada.
   - **No aplica:** consulta técnica o documental sin una regla funcional asociada.
4. Citar el documento y la sección que respaldan el análisis. En Markdown, indicar el título o
   número del apartado; en PDF, la página.
5. Diferenciar las reglas documentadas de las propuestas y los supuestos.

Si la documentación no existe o no puede leerse, indicarlo claramente y no afirmar que el
requisito está definido o ausente.

Un requisito no documentado puede ser una ampliación válida: identificarlo como tal y consultar
las decisiones necesarias. No modificar la documentación de requisitos para justificar una
implementación sin una solicitud explícita del usuario.

## 3. Analizar conflictos e impacto

Antes de modificar una funcionalidad:

- Revisar tanto las reglas documentadas como la implementación existente.
- Identificar dependencias, restricciones compartidas, excepciones, prioridades entre
  comportamientos y posibles regresiones.
- Comparar el comportamiento actual con la documentación; no asumir que el código existente es
  correcto.
- Detectar contradicciones internas de la documentación, incluidas diferencias entre texto,
  diagramas y capturas.
- Comunicar los conflictos relevantes antes de modificar la parte afectada.

En este videojuego, considerar cuando corresponda:

- El Calor como recurso único (vida, luz y munición), su gasto y su recuperación.
- Los estados del jugador y del Apagado, y sus transiciones.
- Movimiento, salto, dash, colisiones y límites del escenario.
- Alcanzabilidad de plataformas y separación vertical entre ellas.
- Recogida y quema de recuerdos, activación de antorchas y consumo en la puerta.
- Viento, agua y demás peligros ambientales.
- Navegación de escenas, pausa, victoria, derrota, reinicio y guardas de transición.
- Actualización del HUD por eventos y persistencia del mejor puntaje.
- Controles de teclado y mouse.

## 4. Preguntar antes de avanzar ante dudas

Cuando una duda afecte el alcance, las reglas, el comportamiento, la compatibilidad o la
implementación:

- Usar la herramienta de preguntas al usuario disponible en el entorno, por ejemplo `question`.
- Formular preguntas concretas.
- Explicar qué decisión falta y por qué importa.
- Ofrecer opciones cuando faciliten la decisión.
- Incluir una recomendación fundamentada cuando corresponda.
- Esperar la respuesta antes de adoptar una decisión que cambie el comportamiento solicitado.
- No inventar reglas para resolver omisiones o contradicciones.
- Continuar con tareas independientes cuyo alcance esté claro.

Si la herramienta de preguntas no está disponible, preguntar directamente en la conversación y
esperar la aclaración necesaria.

## 5. Utilizar POO y patrones de diseño

- Modelar las entidades y comportamientos del dominio mediante programación orientada a objetos,
  respetando JavaScript, Phaser 3.90, Vite y la arquitectura de `src/`.
- Encapsular el estado y las reglas.
- Mantener responsabilidades claras, alta cohesión y bajo acoplamiento.
- Favorecer composición cuando evite jerarquías de herencia innecesarias.
- Separar la lógica de juego de la presentación y de la entrada del usuario.
- Utilizar patrones de diseño cuando resuelvan una necesidad concreta:
  - **State** para los estados del jugador y del Apagado.
  - **Object Pool** para reutilizar chispas.
  - **Observer** para que el HUD escuche eventos sin consultar el estado interno del juego.
- Explicar brevemente la elección y utilidad de los patrones aplicados.
- Evitar abstracciones innecesarias y refactorizaciones ajenas al requisito.

## 6. Reutilizar código existente

Antes de crear clases, componentes, servicios o utilidades:

1. Buscar implementaciones relacionadas en `src/entities/`, `src/systems/`, `src/patterns/` y
   `src/scenes/`.
2. Revisar sus contratos, comportamiento y consumidores.
3. Priorizar su reutilización o extensión cuando sean compatibles.
4. Evitar duplicar lógica de negocio, en particular la del Calor, el puntaje y las transiciones.
5. Extraer lógica común cuando exista una necesidad real, preservando el comportamiento de sus
   consumidores.
6. Respetar las convenciones de estructura, nombres y estilo del proyecto.

Si no existe código reutilizable, indicarlo y diseñar una solución coherente con el proyecto.
Repetir esta revisión en cada tarea; no asumir que la estructura permanece igual entre consultas.

## 7. Consultar sobre sprites y recursos gráficos

El GDD establece que las texturas y el audio se generan por código (§8) y que los assets externos
están fuera de alcance (§9). Cuando una tarea requiera imágenes, sprites, animaciones o audio:

1. Revisar los recursos disponibles y sus convenciones de uso en `src/scenes/BootScene.js`,
   `src/systems/AudioSystem.js` y `src/assets/README.md`.
2. Usar la herramienta de preguntas antes de implementar la parte visual para confirmar si se
   desea:
   - **Generar un mockup:** una representación provisional, en este proyecto preferentemente
     procedural, para desarrollar y validar la funcionalidad.
   - **Utilizar un recurso existente:** solicitar el nombre exacto del recurso y su ruta.
3. Si el recurso indicado no puede localizarse, pedir su ruta o el archivo correspondiente.

Además:

- No asumir qué recurso utilizar ni inventar nombres o rutas.
- Si se elige un mockup, aclarar que es provisional y confirmar el alcance visual necesario.
- Si se elige un recurso existente, comprobar su disponibilidad y compatibilidad con el uso
  previsto, y verificar que no contradiga la regla de assets generados por código.
- Consultar detalles como spritesheet, fotogramas o animaciones cuando sean necesarios y no estén
  documentados.
- Si falta el archivo, solicitarlo antes de avanzar con la parte que depende de él.
- Continuar con la lógica independiente de los recursos gráficos mientras se resuelve la consulta.

## 8. Definir y preparar el flujo Git

Antes de implementar:

- Comprobar que el proyecto utiliza Git. El repositorio tiene remoto `origin` y rama base `main`.
- Revisar el estado del repositorio, la rama actual, los remotos y la estrategia documentada.
- No asumir que existe `develop` ni imponer GitFlow completo sin acordarlo.
- Si no hay una estrategia definida, consultar la rama base, la convención de nombres y el remoto.

Crear una rama de trabajo antes de modificar el código, con un nombre descriptivo:

- `feature/<descripcion>`
- `fix/<descripcion>`
- `docs/<descripcion>`
- `refactor/<descripcion>`
- `test/<descripcion>`
- `chore/<descripcion>`

Si ya existe una rama apropiada para la tarea, verificar si corresponde continuar en ella.
No implementar directamente sobre `main` (ni sobre `master` o `develop` si existieran).

Si existen cambios previos del usuario:

- Preservarlos.
- Identificar si interfieren con la tarea.
- Consultar antes de realizar operaciones que puedan moverlos, descartarlos o mezclarlos con
  otros cambios.

Si el proyecto no tiene repositorio Git o remoto configurado, informar la situación y consultar
antes de inicializarlo o configurarlo.

## 9. Implementar y verificar

- Definir criterios de aceptación a partir del requisito, la documentación y las aclaraciones del
  usuario.
- Realizar cambios enfocados en el alcance acordado.
- Ejecutar las comprobaciones disponibles y pertinentes al cambio:
  - `npm run build` después de cada cambio relevante.
  - `npm run preview` para probar el flujo afectado, no solo el servidor de desarrollo.
  - `npm run generate:pdf` si se modificó `docs/GDD.md`, y revisar el PDF generado.
- Verificar las interacciones identificadas durante el análisis de impacto: Calor, controles,
  colisiones, enemigos, viento, peligros, transiciones, pausa, victoria, derrota, reinicio y
  persistencia del mejor puntaje.
- Mantener las invariantes del proyecto: el Calor como única fuente de verdad, los niveles como
  datos, el HUD por eventos, los assets generados por código y el reinicio limpio de listeners,
  tweens y partículas.
- Agregar pruebas cuando aporten valor para validar reglas o prevenir regresiones.
- Evitar pruebas que solo repliquen la implementación.
- Informar qué se verificó y qué quedó pendiente.
- No afirmar resultados que no fueron comprobados.

## 10. Solicitar confirmación y realizar commit y push

Cuando termine la implementación:

1. Presentar al usuario:
   - Resumen del comportamiento implementado.
   - Archivos afectados.
   - Verificaciones realizadas y sus resultados.
   - Pendientes o limitaciones reales.
   - Rama de trabajo utilizada.
2. Usar la herramienta de preguntas para solicitar:
   - Confirmación de que la implementación es aceptada.
   - Autorización explícita para realizar commit y push.
3. Esperar la respuesta.
4. Si el usuario solicita ajustes:
   - Realizarlos.
   - Repetir las verificaciones afectadas.
   - Volver a solicitar confirmación.

Después de recibir autorización:

1. Revisar `git status`, `git diff` y `git log --oneline -10`.
2. Revisar los archivos nuevos que se incluirán.
3. Preparar únicamente los cambios correspondientes a la tarea, sin incluir cambios ajenos,
   artefactos ignorados ni secretos.
4. Crear un commit descriptivo, coherente con el historial del repositorio (`feat:`, `fix:`,
   `docs:`, `test:`, `chore:`).
5. Realizar push de la rama al remoto acordado, configurando su seguimiento cuando corresponda.
6. Informar:
   - Nombre de la rama.
   - Identificador y mensaje del commit.
   - Resultado del push.

No realizar commit ni push sin autorización explícita del usuario.
No hacer force push, omitir hooks, modificar la configuración de Git ni fusionar ramas sin una
solicitud expresa.

Si un hook o comprobación falla, resolver el problema antes de continuar. Si commit o push falla,
informar el resultado sin afirmar que la operación se completó.

La creación de un pull request y la integración en la rama base requieren autorización adicional.

## 11. Comunicar el análisis y los resultados

Antes de implementar, presentar un análisis breve con los puntos pertinentes:

### Análisis previo

- **Requisito:** comportamiento solicitado.
- **Documentación:** estado y referencias.
- **Conflictos e impacto:** funcionalidades y reglas afectadas.
- **Reutilización:** código existente aprovechable.
- **Diseño:** enfoque POO y patrones pertinentes.
- **Recursos gráficos:** recursos confirmados o consulta pendiente.
- **Git:** rama base y rama de trabajo.
- **Dudas:** decisiones que requieren respuesta del usuario.

Para consultas simples, reducir el formato a los puntos aplicables.

Al finalizar, resumir:

- Cambios y archivos afectados.
- Decisiones relevantes.
- Verificaciones ejecutadas.
- Pendientes reales.
- Confirmación solicitada al usuario.
- Resultado de commit y push, únicamente si fueron autorizados y ejecutados.

No presentar propuestas como funcionalidades implementadas.

## Flujo de trabajo esperado

revisar documentación → analizar impacto → aclarar dudas →
confirmar recursos gráficos cuando corresponda → definir y crear rama →
diseñar y reutilizar → implementar → verificar →
solicitar confirmación → commit → push
