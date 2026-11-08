
import { Helmet } from 'react-helmet-async';

function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
}) {
  const siteName = 'Saveurs - Recipes by Season';

  const fullTitle = title
    ? `${title} | ${siteName}`
    : siteName;

  const defaultDesc =
    'Discover delicious recipes from around the world. Explore seasonal dishes, cooking tips and inspiration for every occasion.';

  const desc = description || defaultDesc;

  const baseUrl = 'https://saveurs-recipes.vercel.app';

  // Build canonical URL
  const fullUrl = url
    ? new URL(url, baseUrl).href
    : baseUrl;

  // Default sharing image
  const defaultImage = `${baseUrl}/images/saveurs-og.jpg`;

  const fullImage = image
    ? new URL(image, baseUrl).href
    : defaultImage;

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{fullTitle}</title>

      <meta name="description" content={desc} />

      <meta
        name="theme-color"
        content="#E88FA5"
      />

      <meta name="robots" content="index, follow" />

      <link
        rel="canonical"
        href={fullUrl}
      />

      {/* Open Graph - Facebook / WhatsApp */}
      <meta property="og:locale" content="en_US" />

      <meta
        property="og:title"
        content={fullTitle}
      />

      <meta
        property="og:description"
        content={desc}
      />

      <meta
        property="og:type"
        content={type}
      />

      <meta
        property="og:url"
        content={fullUrl}
      />

      <meta
        property="og:site_name"
        content={siteName}
      />

      <meta
        property="og:image"
        content={fullImage}
      />

      <meta
        property="og:image:alt"
        content="Saveurs - Delicious recipes by season"
      />

      {/* Twitter / X */}
      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content={fullTitle}
      />

      <meta
        name="twitter:description"
        content={desc}
      />

      <meta
        name="twitter:image"
        content={fullImage}
      />

    </Helmet>
  );
}

export default SEO;
