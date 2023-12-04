<template>
    <v-container >
        <v-row>
            <v-col>
                <v-card flat style="height: 800px; width: 500px; margin-left: 570px; background-color: rgba(255, 255, 255, 0.5) !important; border-color: white !important;">
                    <v-img src="https://i.imgur.com/Q5Ved8b.png" max-height="250px"></v-img>
                    <v-card-item class="user_info_holder">
                        <v-card-title class="user_info" style="margin-left: 69px;">
                            Username    
                        </v-card-title>
                        <v-card-text class="user_info" style="margin-top: 50px;">
                            Name
                        </v-card-text>
                        <v-card-text class="user_info" style="margin-top: -100px;">
                            Email
                        </v-card-text>
                    </v-card-item>
                    <v-card-actions>
                        <v-btn class="reset_password_button" style="background-color: red;" @click="">
                            Reset Password
                        </v-btn>
                    </v-card-actions>
                </v-card>
                
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import { getUserInfo } from '@/CommunicationsManager';
</script>

<style>
.reset_password_button{
    margin-left: 150px;
}
.user_info{
    padding: 100px;
}
.user_info_holder{
    margin-left: 100px;
}
</style>