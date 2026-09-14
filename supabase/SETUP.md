# DZD Store — Supabase setup

## 1. Create the project

Create a Supabase project and keep its URL/project reference private where appropriate.

## 2. Database

Run `supabase/schema.sql` in the SQL Editor.

## 3. Private Storage

Create a bucket named `products-private` and keep it **Private**, not Public.

Upload paid files only to this bucket using the object keys defined in `storage/manifest.example.json`.

## 4. Edge Function

Deploy `supabase/functions/create-download/index.ts` as `create-download`.

The function uses the server-side secret key only on the backend and creates a short-lived signed URL after checking that the order is `PAID`.

## 5. Secrets

Do not put Supabase secret/service keys in `index.html`, `app.js`, `downloads.html`, or GitHub. Configure them as Supabase Edge Function secrets. Supabase documents that secret/service-role keys bypass RLS and must never be exposed in the browser.

## 6. Payment

The payment provider webhook must update the matching order to `PAID` only after the provider's server-side verification succeeds. Never mark an order paid from a browser redirect alone.

Recommended states:

`PENDING → PAID`

or

`PENDING → FAILED / CANCELLED`

and later `PAID → REFUNDED`.

## 7. Frontend integration

The public site should call the download function with the order ID and product ID. It should never receive or store the private object key as a public download URL.

## Current status

The repository now contains the secure storage model, database schema, private-download function scaffold, and download page. Final activation requires the owner's Supabase project plus payment-provider credentials; those cannot safely be invented or committed to a public repository.
