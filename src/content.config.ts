import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

/**
 * Astro Content Collections
 *
 * Semua konten yang editable via Decap CMS di-schema di sini.
 * Decap CMS (public/admin/config.yml) nulis file ke folder yang sama.
 *
 * Struktur:
 * - settings   : 1 file JSON (site-wide settings: title, og image, GA ID)
 * - landing    : 1 file JSON per section (hero, features, pricing, dll)
 * - blog       : multi-file markdown/MDX posts
 *
 * singleObjectParser: Decap CMS `file:` widget nulis single-object JSON,
 * tapi Astro `file()` loader mau-nya array-of-entries. Parser ini adapt:
 * baca JSON object → wrap jadi [{ ...data }] pake `id` dari data atau default.
 */
const singleObjectParser =
  (fallbackId: string) =>
  (text: string): { id: string; [k: string]: unknown }[] => {
    const data = JSON.parse(text);
    const entry = { id: data.id ?? fallbackId, ...data };
    return [entry];
  };

// ─── Site-wide settings ───
const settings = defineCollection({
  loader: file("src/content/settings/site.json", { parser: singleObjectParser("site") }),
  schema: z.object({
    id: z.string(),
    siteTitle: z.string(),
    siteDescription: z.string(),
    ogImage: z.string(),
    gaId: z.string().optional(),
  }),
});

// ─── Landing page sections ───
const landingHero = defineCollection({
  loader: file("src/content/landing/hero.json", { parser: singleObjectParser("hero") }),
  schema: z.object({
    id: z.string(),
    badge: z.string(),
    titleLine1: z.string(),
    titleHighlight: z.string(),
    description: z.string(),
    primaryCtaLabel: z.string(),
    primaryCtaHref: z.string(),
    secondaryCtaLabel: z.string(),
    secondaryCtaHref: z.string(),
    subnote: z.string().optional(),
    stats: z.array(z.object({
      value: z.string(),
      label: z.string(),
    })),
    phoneTitle: z.string(),
    phoneSubtitle: z.string(),
    phoneIconUrl: z.string(),
  }),
});

const landingFeatures = defineCollection({
  loader: file("src/content/landing/features.json", { parser: singleObjectParser("features") }),
  schema: z.object({
    id: z.string(),
    label: z.string(),
    title: z.string(),
    description: z.string(),
    items: z.array(z.object({
      icon: z.string(),   // emoji atau SVG path
      title: z.string(),
      description: z.string(),
    })),
  }),
});

const landingHow = defineCollection({
  loader: file("src/content/landing/how.json", { parser: singleObjectParser("how") }),
  schema: z.object({
    id: z.string(),
    label: z.string(),
    title: z.string(),
    description: z.string(),
    steps: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })),
  }),
});

const landingPricing = defineCollection({
  loader: file("src/content/landing/pricing.json", { parser: singleObjectParser("pricing") }),
  schema: z.object({
    id: z.string(),
    label: z.string(),
    title: z.string(),
    description: z.string(),
    plans: z.array(z.object({
      name: z.string(),
      price: z.string(),
      priceSuffix: z.string(),
      desc: z.string(),
      featured: z.boolean().optional(),
      badge: z.string().optional(),
      badgeColor: z.string().optional(),
      features: z.array(z.object({
        text: z.string(),
        included: z.boolean(),
      })),
      ctaLabel: z.string(),
      ctaHref: z.string(),
      ctaStyle: z.enum(["outline", "filled"]),
    })),
  }),
});

const landingTestimonials = defineCollection({
  loader: file("src/content/landing/testimonials.json", { parser: singleObjectParser("testimonials") }),
  schema: z.object({
    id: z.string(),
    label: z.string(),
    title: z.string(),
    description: z.string(),
    items: z.array(z.object({
      quote: z.string(),
      initials: z.string(),
      name: z.string(),
      role: z.string(),
      rating: z.number().min(1).max(5).default(5),
    })),
  }),
});

const landingFaq = defineCollection({
  loader: file("src/content/landing/faq.json", { parser: singleObjectParser("faq") }),
  schema: z.object({
    id: z.string(),
    label: z.string(),
    title: z.string(),
    description: z.string(),
    items: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })),
  }),
});

const landingCta = defineCollection({
  loader: file("src/content/landing/cta.json", { parser: singleObjectParser("cta") }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    buttonLabel: z.string(),
    buttonHref: z.string(),
    subtext: z.string().optional(),
    emailNote: z.string().optional(),
  }),
});

const landingFooter = defineCollection({
  loader: file("src/content/landing/footer.json", { parser: singleObjectParser("footer") }),
  schema: z.object({
    id: z.string(),
    brandDescription: z.string(),
    columns: z.array(z.object({
      heading: z.string(),
      links: z.array(z.object({
        label: z.string(),
        href: z.string(),
      })),
    })),
    copyright: z.string(),
  }),
});

// ─── Blog posts ───
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    cover: z.string().optional(),
    tag: z.string().default("Umum"),
    author: z.string().default("Tim AgriAgent"),
    publishedAt: z.coerce.date(),
    draft: z.boolean().default(false),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

export const collections = {
  settings,
  landingHero,
  landingFeatures,
  landingHow,
  landingPricing,
  landingTestimonials,
  landingFaq,
  landingCta,
  landingFooter,
  blog,
};
