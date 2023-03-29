<template>
    <div>
       <WebGLDemo1 />
       <WebGLDemo2 />
       <WebGLDemo3 />
    </div>
</template>

<script>
import WebGLDemo1 from '@/components/WebGLDemo1.vue';
import WebGLDemo2 from '@/components/WebGLDemo2.vue';
import WebGLDemo3 from '@/components/WebGLDemo3.vue';

export default {
    name: 'WebGLTest',
    components: {WebGLDemo1, WebGLDemo2, WebGLDemo3}
}
</script>
  
<style>
</style>

