
export type OpportunityOrganizer = {
  name: string;
  about: string;
  contactEmail: string;
};

export type Opportunity = {
  /**
   * Unique identifier used for event details URLs.
   * MongoDB records use an ObjectId.
   */
  id: string;

  /** Optional URL-friendly event slug. */
  slug?: string;

  /** Whether the event is featured. */
  featured: boolean;

  /** Event title. */
  title: string;

  /** Organization or event creator name. */
  organization: string;

  /** Organizer information. */
  organizer: OpportunityOrganizer;

  /** Event type or category. */
  category: string;

  /** Full event location. */
  location: string;

  /** City used for filtering. */
  city: string;

  /** Human-readable event schedule. */
  schedule: string;

  /** Event duration. */
  duration: string;

  /** Full event description. */
  description: string;

  /** Volunteer responsibilities. */
  responsibilities: string[];

  /** Volunteer requirements. */
  requirements: string[];

  /** Benefits of participating. */
  benefits: string[];

  /** Total volunteer spots. */
  spotsTotal: number;

  /** Remaining volunteer spots. */
  spotsLeft: number;

  /** Event thumbnail image URL. */
  imageUrl?: string | null;

  /** Event date stored as an ISO date string. */
  eventDate?: string;
};
