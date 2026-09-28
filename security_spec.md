# Security Specification & Test Payloads

## 1. Data Invariants
- **Identity Isolation**: A user can only read, create, update, or delete their own user document under `/users/{userId}` where `request.auth.uid == userId`.
- **Subcollection Ownership**: An applied job record under `/users/{userId}/appliedJobs/{jobId}` can only be created, read, updated, or deleted by the owner where `request.auth.uid == userId` and `incoming().userId == request.auth.uid`.
- **Path Variable Validation**: Document IDs (`userId`, `jobId`) must conform to safe alphanumeric/hyphen string rules (`isValidId(id)`).
- **Volumetric Boundaries**: String fields like `rawText`, `jobTitle`, `company`, and `notes` have strict character length boundaries.
- **Default Deny**: Any path outside `/users/{userId}` and its subcollections is blocked by a global deny-all rule.

## 2. The Dirty Dozen Payloads (Designed to be REJECTED with PERMISSION_DENIED)
1. **Unauthenticated Read**: Attempting to read `/users/user123` with `request.auth = null`.
2. **Cross-User Snooping**: Authenticated user `alice` attempting to read `/users/bob`.
3. **Identity Spoofing in User Profile**: Authenticated user `alice` creating `/users/alice` with `userId: "bob"`.
4. **Oversized Resume Payload**: Creating `/users/alice` with `rawText` greater than 200,000 characters.
5. **Path Traversal / Malicious ID**: Creating `/users/alice/appliedJobs/../../evil`.
6. **Cross-User Applied Job Injection**: Authenticated user `alice` attempting to write to `/users/bob/appliedJobs/job1`.
7. **Applied Job Owner Tampering**: User `alice` writing to `/users/alice/appliedJobs/job1` with `userId: "bob"`.
8. **Invalid Status Enumeration**: Creating an applied job with `status: "hacked_status"`.
9. **Missing Required Fields**: Writing an applied job missing `company` or `appliedAt`.
10. **Oversized Notes Attack**: Submitting an applied job with `notes` exceeding 2,000 characters.
11. **Blanket Query Attempt**: Unauthenticated or cross-tenant query attempting to list all `/users`.
12. **Foreign Root Collection Access**: Writing to `/system_config` or `/admin_keys`.

## 3. Test Runner Definitions
Tests verify that each of the Dirty Dozen payloads fails with `PERMISSION_DENIED`.
