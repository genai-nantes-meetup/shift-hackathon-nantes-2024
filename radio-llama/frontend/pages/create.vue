<template>
    <div class="grid grid-cols-12 gap-4 p-5">
        <div class="flex flex-col col-span-10 col-start-2 gap-10">
            <div class="flex flex-col items-start gap-8 justify-between w-full p-10 bg-card rounded-lg">
                <div class="flex flex-col w-full gap-8">
                    <h2 class="flex items-center gap-4">
                        <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-llama">
                            <span class="text-2xl">🦙</span>
                        </div>
                        CHOOSE YOUR RADIO STYLE (Max 5)
                    </h2>
                    <div class="flex flex-wrap gap-4">
                        <div v-for="style in radioStyles" :key="style" class="flex items-center gap-4">
                            <Button 
                                :class="{'selected-button': selectedStyles.includes(style)}"
                                :label="style"
                                rounded 
                                @click="toggleStyle(style)"/>
                        </div>
                    </div>
                </div>
            </div>  
        </div>

        <transition name="fade" mode="out-in">
            <div v-if="showPersonalityCard" ref="personalityCard" class="flex flex-col col-start-2 col-span-10 gap-10">
                <div class="flex flex-col items-start gap-8 justify-between w-full p-10 bg-card rounded-lg">
                    <div class="flex flex-col w-full gap-8">
                        <h2 class="flex items-center gap-4">
                            <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-llama">
                                <span class="text-2xl">🦙</span>
                            </div>
                            CHOOSE THE BROADCASTER PERSONALITY (Max 1)
                        </h2>
                        <div class="flex flex-wrap gap-4">
                            <div v-for="personality in radioPersonalities" :key="personality" class="flex items-center gap-4">
                                <Button 
                                    :class="{'selected-button': selectedPersonality === personality}"
                                    :label="personality"
                                    rounded 
                                    @click="togglePersonality(personality)"/>
                            </div>
                        </div>
                    </div>
                </div>  
            </div>
        </transition>

        <transition name="fade" mode="out-in">
            <div v-if="showSubmitButton && showPersonalityCard" ref="submitButton" class="flex flex-col col-start-2 col-span-10 gap-10">
                <div class="flex justify-end">
                    <Button label="GENERATE YOUR RADIO" rounded severity="help" @click="$router.push('/catalogs')"/>
                </div>
            </div>
        </transition>   
    </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import { ref, watch, nextTick } from 'vue';

// Tableau des styles de radio disponibles
const radioStyles = [
    "Reggaeton", "Rock", "Jazz", "Afrobeat", "Dubstep",
    "Salsa", "Pop", "Ambient", "K-pop", "Techno", "Classical"
];

// Tableau des personnalités de radio disponibles
const radioPersonalities = [
    "Pleasant Male", "Serious Male", "Calm Male", "Confident Male",
    "Pleasant Female", "Calm Female", "Serious Female",  "Confident Female",
];

// Tableaux des styles et personnalités sélectionnés
const selectedStyles = ref<string[]>([]);
    const selectedPersonality = ref<string | null>(null);

// Variable pour montrer ou cacher la carte de personnalité
const showPersonalityCard = ref(false);

// Variable pour montrer ou cacher le bouton de soumission
const showSubmitButton = ref(false);

// Fonction pour sélectionner/désélectionner un style
function toggleStyle(style: string) {
    const index = selectedStyles.value.indexOf(style);
    if (index > -1) {
        selectedStyles.value.splice(index, 1); // Deselect if already selected
    } else {
        selectedStyles.value.push(style); // Select if not already selected
    }
}

// Fonction pour sélectionner/désélectionner une personnalité
function togglePersonality(personality: string) {
    if (selectedPersonality.value === personality) {
        selectedPersonality.value = null; // Deselect if already selected
    } else {
        selectedPersonality.value = personality; // Select if not already selected
    }
}

// Observer les changements de selectedStyles
watch(selectedStyles, async (newVal, oldVal) => {
    if (newVal.length > 0) {
        showPersonalityCard.value = true;
        await nextTick(); // Attendre que le DOM soit mis à jour
        scrollToPersonalityCard();
    } else {
        showPersonalityCard.value = false;
    }
}, { deep: true });

// Observer les changements de selectedPersonality
watch(selectedPersonality, (newVal, oldVal) => {
    if (newVal) {
        showSubmitButton.value = true;
        scrollToSubmitButton();
    } else {
        showSubmitButton.value = false;
    }
});

// Fonction pour faire défiler vers la carte de personnalité
function scrollToPersonalityCard() {
    const personalityCardElement = document.querySelector('.fade-enter-active, .fade-enter-to');
    if (personalityCardElement) {
        personalityCardElement.scrollIntoView({ behavior: 'smooth' });
    }
}

// Fonction pour faire défiler vers le bouton de soumission
function scrollToSubmitButton() {
    const submitButtonElement = document.querySelector('.fade-enter-active, .fade-enter-to');
    if (submitButtonElement) {
        submitButtonElement.scrollIntoView({ behavior: 'smooth' });
    }
}
</script>

<style scoped>
.selected-button {
    background-color: rgba(255, 255, 255, 0.4); /* couleur de sélection */
    color: white;
    border-color: white;
}
.bg-card {
    background-color: rgba(0, 0, 0, 0.75);
}
.bg-llama {
    background-color: rgba(255, 255, 255, 0.4);
}
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0;
}
</style>
