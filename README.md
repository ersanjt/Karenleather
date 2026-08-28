# چرم کارن — Karen Leather

**دامنه:** [karenleather.com](https://karenleather.com)

وب‌سایت مدرن React برای برند **چرم کارن** (صنایع چرم کارن افق نو).

## ساختار

| پوشه | توضیح |
|------|--------|
| `karenleather-web/` | اپ React — فروشگاه، ادمین، صفحات برند |
| `_content/` | محتوای استخراج‌شده از وردپرس (محصولات، دسته‌ها، صفحات) |
| `wp-content/uploads/` | تصاویر و مدia برند |

## اجرای محلی

```bash
cd karenleather-web
npm install
npm run dev
```

مرورگر: `http://127.0.0.1:5173`

## بیلد

```bash
cd karenleather-web
npm run build
```

خروجی در `karenleather-web/dist/`

## نکات

- `wp-config.php` و `_content/admin-credentials.json` در git نیستند (امنیت).
- پلاگین‌های وردپرس (`wp-content/plugins/`) عمداً exclude شده‌اند.
- لاگین ادمین dev: فقط با `npm run dev` — `admin@karenleather.com` / `admin`

## توسعه

طراحی و توسعه: [Ersan JT](https://github.com/ersanjt)
