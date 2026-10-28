// Replace these concept studies with verified client work and real outbound URLs.
export type Project = { title: string; category: string; poster: string; label: string; color: string; href?: string; previewVideo?: string; description: string };
const concepts: Project[] = [
  { title: 'A slower kind of morning', category: 'Brand film', poster: '/work/coffee.jpg', label: 'SLOW DAYS', color: '#dfcdae', description: 'An illustrative coffee brand film: intimate details, natural light, and a story that takes its time.' },
  { title: 'Made to move', category: 'Reel', poster: '/work/running.jpg', label: 'IN MOTION', color: '#c6f4a6', description: 'A sample short-form direction for an active lifestyle brand, built around movement and rhythm.' },
  { title: 'Less, but better', category: 'Art direction', poster: '/work/interior.jpg', label: 'FORM / SPACE', color: '#e4e1d6', description: 'A concept editorial series exploring quiet interiors, considered objects, and intentional design.' },
  { title: 'Fresh perspective', category: 'Product shoot', poster: '/work/orange.jpg', label: 'A LITTLE ZEST.', color: '#eab586', description: 'A sample product story with tactile detail and a fresh, warm visual palette.' },
  { title: 'Outside the ordinary', category: 'Video edit', poster: '/work/coast.jpg', label: 'SOMEWHERE ELSE', color: '#c3d8c7', description: 'A concept travel edit about finding a different perspective and making space to explore.' },
  { title: 'Wear your own story', category: 'Social campaign', poster: '/work/fashion.jpg', label: 'OFF SCRIPT', color: '#d9d7c8', description: 'An illustrative fashion campaign direction focused on individual expression and everyday stories.' },
];
export const projects: Project[] = [...concepts, ...concepts.map((p, i) => ({ ...p, title: ['The everyday ritual', 'Find your rhythm', 'Room to breathe', 'Something fresh', 'Take the long way', 'A different point of view'][i], category: ['Carousel', 'Thumbnail', 'Brand film', 'Reel', 'Product shoot', 'Video edit'][i] }))];
