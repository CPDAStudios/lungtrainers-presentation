# LungTrainers — Presentación estratégica inicial

Presentación web ejecutiva preparada por CPDA Studios. La portada permite elegir entre dos rutas independientes:

- sistemas médicos institucionales, centrados en los modelos MD2 y MD3;
- venta directa, centrada en los asistentes individuales para respiración y su sistema de reposición.

## Desarrollo local

El sitio es estático y no requiere compilación. Puede abrirse con cualquier servidor HTTP local:

```powershell
python -m http.server 8080
```

La página principal estará disponible en `http://localhost:8080/`.

## Publicación

Destino: `https://cpdastudios.com/lungtrainers/`.

Este checkout usa un hook local `post-commit`: cada commit realizado en la rama conectada se envía automáticamente a GitHub. La configuración local se activa con:

```powershell
git config core.hooksPath .githooks
```

Las imágenes bajo `assets/official/` provienen de la página pública de LungTrainers y se usan para presentar sus propios productos al cliente. No deben reutilizarse para terceros sin autorización del titular.
