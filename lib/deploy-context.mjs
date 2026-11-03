/** Recognize each host's build context; unknown Netlify contexts fail closed. */
export function isPreviewDeployment(env = process.env) {
  if (env.NETLIFY === 'true') return env.CONTEXT !== 'production';
  return env.VERCEL_ENV === 'preview' || env.VERCEL_ENV === 'development';
}
