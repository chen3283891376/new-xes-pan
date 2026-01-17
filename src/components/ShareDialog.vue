<script lang="ts" setup>
import { ref } from 'vue';
import type { IFile } from '@/interfaces/cloudpan';

const props = defineProps<{
    file?: IFile | null;
    shareType?: string;
    showDialog: boolean;
}>();
const shareCode = ref('');

function copy() {
    navigator.clipboard.writeText(JSON.stringify(props.file));
    emit('close');
}
function download() {
    const file = JSON.parse(shareCode.value);
    window.open(
        `https://livefile.xesimg.com/programme/python_assets/844958913c304c040803a9d7f79f898e.html?name=${
            file.name
        }&file=${file.link.split('python_assets/')[1]}`,
        '_blank',
    );
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
