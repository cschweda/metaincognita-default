<template>
  <UApp>
    <!-- pb clears the fixed status bar so footer content is never hidden -->
    <div id="top" class="grain pb-[3.5rem]">
      <TheBackdrop />
      <NuxtPage />
    </div>
    <TheStatusBar />
  </UApp>
</template>
