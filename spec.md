# Specification

## Summary
**Goal:** Update the admin login credentials and add a Settings section in the admin dashboard to allow credential changes.

**Planned changes:**
- Update hardcoded admin credentials in `AuthContext` to username `AnuragSingh` and password `Anurag@123`
- Add a Settings tab/section to the admin dashboard with a form containing fields for new username, current password, new password, and confirm new password
- On successful submission, update credentials in AuthContext state and sessionStorage for the current session
- Show clear success or error messages for validation failures (wrong current password, mismatched new passwords) and successful saves

**User-visible outcome:** The admin can log in at `/admin/login` with the new credentials (`AnuragSingh` / `Anurag@123`), and from the dashboard Settings section can change their username and password for the current session.
