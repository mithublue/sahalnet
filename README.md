# ISP Multi-Tenant SaaS - Project Documentation

## Project Overview
A comprehensive multi-tenant SaaS application for ISP (Internet Service Provider) management with support for multiple languages (English, Arabic, Bengali) and MikroTik router integration.

## Technology Stack
- **Backend:** Laravel 11
- **Frontend:** React + Inertia.js + Tailwind CSS
- **Multi-tenancy:** stancl/tenancy
- **Permissions:** Spatie Laravel Permission
- **Maps:** Leaflet.js
- **Database:** MySQL

## Completed Features

### ✅ Week 1: Foundation & Multi-Tenancy
- Laravel 11 project setup
- React + Inertia.js + Tailwind CSS
- Multi-tenant architecture with subdomain routing
- Authentication system

### ✅ Week 2: Localization & User Management
- Multi-language support (en, ar, bn)
- RTL/LTR switching
- User management with roles (super_admin, admin, manager, support, accountant)
- Permission-based access control

### ✅ Week 3: Customer & Package Management
- Customer management with KYC fields
- GPS-based location tracking with Leaflet.js
- Internet package management
- Connection management (suspend/activate/renew)
- Dashboard with statistics

### ✅ Week 4: MikroTik Integration (95% Complete)
- MikroTik router management (CRUD)
- PPPoE credential auto-generation
- Connection sync automation
- Router connection testing
- Encrypted password storage

## 🔴 Pending Tasks

### MikroTik Integration - Remaining 5%

**Task:** Implement Full MikroTik RouterOS API Integration

**Location:** `app/Services/MikroTikService.php`

**What's Done:**
- ✅ Service stub with all method signatures
- ✅ Database tables and models
- ✅ Frontend UI complete
- ✅ Auto-sync functionality
- ✅ PPPoE credential generation

**What's Needed:**
1. **Install MikroTik API Package** (when available)
   ```bash
   # Research and install appropriate RouterOS API package
   # Options: routeros-api-php or similar
   ```

2. **Implement API Methods in MikroTikService.php:**
   - `connect()` - Establish connection to RouterOS API
   - `createPPPoESecret()` - Create PPPoE user on router
   - `updatePPPoESecret()` - Update existing PPPoE user
   - `deletePPPoESecret()` - Remove PPPoE user
   - `togglePPPoESecret()` - Enable/disable user
   - `createProfile()` - Create bandwidth profile
   - `getActiveConnections()` - Fetch active sessions
   - `disconnectUser()` - Force disconnect user
   - `getTrafficStats()` - Get user bandwidth usage

3. **Testing Requirements:**
   - Physical MikroTik router or RouterOS VM
   - API service enabled on router (IP → Services → API)
   - Network connectivity between app server and router
   - Test credentials with full API access

4. **Implementation Steps:**
   - Replace stub methods with actual API calls
   - Add error handling and logging
   - Test each method individually
   - Implement retry logic for failed connections
   - Add connection pooling if needed

**Priority:** Medium (can be done when MikroTik router is available)

**Estimated Time:** 4-6 hours with router access

---

## Next Development Phase

### Week 5: Billing & Invoicing
- Invoice generation
- Payment tracking
- Billing cycles
- Payment reminders

### Week 6: Accounting Module
- Chart of accounts
- Journal entries
- Financial reports

### Week 7: Inventory Management
- Equipment tracking
- Stock management

### Week 8: HR & Payroll
- Employee management
- Salary processing
- Payment gateway integration

---

## Quick Start

### Tenant Creation
```bash
php artisan tenant:create {tenant_name} {domain}
```

### Run Migrations for Tenant
```bash
php artisan tenants:migrate --tenants={tenant_name}
```

### Seed Permissions
```bash
php artisan tenants:seed --tenants={tenant_name} --class=RolesAndPermissionsSeeder
```

### Access Application
- Landlord: `http://localhost:8000`
- Tenant: `http://{tenant}.localhost:8000`

---

## Important Notes

### MikroTik Integration
- Current implementation uses stub methods
- Full API integration requires physical router
- All UI and database structure is complete
- PPPoE credentials auto-generate on connection creation

### Database Structure
- Landlord database: `isp_landlord`
- Tenant databases: `{tenant_name}` (e.g., `sahal`, `fresh`)

### Default Credentials
- Super Admin: (set during tenant creation)
- Roles: super_admin, admin, manager, support, accountant

---

## Support & Documentation
For questions or issues, refer to:
- Laravel Documentation: https://laravel.com/docs
- Inertia.js Documentation: https://inertiajs.com
- Stancl Tenancy: https://tenancyforlaravel.com
