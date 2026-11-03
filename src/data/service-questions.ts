export type Question = { id: string; question: string; answer: string; link?: { href: string; label: string } };

// Service-specific answers use only the published scope; delivery details are
// agreed in the brief, rather than implied as a fixed package or guarantee.
export const serviceQuestions: Record<string, readonly Question[]> = {
  'reels-video-editing': [
    { id: 'existing-footage', question: 'What should I send for a reel edit?', answer: 'Send your footage, the main message, intended platform and any brand assets or references. Include the number of edits you need and your preferred deadline so we can discuss the scope.' },
    { id: 'editing-or-shooting', question: 'Do I need video editing or a new shoot?', answer: 'Editing is a useful starting point when you already have footage that communicates your message. If key shots are missing or you need to show a new product, person or location, discuss a shoot with our video production team.', link: { href: '/services/video-production', label: 'Explore video production' } },
    { id: 'video-formats', question: 'Can the edit be prepared for different platforms?', answer: 'Tell us which platforms and placements you plan to use. Aspect ratios, running times and the number of versions are agreed in the brief so the final cuts suit their intended use.' },
  ],
  'social-media-posts-carousels': [
    { id: 'post-or-carousel', question: 'When should I choose a carousel instead of a single post?', answer: 'A single post works well for one clear message. A carousel gives a topic room to unfold across several frames, such as an explanation, a sequence or a set of related ideas. The choice depends on what your audience needs to understand.' },
    { id: 'design-assets', question: 'What brand assets should I share for social media design?', answer: 'Share your logo, brand colours, fonts, approved images and the messages you want to communicate. Existing posts and references help us understand the visual direction and how the new content should fit your feed.' },
    { id: 'publishing-support', question: 'Does post design include publishing and account management?', answer: 'Design and account management are separate parts of the workflow. If you also need scheduling, community replies or reporting, include social media management in your enquiry so those responsibilities can be agreed.', link: { href: '/services/social-media-management', label: 'Explore social media management' } },
  ],
  'social-media-management': [
    { id: 'management-or-design', question: 'How is social media management different from content design?', answer: 'Content design creates the individual posts and visual assets. Social media management brings planning, scheduling, publishing, community replies and reporting into an ongoing workflow. The content volume and channels are agreed for your project.' },
    { id: 'management-brief', question: 'What do you need to plan support for my accounts?', answer: 'Share your public account links, audience, business goals and current publishing routine. Tell us which tasks you want help with and who will review content so we can define the responsibilities clearly.' },
    { id: 'profile-first', question: 'Can you help improve my profile before planning content?', answer: 'Yes. Account optimization focuses on the profile, bio, content pillars and next step for visitors. It can be discussed alongside ongoing management when the account needs a clearer starting point.', link: { href: '/services/social-media-account-optimization', label: 'Explore account optimization' } },
  ],
  'video-production': [
    { id: 'production-scope', question: 'What does SocialMint’s video production cover?', answer: 'Our video production work brings together planning, creative direction, shooting and editing. The location, subjects, required shots and final deliverables are discussed around the purpose of your film.' },
    { id: 'shoot-planning', question: 'What should I confirm before arranging a shoot?', answer: 'Share the location, preferred dates, people or products to be filmed and the intended platform. Let us know about location access or permissions that need arranging, and any must-have shots, so the team can confirm the practical requirements.' },
    { id: 'already-filmed', question: 'What if I only need an edit of existing footage?', answer: 'Start with our reels and video editing service. Send the footage and explain the story you want to tell; a new shoot is only something to discuss if the material does not cover what the film needs.', link: { href: '/services/reels-video-editing', label: 'Explore reels and video editing' } },
  ],
  'social-media-account-optimization': [
    { id: 'profile-scope', question: 'What does account optimization focus on?', answer: 'Account optimization focuses on making your profile easier to understand: a clearer bio, consistent content pillars and an obvious next step for visitors. Share your public profile and business priorities to start the discussion.' },
    { id: 'optimization-or-management', question: 'Is account optimization the same as ongoing management?', answer: 'Optimization improves the account’s structure and first impression. Ongoing management supports the regular planning, publishing, community replies and reporting that keep the account active.', link: { href: '/services/social-media-management', label: 'Explore ongoing management' } },
    { id: 'growth-expectations', question: 'Does profile optimization guarantee followers or enquiries?', answer: 'No. A clearer profile can help visitors understand your brand, but followers and enquiries also depend on the content, audience, offer and platform behaviour. The work focuses on improvements to the profile rather than a promised result.' },
  ],
  'thumbnail-design': [
    { id: 'thumbnail-brief', question: 'What should I provide for a video thumbnail?', answer: 'Share the video or a useful still, the subject or title, publishing platform and your brand assets. Include references and tell us if the thumbnail belongs to a series with an established visual style.' },
    { id: 'thumbnail-or-post', question: 'How does a thumbnail differ from a social media post?', answer: 'A thumbnail introduces a video before playback and needs to communicate its main idea in a single frame. A social media post may carry a standalone message or be part of a longer carousel.', link: { href: '/services/social-media-posts-carousels', label: 'Explore posts and carousel design' } },
    { id: 'thumbnail-series', question: 'Can thumbnails have a consistent look across a video series?', answer: 'Yes. Share examples from the series and any brand guidelines so we can discuss a common visual direction. The number of thumbnails, formats and variations are agreed in the brief.' },
  ],
};
