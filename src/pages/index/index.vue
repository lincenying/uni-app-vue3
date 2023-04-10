<template>
    <div class="home-wrap" :class="$options.name">
        <div class="route-wrap">
            <div p-20px>{{ title }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineOptions({
    name: 'home-router',
})

const title = $ref('这是标题')
</script>
