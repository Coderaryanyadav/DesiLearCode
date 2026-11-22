import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DesiLearCode — Open Technology & STEM Infrastructure',
    short_name: 'DesiLearCode',
    description: 'Empowering children with refurbished tech, STEM mentorship, and verified learning labs across India.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/logo.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/logo.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
    shortcuts: [
      {
        name: 'Donate a Device',
        url: '/donate-device',
        description: 'Pledge laptops or desktop computers for verified learning labs',
      },
      {
        name: 'Explore Projects',
        url: '/projects',
        description: 'Browse verified grassroots computer lab initiatives',
      },
      {
        name: 'Volunteer Mentorship',
        url: '/volunteer',
        description: 'Become a technical mentor for young coders',
      },
    ],
  };
}
