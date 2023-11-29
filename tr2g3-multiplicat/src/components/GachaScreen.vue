<template>
    <v-app>
        <v-container class="d-flex flex-column align-center justify-center" style="height: 100vh;">
            <Pokeball ref="pokeball" />
            <v-btn @click="rollGacha">Roll Gacha</v-btn>
            <v-dialog v-model="dialog" width="500">
            <v-card>
                <v-img :src="selectedItem.image"></v-img>
                <v-card-title>{{ selectedItem.name }}</v-card-title>
                <v-card-text>{{ selectedItem.description }}</v-card-text>
            </v-card>
            </v-dialog>
        </v-container>
    </v-app>
    </template>
    
    <script>
    import { useAppStore } from '@/store/app';
    import Pokeball from './Pokeball.vue';
    
    export default {
        components: {
            Pokeball,
        },
        data: () => ({
            rarities: [
                { name: 'common', probability: 0.5 },
                { name: 'uncommon', probability: 0.3 },
                { name: 'rare', probability: 0.1 },
                { name: 'epic', probability: 0.07 },
                { name: 'legendary', probability: 0.03 },
            ],
            items: [
                { name: 'Item 1', image: 'item1.jpg', description: 'This is item 1', rarity: 'common' },
                { name: 'Item 2', image: 'item2.jpg', description: 'This is item 2', rarity: 'uncommon' },
                { name: 'Item 3', image: 'item3.jpg', description: 'This is item 3', rarity: 'rare' },
                { name: 'Item 4', image: 'item4.jpg', description: 'This is item 4', rarity: 'epic' },
                { name: 'Item 5', image: 'item5.jpg', description: 'This is item 5', rarity: 'legendary' },
            ],
            selectedItem: {},
            dialog: false,
        }),
        methods: {
            async rollGacha() {
                const store = useAppStore();
                const coste = 100;
    
                if (store.user.puntuacio >= coste) {
                    store.reduirPuntuacio(coste);
                    let rarity = this.rollRarity();
                    console.log(`You rolled a ${rarity} item!`);
                    this.selectedItem = this.rollItem(rarity);
                    console.log(`You got ${this.selectedItem.name}!`);
                    await this.showAnimation();
                    this.dialog = true;
                } else {
                    alert('No tens prou punts!');
                }
            },
            rollRarity() {
                let totalProbability = this.rarities.reduce((total, rarity) => total + rarity.probability, 0);
                let roll = Math.random() * totalProbability;
                console.log(roll);
                for (let rarity of this.rarities) {
                    if (roll < rarity.probability) {
                        return rarity.name;
                    }
                    roll -= rarity.probability;
                }
                return this.rarities[this.rarities.length - 1].name;
            },
            rollItem(rarity) {
                let itemsOfRarity = this.items.filter(item => item.rarity === rarity);
                let index = Math.floor(Math.random() * itemsOfRarity.length);
                return itemsOfRarity[index];
            },
            async showAnimation() {
                this.$refs.pokeball.toggleOpen();
                await this.$nextTick(); // Wait for the DOM to update
                return new Promise(resolve => setTimeout(() => {
                    this.$refs.pokeball.toggleOpen();
                    resolve();
                }, 2000)); // Wait for 2 seconds
            },
        },
    };
    </script>
    