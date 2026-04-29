export type Package = 'free' | 'standard' | 'pro'

export const PACKAGES = {
  free: {
    name: 'Free',
    price_monthly: 0,
    price_yearly: 0,
    features: {
      listing: true,
      events: true,
      reviews: true,
      stats_basic: true,
      stats_advanced: false,
      stats_days: 7,
      featured_category: false,
      featured_homepage: false,
      featured_categories_count: 0,
      status_updates: false,
      newsletter_mention: false,
      instagram_post: false,
      promo_discount: 0,
    }
  },
  standard: {
    name: 'Standard',
    price_monthly: 50,
    price_yearly: 500,
    features: {
      listing: true,
      events: true,
      reviews: true,
      stats_basic: true,
      stats_advanced: true,
      stats_days: 30,
      featured_category: true,
      featured_homepage: false,
      featured_categories_count: 1,
      status_updates: true,
      newsletter_mention: false,
      instagram_post: false,
      promo_discount: 10,
    }
  },
  pro: {
    name: 'Pro',
    price_monthly: 100,
    price_yearly: 1000,
    features: {
      listing: true,
      events: true,
      reviews: true,
      stats_basic: true,
      stats_advanced: true,
      stats_days: 90,
      featured_category: true,
      featured_homepage: true,
      featured_categories_count: 2,
      status_updates: true,
      newsletter_mention: true,
      instagram_post: true,
      promo_discount: 15,
    }
  }
} as const

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getPackage(profile: any): Package {
  if (!profile?.package) return 'free'
  if (profile.package_expires_at &&
      new Date(profile.package_expires_at) < new Date()) {
    return 'free'
  }
  return profile.package as Package
}

export function hasFeature(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile: any,
  feature: keyof typeof PACKAGES.free.features
): boolean {
  const pkg = getPackage(profile)
  const pkgFeatures = PACKAGES[pkg].features as Record<string, boolean | number>
  return !!pkgFeatures[feature]
}
