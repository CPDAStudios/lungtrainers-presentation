# LungTrainers — Medical Opportunity

Presentación web ejecutiva preparada por CPDA Studios.

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
