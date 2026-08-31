import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

export const revalidate = 86400; // Cache for 24 hours to prevent Cloudflare D1 limit exhaustion

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kalkulators.my.id';

  const sitemapData: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  try {
    // Fetch categories
    const categories = await prisma.category.findMany({
      select: {
        slug: true,
        updatedAt: true,
      }
    });

    for (const category of categories) {
      sitemapData.push({
        url: `${baseUrl}/${category.slug}`,
        lastModified: category.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }

    // Fetch calculators with their category slug
    const calculators = await prisma.calculator.findMany({
      select: {
        slug: true,
        updatedAt: true,
        category: {
          select: {
            slug: true,
          }
        }
      }
    });

    for (const calc of calculators) {
      sitemapData.push({
        url: `${baseUrl}/${calc.category.slug}/${calc.slug}`,
        lastModified: calc.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    }
  } catch (error) {
    console.error("Error generating sitemap data from DB:", error);
  }

  return sitemapData;
}
