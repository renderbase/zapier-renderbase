# Renderbase Zapier Integration - Deployment Guide

This guide covers the complete process for deploying the Renderbase Zapier integration, from initial setup through production deployment.

**Last Updated:** December 3, 2025

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Integration Overview](#integration-overview)
3. [Local Development Setup](#local-development-setup)
4. [Zapier Developer Platform Setup](#zapier-developer-platform-setup)
5. [OAuth 2.0 Configuration](#oauth-20-configuration)
6. [Testing the Integration](#testing-the-integration)
7. [Deployment to Zapier](#deployment-to-zapier)
8. [Submitting for Public Listing](#submitting-for-public-listing)
9. [Maintenance and Updates](#maintenance-and-updates)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools

- Node.js 18.x or higher
- npm 8.x or higher
- Zapier CLI (`npm install -g zapier-platform-cli`)
- A Zapier account (free tier works for development)
- Access to Renderbase backend with OAuth module deployed

### Backend Requirements

The Renderbase backend must have the following ready:

- OAuth 2.0 module deployed (`/api/oauth/*` endpoints)
- Webhook subscriptions module deployed (`/api/v1/webhook-subscriptions/*`)
- Template Zapier fields endpoint (`/api/templates/:identifier/zapier-fields`)
- API rate limiting configured for OAuth clients
- SSL certificate (HTTPS required for production)

---

## Integration Overview

### Triggers (6)

| Key | Label | Description | Type |
|-----|-------|-------------|------|
| `email_sent` | Email Sent | Triggers when an email is successfully sent | Webhook |
| `email_delivered` | Email Delivered | Triggers when an email is delivered to recipient's mailbox | Webhook |
| `email_opened` | Email Opened | Triggers when a recipient opens an email | Webhook |
| `email_clicked` | Link Clicked | Triggers when a recipient clicks a tracked link | Webhook |
| `email_bounced` | Email Bounced | Triggers when an email bounces (hard or soft) | Webhook |
| `unsubscribe_received` | Unsubscribe Received | Triggers when a recipient unsubscribes | Webhook |

### Actions (5)

| Key | Label | Description | Features |
|-----|-------|-------------|----------|
| `send_email` | Send Email | Send an email using a Renderbase template | Dynamic variable fields |
| `send_email_pdf` | Send Email with Generated PDF | Send email with auto-generated PDF attachment | Dual dynamic fields (email + PDF) |
| `send_email_excel` | Send Email with Generated Excel | Send email with auto-generated Excel attachment | Dual dynamic fields (email + Excel) |
| `send_bulk_email` | Send Bulk Email | Send emails to multiple recipients | Batch processing |
| `send_starter_pack_email` | Send Starter Pack Email | Send email using a starter pack template | Pre-configured template selection |

### Searches (2)

| Key | Label | Description | Visibility |
|-----|-------|-------------|------------|
| `find_email` | Find Email | Search for an email by ID, recipient, or status | Public |
| `template_variables` | Get Template Variables | Fetch Zapier-compatible fields for a template | Hidden (internal use) |

### Hidden Triggers (for Dynamic Dropdowns)

| Key | Purpose |
|-----|---------|
| `template_list` | Populate email template dropdown |
| `template_list_pdf` | Populate PDF template dropdown |
| `template_list_excel` | Populate Excel template dropdown |

---

## Action Field Reference

### Send Email (`send_email`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `templateId` | dropdown | Yes | Email template (dynamic dropdown) |
| `to` | string | Yes | Recipient email address |
| `toName` | string | No | Recipient name |
| `subject` | string | No | Email subject (overrides template) |
| `fromName` | string | No | Sender display name |
| `replyTo` | string | No | Reply-to email address |
| `variables` | text | No | JSON template variables (legacy) |
| `trackOpens` | boolean | No | Enable open tracking (default: true) |
| `trackClicks` | boolean | No | Enable click tracking (default: true) |
| `var_*` | dynamic | No | Template-specific variable fields |

**Dynamic Fields:** When a template is selected, the integration fetches the template's variable schema and generates individual input fields for each variable. Object variables are flattened using `__` notation (e.g., `customer__name`), and array variables become line items.

### Send Email with Generated PDF (`send_email_pdf`)

Includes all fields from `send_email` plus:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `pdfTemplateId` | dropdown | Yes | PDF attachment template |
| `pdfFileName` | string | No | Custom PDF filename (without .pdf) |
| `pdfVariables` | text | No | JSON variables for PDF (legacy) |
| `pdf_var_*` | dynamic | No | PDF template-specific variable fields |

### Send Email with Generated Excel (`send_email_excel`)

Includes all fields from `send_email` plus:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `excelTemplateId` | dropdown | Yes | Excel attachment template |
| `excelFileName` | string | No | Custom Excel filename (without .xlsx) |
| `excelVariables` | text | No | JSON variables for Excel (legacy) |
| `excel_var_*` | dynamic | No | Excel template-specific variable fields |

### Send Starter Pack Email (`send_starter_pack_email`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `starterPackTemplate` | dropdown | Yes | Starter pack template slug |
| `to` | string | Yes | Recipient email address |
| `toName` | string | No | Recipient name |
| `fromName` | string | No | Sender display name |
| `replyTo` | string | No | Reply-to email address |
| `var_*` | dynamic | No | Template-specific variable fields |

**Available Starter Packs:**
- `sales-proposal` - Sales Proposal Email
- `order-confirmation` - Order Confirmation
- `shipping-notification` - Shipping Notification
- `invoice-email` - Invoice Email
- `welcome-email` - Welcome Email
- `meeting-invitation` - Meeting Invitation
- `password-reset` - Password Reset
- `payment-receipt` - Payment Receipt
- `appointment-reminder` - Appointment Reminder
- `newsletter` - Newsletter

### Send Bulk Email (`send_bulk_email`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `templateId` | dropdown | Yes | Email template |
| `recipients` | text | Yes | JSON array of recipients |
| `batchName` | string | No | Name for the batch |
| `sendAt` | datetime | No | Schedule send time |

---

## Trigger Output Fields

### Email Events (sent, delivered, opened, clicked, bounced)

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique event ID |
| `emailId` | string | Email log ID |
| `recipient` | string | Recipient email address |
| `subject` | string | Email subject |
| `status` | string | Email status |
| `timestamp` | datetime | Event timestamp |
| `templateId` | string | Template ID used |
| `templateName` | string | Template name |

### Link Clicked (`email_clicked`)

Additional fields:
| Field | Type | Description |
|-------|------|-------------|
| `clickedUrl` | string | URL that was clicked |
| `linkText` | string | Link text content |

### Unsubscribe Received (`unsubscribe_received`)

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique event ID |
| `email` | string | Unsubscribed email address |
| `category` | string | Unsubscribe category (if any) |
| `reason` | string | Unsubscribe reason |
| `timestamp` | datetime | Event timestamp |

---

## Local Development Setup

### 1. Install Dependencies

```bash
cd integrations/zapier-renderbase
npm install
```

### 2. Login to Zapier CLI

```bash
zapier login
```

This will open a browser window for authentication.

### 3. Create or Link the App

For a new app:
```bash
zapier register "Renderbase"
```

To link to an existing app:
```bash
zapier link
```

### 4. Configure Environment

Create a `.env` file for local development:

```bash
# Local development settings
RENDERBASE_API_URL=https://api.renderbase.dev
RENDERBASE_OAUTH_CLIENT_ID=your_zapier_client_id
RENDERBASE_OAUTH_CLIENT_SECRET=your_zapier_client_secret
```

Update `src/lib/config.js` if needed for local testing.

### 5. Validate the Integration

```bash
zapier validate
```

Expected output:
```
No structural errors found during validation routine.
This project is structurally sound!
- 31 checks passed
- 0 checks failed
```

---

## Zapier Developer Platform Setup

### 1. Access the Developer Platform

1. Go to [developer.zapier.com](https://developer.zapier.com)
2. Sign in with your Zapier account
3. Click "Start a Zapier Integration" or select your existing app

### 2. Configure App Information

In the Zapier Developer Platform:

**Basic Info:**
- **Name:** Renderbase
- **Description:** Renderbase is a powerful email delivery platform that sends transactional emails with dynamically generated PDF and Excel attachments.
- **Logo:** Upload Renderbase logo (256x256px PNG, RGBA mode, transparent background)
- **Category:** Email
- **Role:** Built by Renderbase team

**Intended Audience:**
- For initial development, select "Private"
- For public listing, select "Public"

### 3. Configure Branding

- **Primary Color:** #F97316 (Renderbase orange)
- **Homepage URL:** https://renderbase.dev
- **Support URL:** https://renderbase.dev/support
- **Documentation URL:** https://docs.renderbase.dev/integrations/zapier

---

## OAuth 2.0 Configuration

### 1. Register OAuth Client in Renderbase

In the Renderbase admin panel or via API, create an OAuth client:

```bash
# API call to create OAuth client
curl -X POST https://api.renderbase.dev/api/oauth/clients \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Zapier Integration",
    "redirectUris": [
      "https://zapier.com/dashboard/auth/oauth/return/App{YOUR_APP_ID}CLIAPI/"
    ],
    "scopes": [
      "emails:send",
      "emails:read",
      "templates:read",
      "webhooks:read",
      "webhooks:write",
      "profile:read"
    ],
    "grantTypes": ["authorization_code", "refresh_token"],
    "tokenEndpointAuthMethod": "client_secret_post"
  }'
```

**Important:** Save the `client_id` and `client_secret` returned.

### 2. Configure OAuth in Zapier Developer Platform

1. Go to your app in the Developer Platform
2. Navigate to **Authentication**
3. Select **OAuth 2.0**
4. Configure the following:

**Client ID:** `your_client_id_from_renderbase`

**Client Secret:** `your_client_secret_from_renderbase`

**Authorization URL:**
```
https://app.renderbase.dev/oauth/authorize
```

**Access Token Request URL:**
```
https://api.renderbase.dev/api/oauth/token
```

**Refresh Token Request URL:**
```
https://api.renderbase.dev/api/oauth/token
```

**Scope:** `emails:send emails:read templates:read webhooks:read webhooks:write profile:read`

**Test Trigger or API Call:**
```
GET https://api.renderbase.dev/api/v1/me
```

### 3. Configure Token Exchange

In the authentication settings, configure:

**Access Token Request:**
```json
{
  "method": "POST",
  "url": "https://api.renderbase.dev/api/oauth/token",
  "body": {
    "grant_type": "authorization_code",
    "code": "{{bundle.inputData.code}}",
    "client_id": "{{process.env.CLIENT_ID}}",
    "client_secret": "{{process.env.CLIENT_SECRET}}",
    "redirect_uri": "{{bundle.inputData.redirect_uri}}"
  }
}
```

**Refresh Token Request:**
```json
{
  "method": "POST",
  "url": "https://api.renderbase.dev/api/oauth/token",
  "body": {
    "grant_type": "refresh_token",
    "refresh_token": "{{bundle.authData.refresh_token}}",
    "client_id": "{{process.env.CLIENT_ID}}",
    "client_secret": "{{process.env.CLIENT_SECRET}}"
  }
}
```

### 4. Update Redirect URI in Renderbase

After creating the Zapier app, update the OAuth client with the actual redirect URI:

```
https://zapier.com/dashboard/auth/oauth/return/App{YOUR_APP_ID}CLIAPI/
```

Replace `{YOUR_APP_ID}` with your actual Zapier app ID.

---

## Testing the Integration

### 1. Local Testing with zapier test

```bash
# Run all tests
zapier test

# Run specific test files
zapier test --grep "send_email"
```

### 2. Test Authentication Flow

```bash
# Test OAuth flow
zapier invoke auth:start

# After authorizing, test that it worked
zapier invoke auth:test
```

### 3. Test Individual Actions

```bash
# Test sending an email
zapier invoke creates:send_email

# Test sending with PDF
zapier invoke creates:send_email_pdf

# Test starter pack email
zapier invoke creates:send_starter_pack_email

# Test finding an email
zapier invoke searches:find_email

# Test a trigger
zapier invoke triggers:email_sent
```

### 4. Test Dynamic Fields

The integration uses dynamic fields that fetch template variables. To test:

1. Create a test Zap in Zapier
2. Select the "Send Email" action
3. Connect your Renderbase account
4. Select a template
5. Verify that variable fields appear based on the template schema

### 5. Test with Sample Data

Create `test/sample_data.json`:
```json
{
  "send_email": {
    "templateId": "etpl_test123",
    "to": "test@example.com",
    "toName": "Test User",
    "subject": "Test Email from Zapier",
    "var_customerName": "John Doe",
    "var_orderId": "12345"
  },
  "send_starter_pack_email": {
    "starterPackTemplate": "sales-proposal",
    "to": "client@example.com",
    "toName": "Client Name",
    "var_customer__name": "Acme Corp",
    "var_customer__email": "buyer@acme.com",
    "var_deal__value": 50000
  }
}
```

### 6. End-to-End Testing

1. Push to Zapier: `zapier push`
2. Create a test Zap in zapier.com
3. Connect your Renderbase account
4. Test each trigger and action manually
5. Verify webhook subscriptions are created/deleted properly

---

## Deployment to Zapier

### 1. Final Validation

```bash
# Validate before pushing
zapier validate

# Build the integration
zapier build
```

### 2. Push the Integration

```bash
# Deploy to Zapier
zapier push

# View deployed versions
zapier versions
```

### 3. Promote a Version

```bash
# Promote version to production
zapier promote 1.0.0

# Or promote with specific percentage
zapier promote 1.0.0 --percent 50
```

### 4. Invite Testers

```bash
# Invite testers by email
zapier users:add user@example.com 1.0.0

# List invited users
zapier users:list
```

---

## Submitting for Public Listing

### 1. Pre-Submission Checklist

- [ ] All 6 triggers have accurate sample data
- [ ] All 5 actions have helpful field descriptions
- [ ] Dynamic fields work correctly for all actions
- [ ] Error messages are user-friendly
- [ ] OAuth flow works reliably
- [ ] Integration has been tested by 5+ beta users
- [ ] Documentation is complete

### 2. Required Assets for Public Listing

**App Logo:**
- 256x256 PNG with transparent background
- Square format, RGBA mode (not indexed/P mode)
- Renderbase brand logo

**Category:** Email

**Description (short):**
> Renderbase is a powerful email delivery platform that sends transactional emails with dynamically generated PDF and Excel attachments.

**Description (long):**
> Renderbase is a powerful email delivery platform that helps businesses send transactional emails with automatically generated attachments. Design once, generate PDFs and Excel files from the same template.
>
> **Key Features:**
> - Send personalized transactional emails with dynamic variable fields
> - Automatically generate PDF attachments (invoices, receipts, reports)
> - Automatically generate Excel attachments (data exports, spreadsheets)
> - Track email opens, clicks, and bounces
> - Trigger Zaps when emails are sent, delivered, opened, or clicked
> - Use pre-built Starter Pack templates for common use cases

### 3. Submit for Review

1. In the Developer Platform, click **Visibility**
2. Select **Public**
3. Complete all required fields
4. Submit for Zapier team review

**Review Timeline:** 2-4 weeks typically

### 4. Respond to Review Feedback

Zapier may request changes. Common feedback includes:
- Improving field help text
- Adding better sample data
- Clarifying error messages
- Adjusting trigger/action names
- Fixing label capitalization (e.g., "Send Email With Generated PDF")

---

## Maintenance and Updates

### Version Management

```bash
# View current versions
zapier versions

# Check migration status
zapier migrate 1.0.0 1.1.0

# Deprecate old version
zapier deprecate 1.0.0 2025-06-01
```

### Monitoring

1. **Zapier Dashboard:** Monitor usage and errors
2. **Renderbase Analytics:** Track API usage from Zapier
3. **Error Alerts:** Set up notifications for high error rates

### Common Updates

**Adding a new trigger:**
1. Create the trigger file in `src/triggers/`
2. Add to `index.js`
3. Test locally
4. Push and promote

**Adding a new action:**
1. Create the action file in `src/creates/`
2. Add dynamic field support if needed
3. Add to `index.js`
4. Test locally
5. Push and promote

**Updating OAuth scopes:**
1. Update Renderbase OAuth client
2. Update `src/authentication.js`
3. Users may need to re-authenticate

### Breaking Changes

For breaking changes:
1. Create a new major version
2. Provide migration path
3. Give users notice period (30+ days)
4. Deprecate old version

---

## Troubleshooting

### Common Issues

**OAuth Token Refresh Failing:**
- Check refresh token hasn't expired
- Verify client secret is correct
- Ensure refresh_token grant is enabled

**Webhook Subscriptions Not Working:**
- Verify webhook URL is accessible
- Check Renderbase webhook module is deployed
- Confirm user has webhooks:write scope

**Dynamic Fields Not Loading:**
- Check `/api/templates/:id/zapier-fields` endpoint is deployed
- Verify user has templates:read scope
- Check template has published version with variables

**Dynamic Dropdowns Empty:**
- Check template_list searches are working
- Verify user has templates:read scope
- Check API pagination handling

**Starter Pack Action Errors:**
- Verify user has imported the starter pack
- Check template slug matches exactly
- Confirm template exists in user's account

### Validation Warnings

The following warnings are expected and don't block deployment:

| Warning | Reason | Resolution |
|---------|--------|------------|
| "needs a successful task but doesn't have a Zap" | No live Zaps yet | Create test Zaps before publishing |
| "requires at least one connected account" | No OAuth connections | Connect account in testing |
| "must have at least 3 users with live Zaps" | Publishing requirement | Invite beta testers |
| "needs a titlecased label" | Style recommendation | Update labels (e.g., "Send Email With Generated PDF") |

### Getting Help

- **Zapier Documentation:** https://platform.zapier.com/docs
- **Zapier CLI Reference:** https://github.com/zapier/zapier-platform/tree/main/packages/cli
- **Renderbase Support:** support@renderbase.dev
- **Renderbase Docs:** https://docs.renderbase.dev/integrations/zapier

---

## Quick Reference

### Zapier CLI Commands

```bash
zapier login           # Authenticate with Zapier
zapier register        # Create new app
zapier link            # Link to existing app
zapier validate        # Validate integration
zapier build           # Build integration package
zapier test            # Run tests
zapier push            # Deploy to Zapier
zapier promote         # Promote version
zapier versions        # List versions
zapier logs            # View recent logs
zapier users:add       # Invite beta testers
zapier env:set         # Set environment variables
```

### Important URLs

- Developer Platform: https://developer.zapier.com
- CLI Documentation: https://platform.zapier.com/cli
- Renderbase API Docs: https://docs.renderbase.dev/api
- Renderbase OAuth Docs: https://docs.renderbase.dev/oauth

### API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/oauth/authorize` | GET | OAuth authorization |
| `/api/oauth/token` | POST | Token exchange/refresh |
| `/api/v1/me` | GET | Auth test/user info |
| `/api/v1/emails/send` | POST | Send single email |
| `/api/v1/emails/send-bulk` | POST | Send bulk emails |
| `/api/v1/emails` | GET | List/search emails |
| `/api/v1/emails/:id` | GET | Get email details |
| `/api/v1/templates` | GET | List templates |
| `/api/v1/templates/:id/zapier-fields` | GET | Get template Zapier fields |
| `/api/v1/webhook-subscriptions` | POST | Create webhook |
| `/api/v1/webhook-subscriptions/:id` | DELETE | Delete webhook |

### File Structure

```
integrations/zapier-renderbase/
├── index.js                    # Main entry point
├── package.json                # Dependencies and version
├── DEPLOYMENT.md               # This file
├── README.md                   # General documentation
├── .zapierapprc                # Zapier app config
├── build/                      # Built packages
│   ├── build.zip               # Deployment package
│   └── source.zip              # Source package
└── src/
    ├── authentication.js       # OAuth configuration
    ├── triggers/               # Trigger definitions
    │   ├── email_sent.js
    │   ├── email_delivered.js
    │   ├── email_opened.js
    │   ├── email_clicked.js
    │   ├── email_bounced.js
    │   └── unsubscribe_received.js
    ├── creates/                # Action definitions
    │   ├── send_email.js
    │   ├── send_email_pdf.js
    │   ├── send_email_excel.js
    │   ├── send_bulk_email.js
    │   └── send_starter_pack_email.js
    ├── searches/               # Search definitions
    │   ├── find_email.js
    │   ├── template_list.js
    │   ├── template_list_pdf.js
    │   ├── template_list_excel.js
    │   └── template_variables.js
    └── lib/                    # Shared utilities
        ├── config.js           # API configuration
        ├── action_helpers.js   # Action utilities & field definitions
        ├── dynamic_fields.js   # Dynamic field handling
        └── webhook_helpers.js  # Webhook utilities
```
