# 🏎️ HEAT Companion

"Companion App" para el juego de mesa **HEAT: Pedal to the Metal**. Diseñada para gestionar tus campeonatos, pilotos y resultados de forma rápida y sencilla.

![Licencia](https://img.shields.io/badge/license-MIT-green)

## ⚠️ **Importante: Almacenamiento Local de Datos**

**TODA la información que añadas a esta aplicación web se almacena EXCLUSIVAMENTE en tu propio navegador (localStorage).**

- 📍 **Sin servidores externos**: No existe ninguna persistencia ni registro de datos en servidores
- 🔒 **Privacidad total**: Tus datos nunca salen de tu dispositivo
- 💾 **Almacenamiento local**: La información permanece solo en el navegador donde la creaste

---

## ✨ Características principales

### 🏆 Gestión de campeonatos

- **Calendario**: Añade y edita carreras sobre la marcha.
- **Plantillas Históricas**: Carga configuraciones oficiales de campeonatos históricos (1961, 1962, 1963, etc.) con sus reglas y setups específicos.
- **Sistema de puntuación**: Soporte para sistemas F1 moderno, clásico, simple o totalmente personalizado.

### 👤 Perfiles de pilotos

- **Personalización**: Elige nombre, color y número para cada piloto.
- **Sistema de Mejoras**: Gestiona cartas de mejora técnica por piloto.
- **Patrocinios**: Gestiona cartas de patrocinio por piloto.

### 📊 Seguimiento de resultados

- **Registro rápido**: Introduce posiciones en segundos.
- **Clasificación automática**: Cálculo instantáneo de puntos, victorias, podios y diferencias (Gap).
- **Detalle de carreras**: Consulta el podio y las condiciones de cada carrera ya finalizada.

### 🌓 Experiencia de usuario

- **Modo claro y oscuro**: Alterna entre temas según la iluminación de tu mesa de juego.
- **Diseño responsive**: Optimizado para móviles y tablets para usarlo durante la partida.
- **Persistencia local**: Tus datos se guardan automáticamente en el navegador.
- **Importación/Exportación**: Exporta tus campeonatos a JSON para compartirlos o hacer copias de seguridad.

## 🛠️ Tecnologías

- **HTML5 & CSS3**: Diseño salchichero con html y css del barato.
- **Vanilla JavaScript**: Lógica ligera sin dependencias externas.
- **Local Storage**: Almacenamiento persistente en el navegador.

## 📁 Estructura del proyecto

```
hpttm/
├── index.html          # Página principal de la aplicación
├── app.js              # Lógica principal de la aplicación
├── style.css           # Estilos CSS
├── data/               # Datos del juego organizados
│   ├── circuits.js     # Definiciones de circuitos
│   ├── weather.js      # Efectos de clima (preparación y pista)
│   ├── game-basics.js  # Mecánicas básicas (estrés, motor forzado)
│   ├── upgrades.js     # Cartas de mejora técnica
│   ├── sponsors.js     # Cartas de patrocinio
│   ├── points.js       # Sistemas de puntuación
│   └── championships.js # Plantillas de campeonatos históricos
├── test-data.html      # Script de validación de datos
└── README.md           # Este archivo
```

### 🗂️ Organización de datos

Los datos del juego están organizados en archivos separados dentro de la carpeta `data/` para facilitar el mantenimiento:

- **`circuits.js`**: Contiene todas las definiciones de circuitos con sus características
- **`weather.js`**: Efectos de clima separados en preparación y efectos de pista
- **`game-basics.js`**: Mecánicas fundamentales como estrés y motor forzado
- **`upgrades.js`**: Cartas de mejora técnica disponibles
- **`sponsors.js`**: Cartas de patrocinio
- **`points.js`**: Diferentes sistemas de puntuación (F1 moderno, clásico, etc.)
- **`championships.js`**: Plantillas de campeonatos históricos oficiales

Los datos se cargan como variables globales del navegador para máxima compatibilidad sin necesidad de herramientas de build.

## 📜 Créditos y disclaimer

Este es un proyecto fan-made y no está afiliado con Days of Wonder ni con los diseñadores originales de **HEAT: Pedal to the Metal**. Todos los derechos de las mecánicas y nombres del juego original pertenecen a sus respectivos propietarios.
