# چرم کارن — Karen Leather

**دامنه:** [karenleather.com](https://karenleather.com)

وب‌سایت مدرن React برای برند **چرم کارن** (صنایع چرم کارن افق نو).

## ساختار

سایت زنده **React** است (`karenleather-web`). هستهٔ وردپرس فقط آرشیو و منبع تصویر است؛ روی دامنه سرو نمی‌شود.

| مسیر | نقش |
|------|--------|
| `karenleather-web/` | فروشگاه + پنل ادمین (Vite / React / TypeScript) |
| `karenleather-web/src/pages/` | صفحات عمومی |
| `karenleather-web/src/admin/` | پنل `/admin` |
| `karenleather-web/src/components/` | UI مشترک |
| `karenleather-web/src/content/` | متن، منو، سئو، رسانه |
| `karenleather-web/src/data/` | کاتالوگ محصولات و دسته‌ها |
| `karenleather-web/src/lib/` | سبد، فیلتر فروشگاه، تصویر، API |
| `karenleather-web/src/types/` | تایپ‌های دامنه |
| `karenleather-web/scripts/` | dev، build، SEO، ادمین API |
| `_content/` | JSON استخراج‌شده از ووکامرس |
| `wp-content/uploads/` | تصاویر برند و محصول |
| `deploy-whm.sh` | انتشار روی cPanel |

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
