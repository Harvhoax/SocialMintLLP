import { services } from './services';

const details = [
  {
    slug: 'reels-video-editing', name: 'Reels & video editing',
    heading: 'Short films. A clear point of view.',
    summary: 'Reels and short-form video editing for brands in Mumbai and across India, from the opening hook to the final platform-ready cut.',
    approach: 'A strong reel starts with the story. We shape the concept and script, then bring the footage together through editing and motion. The aim is a clear message that works in a short viewing window.',
    brief: 'Tell us the audience, the message, the platform and whether you already have footage. Share any brand guidelines and the number of videos you need.',
    category: ['Social content', 'Brand content'],
  },
  {
    slug: 'social-media-posts-carousels', name: 'Posts & carousel design',
    heading: 'A feed that feels like your brand.',
    summary: 'Social media posts, carousel design and visual direction for brands in Mumbai and across India.',
    approach: 'We turn your message into a visual sequence people can follow. Static posts establish the idea; carousels give it room to unfold. A consistent visual direction keeps the individual pieces connected to your brand.',
    brief: 'Share your brand identity, the topics you want to cover and the channels you use. Existing posts and references help us understand the direction.',
    category: ['Brand content', 'Social content'],
  },
  {
    slug: 'social-media-management', name: 'Social media management',
    heading: 'Your social presence, handled.',
    summary: 'Social media account management, publishing, community replies and reporting for businesses in Mumbai and across India.',
    approach: 'We bring planning and publishing into one workflow. Content calendars give the account a direction, scheduling keeps it active, and community replies and reporting help the team understand what to improve.',
    brief: 'Tell us which accounts need support, who your audience is, your current publishing routine and your business priorities. We can then discuss the scope of account handling.',
    category: ['Social content', 'Food & hospitality'],
  },
  {
    slug: 'video-production', name: 'Video production',
    heading: 'Good stories start on set.',
    summary: 'Video shooting, creative direction and brand films for projects in Mumbai, with enquiries welcomed from across India.',
    approach: 'We plan the story before the camera starts rolling. Creative direction connects the people, products and places in the brief to the shots we need, so the footage has a purpose when it reaches the edit.',
    brief: 'Share the shoot location, subject, intended format and preferred dates. Tell us whether you need a brand film, a product story or content for social media; shoot arrangements are confirmed with the team.',
    category: ['Storytelling', 'Automotive', 'Real estate', 'Food & hospitality', 'Wedding', 'Travel'],
  },
  {
    slug: 'social-media-account-optimization', name: 'Account optimization',
    heading: 'Make the first visit count.',
    summary: 'Social media profile optimization, clearer bios and content pillars for brands in Mumbai and across India.',
    approach: 'A profile should help someone understand the brand and what to do next. We focus on the profile and bio, the topics your content returns to, and social discovery, so the account has a clearer structure.',
    brief: 'Send your public profile links, describe your audience and tell us what a useful enquiry or action looks like for your business.',
    category: ['Brand content', 'Social content'],
  },
  {
    slug: 'thumbnail-design', name: 'Thumbnail design',
    heading: 'Make the first frame count.',
    summary: 'Custom video thumbnail design and art direction for creators and brands in Mumbai and across India.',
    approach: 'A thumbnail needs to communicate the idea before the video starts. We combine the subject, a clear visual hierarchy and your brand’s design language into a single frame that belongs with the film.',
    brief: 'Share the video, its subject or title, the publishing platform and your brand assets. Let us know if the thumbnail belongs to a series that needs a consistent look.',
    category: ['Brand content', 'Social content'],
  },
] as const;

// Keep cinematic gallery copy small; detailed content stays on server pages.
export const serviceDetails = details.map((detail, index) => ({ ...detail, ...services[index] }));
