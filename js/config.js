/* ============================================
   HACIENDA POPALITO — CONFIGURACIÓN
   ============================================
   
   Este es el ÚNICO archivo que necesitas editar
   para cambiar contenido de la página.
   
   Después de editar, haz push a GitHub y se
   publica automáticamente.
   ============================================ */

var CONFIG = {

  // === WHATSAPP ===
  whatsapp: '573222954445',
  telefono_visible: '+57 322 295 4445',

  // === PRECIOS ===
  precio_anterior: '350.000',
  precio_actual: '280.000',

  // === FECHAS Y CUPOS ===
  fechas_por_mes: 4,
  cupos_disponibles: 4,
  // Dejar vacío para que calcule automáticamente el próximo sábado
  // O poner fecha fija: '2025-06-07T07:30:00'
  proxima_fecha: '',

  // === TESTIMONIOS ===
  testimonios: [
    {
      foto: 'images/testimonio-sandro.jpg',
      texto: '"¡La montaña me llamó! Este lugar es mágico, sientes la energía desde que empiezas a subir. La vista majestuosa, el almuerzo que sabe a cielo. Este lugar llega a ti justo cuando lo necesitas."',
      autor: '— Sandro F., Colombia'
    },
    {
      foto: 'images/testimonio-fredy.jpg',
      texto: '"Es mucho más que un viaje a la montaña. Te conecta profundamente con la naturaleza y contigo mismo. Plantamos árboles, escribimos una carta a nuestro yo del futuro… un momento muy especial. Esto es para quienes buscan más que turismo: una experiencia con propósito."',
      autor: '— Fredy C., Antioquia'
    },
    {
      foto: 'images/testimonio-julian.jpg',
      texto: '"Le daría 7 u 8 estrellas si pudiera. Fue un día mágico. Si quieres desconectarte de la monotonía, las mejores vistas, conversaciones interesantes y comida deliciosa… este es el lugar. Espero volver a ver cómo creció mi árbol."',
      autor: '— Julian R., Medellín'
    }
  ],

  // === TOAST (notificaciones de prueba social) ===
  toasts: [
    'María de Medellín reservó hace 2 horas',
    'Andrés y 4 amigos separaron cupo para el sábado',
    'Laura de Envigado reservó experiencia privada',
    'Un grupo de Bogotá reservó ayer',
    'Camila de Rionegro separó cupo hace 30 min'
  ],

  // === PROOF BAR (contadores) ===
  contadores: {
    arboles: 247,
    visitantes: 89,
    estrellas: 5,
    anos: 3
  },

  // === REDES SOCIALES ===
  instagram: '',  // URL de Instagram
  facebook: '',   // URL de Facebook
  email: 'info@haciendapopalito.com'
};
