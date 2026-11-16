import { reels } from './reels';

const descriptions: Record<string, string> = {
  socialcox: 'A short-form social content edit from the SocialMint sample collection. Watch the 30-second film to explore its pacing, captions and presentation.',
  'supercar-fest': 'An automotive sample film from SocialMint’s selected work. Watch the 24-second Supercar Fest edit for a look at the visual storytelling and editing style.',
  'dubai-real-estate': 'A 35-second real estate sample edit in the SocialMint portfolio. Watch the film to explore how property footage is presented in a vertical social format.',
  'social-edit-01': 'A 31-second vertical social content sample from SocialMint’s reel collection. Watch the complete edit to explore the structure and pacing.',
  'short-form-edit': 'A compact 15-second social video sample from SocialMint. Watch the complete short-form edit to see how the idea unfolds in a brief viewing window.',
  'founder-documentary': 'A 26-second landscape documentary sample in SocialMint’s selected films. Watch the founder story edit in its original widescreen format.',
  'social-edit-02': 'A second vertical social content sample from SocialMint’s collection. Watch this 35-second edit to compare the creative treatment with the other social films.',
  cafe: 'A 32-second café video sample from SocialMint’s food and hospitality collection. Watch the vertical film to explore its approach to presenting a hospitality setting.',
  'cafe-story': 'A 28-second café story edit from SocialMint’s selected work. Watch this food and hospitality sample alongside the other café film in the collection.',
  videokart: 'A 63-second brand content sample in the SocialMint portfolio. Watch the Videokart edit in full to explore its video editing and presentation.',
  mysastiflight: 'A 70-second travel content sample in SocialMint’s selected films. Watch the MySastiFlight.in edit in its vertical format.',
  'star-wedding': 'A 47-second wedding film sample from the SocialMint collection. Watch the Star Wedding edit to explore the treatment of an event story in a short vertical film.',
  kumarland: 'A 43-second brand content sample from SocialMint’s reel collection. Watch the Kumarland edit to explore the visual style and delivery.',
  electrent: 'A 44-second brand content sample in SocialMint’s selected work. Watch the Electrent edit to explore the presentation of a short-form brand message.',
};

// Only add a real first-publication date once confirmed by the owner. File
// modification, encoding and build dates are not video publication dates.
export const reelPublicationDates: Record<string, string> = {};

// Keep short owner-supplied gallery labels; use descriptive headings on the
// static watch pages without changing their existing URLs or media filenames.
const watchTitles: Record<string, string> = {
  'social-edit-01': 'Social content reel — sample 01',
  'social-edit-02': 'Social content reel — sample 02',
  'short-form-edit': '15-second short-form video edit',
  cafe: 'Café reel — food and hospitality',
  'cafe-story': 'Café story — hospitality video',
};

const projectGuidance: Record<string, string> = {
  'Social content': 'For a similar reel, tell us the audience, the main message and the platform where it will appear. Share your raw footage, brand assets and references, or let us know if you need an on-location shoot. We can then discuss the length, captions and number of versions.',
  Automotive: 'For an automotive video, share the vehicle or event, the location and the audience you want to reach. Let us know whether footage is ready or a shoot is needed, which details matter most and where the finished film will be published.',
  'Real estate': 'For a property video, tell us the property type, location and the spaces or features you want viewers to understand. Share existing footage or preferred shoot dates, along with the publishing platform and any approved property information.',
  'Food & hospitality': 'For café, restaurant or hospitality content, share the venue, the dishes or experience you want to feature and the audience you want to reach. We can work with supplied footage or discuss an on-location shoot, then agree the format and scope.',
  Storytelling: 'For an interview or documentary edit, share the subject, the story you want to tell and any recorded interviews or supporting footage. Tell us the intended audience, approximate running time and whether captions or different platform versions are needed.',
  'Brand content': 'For a brand film, share the product or service, the intended audience and the message that should remain with the viewer. Include approved brand assets, existing footage, any shoot requirements and the channels where the film will appear.',
  Travel: 'For a travel edit, share the destinations, available footage and the story or offer the video should communicate. Tell us the publishing platform, preferred length and any approved names or details that need to appear on screen.',
  Wedding: 'For a wedding film, share the event dates, footage available and the moments that matter most to you. Tell us whether the film is a short highlight or a longer edit, who it is for and the preferred delivery format.',
};

export const filmDetails = reels.map(reel => ({
  ...reel,
  watchTitle: watchTitles[reel.slug] || reel.title,
  description: descriptions[reel.slug],
  projectGuidance: projectGuidance[reel.category],
  format: reel.landscape ? 'Landscape' : 'Portrait',
}));
export function durationSeconds(value: string) {
  const [minutes, seconds] = value.split(':').map(Number);
  return minutes * 60 + seconds;
}
