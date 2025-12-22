# Simulador de Examen

Un simulador de examen final completamente frontend, construido con React, TypeScript, Vite y TailwindCSS.

## 🚀 Características

- ✅ Rejilla interactiva de preguntas con colores según estado
- ✅ Modal de pregunta con navegación (anterior/siguiente)
- ✅ Feedback inmediato al responder
- ✅ Estadísticas en tiempo real
- ✅ Carga de preguntas desde PDF
- ✅ Persistencia en LocalStorage
- ✅ Diseño responsivo
- ✅ Animaciones suaves

## 📋 Requisitos

- Node.js 18+ 
- npm o yarn

## 🛠️ Instalación local

```bash
# Clonar el repositorio
git clone <tu-repositorio>
cd exam-simulator

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:8080`

## 📝 Cambiar el JSON de preguntas

Las preguntas precargadas están en `src/data/sampleQuestions.ts`.

### Formato del JSON:

```typescript
[
  {
    "id": 1,
    "text": "Texto de la pregunta...",
    "options": [
      { "id": "A", "text": "Opción A" },
      { "id": "B", "text": "Opción B" },
      { "id": "C", "text": "Opción C" },
      { "id": "D", "text": "Opción D" }
    ],
    "correctOptionId": "C"
  }
]
```

Simplemente reemplaza el array `sampleQuestions` con tus propias preguntas.

## 📄 Cargar preguntas desde PDF

1. Abre el menú de configuración (botón ☰ en la esquina superior derecha)
2. Haz clic en el área de carga o arrastra un archivo PDF
3. Presiona "Procesar PDF"
4. Confirma si deseas reemplazar las preguntas existentes

### Formato de PDF recomendado:

El parser busca patrones como:
- `1. Pregunta...` o `1) Pregunta...`
- `A. Opción` o `A) Opción`
- Respuestas marcadas con `*`, `✓`, o texto explícito como `Respuesta: B`

## 🌐 Deploy en GitHub Pages

### Configuración:

1. Edita `vite.config.ts` y agrega la base URL:

```typescript
export default defineConfig({
  base: '/nombre-de-tu-repo/',
  // ... resto de la configuración
})
```

2. Construye el proyecto:

```bash
npm run build
```

3. Los archivos estarán en la carpeta `dist/`

### Deploy automático con GitHub Actions:

Crea el archivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

4. En tu repositorio, ve a Settings → Pages → Source y selecciona la rama `gh-pages`

## 🎨 Personalización

### Colores

Edita `src/index.css` para cambiar los colores del tema:

```css
:root {
  --primary: 234 89% 55%;      /* Color principal */
  --success: 142 71% 45%;      /* Respuesta correcta */
  --destructive: 0 84% 60%;    /* Respuesta incorrecta */
  --unanswered: 220 13% 91%;   /* Sin responder */
}
```

## 📱 Responsive

La aplicación está optimizada para:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Laptops (1024px+)
- 🖥️ Monitores grandes (1280px+)

## 🔧 Tecnologías

- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/) (Estado global)
- [pdfjs-dist](https://mozilla.github.io/pdf.js/) (Lectura de PDFs)
- [shadcn/ui](https://ui.shadcn.com/) (Componentes UI)

## 📄 Licencia

MIT
