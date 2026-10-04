# Loose Cannon Cafe (React + Vite)

Proyecto web de **Loose Cannon Cafe** empaquetado como aplicación React moderna con Vite, listo para subir a GitHub y desplegar en Vercel.

## Cambios aplicados

- Se migró el archivo fuente único a un proyecto React con módulos ES.
- Se **eliminó la sección de fotos** de café/desayuno (`photo-section`) y su CSS asociado.
- Se conservó el logo original del café en ambos usos visuales (hero y sección ritual), ahora servido localmente desde `public/logo.png`.
- Se añadieron Google Fonts para preservar el diseño original:
  - Inter (400, 500, 600, 800)
  - Fraunces (400, 500)

## Requisitos

- Node.js 18+ recomendado
- npm 9+

## Ejecutar en local

```bash
npm install
npm run dev
```

Luego abre la URL local que muestre Vite (por defecto suele ser `http://localhost:5173`).

## Build de producción

```bash
npm run build
npm run preview
```

El resultado de producción queda en `dist/`.

## Subir a GitHub

1. Crea un repositorio nuevo en GitHub.
2. En este proyecto, configura el remoto y sube:

```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git branch -M main
git push -u origin main
```

## Desplegar en Vercel

1. Entra a Vercel y elige **Add New Project**.
2. Importa el repositorio de GitHub.
3. Vercel detecta automáticamente **Vite**.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Deploy.

No requiere configuración adicional para este proyecto.

## Nota importante

A petición del usuario, se retiraron por completo las fotos de inspiración de café y desayuno (incluyendo su HTML y CSS), manteniendo el resto del diseño y comportamiento original del sitio.
