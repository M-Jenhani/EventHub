export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profilePicture?: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  capacity: number;
  category: EventCategory;
  posterUrl?: string;
  published: boolean;
  organizerId: number;
  organizerName: string;
  attendeeCount: number;
  isFull: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventRequest {
  title: string;
  description: string;
  eventDate: string;
  location: string;
  capacity: number;
  category: EventCategory;
  posterUrl?: string;
  published: boolean;
}

export enum EventCategory {
  CONFERENCE = 'CONFERENCE',
  WORKSHOP = 'WORKSHOP',
  SEMINAR = 'SEMINAR',
  MEETUP = 'MEETUP',
  WEBINAR = 'WEBINAR',
  CONCERT = 'CONCERT',
  SPORTS = 'SPORTS',
  SOCIAL = 'SOCIAL',
  NETWORKING = 'NETWORKING',
  OTHER = 'OTHER'
}

export interface RSVP {
  id: number;
  userId: number;
  userName: string;
  eventId: number;
  eventTitle: string;
  status: RSVPStatus;
  createdAt: string;
}

export enum RSVPStatus {
  CONFIRMED = 'CONFIRMED',
  WAITLIST = 'WAITLIST',
  CANCELLED = 'CANCELLED'
}

export interface Notification {
  id: number;
  message: string;
  read: boolean;
  type: NotificationType;
  relatedEventId?: number;
  createdAt: string;
}

export enum NotificationType {
  RSVP_CONFIRMED = 'RSVP_CONFIRMED',
  RSVP_WAITLIST = 'RSVP_WAITLIST',
  EVENT_UPDATE = 'EVENT_UPDATE',
  EVENT_CANCELLED = 'EVENT_CANCELLED',
  WAITLIST_PROMOTED = 'WAITLIST_PROMOTED',
  EVENT_REMINDER = 'EVENT_REMINDER'
}

export interface DashboardStats {
  totalEvents: number;
  totalUsers: number;
  totalRSVPs: number;
  upcomingEvents: number;
  pastEvents: number;
}
