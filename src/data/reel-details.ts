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

export const filmDetails = reels.map(reel => ({ ...reel, description: descriptions[reel.slug] }));
export function durationSeconds(value: string) {
  const [minutes, seconds] = value.split(':').map(Number);
  return minutes * 60 + seconds;
}
