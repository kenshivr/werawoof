<script setup lang="ts">
useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,800&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap',
    },
    {
      rel: 'stylesheet',
      // icon_names sirve un subset (~25KB vs 1.1MB la fuente completa):
      // todo ícono nuevo en el código debe agregarse acá, en orden alfabético
      href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&icon_names=account_circle,add,add_a_photo,analytics,arrow_back,arrow_forward,block,calendar_today,cancel,chat,chat_bubble,chat_bubble_outline,check,check_circle,chevron_left,chevron_right,close,computer,delete,description,drag_indicator,eco,edit,expand_more,explore,favorite,fingerprint,folder_special,forum,gavel,group,handshake,home,hourglass_empty,house,info,language,location_on,lock,lock_reset,login,logout,mail,mark_email_read,mark_email_unread,mood,percent,person,person_add,pets,phone,photo_camera,progress_activity,rate_review,refresh,school,search,send,sentiment_satisfied,share,smartphone,star,storage,swap_horiz,swipe,trending_up,upload_file,verified,visibility,visibility_off,warning,work&display=block',
    },
  ],
  style: [
    {
      innerHTML: `
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          font-family: 'Material Symbols Outlined';
        }
      `,
    },
  ],
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
