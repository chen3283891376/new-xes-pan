/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// Composables
import { createVuetify } from 'vuetify';
import { VFileUpload } from 'vuetify/labs/VFileUpload';
import { VIconBtn } from 'vuetify/labs/VIconBtn';

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
    theme: {
        defaultTheme: 'system',
    },
    components: {
        VFileUpload,
        VIconBtn,
    },
});
