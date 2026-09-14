# Private Product Storage

هذا المجلد يحتوي على توثيق فقط. **لا تضع ملفات المنتجات المدفوعة هنا ولا في GitHub** لأن المستودع عام.

## البنية المقترحة

`products/{product-id}/{private-file}`

مثال:

- `products/1/dzd-al-tajer-al-thaki-ai.pdf`
- `products/2/social-media-templates.pptx`

## قواعد الأمان

1. الملفات الأصلية تكون في Private Bucket / Private Object Storage.
2. لا نضع رابط الملف الأصلي في HTML أو JavaScript.
3. العميل لا يحصل على رابط دائم.
4. بعد تأكيد الدفع على الخادم فقط، يتم إنشاء Signed URL مؤقت.
5. يفضّل تحديد مدة صلاحية قصيرة للرابط وعدد تنزيلات محدود.
6. يجب التحقق من حالة الطلب على الخادم قبل كل تنزيل.
7. Webhook الدفع يجب التحقق من توقيعه، ومعالجة الطلبات بشكل idempotent.
8. عند Refund يمكن إلغاء صلاحية الوصول.

## ربط المنتج بالملف

كل منتج سيحتوي في قاعدة البيانات على `file_key` فقط، مثل:

`products/1/dzd-al-tajer-al-thaki-ai.pdf`

ولا يحتوي المتجر العام على رابط التخزين المباشر.

## الحالة الحالية

واجهة GitHub Pages الحالية Static، لذلك هذا المجلد يجهز عقد التخزين فقط. الخطوة التالية هي ربط Backend + Private Storage + بوابة الدفع، ثم تفعيل endpoint مثل:

`POST /api/download`

بحيث يرسل العميل `order_id` ويدقق الخادم أن الطلب `PAID` قبل إصدار رابط مؤقت.
