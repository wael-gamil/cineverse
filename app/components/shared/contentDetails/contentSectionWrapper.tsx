// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import OverviewSection from './OverviewSection';
// import CastCrewSection from './CastCrewSection';
// import SeasonsEpisodesSection from './SeasonsEpisodesSection';
// import ReviewsSection from './ReviewsSection';

// type SectionType = 'overview' | 'cast' | 'seasons' | 'reviews';

// interface Props {
//   section: SectionType;
//   slug: string;
// }

// export default function ContentSectionWrapper({ section, slug }: Props) {
//   const ref = useRef<HTMLDivElement | null>(null);
//   const [isVisible, setIsVisible] = useState(false);
//   const [data, setData] = useState<any>(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsVisible(true);
//           observer.disconnect();
//         }
//       },
//       { rootMargin: '200px' }
//     );

//     if (ref.current) observer.observe(ref.current);
//     return () => observer.disconnect();
//   }, []);

//   useEffect(() => {
//     if (!isVisible || data) return;

//     const fetchData = async () => {
//       let result;
//       switch (section) {
//         case 'overview':
//           result = await fetch(`/api/content/stats?slug=${slug}`).then(res =>
//             res.json()
//           );
//           break;
//         case 'cast':
//           result = await fetch(`/api/content/cast?slug=${slug}`).then(res =>
//             res.json()
//           );
//           break;
//         case 'seasons':
//           result = await fetch(`/api/content/seasons?slug=${slug}`).then(res =>
//             res.json()
//           );
//           break;
//         case 'reviews':
//           result = await fetch(`/api/content/reviews?slug=${slug}`).then(res =>
//             res.json()
//           );
//           break;
//       }

//       setData(result);
//     };

//     fetchData();
//   }, [isVisible, slug, section, data]);

//   if (!data) return <div ref={ref} className='min-h-[300px]' />;

//   switch (section) {
//     case 'overview':
//       return <OverviewSection data={data} />;
//     case 'cast':
//       return <CastCrewSection data={data} />;
//     case 'seasons':
//       return <SeasonsEpisodesSection data={data} />;
//     case 'reviews':
//       return <ReviewsSection data={data} />;
//     default:
//       return null;
//   }
// }
