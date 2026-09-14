import { createClient } from 'npm:@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const secretKeys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}')
  const secretKey = secretKeys.default || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!secretKey) return json({ error: 'Server storage key is not configured' }, 500)

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, secretKey)
  const { order_id, product_id } = await req.json().catch(() => ({}))
  if (!order_id || !product_id) return json({ error: 'order_id and product_id are required' }, 400)

  const { data: order, error: orderError } = await admin.from('orders').select('id,status').eq('id', order_id).maybeSingle()
  if (orderError || !order) return json({ error: 'Order not found' }, 404)
  if (order.status !== 'PAID') return json({ error: 'Payment is not confirmed' }, 403)

  const { data: item, error: itemError } = await admin.from('order_items').select('product_id,file_key,file_name').eq('order_id', order_id).eq('product_id', product_id).maybeSingle()
  if (itemError || !item || !item.file_key) return json({ error: 'Product file is not configured' }, 404)

  const { data: product } = await admin.from('products').select('download_limit').eq('id', product_id).maybeSingle()
  const limit = Number(product?.download_limit || 5)

  const { data: signed, error: signError } = await admin.storage.from('products-private').createSignedUrl(item.file_key, 300, { download: item.file_name || true })
  if (signError || !signed?.signedUrl) return json({ error: 'Could not create download URL' }, 500)

  return json({ download_url: signed.signedUrl, expires_in: 300, max_downloads: limit })
})
