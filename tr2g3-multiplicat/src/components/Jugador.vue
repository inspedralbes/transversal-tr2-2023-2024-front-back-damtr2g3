<template>
    <div>
        <img style="height: 100px;" :src="userImage" alt="User Image" />
        <span>Puntuació: {{ userScore }}</span>
    </div>
</template>

<script>
import { useAppStore } from '@/store/app';

export default {
    setup(){
        const store = useAppStore();
        const userImage = store.user.imatge;
        var userScore = store.user.puntuacio;

        return {
            userImage,
            userScore,
        }
    }
};
</script>
