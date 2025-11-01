<script lang="ts" setup>
import { defineProps, defineEmits, ref } from 'vue';
const props = defineProps<{
    file?: any;
    shareType?: string;
    showDialog: boolean;
}>();
const shareCode = ref('');

function copy() {
    navigator.clipboard.writeText(JSON.stringify(props.file));
    emit('close');
}
function download() {
    const file = JSON.parse(shareCode.value)
    window.open(file.link, '_blank')
    shareCode.value = '';
    emit('close');
}

const emit = defineEmits(['close']);
</script>
<template>
    <v-dialog v-model="props.showDialog" width="auto" @close="emit('close')">
        <v-card v-if="props.shareType === 'mine'">
            <v-card-text>
                <v-text-field readonly width="auto">
                    {{ JSON.stringify(props.file) }}
                </v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="copy()"> 拷贝 </v-btn>
                <v-btn @click="emit('close')"> 取消 </v-btn>
            </v-card-actions>
        </v-card>
        <v-card v-else>
            <v-card-text>
                <v-text-field width="500px" placeholder="输入别人给你的分享码" v-model="shareCode"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="download()" :disabled="shareCode === ''"> 下载 </v-btn>
                <v-btn @click="emit('close')"> 取消 </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped></style>
