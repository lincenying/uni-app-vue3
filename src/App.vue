<script setup lang="ts">
import 'uno.css'
import '@/assets/scss/style.scss'

onLaunch(() => {
    console.log('App Launch')
})
onShow(() => {
    console.log('App Show')
})
onHide(() => {
    console.log('App Hide')
})
</script>
