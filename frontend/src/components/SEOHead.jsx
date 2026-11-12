import React, { useEffect } from 'react';

/**
 * SEOHead - Manages dynamic page metadata, Open Graph, Twitter cards, canonical tags,
 * and Schema.org JSON-LD structured data for React SPA routes.
 */
export default function SEOHead({
  title = "SB Dev Studio | Full-Stack Web & Mobile App Development",
  description = "Bespoke software development studio. We build production web applications, native Apple ecosystem software, and resilient cloud architectures.",
  canonical = "https://www.sbdevstudio.in/",
  ogType = "website",
  ogImage = "https://www.sbdevstudio.in/assets/SB_DevStudio_Logo.jpeg",
  robots = "index, follow",
  jsonLd = null,
}) {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // 2. Helper to set or create meta tags
    const setMetaTag = (attrName, attrValue, content) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard metadata
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'title', title);
    setMetaTag('name', 'robots', robots);

    // OpenGraph
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:url', canonical);
    setMetaTag('property', 'og:image', ogImage);

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // 3. Update Canonical Tag
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', canonical);

    // 4. Inject Dynamic JSON-LD if provided
    let scriptTag = document.getElementById('dynamic-jsonld');
    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'dynamic-jsonld';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(jsonLd);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, canonical, ogType, ogImage, robots, jsonLd]);

  return null;
}
