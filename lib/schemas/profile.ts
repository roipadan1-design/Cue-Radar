import { z } from 'zod'

export const profileSchema = z.object({
  handle: z
    .string()
    .min(3, 'Handle must be at least 3 characters')
    .max(30, 'Handle must be at most 30 characters')
    .regex(/^[a-z0-9][a-z0-9_-]{2,29}$/, 'Handle must contain only lowercase letters, numbers, underscores, or hyphens'),
  full_name: z.string().min(1, 'Full name is required'),
  role_label: z.string().optional(),
  bio: z.string().max(600, 'Bio must be at most 600 characters').optional(),
  locations: z.string().optional(),
  current_city: z.string().optional(),
  current_city_until: z.string().optional(),
  open_for_collab: z.boolean().default(false),
  available_from: z.string().optional(),
  showreel_url: z
    .string()
    .url('Must be a valid URL')
    .or(z.literal(''))
    .optional(),
  instagram: z.string().optional(),
  website: z
    .string()
    .url('Must be a valid URL')
    .or(z.literal(''))
    .optional(),
  is_public: z.boolean().default(false),
})

export type ProfileFormData = z.infer<typeof profileSchema>
