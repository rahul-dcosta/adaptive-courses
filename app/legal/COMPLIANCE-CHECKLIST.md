# Legal Compliance Checklist - Adaptive Courses

**Last Updated:** 2026-02-01  
**Status:** PRE-LAUNCH PREPARATION

---

## ⚠️ H1B COMPLIANCE - CRITICAL

**BEFORE ANY PUBLIC LAUNCH OR REVENUE:**

### Corporate Structure
- [ ] **Form Manager-Managed LLC in Delaware**
  - File Certificate of Formation ($90)
  - Appoint registered agent ($50-100/year)
  - Total cost: ~$200 + annual fees

- [ ] **Execute Operating Agreement**
  - Use template in `legal/OPERATING-AGREEMENT-TEMPLATE.md`
  - Define Rahul as Passive Member (90-95% equity)
  - Define Co-founder as Managing Member (5-10% equity)
  - Sign and notarize
  - **IMMIGRATION ATTORNEY REVIEW REQUIRED** (cost: $200-300)

- [ ] **Find US Citizen Co-Founder**
  - Must be willing to be Managing Member
  - Receives 5-10% equity
  - Has full operational control
  - Can hire, fire, sign contracts
  - Rahul has identified potential candidates

- [ ] **Get Immigration Attorney Review**
  - Law firm specializing in H1B
  - Review operating agreement
  - Confirm structure is compliant
  - Get letter for USCIS records
  - Budget: $200-300

### GitHub and Public Code
- [ ] **Transfer Repos to Company GitHub Org**
  - Create GitHub organization owned by co-founder
  - Transfer all repos to org
  - Co-founder controls access and merges
  - Alternative: Make all repos private

- [ ] **Remove Personal Commits** (if necessary)
  - Rewrite git history to show org/company as author
  - Use co-founder's account for future commits
  - OR: Keep private and use "AI tools assisted development"

### Business Accounts
- [ ] **Open Business Bank Account**
  - Co-founder is primary signatory
  - Rahul has NO signing authority
  - Use for all business transactions

- [ ] **Set Up Stripe Account**
  - Register under company name: [COMPANY NAME LLC]
  - Co-founder provides business details
  - Co-founder signs Stripe agreements
  - Rahul is NOT a signatory

- [ ] **Register Resend Account**
  - Use company email domain
  - Co-founder manages account
  - Email sending on behalf of company

### Public Presence
- [ ] **Update All Public Documentation**
  - Remove references to "Rahul D'Costa, Founder"
  - Use "[COMPANY NAME LLC]" or "Company" throughout
  - Support email: support@adaptivecourses.com (not personal)
  - No individual names in Terms, Privacy, or marketing

- [ ] **Social Media Accounts**
  - Twitter/X: Company account (co-founder manages)
  - LinkedIn: Company page (co-founder is admin)
  - No personal accounts representing company

---

## 📄 Legal Documents - REQUIRED FOR LAUNCH

### Core Legal Pages
- [x] **Terms of Service** (`legal/TERMS-OF-SERVICE.md`)
  - AI content disclaimer ✅
  - Refund policy integrated ✅
  - Arbitration clause ✅
  - CCPA/GDPR provisions ✅
  - **TODO:** Fill in [COMPANY NAME LLC] and addresses

- [x] **Privacy Policy** (`legal/PRIVACY-POLICY.md`)
  - Data collection disclosures ✅
  - Third-party processors (Stripe, Anthropic, Supabase, Resend, Vercel) ✅
  - CCPA/GDPR compliance ✅
  - Cookie policy ✅
  - **TODO:** Fill in [COMPANY NAME LLC] and addresses

- [x] **Refund Policy** (`legal/REFUND-POLICY.md`)
  - Digital goods non-refundable ✅
  - Subscription terms ✅
  - Chargeback warnings ✅
  - **TODO:** Fill in [COMPANY NAME LLC]

- [ ] **Deploy Legal Pages**
  - Create `/terms` route
  - Create `/privacy` route
  - Create `/refund` route
  - Link from footer and checkout

### Stripe Requirements
- [ ] **Stripe Account Setup**
  - Business name: [COMPANY NAME LLC]
  - Business address (can use registered agent)
  - EIN (from IRS - see below)
  - Business type: Limited Liability Company
  - Industry: Online education / SaaS
  - Support email: support@adaptivecourses.com
  - Refund policy URL: https://adaptivecourses.com/refund
  - Terms of Service URL: https://adaptivecourses.com/terms

- [ ] **Stripe Products**
  - Create "Per-Course Purchase" ($3.99 one-time)
  - Create "Pro Monthly" ($9.99/month recurring)
  - Create "Pro Annual" ($99/year recurring)
  - Add product descriptions
  - Set tax codes (if applicable)

- [ ] **Stripe Compliance**
  - Add business logo
  - Complete business verification
  - Enable automatic payouts
  - Set up bank account (business account only)

---

## 🏛️ Business Registration

