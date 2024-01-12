<template>
    <div>
        <img :class="{ 'attack-animation': store.user.isAttacking }" style="height: 250px;" :src="userImage" alt="User Image" />

    </div>
</template>


<script>
import { useAppStore } from '@/store/app';

export default {
    
    setup() {
        const store = useAppStore();
        const userImage = store.user.imatge;
        let userScore = store.user.puntuacio;

        return {
            userImage,
            userScore,
            store,
        }
    },
};

</script>

<style scoped>
.attack-animation {
    animation: plunge 1s forwards;
}

@keyframes plunge {
    0% { transform: translate(0, 0); }
    50% { transform: translate(38vw, -38vw); }
    100% { transform: translate(0, 0); }
}
</style>
