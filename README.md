# The Legend of Comira

## Estado del proyecto

**The Legend of Comira** es un prototipo de juego web ambientado en **Pornalia**, con **Cova** como personaje jugable. El proyecto fue desplegado en Vercel directamente desde archivos locales del entorno de trabajo de ChatGPT; **no se utilizó un repositorio de GitHub como origen del despliegue inicial**.

### Producción actual en Vercel

- Proyecto Vercel: `the-legend-of-comira`
- Project ID: `prj_Yvz8FfMCrwZAT0fqJWEo8J2RnG8y`
- Framework detectado por Vercel: **Vite**
- Node.js configurado por Vercel: **24.x**
- Dominio principal: `https://the-legend-of-comira.vercel.app`
- Último deployment verificado: `dpl_Hwq9psconke2RGTTnjfAKMFhNUwE`
- Estado del último deployment verificado: **READY / production**

## Fuente real del código y flujo de despliegue

El flujo usado originalmente fue:

```text
Archivos locales del entorno de ChatGPT
        ↓
Herramienta de despliegue de Vercel
        ↓
Proyecto Vercel: the-legend-of-comira
        ↓
https://the-legend-of-comira.vercel.app
```

No fue:

```text
GitHub → Vercel
```

Esto explica por qué el juego puede estar publicado en Vercel aunque no existiera inicialmente un repositorio remoto de GitHub que lo contuviera.

### Importante sobre el workspace local actual

En el estado local disponible al momento de crear este README, la carpeta contiene:

```text
the-legend-of-comira/
├── index.html
└── README.md
```

El `index.html` actual contiene:

```html
<div id="root"></div><script type="module" src="/src.jsx"></script>
```

Eso significa que el HTML espera un archivo `src.jsx`, pero **ese archivo no está presente en el snapshot local actual**. Por tanto, el workspace local que hoy podemos inspeccionar está **incompleto respecto del código que produjo el deployment publicado**.

Es probable que otros archivos (por ejemplo `src.jsx`, estilos y/o configuración de Vite) existieran en el estado temporal usado durante el despliegue y no hayan quedado conservados en la carpeta local actual. No se debe afirmar que esos archivos están disponibles hasta recuperarlos o reconstruirlos.

## Stack tecnológico

Stack confirmado o fuertemente respaldado por la metadata actual:

- **Frontend:** aplicación web JavaScript
- **Bundler / dev framework:** **Vite**
- **Entrada HTML:** `index.html`
- **Entrada de aplicación esperada:** `/src.jsx`
- **Runtime de build en Vercel:** **Node.js 24.x**
- **Hosting / deployment:** **Vercel**
- **Control de versiones remoto:** **GitHub, repositorio recién creado**
- **Repositorio GitHub:** `altairrojas/the-legend-of-comira`

La extensión `.jsx` sugiere que la aplicación estaba usando JSX y posiblemente React, pero **React no puede declararse como confirmado mientras no recuperemos `src.jsx` o `package.json`**.

## State trace — cambios y decisiones realizados

### 1. Concepto del juego

- Nombre establecido: **The Legend of Comira**.
- Zona principal trabajada: **Pornalia**.
- Personaje jugable: **Cova**.
- Cova no habla.
- Comira aparece en recuerdos después de que Cova la pierde en una parte de la historia.
- Pornalia se definió como un pueblo de fantasía propio, inspirado en la sensación de una aldea tranquila de aventura, pero sin copiar una localización existente.

### 2. Prototipo jugable inicial

Se creó una primera versión web jugable con:

- Escena básica de Pornalia.
- Representación provisional de Cova.
- Movimiento del personaje.
- Cámara con cambio/giro de vista.

La primera representación de Cova era demasiado simple y no coincidía con el diseño de referencia final.

### 3. Primer despliegue en Vercel

Se desplegó el proyecto directamente desde el entorno local de ChatGPT hacia Vercel.

Deployment inicial registrado:

- Deployment ID: `dpl_4VdPjVEtMVkZxXxiaTxi9sew4eMp`
- Estado final: `READY`
- Target: `production`

Vercel creó el proyecto `the-legend-of-comira` y asignó el dominio `https://the-legend-of-comira.vercel.app`.

### 4. Controles táctiles

Después se detectó que el usuario estaba jugando desde iPad y que controles tipo WASD no eran adecuados.

Se preparó / desplegó una versión posterior orientada a controles táctiles. El deployment más reciente que se pudo verificar es:

- Deployment ID: `dpl_Hwq9psconke2RGTTnjfAKMFhNUwE`
- Estado: `READY`
- Target: `production`

La intención funcional de esta revisión fue incorporar controles en pantalla para movimiento y cámara.

### 5. Problemas visuales detectados

El usuario señaló correctamente que:

- Cova se veía como una forma demasiado simple, casi sin patas.
- La apariencia del personaje no coincidía con la referencia artística.
- Pornalia se veía demasiado vacío y básico frente al diseño conceptual.
- Cova debía tener patas claramente visibles y animadas.

### 6. Diseño objetivo de Cova

El diseño que debe sustituir al placeholder actual incluye:

