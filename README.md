# GeoCheck 📍

Aplicación móvil desarrollada con **React Native y Expo** para registrar ubicaciones GPS, consultar información del acelerómetro y capturar evidencias fotográficas.

## Funcionalidades

- **Inicio:** solicita permiso de ubicación, obtiene las coordenadas GPS y permite registrar ubicaciones.
- **Mis ubicaciones:** consulta las ubicaciones guardadas y permite eliminar registros individuales o todos los registros.
- **Evidencias:** permite tomar fotografías con la cámara y consultar o eliminar las evidencias guardadas.
- **Acelerómetro:** muestra los valores de los ejes X, Y y Z del sensor del dispositivo.
- **Almacenamiento local:** utiliza AsyncStorage para conservar los registros en el dispositivo.
- **Respuesta háptica:** utiliza vibración háptica para confirmar acciones compatibles con el dispositivo.

## Tecnologías utilizadas

- React Native
- Expo
- TypeScript
- Expo Router
- Expo Location
- Expo Sensors
- Expo Image Picker
- Expo Haptics
- AsyncStorage

## Requisitos

- Node.js y npm
- Un dispositivo Android o un emulador compatible

## Instalación y ejecución

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/Fabian1014/GeoCheck.git
   ```

2. Entrar a la carpeta:

   ```bash
   cd GeoCheck
   ```

3. Instalar las dependencias:

   ```bash
   npm install
   ```

4. Iniciar el proyecto:

   ```bash
   npx expo start
   ```

## Autor

Proyecto académico desarrollado por Fabian Viveros.

## Repositorio

https://github.com/Fabian1014/GeoCheck
