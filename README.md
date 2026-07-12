# BepariOS BD

**Free seller tools and business management resources for Bangladesh's online sellers.**

BepariOS BD is a mobile-responsive web platform created for Facebook, Instagram, boutique, home-food, cosmetics, and handmade-product sellers in Bangladesh.

The current public MVP provides free business calculators and an invoice generator that work directly in the browser without requiring an account.

## Live Demo

[Visit BepariOS BD](https://bepariosbd.lovable.app)

## Problem

Many small online sellers calculate product pricing, advertising costs, COD returns, profit, and invoices manually using notebooks, messages, or spreadsheets.

This can lead to:

- Incorrect product pricing
- Hidden return losses
- Unsustainable advertising costs
- Confusion about actual profit
- Unprofessional invoices
- Poor business decision-making

BepariOS BD provides simple, Bangladeshi seller-focused tools using BDT/Taka.

## Available Tools

### COD Profit Calculator

Calculates:

- Delivered-order profit
- Loss per returned order
- Return-adjusted profit
- Estimated monthly profit
- Break-even advertising cost
- Expected delivered and returned orders

### Product Pricing Calculator

Calculates:

- Total product cost
- Minimum safe price
- Recommended selling price
- List price before discount
- Profit margin
- Markup
- Platform fee and discount effects

### Facebook Ads Break-even Calculator

Calculates:

- Cost per click
- Cost per order
- Conversion rate
- Delivered conversion rate
- Current ROAS
- Break-even CPA
- Break-even ROAS
- Estimated campaign profit or loss

### Return Loss Calculator

Calculates:

- Return rate
- Loss per returned order
- Total monthly return loss
- Effective return cost per order
- Potential savings from reducing returns

### Free Invoice Generator

Supports:

- Multiple product rows
- Customer and shop information
- Delivery charge and discount
- Paid and due amount
- Automatic payment status
- Printable A4 invoice
- Browser-based PDF saving
- WhatsApp invoice summary
- Local browser-only data handling

## Key Features

- Bangladesh-focused seller tools
- BDT/Taka currency formatting
- Responsive mobile-first interface
- Client-side calculations
- Field-level validation
- No account required for free tools
- No paid APIs
- No calculator data uploaded or stored
- Printable invoice layout
- SEO metadata and canonical URLs
- XML sitemap and robots.txt
- Privacy, Terms, Disclaimer, Contact, and Refund Policy pages
- Demo seller dashboard UI

## Technology Stack

- React 19
- TypeScript
- TanStack Router
- TanStack Start
- Vite
- Tailwind CSS
- Radix UI components
- Lucide React icons
- Bun
- Lovable

## Application Routes

```text
/
├── /tools
│   ├── /tools/cod-profit
│   ├── /tools/product-pricing
│   ├── /tools/ads-breakeven
│   ├── /tools/return-loss
│   └── /tools/invoice
├── /about
├── /contact
├── /privacy
├── /terms
├── /refund-policy
├── /disclaimer
├── /login
├── /signup
├── /forgot-password
└── /dashboard