- Gato atigrado gris y blanco.
- Ojos dorados.
- Capa morada.
- Ropa de aventurero.
- Botas.
- Bolso / accesorios del diseño de referencia.
- Cola rayada.
- Cuatro patas visibles.
- Animación de caminar con patas alternadas.
- Movimiento secundario de cola deseable.

### 7. Estado de esos cambios visuales

**No están confirmados como publicados.**

Se intentó volver a desplegar una versión posterior, pero la herramienta de deployment disponible comenzó a exigir explícitamente los campos `name`, `files` y `target`, mientras que la interfaz del conector expuesta en ese momento no permitía suministrarlos correctamente. Por lo tanto, no se debe declarar que la versión con el nuevo Cova, patas animadas o el Pornalia rediseñado esté en producción.

### 8. Investigación y migración a GitHub

Se creó el repositorio remoto:

- `https://github.com/altairrojas/the-legend-of-comira`
- Rama por defecto: `main`
- Visibilidad: pública

El primer intento de escritura desde ChatGPT devolvió `403 Resource not accessible by integration` porque la aplicación de ChatGPT no estaba instalada en GitHub. Después de instalarla y reconectar GitHub, se volvió a probar la escritura.

## Estado actual resumido

| Área | Estado |
|---|---|
| Proyecto Vercel | ✅ Existe |
| Dominio público | ✅ Existe |
| Deployment producción | ✅ READY |
| Framework Vite | ✅ Confirmado por Vercel |
| Workspace local completo | ❌ No |
| `src.jsx` local actual | ❌ Falta |
| `package.json` local actual | ❌ Falta |
| Repositorio GitHub | ✅ Creado |
| Git como source of truth | 🟡 En migración |
| Cova con diseño final | ❌ No confirmado en producción |
| Patas animadas | ❌ No confirmado en producción |
| Pornalia detallado | ❌ Pendiente / no confirmado en producción |

## Objetivo de migración

Convertir el proyecto a esta arquitectura:

```text
GitHub (source of truth)
   ↓
Vercel conectado al repositorio
   ↓
Preview deployments por cambios / PR
   ↓
Production deployment desde main
```

## Plan para convertir el proyecto en un repositorio remoto de GitHub

### Fase A — Recuperar o reconstruir el código fuente

1. Conservar inmediatamente todo lo que todavía existe en `/mnt/data/the-legend-of-comira`.
2. Recuperar, si es posible, los archivos exactos del deployment publicado desde Vercel o del contexto local histórico.
3. Si no se pueden recuperar, reconstruir el proyecto de Vite desde cero usando el `index.html` restante, las referencias visuales existentes, el comportamiento observado en producción y los requisitos definidos en la conversación.
4. Recrear como mínimo `package.json`, `src.jsx` o estructura equivalente en `src/`, `style.css` o CSS equivalente, `.gitignore` y este `README.md`.
5. Ejecutar build local y comprobar que el proyecto funciona antes de migrarlo.

### Fase B — GitHub como source of truth

1. Subir todos los archivos reconstruidos / recuperados.
2. Usar `main` como rama estable.
3. Añadir commits claros para cambios posteriores.
4. Opcionalmente usar ramas y pull requests para cambios grandes del juego.

### Fase C — Conectar Vercel a GitHub

1. Conectar el proyecto existente de Vercel con este repositorio GitHub, evitando crear un segundo proyecto público innecesario.
2. Confirmar que Vercel usa Vite correctamente.
3. Configurar la rama de producción (`main`).
4. Crear un deployment de prueba.
5. Verificar que `the-legend-of-comira.vercel.app` siga apuntando a la versión correcta.

### Fase D — Continuar el juego con workflow seguro

A partir de ahí:

1. Cada cambio de código se hace en GitHub.
2. Vercel genera una preview.
3. Se prueba en iPad / móvil.
4. Cuando esté bien, se publica a producción.

Así nunca dependeremos de que un workspace temporal de ChatGPT conserve los archivos.

## Qué puede hacer ChatGPT por su cuenta

Con las herramientas actualmente disponibles, ChatGPT puede:

- Inspeccionar y editar archivos locales accesibles.
- Crear y mantener este README y otros archivos del proyecto.
- Reconstruir el código del juego localmente.
- Leer metadata, deployments y logs de Vercel.
- Desplegar a Vercel cuando el conector acepte correctamente el proyecto actual.
- Leer y escribir archivos dentro de este repositorio GitHub.
- Crear ramas, commits, árboles y pull requests mediante las APIs disponibles.
- Gestionar gran parte del ciclo de cambios una vez que GitHub sea la fuente de verdad.

## Próximo paso recomendado

1. Verificar que la escritura a GitHub funciona después de instalar la aplicación de ChatGPT.
2. Reconstruir el código fuente local completo.
3. Subirlo al repositorio.
4. Conectar Vercel a GitHub.
5. Continuar el rediseño de Cova y Pornalia sobre una base persistente y versionada.

---

Este README funciona también como registro técnico de recuperación del proyecto mientras migramos desde un workspace temporal a un flujo GitHub → Vercel reproducible.
