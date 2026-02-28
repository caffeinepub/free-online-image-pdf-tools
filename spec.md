# Specification

## Summary
**Goal:** Add a "Change Password" form to the Settings section of the admin dashboard.

**Planned changes:**
- Add a "Change Password" subsection inside the existing Settings section of `AdminDashboardPage.tsx` with three fields: Current Password, New Password, and Confirm New Password.
- On submit, validate that fields are not empty, verify the current password against AuthContext credentials, and check that new password and confirm new password match.
- If valid, update the password in AuthContext state and sessionStorage.
- Display a success message on successful update, or a descriptive error message for wrong current password, mismatched passwords, or empty fields.
- Style the form and messages consistently with the existing dark gradient admin theme.

**User-visible outcome:** Admins can change their password from the Settings section of the dashboard. The new password is immediately active for the current session and persists so the admin can log out and log back in using the updated credentials.