### IRS and Federal
- [ ] **Apply for EIN (Employer Identification Number)**
  - Online at IRS.gov (free, takes 10 minutes)
  - Needed for bank account and Stripe
  - Even if no employees

- [ ] **File Form 8832** (if electing S-Corp or C-Corp tax treatment)
  - Default: LLC taxed as partnership
  - Consult CPA before electing S-Corp

### State Registration
- [ ] **Delaware LLC Formation**
  - File Certificate of Formation online
  - Pay filing fee (~$90)
  - Appoint registered agent
  - Receive Certificate from Secretary of State

- [ ] **Foreign LLC Registration** (if operating in another state)
  - If Rahul/co-founder reside outside Delaware
  - File in state of principal operations
  - Costs vary by state ($50-300)

- [ ] **Business Licenses**
  - Check local/state requirements
  - Most online businesses: no special license needed
  - Verify with local chamber of commerce

### Banking
- [ ] **Open Business Bank Account**
  - Choose bank (Chase, Bank of America, Mercury, etc.)
  - Bring: EIN, Operating Agreement, Certificate of Formation
  - Co-founder is primary owner/signer
  - Rahul is NOT a signer (H1B compliance)

- [ ] **Business Credit Card** (optional)
  - Helps separate personal/business expenses
  - Builds business credit
  - Co-founder applies and is cardholder

---

## 💼 Accounting and Taxes

### Tax Structure
- [ ] **Choose Tax Classification**
  - Default: Partnership (LLC with 2+ members)
  - Alternative: S-Corp (consult CPA)
  - File appropriate elections with IRS

- [ ] **Set Up Accounting**
  - Use QuickBooks, Xero, or Wave
  - Track all revenue and expenses
  - Separate business/personal accounts

- [ ] **Hire CPA/Accountant**
  - Find CPA experienced with LLCs
  - Discuss tax optimization
  - Plan for quarterly estimated taxes
  - Budget: $500-1500/year for small LLC

### Tax Obligations
- [ ] **Federal Tax Returns**
  - Form 1065 (Partnership return) - due March 15
  - Schedule K-1 for each member
  - Estimated quarterly taxes

- [ ] **State Tax Returns**
  - Delaware annual report + franchise tax ($300/year minimum)
  - State where business operates (if different)
  - State income tax (varies by state)

- [ ] **Sales Tax** (if applicable)
  - Determine nexus (where you must collect sales tax)
  - Register with state tax authorities
  - Collect and remit sales tax
  - **Note:** Digital goods have complex sales tax rules - consult CPA

---

## 🌐 Domain and Email

### Domain Setup
- [ ] **Purchase Domain**
  - adaptivecourses.com (primary)
  - Optional: adaptive-courses.com (redirect)
  - Cost: ~$15-20/year

- [ ] **Configure DNS**
  - Point to Vercel (for website)
  - Set up MX records (for email)
  - Set up SPF, DKIM, DMARC (for email deliverability)

### Email Setup
- [ ] **Professional Email**
  - Option 1: Google Workspace ($6/user/month)
  - Option 2: Microsoft 365 ($5/user/month)
  - Option 3: Fastmail ($5/month)
  - Use: support@adaptivecourses.com

- [ ] **Resend Custom Domain**
  - Configure DNS for Resend
  - Verify domain ownership
  - Update FROM_EMAIL in `.env`

- [ ] **Email Addresses Needed**
  - support@adaptivecourses.com (customer support)
  - privacy@adaptivecourses.com (privacy inquiries)
  - hello@adaptivecourses.com (general inquiries)
  - billing@adaptivecourses.com (optional, for Stripe)

---

## 🔒 Security and Compliance

### Data Protection
- [ ] **HTTPS/SSL**
  - Vercel provides automatically ✅
  - Verify certificate is valid

- [ ] **Environment Variables**
  - Store all secrets in Vercel env vars
  - Never commit API keys to git
  - Use separate keys for dev/prod

- [ ] **Data Encryption**
  - Passwords hashed (bcrypt or argon2)
  - Sensitive data encrypted at rest (Supabase handles this)
  - Use HTTPS for all API calls

### GDPR Compliance (if EU users)
- [ ] **Cookie Consent Banner**
  - Implement if using analytics cookies
  - Options: OneTrust, Cookiebot, or custom
  - Link to Privacy Policy

- [ ] **Data Processing Agreement**
  - Sign DPA with Supabase (EU data hosting)
  - Sign DPA with other processors if required

- [ ] **User Rights Implementation**
  - Account deletion feature
  - Data export feature (JSON)
  - Email opt-out mechanism

