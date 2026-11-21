# Junior Labs - paquete de marca

svg/                    Vectores: icon-navy, icon-light, logos horizontales claro/oscuro
svg/*-fullbleed.svg     Iconos cuadrados sin esquinas redondeadas
png/icon-navy|icon-light/
  *-16..1024.png               Con esquinas redondeadas y transparencia
  *-apple-touch-icon-180.png   Cuadrado completo (iOS pone sus esquinas)
  *-maskable-512.png           Cuadrado completo para PWA / Android
favicon/                favicon-navy.ico, favicon-light.ico (16, 32 y 48 px)
extras-simple-icon/     Version simplificada JR_ (sin llaves) para 16 y 32 px
palette/                colors.css, colors.json, palette.md, palette.svg/png

## HTML

<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/icon-navy.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/icon-navy-apple-touch-icon-180.png">
<link rel="manifest" href="/site.webmanifest">

## site.webmanifest

{"name":"Junior Labs","icons":[
 {"src":"/icon-navy-192.png","sizes":"192x192","type":"image/png"},
 {"src":"/icon-navy-512.png","sizes":"512x512","type":"image/png"},
 {"src":"/icon-navy-maskable-512.png","sizes":"512x512","type":"image/png","purpose":"maskable"}]}
