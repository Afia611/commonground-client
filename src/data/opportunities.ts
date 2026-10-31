/**
 * Sample opportunities used across the landing page and (later) the
 * opportunities pages. When the backend is ready, these will be replaced
 * by data fetched from the CommonGround API.
 */

export type Opportunity = {
  id: string;
  featured: boolean;
  title: string;
  organization: string;
  category: string;
  location: string;
  schedule: string;
  spotsTotal: number;
  spotsLeft: number;
};

export const opportunities: Opportunity[] = [
  {
    id: "garden-restoration",
    featured: true,
    title: "Community Garden Restoration",
    organization: "GreenRoots Collective",
    category: "Environment",
    location: "Dhanmondi Lake, Dhanmondi, Dhaka, Bangladesh",
    schedule: "Sat 14 Nov 2026, 9:00–13:00",
    spotsTotal: 12,
    spotsLeft: 6,
  },
  {
    id: "food-bank-support",
    featured: true,
    title: "Weekend Food Bank Support",
    organization: "Harvest Help",
    category: "Community Care",
    location: "Mirpur 10, Mirpur, Dhaka, Bangladesh",
    schedule: "Sat 7 Nov 2026, 10:00–14:00",
    spotsTotal: 10,
    spotsLeft: 4,
  },
  {
    id: "reading-mentors",
    featured: true,
    title: "Reading Mentors for Children",
    organization: "Story Bridge",
    category: "Education",
    location: "Sufia Kamal National Public Library, Shahbag, Dhaka, Bangladesh",
    schedule: "Tuesdays 16:00–17:30, from 10 Nov",
    spotsTotal: 8,
    spotsLeft: 3,
  },
  {
    id: "riverside-clean-up",
    featured: false,
    title: "Riverside & Beach Clean-Up",
    organization: "Blue Water Alliance",
    category: "Environment",
    location: "Sunny Point Riverside",
    schedule: "Sun 22 Nov 2026, 8:30–12:00",
    spotsTotal: 20,
    spotsLeft: 15,
  },
  {
    id: "companionship-visits",
    featured: false,
    title: "Companionship Visits for Elders",
    organization: "Warm Hearts Society",
    category: "Community Care",
    location: "Rosefield Care Home",
    schedule: "Flexible — 2 hours per week",
    spotsTotal: 6,
    spotsLeft: 2,
  },
  {
    id: "youth-sports-coaching",
    featured: false,
    title: "Youth Sports Coaching Assistant",
    organization: "Eastside Youth Club",
    category: "Sports",
    location: "Eastside Sports Centre",
    schedule: "Thursdays 17:30–19:00, from 5 Nov",
    spotsTotal: 5,
    spotsLeft: 3,
  },
];

export const featuredOpportunities = opportunities.filter(
  (opportunity) => opportunity.featured
);
