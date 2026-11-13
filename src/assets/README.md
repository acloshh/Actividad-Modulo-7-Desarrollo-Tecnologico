# Assets

Este proyecto **no usa archivos de imagen, audio ni fuentes externas**.

Todas las texturas se generan por código en `src/scenes/BootScene.js` usando
`CanvasTexture` y `Graphics.generateTexture()`:

- llamas, personaje, enemigos, astillas, recuerdos, antorchas y plataformas;
- fondos, partículas, gradientes de luz y texturas de UI.

Los sonidos se sintetizan en tiempo real con la Web Audio API desde
`src/systems/AudioSystem.js` (salto, recogida, daño, chispa, victoria, derrota).

Esta carpeta se mantiene para respetar la estructura pedida por la cátedra y
para documentar la decisión de no depender de assets binarios.