### CCPA Compliance (if California users)
- [x] **Privacy Policy Updated** ✅
  - CCPA rights section included
  - "Do Not Sell" provision (we don't sell data)

- [ ] **Data Request Process**
  - Handle CCPA requests within 45 days
  - Verify identity of requester
  - Provide data in portable format

---

## 📢 Marketing and Social

### Social Media Setup
- [ ] **Twitter/X Account**
  - Handle: @adaptivecourses (if available)
  - Bio: "AI-powered courses tailored to you. Learn game theory, supply chain, anything—adapted to your goals."
  - Link: https://adaptivecourses.com
  - Co-founder manages account

- [ ] **LinkedIn Company Page**
  - Company name: [COMPANY NAME LLC]
  - Tagline: "Learn complex topics, fast."
  - Industry: E-Learning
  - Co-founder is admin

- [ ] **Product Hunt Profile** (for launch)
  - Prepare launch materials
  - Screenshots, demo video
  - Co-founder submits as "Maker"

### Branding
- [ ] **Logo**
  - Designed and finalized
  - SVG + PNG formats
  - Light/dark versions

- [ ] **Open Graph Images**
  - For social sharing
  - 1200x630px recommended
  - Includes logo + tagline

---

## ✅ Pre-Launch Checklist

### T-Minus 7 Days
- [ ] LLC formed and operating agreement signed
- [ ] Immigration attorney reviewed structure
- [ ] EIN obtained
- [ ] Business bank account opened
- [ ] Stripe account approved and products created
- [ ] Domain purchased and DNS configured
- [ ] Email addresses set up (support@, privacy@)
- [ ] Legal pages deployed (/terms, /privacy, /refund)
- [ ] All docs updated to remove personal names

### T-Minus 3 Days
- [ ] End-to-end payment testing (Stripe test mode)
- [ ] Email delivery testing (OTP, magic links, receipts)
- [ ] Course generation tested on production
- [ ] Mobile responsiveness verified
- [ ] Browser compatibility tested (Chrome, Safari, Firefox)

### T-Minus 1 Day
- [ ] Stripe switched to LIVE mode
- [ ] Environment variables verified in Vercel
- [ ] Backup plan for outages
- [ ] Monitoring/alerting set up (if using Sentry)
- [ ] Support email monitored

### Launch Day
- [ ] Final smoke test (create account, buy course, verify receipt)
- [ ] Post on Twitter/X
- [ ] Post on LinkedIn
- [ ] Submit to Product Hunt (if planned)
- [ ] Monitor for issues (server errors, payment failures)

---

## 🚨 Red Flags to Avoid (H1B)

**NEVER:**
- ❌ List Rahul as "Founder" or "CEO" publicly
- ❌ Have Rahul sign contracts, invoices, or legal documents
- ❌ Show Rahul making hiring or operational decisions
- ❌ Use Rahul's personal email for business correspondence
- ❌ Have Rahul answer customer support (co-founder or contractors only)
- ❌ Public GitHub commits under Rahul's personal account
- ❌ Blog posts or content authored by Rahul as company representative

**ALWAYS:**
- ✅ Refer to "the Company" or "[COMPANY NAME LLC]"
- ✅ Co-founder makes all operational decisions
- ✅ Co-founder signs all contracts and legal documents
- ✅ Use company email addresses (support@, hello@)
- ✅ Co-founder manages GitHub org and deployments
- ✅ Narrative: "Rahul is a passive investor. Co-founder runs operations with AI tools."

---

## 📞 Contacts and Resources

### Legal
- **Immigration Attorney:** [TO BE HIRED]
  - Specialty: H1B compliance
  - Budget: $200-300 for Operating Agreement review

- **Business Attorney:** [OPTIONAL]
  - For contract review, disputes
  - Budget: $200-400/hour (use sparingly)

### Accounting
- **CPA/Accountant:** [TO BE HIRED]
  - LLC tax returns, quarterly estimates
  - Budget: $500-1500/year

### Services
- **Registered Agent:** [TO BE SELECTED]
  - Delaware registered agent services
  - Options: Northwest Registered Agent, Incfile, LegalZoom
  - Cost: $50-125/year

- **Business Bank:** [TO BE SELECTED]
  - Options: Chase, Bank of America, Mercury (online)

---

## 📚 Reference Documents

All templates and guides are in `/root/projects/adaptive-courses/app/legal/`:

1. `TERMS-OF-SERVICE.md` - Complete, H1B-compliant
2. `PRIVACY-POLICY.md` - Complete, GDPR/CCPA-compliant
3. `REFUND-POLICY.md` - Complete, Stripe-compatible
4. `OPERATING-AGREEMENT-TEMPLATE.md` - H1B-specific, ready for attorney review
5. `COMPLIANCE-CHECKLIST.md` - This file

**H1B Context:** `/root/clawd/memory/h1b-legal-structure.md`

---

## ✅ Completion Tracking

**Overall Progress:** 0% Legal / 0% Corporate

**Critical Path Items (must be done before revenue):**
1. Form LLC
2. Get EIN
3. Execute Operating Agreement (attorney-reviewed)
4. Open business bank account
5. Set up Stripe under LLC name
6. Deploy legal pages

**Estimated Time to Complete Critical Path:** 2-3 weeks  
**Estimated Cost:** ~$500-800 total

---

**Last Updated:** 2026-02-01  
**Next Review:** Before any public launch or revenue generation

**REMINDER:** Do NOT generate revenue or publicly launch until corporate structure is in place. H1B compliance is non-negotiable.
