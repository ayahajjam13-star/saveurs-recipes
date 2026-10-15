import { Helmet } from 'react-helmet-async';

function SEO({ title, description, image, url, type = 'website' }) {
  const siteName = 'Saveurs - Recipes by Season';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDesc = 'Discover 120 recipes from around the world, organized by season.';
  const desc = description || defaultDesc;
  const baseUrl = 'https://saveurs-recipes.vercel.app';
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta name="theme-color" content="#E07A5F" />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      {image && <meta property="og:image" content={image} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
}

export default SEO;