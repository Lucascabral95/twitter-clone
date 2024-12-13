# Snapoo Blog

## Instalación

Instalar Twitter Clone con npm

```bash
  git clone https://github.com/Lucascabral95/twitter-clone.git
  cd twitter-clone
  npm install 
  npm run dev
```
 
## 🌟 Descripción

Un clon de Twitter diseñado como parte de mi portafolio de desarrollador web. Esta aplicación permite a los usuarios crear perfiles, publicar y compartir contenido, interactuar con publicaciones a través de comentarios, me gusta y reposts, y conectarse con otros mediante un sistema de seguidores y seguidos.

## ⚙️ Características Principales:

- **Publicaciones y Reposts**: Los usuarios pueden publicar posteos con texto y luego compartir contenido de otros usuarios mediante reposts. Cada post incluye una sección para interactuar con comentarios y "me gusta".
- **Almacenamiento de Datos en MongoDB**: Los datos de cada usuario, como su perfil, las fotos subidas y las interacciones (me gusta, reposts), se almacenan de manera persistente en MongoDB, asegurando que toda la información esté organizada y fácilmente accesible.
- **Sistema de Seguidores**:Los usuarios pueden seguir y dejar de seguir a otros, lo que les permite ver publicaciones exclusivas de las personas que siguen. Cada perfil muestra un apartado de seguidores y seguidos.
- **Perfiles de Usuario**: Cada usuario tiene un perfil personal que muestra sus publicaciones, reposts y detalles de su información personal, brindando una experiencia personalizada.
- **Interacción en Comentarios**: Además de los posteos, los usuarios pueden comentar en cada publicación y dar "me gusta" a los comentarios de otros, fomentando una interacción activa en la plataforma.
- **Autenticación Segura**: Implementada mediante cookies con JSON Web Tokens (JWT) utilizando jose. Esto garantiza un inicio de sesión confiable y seguro.
- **Estado Global con Zustand**: Gestión eficiente de estados dentro de la aplicación, asegurando fluidez en la experiencia del usuario.
- **Base de Datos Serverless**: Almacenamiento persistente y escalable con Neon Serverless PostgreSQL, ideal para manejar grandes cantidades de datos de usuarios y publicaciones.

## 📄 Conclusión:

- **Clon de Twitter**: Este proyecto refleja mis habilidades avanzadas en desarrollo web, combinando tecnologías modernas con una arquitectura en capas que garantiza un diseño escalable, modular y altamente mantenible. He aplicado principios de abstracción para estructurar componentes y funcionalidades de forma eficiente, logrando una experiencia dinámica y segura para los usuarios. Desde publicaciones interactivas hasta un sistema de seguidores y perfiles personalizados, esta aplicación demuestra mi capacidad para crear soluciones completas, bien organizadas y centradas en el usuario.

## 🚀 Tecnologías Utilizadas 

- **Next.js**: Framework de React que permite la construcción de aplicaciones web y APIs con funcionalidades de renderizado del lado del servidor.
- **Neon Serverless PostgreSQL**: Base de datos relacional serverless que permite almacenar información de usuarios, publicaciones y relaciones entre ellos.
- **SASS**: Para estilos y diseño responsivo, asegurando una buena experiencia en diferentes dispositivos.
- **Zustand**: Librería para la gestión del estado global, sencilla y eficiente.
- **JSON Web Tokens (JWT) y jose**: Manejo de autenticación basado en cookies para garantizar la seguridad del usuario.
- **Zod**: Biblioteca de validación y parsing de esquemas para TypeScript y JavaScript, que permite definir y validar datos con tipos seguros de manera sencilla y eficaz.
- **TypeScript**: Superset de JavaScript que añade tipado estático y otras funcionalidades avanzadas, mejorando la calidad y el mantenimiento del código en aplicaciones grandes y complejas.

## 📬 Contacto

Si tenés alguna pregunta o sugerencia, no dudes en contactarme a través de lucassimple@hotmail.com o https://github.com/Lucascabral95

### Notas: 

- Añadí secciones como **Tecnologías Utilizadas**, **Descripción**, **Conclusión**, **Características Principales** y **Contacto** para hacer el README más completo.
