import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import uni from '@dcloudio/vite-plugin-uni'
// @ts-expect-error 1234
import DefineOptions from 'unplugin-vue-define-options/vite'
// @ts-expect-error 1234
import ReactivityTransform from '@vue-macros/reactivity-transform/vite'

const vmDesignWidth = 375 // 设计稿宽度
const vmDesignMultiple = vmDesignWidth / 750
const minWindow = '320Px' // 兼容最小宽度
const maxWindow = '540Px' // 兼容最小宽度
const vmFontSize = 37.5

export const fontSize = vmFontSize

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

    const __dirname = path.dirname(fileURLToPath(import.meta.url))

    const localMock = true
    const prodMock = false
    const config = {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `
                    $vmDesignWidth: ${vmDesignWidth};
                    $vmDesignMultiple: ${vmDesignMultiple};
                    $minWindow: ${minWindow};
                    $maxWindow: ${maxWindow};
                    $vmFontSize: ${vmFontSize};
                `,
                },
            },
        },
        plugins: [
            DefineOptions(),
            ReactivityTransform(),
            uni(),
            viteMockServe({
                mockPath: 'mock',
                localEnabled: command === 'serve' && localMock,
                prodEnabled: command !== 'serve' && prodMock,
                injectCode: `
                    import { setupProdMockServer } from '${path.resolve('./src/mockProdServer')}';
                    setupProdMockServer();
                `,
                logger: true,
            }),
            AutoImport({
                eslintrc: {
                    enabled: true,
                },
                include: [
                    /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
                    /\.vue$/,
                    /\.vue\?vue/, // .vue
                    /\.md$/, // .md
                ],
                imports: [
                    'vue',
                    '@vueuse/core',
                    '@vueuse/head',
                    {
                        '@dcloudio/uni-app': ['onHide', 'onLaunch', 'onShow'],
                        'pinia': ['defineStore', 'storeToRefs'],
                        'lcy-utils': ['deepClone', 'deepMerge'],
                        '@/api': ['$api'],
                    },
                ],
                dts: 'src/auto-imports.d.ts',
                dirs: ['src/components', 'src/composables', 'src/pinia'],

                resolvers: [],
                defaultExportByFilename: false,
                vueTemplate: true,
                cache: false,
            }),
            Components({
                include: [
                    /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
                    /\.vue$/,
                    /\.vue\?vue/, // .vue
                    /\.md$/, // .md
                ],
                extensions: ['vue', 'tsx', 'jsx'],
                resolvers: [],
                dts: 'src/components.d.ts',
            }),
            UnoCSS({
                /* options */
            }),
        ],
        resolve: {
            alias: {
                '@': path.join(__dirname, './src'),
            },
        },
    }
    return config
})
