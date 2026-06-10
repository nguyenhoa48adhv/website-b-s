/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export type PropertyType = 'dat-nen' | 'dat-tho-cu' | 'dat-vuon' | 'dat-biet-thu';

export interface LandListing {
  id: string;
  title: string;
  type: PropertyType;
  price: string; // Formatted price, e.g., "2.5 Tỷ"
  priceValue: number; // For sorting and filtering (in Billion VND, e.g., 2.5)
  size: number; // in m²
  location: string;
  coordinates: Coordinates;
  image: string;
  description: string;
  contactName: string;
  contactPhone: string;
  legalStatus: string; // e.g., "Sổ đỏ riêng, pháp lý 100%"
  direction: string; // e.g., "Đông Nam 1"
  width?: number; // mặt tiền
  length?: number; // chiều dài
  isFeatured?: boolean;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email?: string;
  interestInListingId?: string;
  interestInListingTitle?: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved';
  createdAt: string;
}

export interface MapMarker {
  id: string;
  title: string;
  lat: number;
  lng: number;
  price: string;
  size: number;
  image: string;
}
